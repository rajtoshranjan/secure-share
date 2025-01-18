from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from drive.helpers import get_active_drive

from ..models import File, FilePermission
from ..permissions import (
    HadManageFilePermission,
    HasDownloadFilePermission,
    HasUploadFilePermission,
)
from ..serializers import FileSerializer, SharedFileSerializer


class FileViewSet(ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [HadManageFilePermission]

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [HasUploadFilePermission]
        elif self.action == "list":
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()

    def get_queryset(self):
        drive = get_active_drive(self.request)
        return File.objects.filter(drive=drive)

    def perform_create(self, serializer):
        file = serializer.save(owner=self.request.user)
        file.encrypt_file()

    @action(
        detail=True, methods=["get"], permission_classes=[HasDownloadFilePermission]
    )
    def download(self, request, pk=None):
        file = get_object_or_404(File, id=pk)
        self.check_object_permissions(request, file)

        decrypted_file = file.get_decrypted_file()

        response = FileResponse(decrypted_file, as_attachment=True, filename=file.name)
        response["Content-Type"] = "application/octet-stream"
        response["Content-Disposition"] = f'attachment; filename="{file.name}"'
        return response

    @action(
        detail=False,
        methods=["get"],
        serializer_class=SharedFileSerializer,
        permission_classes=[IsAuthenticated],
    )
    def shared(self, request):
        file_permissions = FilePermission.objects.filter(
            user=request.user
        ).select_related("file")
        serializer = self.get_serializer(file_permissions, many=True)
        return Response(serializer.data)
