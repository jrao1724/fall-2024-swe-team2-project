from django.urls import path
from .views import UserListCreateView, UserDetailView

urlpatterns = [
    path('users/addUser/', UserListCreateView.as_view(), name='user-list-create'),  # List all users or create a new user
    path('users/userInfo/<str:username>/', UserDetailView.as_view(), name='user-detail'),  # Retrieve, update, or delete a specific user
]