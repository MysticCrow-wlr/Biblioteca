// frontend/src/components/CadastroLivro.jsx
import React, { useState } from 'react';
import api from '../api';

function CadastroLivro() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/livros/', { titulo, autor });
      alert('Livro cadastrado com sucesso!');
      setTitulo('');
      setAutor('');
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      alert('Ocorreu um erro ao cadastrar o livro.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Livro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do Livro"
          required
        />
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Autor"
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroLivro;