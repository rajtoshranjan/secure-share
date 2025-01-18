from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status

from secure_share.tests import BaseTestCase

from ..models import File


class TestFileEndpoints(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.authenticate(self.user)

        # Create test file with proper content
        self.test_file_content = b"test file content"
        self.file = File.objects.create(
            name="test.txt",
            file=SimpleUploadedFile(
                "test.txt", self.test_file_content, content_type="text/plain"
            ),
            drive=self.default_drive,
            owner=self.user,
        )
        # Save file before encryption
        self.file.save()
        self.file.encrypt_file()

    def test_upload_file(self):
        """Test file upload endpoint."""
        # Arrange
        file_content = b"new file content"
        file = SimpleUploadedFile(
            "new_file.txt", file_content, content_type="text/plain"
        )
        data = {"file": file}

        # Act
        response = self.client.post(reverse("file-list"), data, format="multipart")

        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "new_file.txt")
        self.assertTrue(File.objects.filter(name="new_file.txt").exists())

    def test_list_files(self):
        """Test file listing endpoint."""
        # Act
        response = self.client.get(reverse("file-list"))

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "test.txt")

    def test_download_file(self):
        """Test file download endpoint."""
        # Act
        response = self.client.get(
            reverse("file-download", kwargs={"pk": self.file.id})
        )

        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.get("Content-Disposition"),
            f'attachment; filename="{self.file.name}"',
        )
        # Read streaming content
        content = b"".join(response.streaming_content)
        self.assertEqual(content, self.test_file_content)

    def test_delete_file(self):
        """Test file deletion endpoint."""
        # Act
        response = self.client.delete(
            reverse("file-detail", kwargs={"pk": self.file.id})
        )

        # Assert
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(File.objects.filter(id=self.file.id).exists())
