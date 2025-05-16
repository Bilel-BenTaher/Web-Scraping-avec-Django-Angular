
from rest_framework import generics,permissions
from .models import Quote
from .serializers import QuoteSerializer
from .filters import QuoteFilter
from rest_framework.pagination import PageNumberPagination
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .tasks import scrape_quotes_task



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