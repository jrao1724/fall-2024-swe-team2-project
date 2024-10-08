from django.shortcuts import render

# Create your views here.

def serve_frontend(request):
    context = {}
    return render(request, "index.html", context)
