from rest_framework import serializers
from .models import Post
from user_accounts.serializers import UserSerializer

class PostSerializer(serializers.ModelSerializer):
    username = UserSerializer(read_only=True)


    # TODO:
    # - Add serializing functions for Post Object
    class Meta:
        model = Post
        fields = [
            'id',
            'longitude',
            'latitude',
            'username',
            'post_price',
            'post_budget',
            'is_negotiable',
            'post_date',
            'is_active',
            'post_description',
            'post_title',
            'visible_fields',
            'post_type'
        ]

    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post

