from django.core.management.base import BaseCommand
from scraper.tasks import envoyer_citations_quotidiennes

class Command(BaseCommand):
    help = 'Test les notifications Celery'

    def handle(self, *args, **options):
        self.stdout.write('Lancement du test de notifications...')
        
        resultat = envoyer_citations_quotidiennes.delay()
        
        self.stdout.write(
            self.style.SUCCESS(f'Tâche lancée avec ID: {resultat.id}')
        )