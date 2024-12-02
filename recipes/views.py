from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from .models import Recipe, Rating, User
from .serializers import RecipeSerializer, RatingSerializer, SaveRecipeSerializer

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
        try:
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
        except Exception as e:
            print("Ran into error while searching:", e)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        

class RatingView(generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Response(Rating.objects.filter(user=self.request.user), status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        try:
            serializer.save(user=self.request.user)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        

class SaveRecipeByUserView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = SaveRecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user  # Get the currently authenticated user

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(instance=request.user, validated_data=serializer.validated_data)
        return Response({"message": "Recipe saved successfully!"}, status=status.HTTP_200_OK)