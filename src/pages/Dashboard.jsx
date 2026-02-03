// Shows list of user's projects fetched from backend
// Uses token from localStorage for auth

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const[newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
  }, []);
  const handleCreateProject = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newProjectName,
        description: newProjectDesc,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to create project');

    // Add new project to list (optimistic update)
    setProjects([...projects, data]);
    setShowCreateModal(false);
    setNewProjectName('');
    setNewProjectDesc('');
    setSuccessMsg('Project created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="container">
    <h2 className="text-center mb-4">Your Projects</h2>
    {successMsg && (
  <div className="alert alert-success text-center mb-4">
    {successMsg}
  </div>
)}

    {/* Logout button */}
    <div className="text-end mb-3">
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>

    {/* Create Project Button */}
    <div className="text-center mb-4">
      <button
        className="btn btn-success btn-lg"
        onClick={() => setShowCreateModal(true)}  // Opens modal
      >
        Create New Project
      </button>
    </div>

    {loading && <div className="text-center py-5">Loading projects...</div>}

    {error && <div className="alert alert-danger text-center">{error}</div>}

    {!loading && !error && projects.length === 0 && (
      <div className="text-center py-5">
        <p className="lead">No projects yet.</p>
      </div>
    )}

    {!loading && !error && projects.length > 0 && (
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm"
                style={{ cursor: 'pointer' }}  
                onClick={() => navigate(`/projects/${project._id}`)}>
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

    {/* Create Project Modal */}
    {showCreateModal && (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Project</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateProject}>
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description (optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Create Project
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default Dashboard;