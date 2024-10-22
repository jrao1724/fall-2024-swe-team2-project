from django.db import models

# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.name)

class RecipeIngredient(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    recipe = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE)
    quantity = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.quantity} of {self.ingredient.name} in {self.recipe.name}"