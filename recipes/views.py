from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.db.models import Q
from .models import Recipe
from .serializers import RecipeSerializer

# Create your views here.
class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RecipeCheckExistsView(generics.GenericAPIView):
    serializer_class = RecipeSerializer

    def get(self, request, *args, **kwargs):
        recipe_name = kwargs.get('recipe_name', None)
        if Recipe.objects.filter(name=recipe_name).exists():
            return Response({'exists': True}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_200_OK)


class RecipeFilterByRestrictionView(generics.ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        restriction = self.request.query_params.get('restriction', None)
        if restriction:
            return Recipe.objects.filter(restrictions=restriction)
        return Recipe.objects.none()