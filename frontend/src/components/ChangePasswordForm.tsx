import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { changePassword } from '../api/auth';

const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.token) {
        await changePassword(oldPassword, newPassword, user.token);
        setSuccess(true);
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed');
    }
  };

  return (
    <div>
      <h2>Смена пароля</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Пароль успешно изменен!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Старый пароль:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Новый пароль:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <button type="submit">Сменить пароль</button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;