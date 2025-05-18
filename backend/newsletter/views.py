from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from .serializers import NewsletterSerializer
from .models import NewsletterSubscriber
import json

@api_view(['POST'])
def subscribe_newsletter(request):
    # Accepter les données JSON et formulaire
    try:
        # Si les données arrivent en tant que chaîne JSON
        if isinstance(request.data, dict) and 'email' not in request.data and request.body:
            try:
                data = json.loads(request.body)
                if 'email' in data:
                    email_data = {'email': data['email']}
                else:
                    return Response(
                        {"error": "Le champ 'email' est obligatoire"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except json.JSONDecodeError:
                return Response(
                    {"error": "Format de données invalide. JSON attendu"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            email_data = request.data
            
        serializer = NewsletterSerializer(data=email_data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Vérifier si l'email existe déjà
            if NewsletterSubscriber.objects.filter(email=email).exists():
                return Response(
                    {"message": "Cette adresse email est déjà inscrite à notre newsletter."},
                    status=status.HTTP_200_OK
                )
            
            # Sauvegarder le nouvel abonné
            subscriber = serializer.save()
            
            # Envoyer une notification par email
            try:
                # Email à l'administrateur
                admin_subject = "Nouvel abonnement à la newsletter"
                admin_message = f"Un nouvel utilisateur s'est inscrit à la newsletter avec l'email: {email}"
                
                send_mail(
                    subject=admin_subject,
                    message=admin_message,
                    from_email='noreply@quoteshub.com',
                    recipient_list=['bilelbentaher9@gmail.com'],
                    fail_silently=False
                )
                
                # Email de confirmation à l'utilisateur
                user_subject = "Bienvenue à la newsletter de QuotesHub"
                user_message = f"""
                Bonjour,
                
                Merci de vous être inscrit à la newsletter de QuotesHub!
                Vous recevrez désormais toutes nos dernières actualités et citations inspirantes.
                
                Cordialement,
                L'équipe QuotesHub
                """
                
                send_mail(
                    subject=user_subject,
                    message=user_message,
                    from_email='noreply@quoteshub.com',
                    recipient_list=[email],
                    fail_silently=False
                )
                
                return Response(
                    {"message": "Inscription à la newsletter réussie! Merci de votre intérêt."},
                    status=status.HTTP_201_CREATED
                )
                
            except Exception as e:
                # En cas d'erreur, on supprime l'abonné créé
                subscriber.delete()
                return Response(
                    {"error": f"Une erreur s'est produite lors de l'envoi de l'email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {"error": f"Une erreur inattendue s'est produite: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )