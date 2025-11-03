# backend/library/views.py

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Usuario, Livro, Emprestimo
from .serializers import (
    UsuarioSerializer,
    LivroSerializer,
    EmprestimoSerializer,
    RegistroSerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]


class LivroViewSet(viewsets.ModelViewSet):
    queryset = Livro.objects.all()
    serializer_class = LivroSerializer
    permission_classes = [IsAuthenticated]

class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        livro_id = request.data.get('livro')
        try:
            livro = Livro.objects.get(pk=livro_id)
        except Livro.DoesNotExist:
            return Response({'error': 'Livro não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if not livro.disponivel:
            return Response({'error': 'Livro não está disponível'}, status=status.HTTP_400_BAD_REQUEST)

        livro.disponivel = False
        livro.save()
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        emprestimo = self.get_object()
        if emprestimo.data_devolucao:
            return Response({'error': 'Este livro já foi devolvido'}, status=status.HTTP_400_BAD_REQUEST)
        emprestimo.data_devolucao = timezone.now().date()
        emprestimo.save()
        livro = emprestimo.livro
        livro.disponivel = True
        livro.save()
        serializer = self.get_serializer(emprestimo)
        return Response(serializer.data)

class RegistroView(viewsets.ModelViewSet):
    serializer_class = RegistroSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

@api_view(['GET'])
def current_user(request):
    try:
        usuario_perfil = Usuario.objects.get(email=request.user.email)
        serializer = UsuarioSerializer(usuario_perfil)
        return Response(serializer.data)
    except Usuario.DoesNotExist:
        return Response({"error": "Perfil de usuário não encontrado."}, status=404)