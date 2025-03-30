import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { useNavigate } from 'react-router-dom';



const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin, error, loading } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authLogin(login, password);

    if (error){}
    else if (user) {navigate(user.permissionLevel === 4 ? '/admin' : '/employee'); }
  };

  return (
    <div>
      <h2>Войдите в личный кабинет</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;