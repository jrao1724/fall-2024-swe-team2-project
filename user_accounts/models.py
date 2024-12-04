from django.db import models
from django.contrib.auth.models import AbstractUser
# from recipes.models import Recipe
import json

# Create your models here.
class User(AbstractUser):
    ROLES = (
        ('student', 'Student'),
        ('studentGroup', 'Student Group'),
        ('foodBankCustomer', 'Food Bank Customer'),
        ('vendor', 'Vendor')
    )

    username = models.CharField(max_length=30, unique=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLES, default='student')
    admin = models.BooleanField(default=False)
    email = models.CharField(max_length=40, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    saved_recipes = models.ManyToManyField("recipes.Recipe", related_name='saved_by', blank=True)

    def __str__(self):
        return str(self.username)

    @property
    def is_admin(self):
        return self.admin
    