from azure.storage.blob import BlobServiceClient
from campus_grocery_app import settings
from dotenv import load_dotenv
import os

load_dotenv()

def upload_image_to_azure(image_file, file_name):
    try:
        print("Credentials:", os.getenv('AZURE_ACCOUNT_KEY'))
        print("Container:", )

        blob_service_client = BlobServiceClient(
            account_url=f"https://{os.getenv('AZURE_ACCOUNT_NAME')}.blob.core.windows.net",
            credential=os.getenv('AZURE_ACCOUNT_KEY')
        )

        # Get the container client
        container_client = blob_service_client.get_container_client(os.getenv('AZURE_CONTAINER'))

        # Upload the file
        blob_client = container_client.get_blob_client(file_name)
        blob_client.upload_blob(image_file, overwrite=True)

        # Return the URL of the uploaded file
        blob_url = f"https://{os.getenv('AZURE_ACCOUNT_NAME')}.blob.core.windows.net/{os.getenv('AZURE_CONTAINER')}/{file_name}"
        return blob_url

    except Exception as e:
        print(f"Error uploading to Azure Blob Storage: {e}")
        raise
