
from rest_framework import generics,permissions
from .models import Quote, PushSubscription
from .serializers import QuoteSerializer
from .filters import QuoteFilter
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .tasks import scrape_quotes_task
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from pywebpush import webpush, WebPushException
from django.conf import settings
import json
import random
 

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from .tasks import envoyer_notification_demarrage



# Create your views here.

class QuoteList(generics.ListCreateAPIView):
    queryset = Quote.objects.all().order_by('id')
    filterset_class = QuoteFilter
    pagination_class = PageNumberPagination
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class QuoteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

@csrf_exempt
@require_POST
def trigger_scraping(request):
    """Déclenche la tâche de scraping de façon asynchrone"""
    # La méthode delay() permet d'exécuter la tâche de manière asynchrone
    task = scrape_quotes_task.delay()
    return JsonResponse({
        'status': 'success',
        'message': 'Tâche de scraping démarrée avec succès',
        'task_id': task.id
    })

@method_decorator(csrf_exempt, name='dispatch')  # Optional if using auth tokens
class SubscribePushView(APIView):
    """Handles push notification subscriptions"""
    permission_classes = [IsAuthenticated]  # Only logged-in users

    def post(self, request):
        try:
            subscription = request.data.get('subscription')
            if not subscription:
                return Response({"success": False, "error": "Missing subscription data"}, status=400)

            # Create or update subscription
            push_sub, created = PushSubscription.objects.get_or_create(
                user=request.user,
                endpoint=subscription['endpoint'],
                defaults={
                    'p256dh_key': subscription['keys']['p256dh'],
                    'auth_key': subscription['keys']['auth'],
                }
            )
            
            return Response({
                'success': True,
                'message': 'Push notifications enabled successfully!'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=400)


class UnsubscribePushView(APIView):
    """Handles push notification unsubscriptions"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            endpoint = request.data.get('endpoint')
            if not endpoint:
                return Response({'success': False, 'error': 'Missing endpoint'}, status=400)

            PushSubscription.objects.filter(
                user=request.user,
                endpoint=endpoint
            ).delete()

            return Response({
                'success': True,
                'message': 'Push notifications disabled'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=400)


def send_random_quote_notification(user):
    """Envoie une citation aléatoire à un utilisateur"""
    try:
        quotes = Quote.objects.all()
        if not quotes:
            return False
            
        random_quote = random.choice(quotes)
        
        subscriptions = PushSubscription.objects.filter(user=user, is_active=True)
        sent_successfully = False
        
        for subscription in subscriptions:
            try:
                webpush(
                    subscription_info={
                        "endpoint": subscription.endpoint,
                        "keys": {
                            "p256dh": subscription.p256dh_key,
                            "auth": subscription.auth_key
                        }
                    },
                    data=json.dumps({
                        "title": "Daily Quote ✨",
            "body": f'{random_quote.text} - {random_quote.author}',
            "icon": "/static/icons/quote-icon.png",
            "badge": "/static/icons/badge-icon.png",
            "tag": "daily-quote",
            "requireInteraction": True,
              "data": {
        "url": "http://localhost:4200/user/quotes",  
        "type": "quote_notification"
    },
            "actions": [
                {
                    "action": "view",
                    "title": "View more quotes"
                }
            ]
                    }),
                    vapid_private_key=settings.VAPID_PRIVATE_KEY,
                    vapid_claims={
                        "sub": f"mailto:{settings.VAPID_ADMIN_EMAIL}"
                    }
                )
                sent_successfully = True
            except WebPushException as ex:
                print(f"Erreur notification pour {user.username}: {ex}")
                if ex.response and ex.response.status_code == 410:  # 410 = Gone (abonnement expiré)
                    print(f"Suppression abonnement expiré pour {user.username}")
                    subscription.delete()
                elif ex.response and ex.response.status_code == 404:  # 404 = Not Found
                    print(f"Suppression abonnement invalide (404) pour {user.username}")
                    subscription.delete()
                    
        return sent_successfully
    except Exception as e:
        print(f"Erreur majeure envoi notification: {e}")
        return False
    
@csrf_exempt
@login_required
@require_http_methods(["POST"])
def declencher_notification_demarrage(request):
    """Déclenche une notification de démarrage via Celery"""
    try:
        # Lancer la tâche de manière asynchrone
        tache = envoyer_notification_demarrage.delay(request.user.id)
        
        return JsonResponse({
            'succes': True,
            'message': 'Notification de démarrage programmée',
            'id_tache': tache.id
        })
    except Exception as e:
        return JsonResponse({
            'succes': False,
            'erreur': str(e)
        }, status=400)

@csrf_exempt
@login_required
@require_http_methods(["POST"])
def envoyer_notification_manuelle(request):
    """Envoie une notification manuelle à l'utilisateur"""
    try:
        # Utiliser la fonction existante send_random_quote_notification
        succes = send_random_quote_notification(request.user)
        
        return JsonResponse({
            'succes': succes,
            'message': 'Notification envoyée' if succes else 'Erreur envoi notification'
        })
    except Exception as e:
        return JsonResponse({
            'succes': False,
            'erreur': str(e)
        }, status=400)