from accounts.models import User
from rest_framework import serializers

from ..models import FileShareLink


class FileShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileShareLink
        fields = ['id', 'file', 'slug', 'expires_at']
        read_only_fields = ['slug', 'id']
