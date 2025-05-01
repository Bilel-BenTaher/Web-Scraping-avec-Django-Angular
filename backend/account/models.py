from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver 
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    reset_password_token = models.CharField(max_length=50, default="", blank=True)
    reset_password_expire = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Profil de {self.user.username}"
 
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    # Cette fonction est déclenchée quand un User est créé
    if created:
        Profile.objects.create(user=instance)
