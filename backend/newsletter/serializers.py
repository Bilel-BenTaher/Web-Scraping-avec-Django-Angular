from rest_framework import serializers
from .models import NewsletterSubscriber

class NewsletterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        error_messages={
            'required': "L'adresse email est obligatoire.",
            'invalid': "Veuillez fournir une adresse email valide.",
            'blank': "L'adresse email ne peut pas être vide."
        }
    )
    
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']