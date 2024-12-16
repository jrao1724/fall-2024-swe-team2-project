'''import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from user_accounts.models import User
from marketplace.models import Post

@pytest.mark.django_db
def setup():
    client = APIClient()
    user = User.objects.create_user(username="testuser", email="testuser@example.com", password="testpassword123")
    client.login(username="testuser", password="testpassword123")
    return client, user

@pytest.mark.django_db
def test_create_post():
    client, user = setup()
    
    post_data = {
        "post_title": "Test Post",
        "post_description": "This is a test post description.",
        "post_price": 100.00,
        "post_budget": 80.00,
        "is_negotiable": True,
        "post_type": "buying",
        "visible_fields": ["email", "phone_number"],
        "username": user.username,
    }

    url = reverse("post-list-create")  # Replace with actual URL name for creating a post
    response = client.post(url, post_data, format="json")

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["post_title"] == post_data["post_title"]

@pytest.mark.django_db
def test_get_post():
    client, user = setup()
    
    post = Post.objects.create(
        username=user,
        post_title="Test Post",
        post_description="Description of the test post",
        post_price=100.00,
        post_type="selling",
        visible_fields=["email", "phone_number"]
    )
    
    url = reverse("post-detail", kwargs={"post_id": post.post_id})  # Replace with actual URL for retrieving a post
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["post_title"] == post.post_title

@pytest.mark.django_db
def test_update_post():
    client, user = setup()
    
    post = Post.objects.create(
        username=user,
        post_title="Test Post",
        post_description="Description of the test post",
        post_price=100.00,
        post_type="selling",
        visible_fields=["email", "phone_number"]
    )

    update_data = {
        "post_price": 120.00,
        "post_description": "Updated description of the test post",
    }

    url = reverse("post-detail", kwargs={"post_id": post.post_id})  # Replace with actual URL for updating a post
    response = client.patch(url, update_data, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["post_price"] == 120.00
    assert response.data["post_description"] == "Updated description of the test post"

@pytest.mark.django_db
def test_delete_post():
    client, user = setup()

    post = Post.objects.create(
        username=user,
        post_title="Test Post",
        post_description="Description of the test post",
        post_price=100.00,
        post_type="selling",
        visible_fields=["email", "phone_number"]
    )

    url = reverse("post-detail", kwargs={"post_id": post.post_id})  # Replace with actual URL for deleting a post
    response = client.delete(url)

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Post.objects.filter(post_id=post.post_id).exists()

@pytest.mark.django_db
def test_post_visibility_fields():
    client, user = setup()

    post = Post.objects.create(
        username=user,
        post_title="Test Post",
        post_description="Description of the test post",
        post_price=100.00,
        post_type="buying",
        visible_fields=["email", "phone_number"]
    )

    url = reverse("post-detail", kwargs={"post_id": post.post_id})
    response = client.get(url)

    assert "email" in response.data["visible_fields"]
    assert "phone_number" in response.data["visible_fields"]
    assert "address" not in response.data["visible_fields"]

@pytest.mark.django_db
def test_unauthorized_post_update():
    client, user = setup()

    other_user = User.objects.create_user(username="otheruser", email="otheruser@example.com", password="testpassword123")
    
    post = Post.objects.create(
        username=user,
        post_title="Test Post",
        post_description="Description of the test post",
        post_price=100.00,
        post_type="selling",
        visible_fields=["email", "phone_number"]
    )

    update_data = {
        "post_price": 150.00,
    }

    client.login(username="otheruser", password="testpassword123")
    url = reverse("post-detail", kwargs={"post_id": post.post_id})  # Replace with actual URL for updating a post
    response = client.patch(url, update_data, format="json")

    assert response.status_code == status.HTTP_403_FORBIDDEN
    post.refresh_from_db()
    assert post.post_price == 100.00  # Ensure price wasn't updated

'''
