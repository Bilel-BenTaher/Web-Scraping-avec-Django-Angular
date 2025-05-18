from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from .serializers import ContactSerializer
import logging

# Configurez un logger pour déboguer
logger = logging.getLogger(__name__)

@api_view(['POST'])
def send_contact_email(request):
    serializer = ContactSerializer(data=request.data)
    
    if serializer.is_valid():
        # Enregistrer le message de contact dans la base de données
        contact = serializer.save()
        
        # Récupérer les données validées
        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        message = serializer.validated_data['message']
        
        # Contenu de l'email
        email_subject = f"Nouveau message de contact de {name}"
        email_body = f"""
        Vous avez reçu un nouveau message de contact:
        
        Nom: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        # Envoyer l'email avec gestion d'erreurs détaillée
        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=None,  # Utilisera DEFAULT_FROM_EMAIL des settings
                recipient_list=['bilelbentaher9@gmail.com'],
                fail_silently=False
            )
            return Response({"message": "Message envoyé avec succès!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log l'erreur pour le débogage
            logger.error(f"Erreur d'envoi d'email: {str(e)}")
            # Supprimer l'entrée de la base de données en cas d'échec de l'email
            contact.delete()
            return Response(
                {"error": f"Impossible d'envoyer l'email: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)