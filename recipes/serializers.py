from rest_framework import serializers
from .models import Recipe

class RecipeSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'difficulty_level', 'quickness', 'nutritional_facts', 
                  'ingredients', 'restrictions', 'allergens', 'rating', 'image', 'created_by_username']
        read_only_fields = ['created_by_username']

    def get_created_by_username(self, obj):
        return obj.created_by.username if obj.created_by else None

    def create(self, validated_data):
        parsed_user = self.context['request'].user
        recipe = Recipe.objects.create(created_by=parsed_user, **validated_data)
        return recipe