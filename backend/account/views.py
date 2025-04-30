from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate,get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignUpSerializer,UserProfileSerializer,SignInSerializer

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
        
        # Recherche directe de l'utilisateur par email
        try:
            user = User.objects.get(email=email)
            
            # Vérification manuelle du mot de passe
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
        # Mettre à jour le profil (PUT)
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
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