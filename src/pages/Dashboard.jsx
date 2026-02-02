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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ||'Failed to fetch projects');
        }
        setProjects(data);
      } catch (err) {
        setError(err.message);
        // If token invalid/expired, log out
        if (err.message.includes('token') || err.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  return (
    <div className="container">
      <h2 className="text-center mb-4">Your Projects</h2>
      <button
  className="btn btn-danger mb-4"
  onClick={() => {
    localStorage.removeItem('token');
    navigate('/login');
  }}
>
  Logout
</button>

      {loading && <div className="text-center py-5">Loading projects...</div>}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-5">
          <p className="lead">No projects yet. Create one to get started!</p>
          <button className="btn btn-primary btn-lg">Create New Project</button>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
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