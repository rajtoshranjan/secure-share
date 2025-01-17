from rest_framework.routers import DefaultRouter

from .views import DriveUserViewSet, DriveViewSet

router = DefaultRouter()
router.register(r'', DriveViewSet, basename='drive')
router.register(r'members', DriveUserViewSet, basename='drive-members')

urlpatterns = router.urls
