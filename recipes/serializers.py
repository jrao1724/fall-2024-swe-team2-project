from rest_framework import serializers
from .models import Recipe, Allergen, DietaryRestriction, Rating
from user_accounts.models import User
import json

class RecipeSerializer(serializers.ModelSerializer):
    allergens = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False, allow_empty=True
    )
    restrictions = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False, allow_empty=True
    )

    average_rating = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()
    image = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Recipe
        fields = [
            'recipe_id', 'recipe_name', 'difficulty_level', 'quickness', 'nutrition', 'time_unit',
            'ingredients', 'allergens', 'restrictions', 'description', 'image', 'average_rating', 'user_rating'
        ]

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        return round(sum(r.rating for r in ratings) / ratings.count(), 2) if ratings.exists() else None
    
    def get_user_rating(self, obj):
        request = self.context.get('request')
        if request is None:
            print("Request is None!")  # Debugging
            return None
        if request and request.user.is_authenticated:
            rating = obj.ratings.filter(user=request.user).first()
            if rating:
                return rating.rating
        return None

    def validate_recipe_name(self, value):
        if Recipe.objects.filter(recipe_name__iexact=value).exists():
            raise serializers.ValidationError("A recipe with this name already exists.")
        return value

    def validate_allergens(self, value):
        if not value:
            return []
        if isinstance(value, str):
            try:
                allergens_list = [allergen.strip() for allergen in value.split(',')]
                print("Returning allergens_list:", allergens_list)
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON format for allergens.")
        elif isinstance(value, list):
            allergens_list = value
        else:
            raise serializers.ValidationError("Allergens must be a JSON array or list.")

        if not isinstance(allergens_list, list):
            raise serializers.ValidationError("Allergens must be a list.")
        return allergens_list

    def validate_restrictions(self, value):
        if isinstance(value, str):
            try:
                restrictions_list = [restriction.strip() for restriction in value.split(',')]
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid JSON format for restrictions.")
        elif isinstance(value, list):
            restrictions_list = value
        else:
            raise serializers.ValidationError("Restrictions must be a JSON array or list.")

        if not isinstance(restrictions_list, list):
            raise serializers.ValidationError("Restrictions must be a list.")
        return restrictions_list

    def create(self, validated_data):
        print("Creating allergens data")
        allergens_data = validated_data.pop('allergens', [])
        restrictions_data = validated_data.pop('restrictions', [])
        user = self.context['request'].user

        recipe = Recipe.objects.create(**validated_data)
        if allergens_data:
            allergens_list = [allergen.strip() for allergen in allergens_data[0].split(',')] 
            allergens = Allergen.objects.filter(name__in=[name.strip() for name in allergens_list])
        else:
            allergens = []

        if restrictions_data:
            restrictions_list = [restriction.strip() for restriction in restrictions_data[0].split(',')]
            restrictions = DietaryRestriction.objects.filter(name__in=[name.strip() for name in restrictions_list])
        else:
            restrictions = []

        recipe.allergens.set(allergens)
        recipe.restrictions.set(restrictions)

        recipe.refresh_from_db()

        return recipe

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request')

        representation['allergens_display'] = [allergen.name for allergen in instance.allergens.all()]
        representation['restrictions_display'] = [restriction.name for restriction in instance.restrictions.all()]
        return representation
    

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