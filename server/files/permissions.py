from drive.constants import DriveMemberRole
from drive.helpers import get_active_drive
from rest_framework.permissions import IsAuthenticated

from .models import File


class HasDownloadFilePermission(IsAuthenticated):
    def has_object_permission(self, request, view, file: File):
        if file.owner == request.user:
            return True

        if file.drive.owner == request.user:
            return True

        file_permissions = file.user_permissions.filter(user=request.user)

        if file_permissions.exists() and file_permissions.first().can_download:
            return True

        if file.drive.members.filter(user=request.user).exists():
            return True

        return False


class HasUploadFilePermission(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        drive = get_active_drive(request)
        if drive.owner == request.user:
            return True

        if drive.members.filter(
            user=request.user,
            role__in=[DriveMemberRole.ADMIN.value, DriveMemberRole.REGULAR.value]
        ).exists():
            return True

        return False


class HadManageFilePermission(IsAuthenticated):
    def has_object_permission(self, request, view, file: File):

        if file.drive.owner == request.user:
            return True

        if file.drive.members.filter(
            user=request.user,
            role__in=[DriveMemberRole.ADMIN.value, DriveMemberRole.REGULAR.value]
        ).exists():
            return True

        return False
