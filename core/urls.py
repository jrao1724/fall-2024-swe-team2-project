from django.urls import re_path
from .views import serve_frontend

# Catch all pattern
urlpatterns = [
    re_path('.*', serve_frontend, name='frontend'),
]