from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import User
from .permissions import IsSelf
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsSelf]

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            self.permission_classes = [AllowAny]
        return super(UserViewSet, self).get_permissions()

    def get_queryset(self):
        return User.objects.all()
