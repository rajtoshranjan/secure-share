from rest_framework.permissions import IsAuthenticated

from .models import File


class HasDownloadFilePermission(IsAuthenticated):
    def has_object_permission(self, request, view, file: File):
        if file.owner == request.user:
            return True

        file_permissions = file.user_permissions.filter(user=request.user)

        if file_permissions.exists() and file_permissions.first().can_download:
            return True

        return False
