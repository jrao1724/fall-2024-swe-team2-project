import pytest
import json
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.db import IntegrityError
from user_accounts.models import User
from ingredients.models import Ingredient, RecipeIngredient
from recipes.models import Recipe, Allergen, DietaryRestriction, Rating
from django.core.files.uploadedfile import SimpleUploadedFile



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

@pytest.mark.django_db
def test_create_recipe_invalid_data():
    client, user, _ = setup()
    client.force_authenticate(user=user)
    url = reverse("recipe-list-create")
    response = client.post(url, {"recipe_name": ""})  # Missing required fields
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_create_recipe_with_image():
    client, user, recipe_data = setup()
    
    # Create a dummy image to upload
    image = SimpleUploadedFile(
        name="test_image.jpg",
        content=b"fake image content",  # This is just fake binary content for the image
        content_type="image/jpeg"
    )

    # Convert the nutrition dictionary to a JSON string
    recipe_data['nutrition'] = json.dumps(recipe_data['nutrition'])

    # Add the image to the recipe data
    recipe_data['image'] = image

    # Authenticate the client
    client.force_authenticate(user=user)

    # Send the POST request with the recipe data and image
    url = reverse("recipe-list-create")
    response = client.post(url, recipe_data, format="multipart")

    # Assert the response status is HTTP 201 Created
    assert response.status_code == status.HTTP_201_CREATED

    # Assert that the recipe is created in the database
    assert Recipe.objects.count() == 1
    recipe = Recipe.objects.first()
    assert recipe.recipe_name == recipe_data["recipe_name"]
    assert recipe.image is not None  # Ensure that the image URL is generated
    assert "https://" in recipe.image  # Assuming the image URL contains 'https://'