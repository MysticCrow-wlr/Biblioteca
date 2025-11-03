// frontend/src/components/Biblioteca.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

function Biblioteca() {
  const [livros, setLivros] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [datasDevolucao, setDatasDevolucao] = useState({});

  const fetchData = async () => {
    try {
      const userRes = await api.get('/api/current_user/');
      setCurrentUser(userRes.data);

      const livrosRes = await api.get('/api/livros/');
      setLivros(livrosRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataChange = (livroId, data) => {
    setDatasDevolucao(prev => ({ ...prev, [livroId]: data }));
  };

  const handleEmprestar = async (livroId) => {
    const dataPrevista = datasDevolucao[livroId];
    if (!dataPrevista) {
      alert('Por favor, selecione a data de devolução.');
      return;
    }
    if (!currentUser) {
      alert('Não foi possível identificar o usuário. Tente relogar.');
      return;
    }

    try {
      await api.post('/api/emprestimos/', {
        livro: livroId,
        usuario: currentUser.id,
        data_prevista_devolucao: dataPrevista,
      });
      alert('Livro emprestado com sucesso!');
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Não foi possível emprestar o livro.');
    }
  };

  
  const handleDevolver = async (loanId) => {
    if (!loanId) {
      alert('Não foi possível encontrar o registro do empréstimo para devolução.');
      return;
    }
    try {
      
      await api.post(`/api/emprestimos/${loanId}/devolver/`);
      alert('Livro devolvido com sucesso!');
      fetchData(); 
    } catch (error) {
      console.error('Erro ao devolver o livro:', error);
      alert('Não foi possível devolver o livro.');
    }
  };

  return (
    <div>
      <h2>Acervo da Biblioteca</h2>
      {currentUser && <p>Bem-vindo(a), {currentUser.nome}!</p>}
      
      <ul className="lista-livros">
        {livros.map(livro => (
          <li key={livro.id} className={!livro.disponivel ? 'emprestado' : ''}>
            <div>
              <span><strong>{livro.titulo}</strong> - <em>{livro.autor}</em></span>
              {livro.disponivel && (
                <div style={{ marginTop: '5px' }}>
                  <label>Data de Devolução: </label>
                  <input
                    type="date"
                    onChange={(e) => handleDataChange(livro.id, e.target.value)}
                  />
                </div>
              )}
            </div>
            
            
            {livro.disponivel ? (
              <button onClick={() => handleEmprestar(livro.id)}>Emprestar</button>
            ) : (
              
              currentUser && livro.borrowed_by_user_id === currentUser.id ? (
                <button onClick={() => handleDevolver(livro.active_loan_id)}>Devolver</button>
              ) : (
                <button disabled>Emprestado</button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Biblioteca;