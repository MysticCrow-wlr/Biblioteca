// frontend/src/components/CadastroUsuario.jsx
import React, { useState } from 'react';
import api from '../api';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios/', { nome, email });
      alert('Usuário cadastrado com sucesso!');
      
      setNome('');
      setEmail('');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Ocorreu um erro. Verifique se o e-mail já não está em uso.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Usuário"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroUsuario;