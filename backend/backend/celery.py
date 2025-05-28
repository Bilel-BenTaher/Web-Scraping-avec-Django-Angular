import os
from celery import Celery

# Définir la variable d'environnement pour les settings Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Créer l'instance de l'application Celery
app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

# CORRECTION: Spécifier explicitement votre app 'scraper'
app.autodiscover_tasks(['scraper'])

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')