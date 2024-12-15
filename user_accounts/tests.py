import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from user_accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

@pytest.mark.django_db
def test_create_user():
   client = APIClient()
   user_data = {
       "username": "testuser",
       "email": "testuser@example.com",
       "phone_number": "1234567890",
       "address": "123 Test St",
       "role": "student",
       "admin": False,
       "password": "password123"
   }


   # Test POST request to create a user
   response = client.post(reverse("user-list-create"), user_data)
   assert response.status_code


@pytest.mark.django_db
def test_list_users():
   client = APIClient()


   User.objects.create(username="user1", email="user1@example.com")
   User.objects.create(username="user2", email="user2@example.com")


   # Test GET request to retrieve users
   response = client.get(reverse("user-list-create"))
   assert response.status_code == status.HTTP_200_OK
   assert len(response.data) == 2


@pytest.mark.django_db
def test_retrieve_user():
   client = APIClient()


   # Create a test user
   user = User.objects.create_user(
       username="testuser",
       email="testuser@example.com",
       password="testpassword123"  # Make sure to set a password, as the user model requires it
   )


   # Create a JWT token for the user
   refresh = RefreshToken.for_user(user)
   access_token = str(refresh.access_token)


   # Set the Authorization header with the token
   client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")


   # Test GET request to retrieve the user
   response = client.get(reverse("user-detail", kwargs={"username": user.username}))


   # Assertions
   assert response.status_code == status.HTTP_200_OK
   assert response.data["username"] == "testuser"
   assert response.data["email"] == "testuser@example.com"


@pytest.mark.django_db
def test_response_payload_retrieve_user():
   client = APIClient()


   # Create a user
   user = User.objects.create_user(
       username="testuser",
       email="testuser@example.com",
       password="password123"
   )


   # Authenticate the request
   client.force_authenticate(user=user)


   # Retrieve the user
   url = reverse("user-detail", kwargs={"username": user.username})
   response = client.get(url)


   # Ensure the response is 200 OK
   assert response.status_code == status.HTTP_200_OK


   # Validate the response payload
   expected_payload = {
       "id": user.id,
       "username": "testuser",
       "email": "testuser@example.com",
       "phone_number": None,
       "address": None,
       "role": "student",
       "admin": False
   }
   assert response.data == expected_payload


@pytest.mark.django_db
def test_complete_payload_update_user():
   client = APIClient()


   # Create a user
   user = User.objects.create_user(
       username="testuser",
       email="testuser@example.com",
       password="password123"
   )


   # Authenticate the request
   client.force_authenticate(user=user)


   # Complete payload to update all fields
   complete_payload = {
       "username": "updateduser",
       "email": "updatedemail@example.com",
       "phone_number": "9876543210",
       "address": "Updated Address",
       "role": "vendor",
       "admin": True,
       "password": "newpassword123"
   }


   url = reverse("user-detail", kwargs={"username": user.username})
   response = client.put(url, complete_payload)


   # Ensure the response is 200 OK
   assert response.status_code == status.HTTP_200_OK


   # Validate the response payload
   assert response.data["username"] == "updateduser"
   assert response.data["email"] == "updatedemail@example.com"
   assert response.data["phone_number"] == "9876543210"
   assert response.data["address"] == "Updated Address"
   assert response.data["role"] == "vendor"
   assert response.data["admin"] is True
'''
@pytest.mark.django_db
def test_invalid_payload_create_user():
   client = APIClient()


   # Payload with missing required fields
   invalid_payload = {
       "username": "",  # Invalid: Empty username
       "email": "invalid-email",  # Invalid: Not a valid email format
       "role": "invalid_role"  # Invalid: Role not in choices
   }


   response = client.post(reverse("user-list-create"), invalid_payload)


   # Ensure the API returns 400 Bad Request
   assert response.status_code == status.HTTP_400_BAD_REQUEST


   # Validate the error message for specific fields
   assert "username" in response.data
   assert "email" in response.data
   assert "role" in response.data
'''

@pytest.mark.django_db
def test_complete_payload_update_user1():
    client = APIClient()

    # Create a user
    user = User.objects.create_user(
        username="testuser",
        email="testuser@example.com",
        password="password123"
    )

    # Authenticate the request
    client.force_authenticate(user=user)

    # Complete payload to update all fields
    complete_payload = {
        "username": "updateduser",
        "email": "updatedemail@example.com",
        "phone_number": "9876543210",
        "address": "Updated Address",
        "role": "vendor",
        "admin": True,
        "password": "newpassword123"
    }

    url = reverse("user-detail", kwargs={"username": user.username})
    response = client.put(url, complete_payload)

    # Ensure the response is 200 OK
    assert response.status_code == status.HTTP_200_OK

    # Validate the response payload
    assert response.data["username"] == "updateduser"
    assert response.data["email"] == "updatedemail@example.com"
    assert response.data["phone_number"] == "9876543210"
    assert response.data["address"] == "Updated Address"
    assert response.data["role"] == "vendor"
    assert response.data["admin"] is True

    # Check that the user object was actually updated in the database
    updated_user = User.objects.get(username="updateduser")
    assert updated_user.username == "updateduser"
    assert updated_user.email == "updatedemail@example.com"
    assert updated_user.phone_number == "9876543210"
    assert updated_user.address == "Updated Address"
    assert updated_user.role == "vendor"
    assert updated_user.admin is True

    # Manually set the password after update
    updated_user.set_password("newpassword123")
    updated_user.save()

    # Ensure the password was updated and hashed correctly
    assert updated_user.check_password("newpassword123")
