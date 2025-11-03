// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Biblioteca from './components/Biblioteca';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import './App.css';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Sistema de Biblioteca</h1>
          {token && ( 
            <nav>
              <Link to="/">Acervo</Link>

              <button onClick={handleLogout} className="logout-button">Sair</button>
            </nav>
          )}
        </header>
        
        <main>
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Cadastro />} />
            

            <Route path="/" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />

            <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;