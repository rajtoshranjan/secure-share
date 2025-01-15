from django.http import FileResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import File, FileShare, FileShareLink
from .permissions import HasDownloadFilePermission
from .serializers import (FileSerializer, FileShareLinkSerializer,
                          FileShareSerializer, SharedFileSerializer)


class FileViewSet(ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        file = serializer.save(owner=self.request.user)
        file.encrypt_file()

    @action(
        detail=True,
        methods=['get'],
        permission_classes=[HasDownloadFilePermission]
    )
    def download(self, request, pk=None):
        file = get_object_or_404(File, id=pk)
        self.check_object_permissions(request, file)

        decrypted_file = file.get_decrypted_file()

        response = FileResponse(
            decrypted_file,
            as_attachment=True,
            filename=file.name
        )
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

    @action(
        detail=False,
        methods=['get'],
        serializer_class=SharedFileSerializer,
        permission_classes=[IsAuthenticated]
    )
    def shared(self, request):
        shares = FileShare.objects.filter(user=request.user).select_related('file')
        serializer = self.get_serializer(shares, many=True)
        return Response(serializer.data)


class FileShareViewSet(ModelViewSet):
    serializer_class = FileShareSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file']

    def get_queryset(self):
        return FileShare.objects.filter(file__owner=self.request.user)

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


class FileShareLinkViewSet(ModelViewSet):
    serializer_class = FileShareLinkSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['file']

    def get_queryset(self):
        return FileShareLink.objects.filter(
            file__owner=self.request.user,
            expires_at__gte=timezone.now()
        )

    def perform_create(self, serializer):
        # Ensure user owns the file being shared.
        file = serializer.validated_data['file']
        if file.owner != self.request.user:
            raise PermissionError("You can only share files you own")
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
