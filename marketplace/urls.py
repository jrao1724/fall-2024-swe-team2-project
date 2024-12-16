from django.urls import path
from .views import CreatePostView, FilterPostView, GetAllPostsView, DeletePostView, PostsByUserView

urlpatterns = [
    path('marketplace/addPost/', CreatePostView.as_view(), name='post-list-create'),
    path('marketplace/searchPosts/', FilterPostView.as_view(), name='search-posts'),
    path('marketplace/getAllPosts/', GetAllPostsView.as_view(), name='get-all-posts'),
    path('marketplace/getPostsByUser/', PostsByUserView.as_view(), name='get-users-posts'),
    path('marketplace/<int:post_id>/delete/', DeletePostView.as_view(), name='delete-post'),

]