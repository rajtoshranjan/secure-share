from rest_framework.permissions import IsAuthenticated

from .models import File


class HasDownloadFilePermission(IsAuthenticated):
    def has_object_permission(self, request, view, file: File):
        if file.owner == request.user:
            return True

        shared_file = file.shares.filter(user=request.user)

        if shared_file.exists() and shared_file.first().can_download:
            return True

        return False
