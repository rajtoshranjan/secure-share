from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied

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
            raise PermissionDenied("You can only share files you own")
        serializer.save()

    def partial_update(self, request, pk=None):
        file_permission = self.get_object()
        can_download = request.data.get('can_download', False)

        file_permission.can_download = can_download
        file_permission.save()

        response = {
            'data': self.get_serializer(file_permission).data,
            "message": "File permission updated successfully"
        }

        return Response(response)

