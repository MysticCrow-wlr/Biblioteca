import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("As senhas não são iguais.");
      return;
    }

    try {
      await api.post('/api/register/', {
        username,
        email,
        password,
        password2,
      });
      alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
      navigate('/login');
    } catch (err) {
      console.error("Erro no cadastro:", err.response.data);
      const errorData = err.response.data;
      const errorMessages = Object.values(errorData).flat().join(' ');
      setError(errorMessages || 'Ocorreu um erro ao tentar cadastrar.');
    }
  };

  return (
    <div className="login-container">
      <h2>Crie sua Conta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Confirme a Senha"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Cadastrar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Já tem uma conta? <Link to="/login">Faça Login</Link>
      </p>
    </div>
  );
}

export default Cadastro;