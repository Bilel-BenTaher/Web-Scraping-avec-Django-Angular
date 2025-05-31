import json
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from .serializers import SignUpSerializer,UserProfileSerializer,SignInSerializer
from rest_framework_simplejwt.exceptions import  TokenError
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import jwt
from django.conf import settings

User = get_user_model()

class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '').lower().strip()
        username = request.data.get('username', '').strip()
        
        # Validation de l'email
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'email': 'Un utilisateur avec cet email existe déjà.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validation du username
        if User.objects.filter(username__iexact=username).exists():
            return Response(
                {'username': "Ce nom d'utilisateur est déjà pris."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Création de l'utilisateur
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=serializer.validated_data['password'],
                first_name=serializer.validated_data['first_name'],
                last_name=serializer.validated_data['last_name']
            )
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignInView(generics.GenericAPIView):
    serializer_class = SignInSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            
            if not user.check_password(password):
                return Response(
                    {'error': 'Email ou mot de passe incorrect'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'Email ou mot de passe incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )

@method_decorator(csrf_exempt, name='dispatch')
class VerifyTokenView(generics.GenericAPIView):
    """Vue pour vérifier la validité d'un token"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response(
                {'error': 'Token requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Décoder le token pour vérifier sa validité
            decoded_token = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=['HS256']
            )
            
            # Vérifier si l'utilisateur existe toujours
            user_id = decoded_token.get('user_id')
            if not user_id:
                return Response(
                    {'error': 'Token invalide'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            try:
                user = User.objects.get(id=user_id)
                return Response({
                    'valid': True,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username
                    }
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response(
                    {'error': 'Utilisateur non trouvé'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Token expiré'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError:
            return Response(
                {'error': 'Token invalide'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class RefreshTokenView(generics.GenericAPIView):
    """Vue pour rafraîchir le token d'accès"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            new_access_token = refresh.access_token
            
            return Response({
                'access': str(new_access_token),
                'refresh': str(refresh)  # Optionnel: nouveau refresh token
            }, status=status.HTTP_200_OK)
            
        except TokenError:
            return Response(
                {'error': 'Refresh token invalide ou expiré'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
class SignOutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Obtenir le token de rafraîchissement
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Le token de rafraîchissement est requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Blacklister le token de rafraîchissement
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Déconnexion réussie'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la déconnexion: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Retourne l'utilisateur connecté
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        # Récupérer le profil (GET)
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        # Cette méthode gère à la fois PUT et PATCH
        user = self.get_object()
        
        # Utiliser partial=True pour permettre les mises à jour partielles (PATCH)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Ne jamais renvoyer le mot de passe, même hashé
            return Response({
                'user': serializer.data,
                'message': 'Profil mis à jour avec succès'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        # Supprimer le profil (DELETE)
        user = self.get_object()
        user.delete()
        return Response({
            'message': 'Compte supprimé avec succès'
        }, status=status.HTTP_204_NO_CONTENT)
    
class ForgotPasswordView(APIView):
    def post(self, request):
        data = request.data
        
        # Vérifier si l'email est fourni
        if 'email' not in data:
            return Response({'error': 'Email est requis'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Trouver l'utilisateur avec cet email
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            return Response({'error': 'Aucun utilisateur trouvé avec cet email'}, status=status.HTTP_404_NOT_FOUND)
            
        # Générer un token et définir sa date d'expiration
        token = get_random_string(40)
        expire_date = datetime.now() + timedelta(minutes=15)
            
        # Mettre à jour le profil de l'utilisateur
        user.profile.reset_password_token = token
        user.profile.reset_password_expire = expire_date
        user.profile.save()
            
        # Modifier le lien pour utiliser le domaine de votre frontend Angular
        link = f"http://localhost:8000/reset_password/{token}/"
        body = f"Votre lien de réinitialisation de mot de passe est : {link}"
            
        send_mail(
            "Réinitialisation de mot de passe",
            body,
            "votre_email@example.com",
            [data['email']]
        )
            
        return Response({'details': f'Email de réinitialisation envoyé à {data["email"]}'})

class ResetPasswordView(APIView):
    def get(self, request, token):
        # Vérifier que le token existe et n'est pas expiré
        try:
            user = User.objects.get(profile__reset_password_token=token)
            if user.profile.reset_password_expire < timezone.now():
                # Si expiré, on pourrait rediriger vers une page d'erreur
                pass
        except User.DoesNotExist:
            # Si token invalide, on pourrait rediriger vers une page d'erreur
            pass
        
        # Servir la page HTML pour réinitialiser le mot de passe
        return render(request, 'reset_password_template.html')
    
    def post(self, request, token):
        # Pour les requêtes Ajax depuis la page HTML
        try:
            # Si la requête est au format JSON (depuis la page HTML)
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                # Si la requête vient de l'API (comme avant)
                data = request.data
                
            # Vérifier si les champs requis sont présents
            if 'password' not in data or 'confirmPassword' not in data:
                return Response({'error': 'Les champs mot de passe sont requis'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Vérifier si les mots de passe correspondent
            if data['password'] != data['confirmPassword']:
                return Response({'error': 'Les mots de passe ne correspondent pas'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Trouver l'utilisateur avec ce token
            try:
                user = User.objects.get(profile__reset_password_token=token)
            except User.DoesNotExist:
                return Response({'error': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Vérifier si le token n'est pas expiré
            if user.profile.reset_password_expire < timezone.now():
                return Response({'error': 'Token expiré'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Mettre à jour le mot de passe
            user.password = make_password(data['password'])
                
            # Effacer le token et sa date d'expiration
            user.profile.reset_password_token = ""
            user.profile.reset_password_expire = None
                
            # Sauvegarder les modifications
            user.profile.save()
            user.save()
                
            return Response({'details': 'Mot de passe réinitialisé avec succès'})
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)