
from rest_framework import generics
from .models import Quote
from .serializers import QuoteSerializer

# Create your views here.
class QuoteList(generics.ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer