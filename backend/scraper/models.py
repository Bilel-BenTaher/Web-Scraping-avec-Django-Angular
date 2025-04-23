from django.db import models

# Create your models here.

class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=100)
    tags = models.CharField(max_length=200)  # Stocke les tags séparés par des virgules