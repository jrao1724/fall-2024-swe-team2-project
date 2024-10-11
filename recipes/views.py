from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import Recipe
from .serializers import RecipeSerializer

# Create your views here.
# API to create new recipes
class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
# API to get Recipe info
class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Check if a Recipe exists
class RecipeCheckExistsView(generics.GenericAPIView):
    serializer_class = RecipeSerializer

    def get(self, request, *args, **kwargs):
        """Check if a Recipe already exists with the same name

        Args:
            request (_type_): POST request with Recipe name

        Returns:
            _type_: Response with true or false
        """
        recipe_name = kwargs.get('recipe_name', None)
        if Recipe.objects.filter(name=recipe_name).exists():
            return Response({'exists': True}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_200_OK)

# List the recipes that meet the provided food restriction
class RecipeFilterByRestrictionView(generics.ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        """Returns recipes based on food restrictions

        Returns:
            _type_: _description_
        """
        restriction = self.request.query_params.get('restriction', None)
        if restriction:
            return Recipe.objects.filter(restrictions=restriction)
        return Recipe.objects.none()