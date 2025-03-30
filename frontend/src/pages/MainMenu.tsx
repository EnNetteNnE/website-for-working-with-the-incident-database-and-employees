import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const MainMenu: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Main Menu</h1>
      {user?.permissionLevel === 4 && (
        <div>
          <h2>Admin Options</h2>
          <Link to="/admin/employees">Manage Employees</Link>
          <br />
          <Link to="/admin/incidents">View All Incidents</Link>
        </div>
      )}
      
      {user && user.permissionLevel < 4 && (
        <div>
          <h2>Employee Options</h2>
          <Link to="/employee/incidents">View Incidents</Link>
        </div>
      )}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default MainMenu;