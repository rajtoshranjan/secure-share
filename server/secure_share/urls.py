from django.urls import include, path

urlpatterns = [
    path("accounts/", include("accounts.urls")),
]
