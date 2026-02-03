import { useState } from 'react';
import TaskModal from './TaskModal';  
export default function TaskList({ tasks, setTasks, projectId }) {
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Function to add new task
  const handleAddTask = async (taskData) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `Failed to add task (${res.status})`);

      setTasks([...tasks, data]);
      setShowTaskModal(false);
    } catch (err) {
  console.error('Add task error:', err);
  
  if (err.message.includes('401') || err?.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';   
  }
  
  alert(`Error: ${err.message}`);
}
  }

  //centralized update logic for status & priority 
  const handleUpdateTask = async (taskId, updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Update failed (${res.status})`);
      }

      // Update local state safely
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err) {
      console.error('Update task error:', err);
      alert(`Failed to update task: ${err.message}`);
    }
  };

  // delete task with confirmation
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Delete failed (${res.status})`);
      }

      // Remove task from local state
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Delete task error:', err);
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Tasks</h4>
        <button
          className="btn btn-success btn-sm px-4"
          onClick={() => setShowTaskModal(true)}
        >
          + Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="lead">No tasks yet.</p>
          <p className="small">Click "+ Add Task" to get started.</p>
        </div>
      ) : (
        <div className="row g-4">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 hover-shadow">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 flex-grow-1">{task.title}</h5>

                    {/*Delete button */}
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>

                  {task.description && (
                    <p className="card-text text-muted small mb-3 flex-grow-1">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    {/* Status dropdown*/}
                    <select
                      className={`form-select form-select-sm w-auto badge bg-${
                        task.status === 'Done' ? 'success' :
                        task.status === 'In Progress' ? 'warning' : 'secondary'
                      }`}
                      value={task.status}
                      onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>

                    {/* Priority dropdown */}
                    <select
                      className={`form-select form-select-sm w-auto badge bg-${
                        task.priority === 'High' ? 'danger' :
                        task.priority === 'Medium' ? 'warning' : 'info'
                      }`}
                      value={task.priority}
                      onChange={(e) => handleUpdateTask(task._id, { priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  {task.dueDate && (
                    <small className="text-muted mt-2 d-block">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Task Modal*/}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}