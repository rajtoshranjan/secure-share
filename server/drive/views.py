from django.db.models import Q
from drive.helpers import get_active_drive
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .constants import DriveMemberRole
from .models import Drive, DriveMember
from .permissions import CanManageDrive, IsDriveAdmin
from .serializers import DriveMemberSerializer, DriveSerializer


class DriveViewSet(viewsets.ModelViewSet):
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


class DriveUserViewSet(viewsets.ModelViewSet):
    serializer_class = DriveMemberSerializer
    permission_classes = [IsDriveAdmin]

    def get_queryset(self):
        drive = get_active_drive(self.request, raise_exception=False)
        if drive:
            return DriveMember.objects.filter(drive_id=drive.id)
        return DriveMember.objects.none()

    def perform_create(self, serializer):
        drive = serializer.validated_data['drive']
        if not drive.members.filter(
            user=self.request.user,
            role=DriveMemberRole.ADMIN.value
        ).exists():
            raise PermissionDenied("You must be a drive admin")
        serializer.save()
