from celery import shared_task
from django.core.management import call_command
import logging

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