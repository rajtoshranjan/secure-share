from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import FilePermission
from ..serializers import FilePermissionSerializer


class FilePermissionViewSet(ModelViewSet):
    serializer_class = FilePermissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file']

    def get_queryset(self):
        return FilePermission.objects.filter(file__owner=self.request.user)

    def perform_create(self, serializer):
        # Ensure user owns the file being shared.
        file = serializer.validated_data['file']
        if file.owner != self.request.user:
            raise PermissionError("You can only share files you own")
        serializer.save()

    @action(detail=True, methods=['patch'], url_path='update-permission')
    def update_permission(self, request, pk=None):
        share = self.get_object()
        can_download = request.data.get('can_download', False)

        if share.file.owner != request.user:
            return Response(
                {"detail": "You can only modify permissions for files you own"},
                status=403
            )

        share.can_download = can_download
        share.save()

        return Response(self.get_serializer(share).data)
