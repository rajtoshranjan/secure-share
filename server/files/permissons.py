from rest_framework.permissions import IsAuthenticated


class HasFileAccess(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
