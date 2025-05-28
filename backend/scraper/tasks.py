from celery import shared_task
from django.core.management import call_command
import logging
from django.contrib.auth.models import User
from django.utils import timezone
from .models import PushSubscription

logger = logging.getLogger(__name__)

@shared_task
def scrape_quotes_task():
    """
    Tâche Celery pour exécuter la commande de scraping de façon asynchrone
    """
    try:
        logger.info("Démarrage de la tâche de scraping...")
        # Cette ligne exécute votre commande management 'scrape_quotes'
        call_command('scrape_quotes')
        logger.info("Tâche de scraping terminée avec succès")
        return "Scraping terminé avec succès"
    except Exception as e:
        logger.error(f"Erreur lors du scraping: {str(e)}")
        raise

@shared_task(bind=True, retry_backoff=True, max_retries=3)
def envoyer_citations_quotidiennes(self):
    """Tâche pour envoyer des citations quotidiennes à tous les utilisateurs abonnés"""
    try:
        from .views import send_random_quote_notification
        
        # Récupérer tous les utilisateurs avec des abonnements actifs
        utilisateurs_avec_abonnements = User.objects.filter(
            pushsubscription__is_active=True
        ).distinct()
        
        nombre_envoyes = 0
        nombre_erreurs = 0
        
        for utilisateur in utilisateurs_avec_abonnements:
            try:
                if send_random_quote_notification(utilisateur):
                    nombre_envoyes += 1
                else:
                    nombre_erreurs += 1
            except Exception as e:
                logger.error(f"Erreur envoi notification pour utilisateur {utilisateur.id}: {e}")
                nombre_erreurs += 1
        
        # Log des résultats
        logger.info(f"Citations quotidiennes: {nombre_envoyes} envoyées, {nombre_erreurs} erreurs")
        
        return {
            'succes': True,
            'nombre_envoyes': nombre_envoyes,
            'nombre_erreurs': nombre_erreurs,
            'horodatage': timezone.now().isoformat()
        }
        
    except Exception as exc:
        logger.error(f"Erreur dans envoyer_citations_quotidiennes: {exc}")
        # Retry automatique en cas d'erreur
        raise self.retry(exc=exc, countdown=60)

@shared_task(bind=True)
def envoyer_notification_demarrage(self, id_utilisateur):
    """Tâche pour envoyer une notification au démarrage du PC"""
    try:
        from .views import send_random_quote_notification
        
        utilisateur = User.objects.get(id=id_utilisateur)
        
        # Vérifier si l'utilisateur a des abonnements actifs
        if not PushSubscription.objects.filter(user=utilisateur, is_active=True).exists():
            return {'succes': False, 'message': 'Aucun abonnement actif'}
        
        # Envoyer notification de démarrage
        succes = send_random_quote_notification(utilisateur)
        
        return {
            'succes': succes,
            'id_utilisateur': id_utilisateur,
            'horodatage': timezone.now().isoformat()
        }
        
    except User.DoesNotExist:
        logger.error(f"Utilisateur {id_utilisateur} non trouvé")
        return {'succes': False, 'erreur': 'Utilisateur non trouvé'}
    except Exception as exc:
        logger.error(f"Erreur notification démarrage: {exc}")
        raise self.retry(exc=exc, countdown=30, max_retries=2)

@shared_task
def nettoyer_abonnements_expires():
    """Tâche de nettoyage des abonnements expirés"""
    try:
        from datetime import timedelta
        
        date_expiration = timezone.now() - timedelta(days=30)
        nombre_supprimes = PushSubscription.objects.filter(
            is_active=False,
            created_at__lt=date_expiration
        ).delete()[0]
        
        logger.info(f"Abonnements expirés supprimés: {nombre_supprimes}")
        return {'succes': True, 'nombre_supprimes': nombre_supprimes}
        
    except Exception as e:
        logger.error(f"Erreur nettoyage: {e}")
        return {'succes': False, 'erreur': str(e)}