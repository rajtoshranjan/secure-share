import os
from uuid import uuid4

from cryptography.fernet import Fernet
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from secure_share.models import BaseModel

from .managers import FileShareLinkManager


def get_file_path(instance, filename):
    _, ext = os.path.splitext(filename)
    id = instance.id or uuid4()
    return f'files/{instance.owner.id}/{id}{ext}'


class File(BaseModel):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=get_file_path)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_files'
    )
    encryption_key = models.BinaryField(editable=False, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "owner"],
                name="unique_file_name_owner",
                violation_error_message="A file with this name already exists",
                violation_error_code="unique_file_name_owner"
            )
        ]

    @property
    def size(self):
        return self.file.size

    # TODO: Implement AES encryption.
    def encrypt_file(self):
        """
        Encrypts the file using Fernet symmetric encryption.
        Fernet ensures that the file cannot be manipulated or read without the key.
        """
        try:
            # Generate a key for encryption
            key = Fernet.generate_key()
            fernet = Fernet(key)

            # Read original file content in binary mode
            self.file.seek(0)
            file_content = self.file.read()

            # Encrypt the content
            encrypted_content = fernet.encrypt(file_content)

            # Create a new file with encrypted content
            encrypted_name = f"{self.name}.encrypted"
            encrypted_file = ContentFile(encrypted_content)

            # Save the encrypted file
            self.file.delete(save=False)  # Delete old file
            self.file.save(encrypted_name, encrypted_file, save=False)

            # Store the encryption key
            self.encryption_key = key
            self.save()

        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")

    def get_decrypted_content(self):
        """
        Decrypts and returns the file content.

        Returns:
            bytes: Decrypted file content

        Raises:
            ValueError: If file is not encrypted or decryption fails
        """
        if not self.encryption_key:
            raise ValueError("File is not encrypted")

        try:
            # Initialize Fernet with the stored key
            fernet = Fernet(self.encryption_key)

            # Read encrypted content in binary mode
            self.file.seek(0)
            encrypted_content = self.file.read()

            # Decrypt the content
            decrypted_content = fernet.decrypt(encrypted_content)

            # Return the decrypted content as bytes
            return bytes(decrypted_content)

        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

    def get_decrypted_file(self):
        """
        Returns a file-like object with decrypted content.
        Useful for streaming responses.
        """
        decrypted_content = self.get_decrypted_content()
        return ContentFile(decrypted_content)


class FileShare(BaseModel):
    file = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shared_files'
    )
    can_download = models.BooleanField(default=False)

    class Meta:
        unique_together = ('file', 'user')


class FileShareLink(BaseModel):
    file = models.ForeignKey(
        File,
        on_delete=models.CASCADE,
        related_name='share_links'
    )
    expires_at = models.DateTimeField()
    slug = models.CharField(
        max_length=8,
        unique=True,
        db_index=True,
    )

    def clean(self):
        # Validate that expires_at is not in the past
        if self.expires_at < timezone.now():
            raise ValidationError(
                {'expires_at': 'Expiry date cannot be in the past'}
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    # Properties.
    @property
    def is_expired(self):
        return self.expires_at < timezone.now()

    # Managers.
    objects = FileShareLinkManager()
