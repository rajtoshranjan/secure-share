from rest_framework.permissions import BasePermission, IsAuthenticated

from .constants import DriveMemberRole
from .helpers import get_active_drive
from .models import Drive, DriveMember


class CanManageDrive(IsAuthenticated):
    def has_object_permission(self, request, view, drive: Drive):
        return request.user.is_authenticated and request.user == drive.owner


class CanManageDriveMembers(BasePermission):
    def has_permission(self, request, view):
        drive = get_active_drive(request)

        return (
            drive.owner == request.user
            or drive.members.filter(
                user=request.user, role=DriveMemberRole.ADMIN.value
            ).exists()
        )

    def has_object_permission(self, request, view, drive_member: DriveMember):
        return request.user.is_authenticated and (
            drive_member.role == DriveMemberRole.ADMIN.value
            or drive_member.drive.owner == request.user
        )
