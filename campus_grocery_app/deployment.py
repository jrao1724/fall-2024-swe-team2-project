import os 
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']]
CSRF_TRUSTED_ORIGINS = ['https://'+os.environ['WEBSITE_HOSTNAME']]
DEBUG = False
SECRET_KEY = os.environ['MY_SECRET_KEY']

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

'''
CORS_ALLOWED_ORIGINS = [
    'https://victorious-river-09d149f03.4.azurestaticapps.net' 
]
'''


STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

CONNECTION = os.environ['AZURE_POSTGRESQL_CONNECTIONSTRING']
CONNECTION_STR = {pair.split('=')[0]:pair.split('=')[1] for pair in CONNECTION.split(' ')}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": CONNECTION_STR['dbname'],
        "HOST": CONNECTION_STR['host'],
        "USER": CONNECTION_STR['user'],
        "PASSWORD": CONNECTION_STR['password'],
        'TEST': {
            'NAME': 'test_campus_grocery_app_db',  # Test database name
            'USER': CONNECTION_STR['user'],       # You can specify a user for testing
            'PASSWORD': CONNECTION_STR['password'], # Specify password for test DB
            'HOST': CONNECTION_STR['host'],       # Test database host
        },
    }
}

STATIC_ROOT = BASE_DIR / 'staticfiles'

# Azure Blob Storage Settings
DEFAULT_FILE_STORAGE = 'storages.backends.azure_storage.AzureStorage'

# Replace with your Azure Storage Account details
AZURE_ACCOUNT_NAME = os.environ['AZURE_ACCOUNT_NAME']  # e.g., campuscuisinefiles
AZURE_ACCOUNT_KEY = os.environ['AZURE_ACCOUNT_KEY']
AZURE_CONTAINER = os.environ['AZURE_CONTAINER'] # The container name you created


# Media URL points to Azure Blob Storage
MEDIA_URL = f'https://{AZURE_ACCOUNT_NAME}.blob.core.windows.net/{AZURE_CONTAINER}/'
