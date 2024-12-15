from django.db import models
from ingredients.models import Ingredient, RecipeIngredient
from user_accounts.models import User

class Allergen(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.name)

class DietaryRestriction(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return str(self.name)

# Create your models here.
class Recipe(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    )

    TIME_UNITS = (
        ('mins', 'Minutes'),
        ('hrs', 'Hours')
    )

    recipe_id = models.AutoField(primary_key=True)
    recipe_name = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='easy')
    quickness = models.PositiveIntegerField(help_text="Time in minutes")
    time_unit = models.CharField(max_length=4, choices=TIME_UNITS, default='mins')
    nutrition = models.JSONField()

    ingredients = models.TextField(default="")
    
    restrictions = models.ManyToManyField(DietaryRestriction, related_name="recipes", blank=True)
    allergens = models.ManyToManyField(Allergen, related_name="recipes", blank=True)

    image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(default="")

    average_rating = models.FloatField(default=0.0)

    def update_average_rating(self):
        ratings = self.ratings.all()
        self.average_rating = sum(r.rating for r in ratings) / ratings.count() if ratings.exists() else 0.0
        self.save()

    def __str__(self):
        return str(self.recipe_name)


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField()

    class Meta:
        unique_together = ('user', 'recipe')  # Prevent multiple ratings for the same recipe by the same user

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.recipe.update_average_rating()

    def delete(self, *args, **kwargs):
        recipe = self.recipe
        super().delete(*args, **kwargs)
        recipe.update_average_rating()