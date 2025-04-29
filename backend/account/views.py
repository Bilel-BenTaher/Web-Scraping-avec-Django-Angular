from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import SignUpSerializer

User = get_user_model()

class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        username = request.data.get('username')
        
        # Vérifier si l'email existe déjà
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Un utilisateur avec cet email existe déjà'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si le nom d'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Ce nom d\'utilisateur est déjà pris'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Si tout est ok, procéder à la création
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
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