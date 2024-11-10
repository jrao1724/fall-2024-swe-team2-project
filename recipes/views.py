from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
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

# List the recipes that meet the provided keyword, dietary restriction, and/or allergy

class RecipeSearchFilterAPIView(generics.GenericAPIView):
    """
    POST API for searching recipes by name, multiple restrictions, and multiple allergens.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        search_data = request.data
        keyword = search_data.get('search', "")
        restriction_ids = search_data.get('restrictions', [])
        allergen_ids = search_data.get('allergens', [])

        queryset = Recipe.objects.all()

        if keyword:
            queryset = queryset.filter(recipe_name__icontains=keyword)

        if restriction_ids:
            queryset = queryset.filter(restrictions__id__in=restriction_ids).distinct()

        if allergen_ids:
            queryset = queryset.filter(allergens__id__in=allergen_ids).distinct()

        serializer = RecipeSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)