from django.urls import path
from . import views

urlpatterns = [
    path('trigger-scraping/', views.trigger_scraping, name='trigger_scraping'),
]