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
    
    ingredients = models.ManyToManyField('Ingredient', through='RecipeIngredient')
    
    restrictions = models.ManyToManyField(DietaryRestriction, related_name="recipes", blank=True)
    allergens = models.ManyToManyField(Allergen, related_name="recipes", blank=True)
    
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return str(self.recipe_name)
