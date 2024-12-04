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

    def create(self, request, *args, **kwargs):
        """
        Override the create method to include the recipe ID in the response.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()  # 'created_by' is already handled in the serializer
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Recipe created successfully!", "recipe_id": recipe.recipe_id},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
# API to get Recipe info
class RecipeDetailView(generics.GenericAPIView):
    """
    API to retrieve recipe details by ID. Accepts both GET and POST.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, recipe_id, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id)
            serializer = RecipeSerializer(recipe)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found."}, status=status.HTTP_404_NOT_FOUND)

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
            recipe_ids = Recipe.objects.filter(name=recipe_name).values_list('id', flat=True)
            return Response({'exists': True, 'recipe_ids': list(recipe_ids)}, status=status.HTTP_200_OK)
        return Response({'exists': False}, status=status.HTTP_200_OK)

# List the recipes that meet the provided keyword, dietary restriction, and/or allergy


class RecipeSearchFilterAPIView(generics.GenericAPIView):
    """
    POST API for searching recipes by name, restrictions, and allergens.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            search_data = request.data
            keyword = search_data.get('search', "").strip()
            restriction_names = search_data.get('restrictions', [])
            allergen_names = search_data.get('allergens', [])

            queryset = Recipe.objects.all()

            # Filter by keyword
            if keyword:
                queryset = queryset.filter(recipe_name__icontains=keyword)

            # Filter by restrictions using names
            if restriction_names:
                queryset = queryset.filter(
                    restrictions__name__in=[name.strip() for name in restriction_names]
                ).distinct()

            # Filter by allergens using names
            if allergen_names:
                queryset = queryset.filter(
                    allergens__name__in=[name.strip() for name in allergen_names]
                ).distinct()

            serializer = RecipeSerializer(queryset, many=True)
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
    

class RecipeDeleteView(generics.GenericAPIView):
    """
    API to delete a recipe by its ID.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, recipe_id, *args, **kwargs):
        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id, created_by=request.user)
            recipe.delete()
            return Response({"message": "Recipe deleted successfully!"}, status=status.HTTP_200_OK)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found or you do not have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)


class UserCreatedRecipesView(generics.GenericAPIView):
    """
    API to fetch recipes created by the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        recipes = Recipe.objects.filter(created_by=user)
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)