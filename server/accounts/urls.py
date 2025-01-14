from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from .views import UserViewSet

router = DefaultRouter()
router.register(r"", UserViewSet, basename="user")

urlpatterns = [
    path("", include("trench.urls.jwt")),
    path("mfa/", include("trench.urls")),
    path(
        "token/refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token-refresh",
    ),
]

urlpatterns += router.urls
