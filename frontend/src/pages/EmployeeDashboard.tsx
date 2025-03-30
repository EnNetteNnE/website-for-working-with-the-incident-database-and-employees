import React, { useState } from 'react';
//import { useAuth } from '../context/AuthContext';
//import { Link } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm.tsx';
import IncidentList from '../components/IncidentList.tsx';
import IncidentForm from '../components/IncidentForm.tsx';

const EmployeeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'change-password':
        return <ChangePasswordForm />;
      case 'view-incidents':
        return <IncidentList />;
      case 'add-incident':
        return <IncidentForm />;
      default:
        return (
          <div className="employee-menu">
            <h2>Меню</h2>
            <button onClick={() => setActiveTab('change-password')}>Сменить пароль</button>
            <button onClick={() => setActiveTab('view-incidents')}>Просмотреть инциденты</button>
            <button onClick={() => setActiveTab('add-incident')}>Добавить инцидент</button>
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

export default EmployeeDashboard;