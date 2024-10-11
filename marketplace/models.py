from django.db import models
from django.contrib.postgres.fields import ArrayField
from user_accounts.models import User

# Create your models here.
class Post(models.Model):
    POST_TYPE_CHOICES = (
        ('buying', 'Buying'),
        ('selling', 'Selling')
    )

    VISIBLE_CONTACT_FIELDS = (
        ('email', 'Email'),
        ('phone_number', 'Phone Number'),
        ('address', 'Address')
    )

    post_id = models.AutoField(primary_key=True)
    user_long = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)
    user_lat = models.DecimalField(max_digits=22, decimal_places=16, blank=True, null=True)

    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username')
    post_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    post_budget = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_negotiable = models.BooleanField(default=True)
    post_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)

    post_description = models.TextField(blank=True, null=True)
    post_title = models.CharField(max_length=200)
    visible_fields = ArrayField(models.CharField(max_length=30, choices=VISIBLE_CONTACT_FIELDS))

    post_type = models.CharField(max_length=10, choices=POST_TYPE_CHOICES)

    def __str__(self):
        return str(self.post_title)

    @property
    def is_buy_or_sell(self):
        return str(self.post_type)
