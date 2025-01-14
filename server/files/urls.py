from rest_framework.routers import DefaultRouter

from .views import FileShareLinkViewSet, FileShareViewSet, FileViewSet

router = DefaultRouter()
router.register('', FileViewSet, basename='file')
router.register('shares/', FileShareViewSet, basename='file-share')
router.register('links/', FileShareLinkViewSet, basename='file-share-link')

urlpatterns = router.urls
