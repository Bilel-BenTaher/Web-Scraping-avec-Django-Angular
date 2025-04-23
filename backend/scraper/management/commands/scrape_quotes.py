from django.core.management.base import BaseCommand
from scraper.scraping import scrape_quotes
import traceback

class Command(BaseCommand):
    help = 'Scrape quotes from quotes.toscrape.com/js/'

    def handle(self, *args, **kwargs):
        self.stdout.write('Début du scraping...')
        try:
            count = scrape_quotes()
            self.stdout.write(self.style.SUCCESS(f'Scraping terminé avec succès! {count} citations trouvées.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur pendant le scraping: {str(e)}'))
            # Afficher plus de détails sur l'erreur
            self.stdout.write(self.style.ERROR(traceback.format_exc()))