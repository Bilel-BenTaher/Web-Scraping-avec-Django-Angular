from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from scraper.views import send_random_quote_notification  

class Command(BaseCommand):
    help = 'Envoie des citations aléatoires à tous les utilisateurs abonnés'

    def handle(self, *args, **options):
        users_with_subscriptions = User.objects.filter(
            pushsubscription__is_active=True
        ).distinct()
        
        sent_count = 0
        error_count = 0
        
        for user in users_with_subscriptions:
            try:
                if send_random_quote_notification(user):
                    sent_count += 1
                else:
                    error_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Erreur avec utilisateur {user.username}: {str(e)}')
                )
                error_count += 1
                
        self.stdout.write(
            self.style.SUCCESS(
                f'Notifications envoyées à {sent_count} utilisateurs, {error_count} échecs'
            )
        )