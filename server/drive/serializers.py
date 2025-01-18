from rest_framework import serializers

from accounts.models import User

from .helpers import get_active_drive
from .models import Drive, DriveMember


class DriveSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = Drive
        fields = ["id", "name", "role"]
        read_only_fields = ["id", "role"]

    def get_role(self, drive: Drive):
        request = self.context.get("request")

        if request.user == drive.owner:
            return "owner"

        drive_member = drive.members.filter(user=request.user).first()
        return drive_member.role if drive_member else None

    def create(self, validated_data):
        validated_data["owner"] = self.context.get("request").user
        return super().create(validated_data)


class DriveMemberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = DriveMember
        fields = ["id", "drive", "role", "email", "user_email", "user_name"]
        read_only_fields = ["id", "drive", "user_email", "user_name"]

    def create(self, validated_data):
        email = validated_data.pop("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User not found"})

        if user == self.context.get("request").user:
            raise serializers.ValidationError(
                {"email": "You cannot add yourself to the drive"}
            )

        validated_data["user"] = user
        validated_data["drive"] = get_active_drive(self.context.get("request"))
        return super().create(validated_data)
