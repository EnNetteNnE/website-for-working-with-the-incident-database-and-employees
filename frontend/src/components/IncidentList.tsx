import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchIncidents } from '../api/incidents.ts';
import { Incident } from '../types/types';
import { Link } from 'react-router-dom';

const IncidentList: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        if (user) {
          const data = await fetchIncidents(user.token);
          setIncidents(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load incidents');
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="incident-list">
      <h2>Инциденты</h2>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Статус</th>
            <th>Уровень допуска</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.title}</td>
              <td>{incident.status}</td>
              <td>{incident.securityLevel}</td>
              <td>
                <Link to={`/incident/${incident.id}`}>Детали</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;
