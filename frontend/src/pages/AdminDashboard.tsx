import React, { useState } from 'react';
//import { useAuth } from '../context/AuthContext';
//import { Link } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm.tsx';
import EmployeeForm from '../components/EmployeeForm.tsx';
import EmployeeAccessForm from '../components/EmployeeAccessForm.tsx';
import EmployeePasswordForm from '../components/EmployeePasswordForm.tsx';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'change-password':
        return <ChangePasswordForm />;
      case 'add-employee':
        return <EmployeeForm />;
      case 'change-access':
        return <EmployeeAccessForm />;
      case 'change-employee-password':
        return <EmployeePasswordForm />;
      default:
        if (!user) {
            return (
              <div>
                <h1>Вы вошли в систему</h1>
                <Link to="/login">Пожалуйста, войдите в систему</Link>
              </div>
            )
          }
        return (
          <div className="admin-menu">
            <h2>Меню</h2>
            <button onClick={() => setActiveTab('change-password')}>Сменить пароль</button>
            <button onClick={() => setActiveTab('add-employee')}>Добавть сотрудника</button>
            <button onClick={() => setActiveTab('change-access')}>Сменить уровень допуска сотрудника</button>
            <button onClick={() => setActiveTab('change-employee-password')}>Сменить пароль сотрудника</button>
          </div>
        );
    }
  };

  return (
    <div>
      {activeTab && (
        <button onClick={() => setActiveTab('')} className="back-button">
          Вернуться в меню
        </button>
      )}
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;
