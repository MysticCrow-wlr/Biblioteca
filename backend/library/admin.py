from django.contrib import admin
from .models import Usuario, Livro, Emprestimo

@admin.register(Livro)
class LivroAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'disponivel')
    list_filter = ('disponivel', 'autor')
    search_fields = ('titulo', 'autor')

@admin.register(Emprestimo)
class EmprestimoAdmin(admin.ModelAdmin):
    list_display = (
        'livro',
        'usuario',
        'data_emprestimo',
        'data_prevista_devolucao',
        'data_devolucao'
    )
    list_filter = (
        'data_emprestimo',
        'data_prevista_devolucao',
        'data_devolucao'
    )

admin.site.register(Usuario)