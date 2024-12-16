import pytest
from ingredients.models import Ingredient
from ingredients.models import RecipeIngredient
from recipes.models import Recipe
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from user_accounts.models import User
from recipes.models import Recipe, Ingredient, DietaryRestriction, Allergen


@pytest.mark.django_db
def test_ingredient_creation():
   ingredient = Ingredient.objects.create(name="Tomato", description="A red fruit used in cooking.")
   assert ingredient.name == "Tomato"
   assert ingredient.description == "A red fruit used in cooking."


@pytest.mark.django_db
def test_ingredient_name_is_required():
   ingredient = Ingredient(description="A fruit used in cooking.")
   with pytest.raises(ValidationError):
       ingredient.full_clean()           


@pytest.mark.django_db
def test_ingredient_str_method():
   ingredient = Ingredient.objects.create(name="Cucumber")
   assert str(ingredient) == "Cucumber"




@pytest.mark.django_db
def test_recipe_ingredient_creation():
   # Create a user who will be the creator of the recipe
   user = User.objects.create_user(username='testuser', password='testpassword')


   # Ensure unique names for dietary restrictions
   vegetarian, created = DietaryRestriction.objects.get_or_create(name="Vegetarian")
   gluten_free, created = DietaryRestriction.objects.get_or_create(name="Gluten-Free")
   peanut_allergy, created = Allergen.objects.get_or_create(name="Peanut")


   # Create an ingredient to associate with the recipe
   ingredient = Ingredient.objects.create(name="Tomato", description="A red fruit used in cooking.")


   # Now create a Recipe instance with required fields
   recipe = Recipe.objects.create(
       recipe_name="Tomato Soup",
       difficulty_level="easy",  # you can set this to 'medium' or 'hard' as well
       quickness=10,  # Time to cook in minutes
       time_unit="mins",  # Can be 'hrs' or 'mins'
       nutrition={"calories": 150, "fat": 5},  # Provide a valid JSON object for nutrition
       ingredients="Tomato, Salt, Pepper",  # A text representation of ingredients
       created_by=user,  # Associate the user with the recipe
       description="A delicious soup made with tomatoes.",
   )


   # Add dietary restrictions and allergens to the recipe
   recipe.restrictions.add(vegetarian, gluten_free)
   recipe.allergens.add(peanut_allergy)


   # Check that the recipe was created successfully
   assert recipe.recipe_name == "Tomato Soup"
   assert recipe.difficulty_level == "easy"
   assert recipe.quickness == 10
   assert recipe.time_unit == "mins"
   assert recipe.nutrition == {"calories": 150, "fat": 5}
   assert recipe.ingredients == "Tomato, Salt, Pepper"
   assert recipe.created_by == user
   assert recipe.description == "A delicious soup made with tomatoes."


   # Check that dietary restrictions and allergens were added successfully
   assert vegetarian in recipe.restrictions.all()
   assert gluten_free in recipe.restrictions.all()
   assert peanut_allergy in recipe.allergens.all()


   # Ensure the ingredient is part of the recipe (not directly part of the model, but you can add ingredients in a similar way if needed)
   assert ingredient.name == "Tomato"


@pytest.mark.django_db
def test_ingredient_with_no_description():
   ingredient = Ingredient.objects.create(name="Lettuce")
   assert ingredient.name == "Lettuce"
   assert ingredient.description is None  # Should be None since it's optional