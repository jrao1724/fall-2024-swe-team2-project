from django.db import models
from ingredients.models import Ingredient, RecipeIngredient
from user_accounts.models import User

# Create your models here.
class Recipe(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    )

    RESTRICTION_CHOICES = (
        ('vegetarian', 'Vegetarian'),
        ('vegan', 'Vegan'),
        ('dairy_free', 'Dairy Free'),
        ('gluten_free', 'Gluten Free'),
        ('nut_free', 'Nut Free'),
        ('none', 'None'),
    )

    ALLERGEN_CHOICES = (
        ('nuts', 'Nuts'),
        ('gluten', 'Gluten'),
        ('dairy', 'Dairy'),
        ('soy', 'Soy'),
        ('shellfish', 'Shellfish'),
        ('eggs', 'Eggs'),
        ('none', 'None')
    )

    recipe_id = models.AutoField(primary_key=True)
    recipe_name = models.CharField(max_length=255)
    difficulty_level = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='easy')
    quickness = models.PositiveIntegerField(help_text="Time in minutes")
    nutrition = models.JSONField()

    ingredients = models.ManyToManyField(Ingredient, through=RecipeIngredient)

    restrictions = models.CharField(max_length=20, choices=RESTRICTION_CHOICES, default='none')
    allergens = models.CharField(max_length=20, choices=ALLERGEN_CHOICES, default='none')

    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.recipe_name)
