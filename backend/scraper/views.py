
from rest_framework import generics
from .models import Quote
from .serializers import QuoteSerializer
from .filters import QuoteFilter
from rest_framework.pagination import PageNumberPagination


# Create your views here.

class QuoteList(generics.ListAPIView):
    queryset = Quote.objects.all().order_by('id')
    filterset_class = QuoteFilter 
    pagination_class = PageNumberPagination
    serializer_class = QuoteSerializer
     