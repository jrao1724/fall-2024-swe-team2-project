from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    # TODO:
    # - Add serializing functions for Post Object
    class Meta:
        model = Post
        fields = [
        ]

    def create_post(self, validated_data):
        post = Post.objects.create(
        )

