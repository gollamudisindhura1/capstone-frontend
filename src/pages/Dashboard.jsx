// src/pages/Dashboard.jsx
// Shows list of user's projects fetched from backend
// Uses token from localStorage for auth

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  if (loading) return <div className="text-center py-5">Loading projects...</div>;

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-center mb-4">Your Projects</h2>

      {projects.length === 0 ? (
        <div className="text-center py-5">
          <p className="lead">No projects yet. Create one to get started!</p>
          <button className="btn btn-primary btn-lg">Create New Project</button>
        </div>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project._id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text text-muted">
                    {project.description || 'No description'}
                  </p>
                  <small className="text-muted">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;