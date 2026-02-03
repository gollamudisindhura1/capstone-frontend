import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import ProjectInfo from './ProjectInfo';

function ProjectDetail() {
  const { id } = useParams(); // project ID from URL
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-5">Loading project...</div>;

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  if (!project) return <div className="text-center py-5">Project not found</div>;

  return (
    <div className="container">
      {/* pass project & setter to sub-component */}
      <ProjectInfo 
        project={project} 
        setProject={setProject} 
        navigate={navigate} 
      />

      {/*  pass tasks & setter to sub-component */}
      <TaskList 
        tasks={tasks} 
        setTasks={setTasks} 
        projectId={id} 
      />

      {/* Day Planner Placeholder */}
      <div className="mt-5 pt-5 border-top">
        <h4>Day Planner View (Coming Soon)</h4>
        <p>Here we will show tasks by date with a calendar/timeline.</p>
      </div>
    </div>
  );
}

export default ProjectDetail;