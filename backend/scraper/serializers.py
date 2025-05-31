from rest_framework import serializers
from .models import Quote

class QuoteSerializer(serializers.ModelSerializer):
    # Make the 'author' and 'tags' fields optional
    author = serializers.CharField(required=False, allow_blank=True)
    tags = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate_text(self, value):
        """Custom validation to ensure the quote text is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Quote text cannot be empty.")
        return value.strip()
    
    def validate(self, attrs):
        """Validation to avoid duplicate quotes"""
        text = attrs.get('text', '').strip().lower()
        author = attrs.get('author', '').strip().lower() if attrs.get('author') else ''
        
        # Get the user from the context
        user = self.context['request'].user
        
        # Check if a similar quote already exists for this user
        existing_quote = Quote.objects.filter(
            user=user,
            text__iexact=text,  # Case-insensitive comparison
            author__iexact=author if author else ''
        ).first()
        
        # If in update mode, exclude the current quote instance
        if self.instance:
            existing_quote = existing_quote.exclude(id=self.instance.id) if existing_quote else None
        
        if existing_quote:
            if author:
                raise serializers.ValidationError({
                    'text': f'This quote by "{author}" already exists in your collection.'
                })
            else:
                raise serializers.ValidationError({
                    'text': 'This quote already exists in your collection.'
                })
        
        return attrs
