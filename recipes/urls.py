from django.urls import path
from .views import RecipeListCreateView, RecipeDetailView, RecipeCheckExistsView, RecipeFilterByRestrictionView

urlpatterns = [
    path('recipes/addRecipe/', RecipeListCreateView.as_view(), name='recipe-list-create'),
    path('recipes/recipeInfo/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipes/exists/<str:name>/', RecipeCheckExistsView.as_view(), name='recipe-check-exists'),
    path('recipes/filter/', RecipeFilterByRestrictionView.as_view(), name='recipe-filter-by-restriction')
]