from django.db.models import Q
from drive.helpers import get_active_drive
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .constants import DriveMemberRole
from .models import Drive, DriveMember
from .permissions import CanManageDrive, CanManageDriveMembers
from .serializers import DriveMemberSerializer, DriveSerializer


class DriveViewSet(ModelViewSet):
    serializer_class = DriveSerializer
    permission_classes = [CanManageDrive]

    def get_permissions(self):
        if self.action in ['create', 'list']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        return Drive.objects.filter(
            Q(members__user=self.request.user) | Q(owner=self.request.user)
        )


class DriveUserViewSet(ModelViewSet):
    serializer_class = DriveMemberSerializer
    permission_classes = [CanManageDriveMembers]

    def get_queryset(self):
        drive = get_active_drive(self.request, raise_exception=False)
        if drive:
            return DriveMember.objects.filter(drive_id=drive.id)
        return DriveMember.objects.none()

    def perform_create(self, serializer):
        drive = get_active_drive(self.request)
        if drive.owner != self.request.user and not drive.members.filter(
            user=self.request.user,
            role=DriveMemberRole.ADMIN.value
        ).exists():
            raise PermissionDenied("You must be a drive admin or owner to add members to this drive")
        serializer.save()
