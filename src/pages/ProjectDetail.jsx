// Page for a single project
// Shows project info + list of tasks
// Placeholder for day planner view
// Fetches tasks from backend: /api/projects/:projectId/tasks

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProjectDetail() {
  const { id } = useParams(); // project ID from URL
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch project details
        const projectRes = await fetch(`http://localhost:3000/api/projects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!projectRes.ok) throw new Error('Project not found or access denied');

        const projectData = await projectRes.json();
        setProject(projectData);

        // 2. Fetch tasks for this project
        const tasksRes = await fetch(`http://localhost:3000/api/projects/${id}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!tasksRes.ok) throw new Error('Failed to fetch tasks');

        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('401') || err.message.includes('token')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, []);

  if (loading) return <div className="text-center py-5">Loading project...</div>;

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  if (!project) return <div className="text-center py-5">Project not found</div>;

  return (
    <div className="container">
      {/* Project Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{project.name}</h2>
        <button className="btn btn-outline-primary">Edit Project</button>
      </div>

      <p className="text-muted mb-4">{project.description || 'No description'}</p>

      <small className="text-muted d-block mb-5">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </small>

      {/* Tasks Section */}
      <h4 className="mb-3">Tasks</h4>

      {tasks.length === 0 ? (
        <div className="text-center py-4">
          <p>No tasks yet. Add one!</p>
          <button className="btn btn-success">Add New Task</button>
        </div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-6 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text text-muted small">{task.description || 'No description'}</p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className={`badge bg-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'warning' : 'secondary'}`}>
                      {task.status}
                    </span>
                    <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.dueDate && (
                    <small className="text-muted d-block mt-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day Planner Placeholder */}
      <div className="mt-5 pt-5 border-top">
        <h4>Day Planner View (Coming Soon)</h4>
        <p>Here we will show tasks by date with a calendar/timeline.</p>
      </div>
    </div>
  );
}

export default ProjectDetail;