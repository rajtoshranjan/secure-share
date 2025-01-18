from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User


class UserSerializer(serializers.ModelSerializer):
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

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        # Validate on create.
        if not self.instance:
            validation_errors = {}
            try:
                validate_password(validated_data["password"])
            except Exception as exc:
                validation_errors["password"] = exc

            # Check if user with this email already exists.
            if User.objects.filter(email__iexact=validated_data["email"]).exists():
                validation_errors["email"] = "User with this email already exists."

            if validation_errors:
                raise ValidationError(validation_errors)

        return validated_data

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        # TODO: Update email after email verification.
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField()

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()
        return instance

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        validation_errors = {}

        if not self.instance.check_password(validated_data["current_password"]):
            validation_errors["current_password"] = "Old password is incorrect."

        try:
            validate_password(validated_data["new_password"])
        except ValidationError as error:
            validation_errors["new_password"] = error

        if validation_errors:
            raise ValidationError(validation_errors)

        return validated_data
