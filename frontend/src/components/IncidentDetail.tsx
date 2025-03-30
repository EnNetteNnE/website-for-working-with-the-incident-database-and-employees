import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { IncidentC, IncidentComment } from '../types/types';
import { fetchIncident, addComment, closeIncident, deleteIncident } from '../api/incidents';

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<IncidentC | null>(null);
  const [comments, setComments] = useState<IncidentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id || !user?.token) return;
        
        const [incidentData] = await Promise.all([
          fetchIncident(id, user.token)
        ]);
        
        setIncident(incidentData);
        setComments(incidentData.comments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.token]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id || !user?.token) return;
    
    try {
      const comment = await addComment(id, newComment, user.token);
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const handleCloseIncident = async () => {
    if (!id || !user?.token || !incident) return;
    
    try {
      await closeIncident(id, user.token);
      const updatedIncident = await fetchIncident(id, user.token);
      setIncident(updatedIncident);
      setComments(updatedIncident.comments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close incident');
    }
  };

  const DeleteIncident = async () => {
    if (!id || !user?.token || !incident) return;
    
    try {
      await deleteIncident(id, user.token);
      navigate('/employee'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete incident');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!incident) return <div>Incident not found</div>;

  const hasPermission = user?.permissionLevel !== undefined && 
                        user.permissionLevel >= incident.securityLevel;

  return (
    <div className="incident-detail">
      <h2>{incident.title}</h2>
      <p className="description">{incident.description}</p>
      <div className="meta">
        <span>Статус: {incident.status}</span>
        <br></br>
        <span>Уровень допуска: {incident.securityLevel}</span>
        <br></br>
        <span>Создан: {new Date(incident.createdAt).toLocaleString()}</span>
      </div>
      
      {incident.status === 'open' && hasPermission && (
        <div className="actions">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Добавить комментарий..."
            rows={3}
          />
          <button onClick={handleAddComment}>Добавить комментарий</button>
          <button onClick={handleCloseIncident}>Закрыть инцидент</button>
        </div>
      )}

      {incident.status === 'closed' && (
        <div className="actions">
          <button onClick={DeleteIncident}>Удалить инцидент</button>
        </div>
      )}

      <div className="comments">
        <h3>Комментарии</h3>
        {comments.length === 0 ? (
          <p>Сейчас нет комментариев</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <p>{comment.text}</p>
              <small>
                создан {comment.author}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentDetail;
