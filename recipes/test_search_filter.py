import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from recipes.models import Recipe, Allergen, DietaryRestriction
from user_accounts.models import User

@pytest.mark.django_db
@pytest.mark.django_db
def setup():
    client = APIClient()
    user = User.objects.create_user(username="testuser", password="testpassword")
    client.force_authenticate(user=user)

    # Use get_or_create to avoid duplicate entries
    restriction, _ = DietaryRestriction.objects.get_or_create(name="Vegan")
    allergen, _ = Allergen.objects.get_or_create(name="Peanut")

    # Create recipes
    recipe1 = Recipe.objects.create(
        created_by=user,
        recipe_name="Vegan Salad",
        difficulty_level="easy",
        quickness=15,
        time_unit="mins",
        description="Healthy vegan salad",
        nutrition={"calories": 200, "fat": 10},

    )
    recipe1.restrictions.add(restriction)

    recipe2 = Recipe.objects.create(
        created_by=user,
        recipe_name="Peanut Butter Cookies",
        difficulty_level="medium",
        quickness=30,
        time_unit="mins",
        description="Cookies with peanut butter",
        nutrition={"calories": 300, "fat": 15},
    )
    recipe2.allergens.add(allergen)

    recipe3 = Recipe.objects.create(
        created_by=user,
        recipe_name="Grilled Cheese Sandwich",
        difficulty_level="easy",
        quickness=10,
        time_unit="mins",
        description="Classic grilled cheese",
        nutrition={"calories": 350, "fat": 18},
    )

    return client, user, restriction, allergen, recipe1, recipe2, recipe3

@pytest.mark.django_db
def test_search_by_keyword():
    client, _, _, _, recipe1, _, _ = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {"search": "Vegan"}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["recipe_name"] == recipe1.recipe_name

@pytest.mark.django_db
def test_filter_by_restrictions():
    client, _, restriction, _, recipe1, _, _ = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {"restrictions": [restriction.name]}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["recipe_name"] == recipe1.recipe_name

@pytest.mark.django_db
def test_filter_by_allergens():
    client, _, _, allergen, _, recipe2, _ = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {"allergens": [allergen.name]}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["recipe_name"] == recipe2.recipe_name

@pytest.mark.django_db
def test_combined_filters():
    client, _, restriction, allergen, recipe1, recipe2, _ = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(
        url,
        {"search": "Peanut", "restrictions": [restriction.name], "allergens": [allergen.name]},
        format="json"
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0  # No recipe matches all filters

@pytest.mark.django_db
def test_empty_filters():
    client, _, _, _, recipe1, recipe2, recipe3 = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 3  # All recipes should be returned
'''
@pytest.mark.django_db
def test_invalid_field():
    client, _, _, _, _, _, _ = setup()
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {"invalid_field": "test"}, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
'''    

@pytest.mark.django_db
def test_permission_denied():
    client = APIClient()  # Unauthenticated client
    url = reverse("recipe-filter-by-restriction")
    response = client.post(url, {"search": "Vegan"}, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
