import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Вы вошли в систему</h1>
      {user ? (
        <div>
          <p>Здраствуйте, {user.firstName} {user.lastName}</p>
          <Link to={user.permissionLevel === 4 ? '/admin' : '/employee'}>
            Перейти в меню
          </Link>
        </div>
      ) : (
        <Link to="/login">Пожалуйста, войдите в систему</Link>
      )}
    </div>
  );
};

export default Home;