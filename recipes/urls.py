from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, RecipeCheckExistsView, RecipeSearchFilterAPIView, RatingView, SaveRecipeByUserView

urlpatterns = [
    path('recipes/addRecipe/', RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/recipeInfo/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipes/exists/<str:name>/', RecipeCheckExistsView.as_view(), name='recipe-check-exists'),
    path('recipes/filter/', RecipeSearchFilterAPIView.as_view(), name='recipe-filter-by-restriction'),
    path('recipes/rateRecipe/', RatingView.as_view(), name='rate-recipe'), # POST
    path('recipes/saveRecipe/', SaveRecipeByUserView.as_view(), name='save-recipe') # POST
]