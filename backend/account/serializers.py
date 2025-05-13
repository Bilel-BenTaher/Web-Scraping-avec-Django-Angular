from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'},
        validators=[validate_password]
    )
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {
            'username': {'required': True, 'allow_blank': False, 'min_length': 4},
            'first_name': {'required': True, 'allow_blank': False, 'max_length': 30},
            'last_name': {'required': True, 'allow_blank': False, 'max_length': 30},
            'email': {'required': True, 'allow_blank': False}
        }

class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        write_only=True
    )

class SignOutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)
    
class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')
        extra_kwargs = {
            'username': {'read_only': True},  # Empêche la modification du nom d'utilisateur
            'password': {'write_only': True}  # Le mot de passe n'est jamais renvoyé dans les réponses
        }
    
    def update(self, instance, validated_data):
        # Gérer séparément le mot de passe s'il est fourni
        password = validated_data.pop('password', None)
        
        # Mettre à jour les autres champs normalement
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # Si un mot de passe est fourni, le hacher correctement avant de l'enregistrer
        if password is not None:
            instance.set_password(password)
            
        instance.save()
        return instance