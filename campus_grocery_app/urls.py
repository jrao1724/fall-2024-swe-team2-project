"""
URL configuration for campus_grocery_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from core.views import serve_frontend
from user_accounts.views import UserListCreateView, UserDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", serve_frontend, name="frontend"),
    path('apis/rest/users/', UserListCreateView.as_view(), name='user-list-create'),
    path('apis/rest/users/<int:id>/', UserDetailView.as_view(), name='user-detail'),
    # path('ingredients/', include('ingredients.urls')),
    # path('marketplace/', include('marketplace.urls')),
    # path('recipes/', include('recipes.urls')),
]
