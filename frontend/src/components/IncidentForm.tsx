import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createIncident } from '../api/incidents';
import { Incident } from '../types/types';

const IncidentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    securityLevel: 1  
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'securityLevel' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.token) {
        const incidentData: Omit<Incident, 'id'> = {
          title: formData.title,
          description: formData.description,
          securityLevel: formData.securityLevel,
          status: 'open',  
          createdBy: user.employeeId,
          createdAt: new Date().toISOString()  
        };
        
        await createIncident(incidentData, user.token);
        setSuccess(true);
        setError('');
        setFormData({
          title: '',
          description: '',
          securityLevel: 1
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
    }
  };

  return (
    <div>
      <h2>Добавить инцидент</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Incident created successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Уровень допуска:</label>
          <select
            name="securityLevel"  
            value={formData.securityLevel}
            onChange={handleChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <button type="submit">Создать инцидент</button>
      </form>
    </div>
  );
};

export default IncidentForm;