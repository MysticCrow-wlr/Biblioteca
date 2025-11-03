from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    LivroViewSet,
    EmprestimoViewSet,
    RegistroView,
    current_user
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'livros', LivroViewSet)
router.register(r'emprestimos', EmprestimoViewSet)
router.register(r'register', RegistroView, basename='register')


urlpatterns = [
    
    path('', include(router.urls)),
    path('current_user/', current_user),
]