import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateEmployeePassword } from '../api/employees';

const EmployeePasswordForm: React.FC = () => {
  const [employeeLogin, setEmployeeLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.token) {
        await updateEmployeePassword(
          employeeLogin,
          newPassword,
          user.token
        );
        setSuccess(true);
        setError('');
        setEmployeeLogin('');
        setNewPassword('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  return (
    <div>
      <h2>Сменить пароль сотрудника</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Пароль успешно изменен!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин сотрудника:</label>
          <input
            type="text"
            value={employeeLogin}
            onChange={(e) => setEmployeeLogin(e.target.value)}
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
        
        <button type="submit">
          Сменить пароль
        </button>
      </form>
    </div>
  );
};

export default EmployeePasswordForm;