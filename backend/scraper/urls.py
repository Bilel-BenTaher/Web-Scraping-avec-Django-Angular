from django.urls import path
from . import views

urlpatterns = [
    path('trigger-scraping/', views.trigger_scraping, name='trigger_scraping'),
     path('api/push/demarrage/', views.declencher_notification_demarrage, name='demarrage'),
    path('api/push/manuelle/', views.envoyer_notification_manuelle, name='manuelle'),
]