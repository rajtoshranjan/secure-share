from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer

from .models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            "email",
            "password",
            "name",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        validation_errors = {}
        try:
            validate_password(data["password"])
        except Exception as exc:
            validation_errors["password"] = exc

        # Check if user with this email already exists.
        if User.objects.filter(email__iexact=data["email"]).exists():
            validation_errors["email"] = "User with this email already exists."

        if validation_errors:
            raise ValidationError(validation_errors)

        return data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
