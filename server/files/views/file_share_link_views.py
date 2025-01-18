from django.db.models import Q
from django.http import FileResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from drive.constants import DriveMemberRole
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from ..models import FileShareLink
from ..permissions import (CanManageFileShareLinkPermission,
                           has_manage_file_permission)
from ..serializers import FileShareLinkSerializer


class FileShareLinkViewSet(ModelViewSet):
    serializer_class = FileShareLinkSerializer
    permission_classes = [CanManageFileShareLinkPermission]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file']

    def get_queryset(self):
        return FileShareLink.objects.filter(
            Q(file__drive__owner=self.request.user) |
            (Q(file__drive__members__user=self.request.user) &
             Q(file__drive__members__role__in=[
                 DriveMemberRole.ADMIN.value,
                 DriveMemberRole.REGULAR.value
             ])),
            expires_at__gte=timezone.now()
        )

    def perform_create(self, serializer):
        # Ensure user owns the file being shared.
        file = serializer.validated_data['file']
        if not has_manage_file_permission(file, self.request.user):
            raise PermissionDenied("You don't have permission to share this file")
        serializer.save()

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def download(self, request, pk=None):
        share_link = get_object_or_404(FileShareLink, slug=pk)

        # Check if link has expired.
        if share_link.is_expired:
            return render(request, 'link_expired.html')

        file = share_link.file
        decrypted_file = file.get_decrypted_file()

        response = FileResponse(
            decrypted_file,
            as_attachment=True,
            filename=file.name
        )
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'

        return response
