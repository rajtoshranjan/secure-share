from rest_framework.permissions import IsAuthenticated

from .constants import DriveMemberRole
from .models import Drive, DriveMember


class CanManageDrive(IsAuthenticated):
    def has_object_permission(self, request, view, drive: Drive):
        return request.user.is_authenticated and request.user == drive.owner


class IsDriveAdmin(IsAuthenticated):
    def has_object_permission(self, request, view, drive_member: DriveMember):
        return (request.user.is_authenticated and 
                drive_member.role == DriveMemberRole.ADMIN.value)
