import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addEmployee } from '../api/employees';
import { EmployeeFormData } from '../types/types';

const EmployeeForm: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    accessRightId: 1,
    login: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'accessRightId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.token) {
        await addEmployee(formData, user.token);
        setSuccess(true);
        setError('');
        setFormData({
          firstName: '',
          lastName: '',
          accessRightId: 1,
          login: '',
          password: ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add employee');
    }
  };

  return (
    <div>
      <h2>Добавить сотрудника</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Сотрудник добавлен успешно!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Фамилия:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Уровень допуска:</label>
          <select
            name="accessRightId"
            value={formData.accessRightId}
            onChange={handleChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>Админ</option>
          </select>
        </div>
        <div>
          <label>Логин:</label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        <button type="submit">Добавить сотрудника</button>
      </form>
    </div>
  );
};

export default EmployeeForm;