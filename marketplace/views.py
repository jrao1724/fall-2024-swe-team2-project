from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer
import django

# Create your views here.

class CreatePostView(generics.GenericAPIView):
    permissions = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FilterPostView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            search_data = request.data
            keyword = search_data.get('search', "").strip()

            queryset = Post.objects.all()

            # Filter by keyword in post title
            if keyword:
                queryset = queryset.filter(post_title__icontains=keyword)

            serializer = PostSerializer(queryset, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except django.core.exceptions.FieldError as e:
            return Response(
                {"error": f"Invalid field or query: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class GetAllPostsView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset
    
class DeletePostView(generics.GenericAPIView):
    """
    Deletes a post using the DELETE method
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id, *args, **kwargs):
        try:
            post = Post.objects.get(post_id=post_id)

            if request.user.username != post.created_by:
                return Response(
                    {"error": "You do not have permission to delete this post."},
                    status=status.HTTP_403_FORBIDDEN
                )

            post.delete()
            return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class PostsByUserView(generics.ListAPIView):
    """
    Retrieve all posts created by the currently authenticated user.
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(created_by=self.request.user.username)