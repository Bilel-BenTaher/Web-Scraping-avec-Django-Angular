
from rest_framework import generics,permissions
from .models import Quote
from .serializers import QuoteSerializer
from .filters import QuoteFilter
from rest_framework.pagination import PageNumberPagination



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