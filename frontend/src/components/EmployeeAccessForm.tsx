import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchEmployees, updateEmployeeAccess } from '../api/employees';
import { Employee } from '../types/types';

const EmployeeAccessForm: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [newAccessLevel, setNewAccessLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        if (user?.token) {
          const data = await fetchEmployees(user.token);
          console.log("DATE" + data)
          setEmployees(data.filter((e: Employee) => e.accessRightId < 4));
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees');
        setLoading(false);
      }
    };

    loadEmployees();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      if (user?.token) {
        await updateEmployeeAccess(
          selectedEmployee,
          newAccessLevel,
          user.token
        );
        setSuccess(true);
        setError('');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update access level');
    }
  };

  if (loading) return <div>Загрузка сотрудников...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h2>Изменить уровень доступа сотрудника</h2>
      {success && <p style={{ color: 'green' }}>Уровень допуска изменен успешно!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Выбрать сотрудника:</label>
          <select
            value={selectedEmployee || ''}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
            required
          >
            <option value="">-- Выбрать сотрудника --</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName} (Уровень: {employee.accessRightId})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Новый уровень допуска:</label>
          <select
            value={newAccessLevel}
            onChange={(e) => setNewAccessLevel(Number(e.target.value))}
            required
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>Админ</option>
          </select>
        </div>
        
        <button type="submit" disabled={!selectedEmployee}>
          Изменить уровень допуска
        </button>
      </form>
    </div>
  );
};

export default EmployeeAccessForm;