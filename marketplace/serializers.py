from rest_framework import serializers
from .models import Post
from user_accounts.models import User

class PostSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(default=serializers.CurrentUserDefault())
    visible_fields = serializers.JSONField(required=False)

    class Meta:
        model = Post
        fields = [
            'post_id', 'post_title', 'post_description', 'post_price',
            'post_budget', 'is_negotiable', 'post_type', 'visible_fields',
            'post_date', 'is_active', 'user_location', 'created_by'
        ]
        read_only_fields = ['post_id', 'post_date', 'created_by']

    def validate_visible_fields(self, value):
        """
        Ensure visible_fields contains valid keys.
        """
        allowed_keys = ['email', 'address', 'phone_number']
        invalid_keys = [key for key in value if key not in allowed_keys]

        if invalid_keys:
            raise serializers.ValidationError(
                f"Invalid keys in visible_fields: {', '.join(invalid_keys)}"
            )
        return value
    
    def to_representation(self, instance):
        """
        Customize serialization to dynamically populate visible fields.
        """
        representation = super().to_representation(instance)

        user = User.objects.filter(username=instance.created_by).first()
        if user:
            contact_data = {
                'email': user.email,
                'address': user.address, 
                'phone_number': user.phone_number
            }
            representation['visible_fields'] = {
                key: contact_data[key] for key in instance.visible_fields if key in contact_data and contact_data[key]
            }
        else:
            representation['visible_fields'] = {}

        return representation

    # Validate that price/budget align with post_type
    def validate(self, data):
        if data['post_type'] == 'buying' and 'post_budget' not in data:
            raise serializers.ValidationError("A budget is required for 'buying' posts.")
        if data['post_type'] == 'selling' and 'post_price' not in data:
            raise serializers.ValidationError("A price is required for 'selling' posts.")
        return data
    
    def create(self, validated_data):
        # Use the username from the request user if available
        user = self.context['request'].user
        if user and user.is_authenticated:
            validated_data['created_by'] = user.username
        else:
            validated_data['created_by'] = "Anonymous"

        print(validated_data)
        return super().create(validated_data)

