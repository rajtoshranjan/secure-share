from rest_framework import serializers

from accounts.models import User

from ..models import FilePermission


class FilePermissionSerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source="file.name", read_only=True)
    shared_with_name = serializers.CharField(source="user.name", read_only=True)
    shared_with_email = serializers.CharField(source="user.email", read_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = FilePermission
        fields = [
            "id",
            "file",
            "email",
            "can_download",
            "file_name",
            "shared_with_name",
            "shared_with_email",
        ]

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        validation_errors = {}

        email = validated_data.get("email")
        try:
            user = User.objects.get(email=email)
            validated_data["user"] = user
            if user == self.context["request"].user:
                validation_errors["email"] = "You cannot share a file with yourself"

            # Check if file is already shared with user
            file = attrs.get("file")
            if FilePermission.objects.filter(file=file, user=user).exists():
                validation_errors[
                    "email"
                ] = "This file is already shared with this user"

        except User.DoesNotExist:
            validation_errors["email"] = "User with this email does not exist"

        if validation_errors:
            raise serializers.ValidationError(validation_errors)

        return validated_data

    def create(self, validated_data):
        validated_data.pop("email")
        return FilePermission.objects.create(**validated_data)
