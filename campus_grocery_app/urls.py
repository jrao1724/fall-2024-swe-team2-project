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
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('core.urls')),
    path('apis/token/', csrf_exempt(TokenObtainPairView.as_view()), name='token-obtain-pair'),
    path('apis/token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token-refresh'),
    path('apis/rest/', include('user_accounts.urls')),
    # path('apis/rest/', include('ingredients.urls')),
    path('apis/rest/', include('recipes.urls'))
    # path('ingredients/', include('ingredients.urls')),
    # path('marketplace/', include('marketplace.urls')),
    # path('recipes/', include('recipes.urls')),
]
