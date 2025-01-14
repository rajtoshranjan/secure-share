from rest_framework import serializers

from .models import File, FileShare, FileShareLink


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = File
        fields = ['id', 'name', "size", 'file', 'created_at', 'modified_at']
        read_only_fields = ['id', 'created_at', 'modified_at', 'size', 'name']
        write_only_fields = ['file']

    def validate(self, attrs):
        file = attrs.get('file')
        if file:
            attrs['name'] = file.name
        return super().validate(attrs)


class FileShareSerializer(serializers.ModelSerializer):
    file_name = serializers.CharField(source='file.name', read_only=True)
    shared_with_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = FileShare
        fields = ['id', 'file', 'user', 'can_write', 'file_name', 'shared_with_name'] 


class FileShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileShareLink
        fields = ['id', 'file', 'slug', 'expires_at']
        read_only_fields = ['slug', 'id']
