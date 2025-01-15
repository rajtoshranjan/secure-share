from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .permissions import IsSelf
from .serializers import ChangePasswordSerializer, UserSerializer


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

    @action(detail=False,  methods=["get", 'patch'])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.serializer_class(request.user)
            response = {
                "message": "Profile fetched successfully.",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)
        elif request.method == 'PATCH':
            serializer = self.serializer_class(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response = {
                "message": "Profile updated successfully.",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        serializer = ChangePasswordSerializer(request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = {
            "message": "Password changed successfully.",
        }
        return Response(response, status=status.HTTP_200_OK)


    @action(detail=False,  methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)

            user_from_token = JWTTokenUserAuthentication().get_user(token)

            user = get_object_or_404(User, id=user_from_token.id)
            self.check_object_permissions(self.request, user)

            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            response = {"message": str(e)}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

