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
        """Return the User who created a given recipe

        Args:
            obj (_type_): Recipe Object

        Returns:
            _type_: Returns the username of the User who created the given Recipe
        """
        return obj.created_by.username if obj.created_by else None

    def create(self, validated_data):
        """Create a new Recipe

        Args:
            validated_data (_type_): The Recipe data sent by the POST request

        Returns:
            _type_: new Recipe object
        """
        parsed_user = self.context['request'].user
        recipe = Recipe.objects.create(created_by=parsed_user, **validated_data)
        return recipe