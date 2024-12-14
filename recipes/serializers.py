from rest_framework import serializers
from .models import Recipe, Allergen, DietaryRestriction, Rating
from user_accounts.models import User

class RecipeSerializer(serializers.ModelSerializer):
    # allergens = serializers.ListField(
    #     child=serializers.CharField(), write_only=True
    # )  # Accepts strings for allergens
    # restrictions = serializers.ListField(
    #     child=serializers.CharField(), write_only=True
    # )  # Accepts strings for restrictions
    
    restrictions = serializers.StringRelatedField(
        many=True, read_only=True
    )
    allergens = serializers.StringRelatedField(
        many=True, read_only=True
    )
    class Meta:
        model = Recipe
        fields = [
            'recipe_id', 'recipe_name', 'difficulty_level', 'quickness', 'time_unit', 'nutrition',
            'ingredients', 'restrictions', 'allergens', 'image', 'description'
        ]

    def validate_recipe_name(self, value):
        """Check if a recipe with the same name already exists."""
        if Recipe.objects.filter(recipe_name__iexact=value).exists():
            raise serializers.ValidationError("A recipe with this name already exists.")
        return value
    
    def validate_allergens(self, value):
        """Validate that all allergens exist in the database."""
        for allergen_name in value:
            if not Allergen.objects.filter(name__iexact=allergen_name).exists():
                raise serializers.ValidationError(f"Allergen '{allergen_name}' does not exist.")
        return value
    
    def validate_restrictions(self, value):
        """Validate that all dietary restrictions exist in the database."""
        for restriction_name in value:
            if not DietaryRestriction.objects.filter(name__iexact=restriction_name).exists():
                raise serializers.ValidationError(f"Dietary restriction '{restriction_name}' does not exist.")
        return value

    def create(self, validated_data):
        """Create a new Recipe and associate restrictions and allergens."""
        allergens_data = validated_data.pop('allergens', [])
        restrictions_data = validated_data.pop('restrictions', [])
        parsed_user = self.context['request'].user

        # Create the Recipe instance
        recipe = Recipe.objects.create(created_by=parsed_user, **validated_data)

        # Filter allergens and restrictions by name
        allergens = Allergen.objects.filter(name__in=[name.strip() for name in allergens_data])
        restrictions = DietaryRestriction.objects.filter(name__in=[name.strip() for name in restrictions_data])

        # Associate allergens and restrictions
        recipe.allergens.set(allergens)
        recipe.restrictions.set(restrictions)

        return recipe
    

class RatingSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(write_only=True)
    rating = serializers.IntegerField(min_value=1, max_value=5)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'recipe_id', 'rating', 'user']

    def validate_recipe_id(self, value):
        try:
            Recipe.objects.get(recipe_id=value)
        except Recipe.DoesNotExist:
            raise serializers.ValidationError("Recipe with this ID does not exist.")
        return value

    def create(self, validated_data):
        recipe_id = validated_data.pop('recipe_id')
        user = self.context['request'].user
        recipe = Recipe.objects.get(recipe_id=recipe_id)
        rating, created = Rating.objects.update_or_create(
            user=user, recipe=recipe, defaults={'rating': validated_data['rating']}
        )
        recipe.update_average_rating() 
        return rating

    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.save()
        instance.recipe.update_average_rating()
        return instance
    

class SaveRecipeSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ['recipe_id']

    def validate_recipe_id(self, value):
        try:
            Recipe.objects.get(recipe_id=value)
        except Recipe.DoesNotExist:
            raise serializers.ValidationError("Recipe with this ID does not exist.")
        return value

    def update(self, instance, validated_data):
        recipe_id = validated_data.get('recipe_id')
        recipe = Recipe.objects.get(recipe_id=recipe_id)
        instance.saved_recipes.add(recipe)
        return instance