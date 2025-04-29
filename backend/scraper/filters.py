
from django_filters import rest_framework as filters
from .models import Quote



class QuoteFilter(filters.FilterSet):
    author = filters.CharFilter(lookup_expr='icontains')  # Filtre insensible à la casse
    tags = filters.CharFilter(method='filter_tags')  # Filtre personnalisé pour les tags

    class Meta:
        model = Quote
        fields = ['author', 'tags']

    def filter_tags(self, queryset, name, value):
        # Filtre les citations qui contiennent le tag spécifié
        return queryset.filter(tags__icontains=value)