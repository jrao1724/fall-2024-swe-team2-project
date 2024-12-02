from rest_framework import serializers
from .models import Recipe, Allergen, DietaryRestriction, Rating
from user_accounts.models import User

class RecipeSerializer(serializers.ModelSerializer):
    allergens = serializers.StringRelatedField(many=True)
    restrictions = serializers.StringRelatedField(many=True)

    class Meta:
        model = Recipe
        fields = [
            'recipe_id', 'recipe_name', 'difficulty_level', 'quickness', 'nutrition',
            'ingredients', 'restrictions', 'allergens', 'rating', 'image', 'created_by'
        ]

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
    

class RatingSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(write_only=True)  # Input recipe ID
    rating = serializers.IntegerField(min_value=1, max_value=5)  # Ensure rating is between 1 and 5
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'recipe_id', 'rating', 'user']

    def validate_recipe_id(self, value):
        from .models import Recipe
        try:
            Recipe.objects.get(id=value)
        except Recipe.DoesNotExist:
            raise serializers.ValidationError("Recipe with this ID does not exist.")
        return value

    def create(self, validated_data):
        recipe_id = validated_data.pop('recipe_id')
        user = self.context['request'].user
        from .models import Recipe
        recipe = Recipe.objects.get(id=recipe_id)
        rating, created = Rating.objects.update_or_create(
            user=user, recipe=recipe, defaults={'rating': validated_data['rating']}
        )
        recipe.update_average_rating()  # Ensure the recipe's average rating is updated
        return rating

    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        instance.recipe.update_average_rating()
        return instance
    

class SaveRecipeSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(write_only=True)  # Input recipe ID

    class Meta:
        model = User
        fields = ['recipe_id']

    def validate_recipe_id(self, value):
        try:
            Recipe.objects.get(id=value)
        except Recipe.DoesNotExist:
            raise serializers.ValidationError("Recipe with this ID does not exist.")
        return value

    def update(self, instance, validated_data):
        recipe_id = validated_data.get('recipe_id')
        recipe = Recipe.objects.get(id=recipe_id)
        instance.saved_recipes.add(recipe)
        return instance