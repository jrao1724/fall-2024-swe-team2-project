import pytest
import random
import string
from rest_framework.exceptions import ValidationError
from marketplace.models import Post
from marketplace.serializers import PostSerializer
from user_accounts.models import User
from unittest.mock import Mock
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

@pytest.fixture
def authenticated_client(db):
    user = User.objects.create_user(username="testuser", password="testpassword")
    
    client = APIClient()
    client.login(username="testuser", password="testpassword")
    
    return client

@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',
        password='password123',
        email='testuser@example.com'
    )

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_post_creation():
    post = Post.objects.create(
        post_title="Sample Post",
        post_description="This is a test post",
        post_type="selling",
        post_price=100.50,
        is_active=True
    )
    assert post.post_id is not None
    assert post.post_title == "Sample Post"
    assert post.is_buy_or_sell == "selling"

@pytest.mark.django_db
def test_post_str_method():
    post = Post.objects.create(post_title="Sample Post", post_type="selling")
    assert str(post) == "Sample Post"

@pytest.mark.django_db
def test_post_serializer_valid_data():
    mock_request = Mock()
    mock_request.user = Mock()
    mock_request.user.username = "testuser"

    data = {
        "post_title": "Test Post",
        "post_description": "This is a test",
        "post_type": "buying",
        "post_budget": 500.00,
        "visible_fields": ["email"]
    }
    
    serializer = PostSerializer(data=data, context={'request': mock_request})
    assert serializer.is_valid(), serializer.errors  # Include errors for debugging
    post = serializer.save()
    
    assert post.post_title == "Test Post"
    assert post.post_budget == 500.00
    assert post.created_by == "testuser"


@pytest.mark.django_db
def test_post_serializer_invalid_visible_fields():
    data = {
        "post_title": "Test Post",
        "post_type": "buying",
        "visible_fields": ["invalid_key"]
    }
    serializer = PostSerializer(data=data)
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)

@pytest.mark.django_db
def test_post_serializer_invalid_visible_fields():
    mock_request = Mock()
    mock_request.user = Mock()
    mock_request.user.username = "testuser"

    data = {
        "post_title": "Test Post",
        "post_type": "buying",
        "visible_fields": ["invalid_key"]
    }

    serializer = PostSerializer(data=data, context={'request': mock_request})

    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)        

@pytest.mark.django_db
def test_post_serializer_representation(mocker):
    mock_user = mocker.patch('user_accounts.models.User.objects.filter')
    mock_user.return_value.first.return_value = User(email="test@example.com", address="123 Test St", phone_number="1234567890")
    
    post = Post.objects.create(post_title="Test Post", visible_fields=["email", "address"])
    serializer = PostSerializer(instance=post)
    representation = serializer.data
    assert representation["visible_fields"]["email"] == "test@example.com"
    assert "phone_number" not in representation["visible_fields"]   
'''
@pytest.mark.django_db
def test_create_post_view(authenticated_client, user):
    url = reverse('post-list-create')
    data = {
        "post_title": "New Post",
        "post_description": "This is a description",
        "post_type": "selling",
        "post_price": 150.00
    }
    response = authenticated_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["post_title"] == "New Post"
'''
@pytest.mark.django_db
def test_filter_post_view(authenticated_client):
    Post.objects.create(post_title="Buy Item", post_type="buying", is_active=True)
    Post.objects.create(post_title="Sell Item", post_type="selling", is_active=True)

    url = reverse('search-posts')
    data = {"search": "Buy"}
    response = authenticated_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["post_title"] == "Buy Item"
'''
@pytest.mark.django_db
def test_delete_post_view(authenticated_client, user):
    post = Post.objects.create(post_title="Test Post", created_by=user.username)
    url = reverse('delete-post', kwargs={"post_id": post.post_id})
    response = authenticated_client.delete(url)
    assert response.status_code == status.HTTP_200_OK
    assert Post.objects.filter(post_id=post.post_id).count() == 0
'''
@pytest.mark.django_db
def test_filter_by_type_view(authenticated_client):
    Post.objects.create(post_title="Buy Item", post_type="buying", is_active=True)
    Post.objects.create(post_title="Sell Item", post_type="selling", is_active=True)

    url = reverse('filter-posts-by-type') + "?post_type=buying"
    response = authenticated_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]["post_title"] == "Buy Item" 


from decimal import Decimal
@pytest.mark.django_db
def test_add_post(api_client, capsys):
    user = User.objects.create_user(username="testuser", password="password123")
    api_client.force_authenticate(user=user)

    payload = {
        "post_title": "Selling Tomatoes",
        "post_description": "Fresh tomatoes for sale.",
        "post_price": 50.00,  
        "post_type": "selling",
        "user_location": "NYC, NY",
        "is_active": True,
        "is_negotiable": True,
        "visible_fields": ["email"] 
    }

    url = reverse("post-list-create") 
    response = api_client.post(url, payload, format="json") 

    print(response.data) 

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["post_title"] == "Selling Tomatoes"

    captured = capsys.readouterr()
    print("Captured Output:", captured.out)  
    assert "Selling Tomatoes" in captured.out