import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.db import IntegrityError
from user_accounts.models import User
from ingredients.models import Ingredient, RecipeIngredient
from recipes.models import Recipe, Allergen, DietaryRestriction, Rating


@pytest.mark.django_db
def setup():
   client = APIClient()
   user = User.objects.create_user(
       username="testuser", email="testuser@example.com", password="testpassword123"
   )
   client.login(username="testuser", password="testpassword123")


   # Ensure that allergens and restrictions are created only if they don't already exist
   allergen, created_allergen = Allergen.objects.get_or_create(name="Peanut")
   restriction, created_restriction = DietaryRestriction.objects.get_or_create(name="Gluten-Free")


   recipe_data = {
       "recipe_name": "Peanut Butter Jelly Sandwich",
       "difficulty_level": "easy",
       "quickness": 10,
       "time_unit": "mins",
       "nutrition": {"calories": 400, "fat": 20},
       "ingredients": "Peanut Butter, Jelly, Bread",
       "restrictions": ["Gluten-Free"],
       "allergens": ["Peanut"],
       "image": None,
       "description": "A quick and easy peanut butter jelly sandwich.",
   }
   return client, user, recipe_data


@pytest.mark.django_db
def test_create_recipe():
   client, user, recipe_data = setup()
   url = reverse("recipe-list-create")
   response = client.post(url, recipe_data, format="json")

@pytest.mark.django_db
def test_get_recipe():
    client, user, recipe_data = setup()

    # Authenticate the client
    client.force_authenticate(user=user)

    # Create the Recipe instance
    recipe = Recipe.objects.create(
        created_by=user,
        recipe_name="Peanut Butter Jelly Sandwich",
        difficulty_level="easy",
        quickness=10,
        time_unit="mins",
        nutrition={"calories": 400, "fat": 20},
        ingredients="Peanut Butter, Jelly, Bread",
        description="A quick and easy peanut butter jelly sandwich.",
    )

    # Construct the URL for fetching the recipe details
    url = reverse("recipe-detail", kwargs={"recipe_id": recipe.recipe_id})

    # Send GET request to the URL
    response = client.get(url)

    # Assert the response status is OK (200)
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_get_recipe_not_found():
    client, user, _ = setup()
    client.force_authenticate(user=user)
    url = reverse("recipe-detail", kwargs={"recipe_id": 9999})  # Non-existent ID
    response = client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_save_recipe_unauthenticated():
    client = APIClient()
    url = reverse("save-recipe")
    response = client.post(url, {})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

'''@pytest.mark.django_db
def test_search_recipes_no_results():
    client, user, _ = setup()
    client.force_authenticate(user=user)
    url = reverse("recipe-search")
    response = client.post(url, {"search": "NonExistentKeyword"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data == []  # No recipes found
'''    

@pytest.mark.django_db
def test_create_recipe_invalid_data():
    client, user, _ = setup()
    client.force_authenticate(user=user)
    url = reverse("recipe-list-create")
    response = client.post(url, {"recipe_name": ""})  # Missing required fields
    assert response.status_code == status.HTTP_400_BAD_REQUEST
