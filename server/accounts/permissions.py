from rest_framework.permissions import IsAuthenticated

from .models import User


class IsSelf(IsAuthenticated):
    """
    Allows permission to object user owned by self.
    """

    def has_object_permission(self, request, view, user: User):
        return user == request.user
