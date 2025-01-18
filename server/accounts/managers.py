from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.password_validation import validate_password


class UserManager(BaseUserManager):
    def create_user(self, email: str, password: str, **extra_fields):

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        # Raise Validation Error invalid password.
        validate_password(password)

        user.set_password(password)
        user.save()
        return user
