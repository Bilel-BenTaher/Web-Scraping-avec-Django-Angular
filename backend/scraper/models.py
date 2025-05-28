from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class PushSubscription(models.Model):
    """Stores user's push notification subscriptions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    endpoint = models.URLField()  # Unique browser-generated URL
    p256dh_key = models.TextField()  # Encryption key
    auth_key = models.TextField()  # Authentication key
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'endpoint')  # Prevent duplicate subscriptions

    def __str__(self):
        return f"Push subscription for {self.user.username}"

class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=100)
    tags = models.CharField(max_length=200)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quotes', null=True)
    # Champs de date et heure
    created_at = models.DateTimeField(auto_now_add=True)  # Date et heure de création (s'ajoute automatiquement lors de la création)
    updated_at = models.DateTimeField(auto_now=True)  # Date et heure de dernière modification (se met à jour automatiquement)
    
    def __str__(self):
        return f"{self.text[:50]}... - {self.author}"