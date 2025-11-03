from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Usuario, Livro, Emprestimo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email']

class LivroSerializer(serializers.ModelSerializer):
    
    active_loan_id = serializers.SerializerMethodField()
    borrowed_by_user_id = serializers.SerializerMethodField()

    class Meta:
        model = Livro
        
        fields = ['id', 'titulo', 'autor', 'disponivel', 'active_loan_id', 'borrowed_by_user_id']

    def get_active_loan_id(self, obj):
        """Se o livro estiver emprestado, retorna o ID do empréstimo ativo."""
        if not obj.disponivel:
            loan = Emprestimo.objects.filter(livro=obj, data_devolucao__isnull=True).first()
            return loan.id if loan else None
        return None

    def get_borrowed_by_user_id(self, obj):
        """Se o livro estiver emprestado, retorna o ID do usuário que o pegou."""
        if not obj.disponivel:
            loan = Emprestimo.objects.filter(livro=obj, data_devolucao__isnull=True).first()
            return loan.usuario.id if loan else None
        return None

class EmprestimoSerializer(serializers.ModelSerializer):
    livro_titulo = serializers.CharField(source='livro.titulo', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)

    class Meta:
        model = Emprestimo
        fields = ['id', 'livro', 'usuario', 'data_emprestimo', 'data_prevista_devolucao', 'data_devolucao', 'livro_titulo', 'usuario_nome']

class RegistroSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = User(
            email=self.validated_data['email'],
            username=self.validated_data['username']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password': 'As senhas não são iguais.'})
        
        user.set_password(password) 
        user.save()

        
        Usuario.objects.create(
            nome=user.username,
            email=user.email
        )
        return user
