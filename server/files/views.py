from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import File, FileShare, FileShareLink
from .serializers import (FileSerializer, FileShareLinkSerializer,
                          FileShareSerializer)


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        file = serializer.save(owner=self.request.user)
        file.encrypt_file()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file = self.get_object()
        decrypted_file = file.get_decrypted_file()
        
        response = FileResponse(
            decrypted_file,
            as_attachment=True,
            filename=file.name
        )
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

    @action(detail=False, methods=['get'])
    def owned(self, request):
        files = File.objects.filter(owner=request.user)
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def shared(self, request):
        files = File.objects.filter(shares__user=request.user)
        serializer = self.get_serializer(files, many=True)
        return Response(serializer.data)


class FileShareViewSet(viewsets.ModelViewSet):
    serializer_class = FileShareSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileShare.objects.filter(file__owner=self.request.user)

    def perform_create(self, serializer):
        # Ensure user owns the file being shared
        file = serializer.validated_data['file']
        if file.owner != self.request.user:
            raise PermissionError("You can only share files you own")
        serializer.save()


class FileShareLinkViewSet(viewsets.ModelViewSet):
    serializer_class = FileShareLinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FileShareLink.objects.filter(file__owner=self.request.user)
