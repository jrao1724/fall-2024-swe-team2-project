from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'post_',
            'username',
            'email',
            'phone_number',
            'address',
            'role',
            'admin'
        ]

    def create_post(self, validated_data):
        post = Post.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            role=validated_data.get('role', 'student'),
            admin=validated_data.get('admin', False)
        )

