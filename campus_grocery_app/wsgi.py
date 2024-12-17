"""
WSGI config for campus_grocery_app project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
settings_module = 'campus_grocery_app.deployment' if 'WEBSITE_HOSTNAME' in os.environ else 'campus_grocery_app.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'campus_grocery_app.settings')

application = get_wsgi_application()
