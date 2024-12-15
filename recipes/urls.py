from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, RecipeCheckExistsView, RecipeSearchFilterAPIView, \
    SaveRecipeByUserView, RecipeDeleteView, UserCreatedRecipesView, UserSavedRecipesView, RateRecipeView, \
    FetchOtherUserRecipesView

urlpatterns = [
    path('recipes/addRecipe/', RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/recipeInfo/<int:recipe_id>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipes/exists/<str:name>/', RecipeCheckExistsView.as_view(), name='recipe-check-exists'),
    path('recipes/filter/', RecipeSearchFilterAPIView.as_view(), name='recipe-filter-by-restriction'),
    path('recipes/saveRecipe/', SaveRecipeByUserView.as_view(), name='save-recipe'), # POST
    path('recipes/delete/<int:recipe_id>/', RecipeDeleteView.as_view(), name='delete-recipe'),
    path('recipes/my_recipes/', UserCreatedRecipesView.as_view(), name='user-created-recipes'),
    path('recipes/saved_recipes/', UserSavedRecipesView.as_view(), name='get-saved-recipes'),
    path('recipes/rateRecipe/', RateRecipeView.as_view(), name='rate-recipe'), # POST,
    path('recipes/getRecipes/', FetchOtherUserRecipesView.as_view(), name='get-recipes') # GET by passing n=<amount>
]