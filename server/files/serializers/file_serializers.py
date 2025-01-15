from rest_framework import serializers

from ..models import File


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


class SharedFileSerializer(serializers.Serializer):
    shared_by_name = serializers.CharField(
        source='file.owner.name',
        read_only=True
    )
    shared_by_email = serializers.CharField(
        source='file.owner.email',
        read_only=True
    )
    can_download = serializers.BooleanField(read_only=True)
    file = FileSerializer(read_only=True)
