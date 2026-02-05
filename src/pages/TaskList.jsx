import { useState } from 'react';
import TaskModal from './TaskModal';  

export default function TaskList({ tasks, setTasks, projectId }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  //status/priority update
 
  const handleUpdateTask = async (taskId, updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again');
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks/${taskId}`, {
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

      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, ...updates } : task
      ));
    } catch (err) {
      console.error('Update task error:', err);
      alert(`Failed to update task: ${err.message}`);
    }
  };

 
  // Delete task
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Delete failed (${res.status})`);
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error('Delete task error:', err);
      alert(`Failed to delete task: ${err.message}`);
    }
  };


  // Open modal to edit a task
 
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };


  // Unified handler for BOTH add and edit
  
  const handleTaskSubmit = async (taskData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again');
      return;
    }

    setSaving(true);

    try {
      let res;
      let updatedTask;

      if (editingTask) {
        // EDIT mode
        res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Update failed');
        }

        updatedTask = await res.json();

        setTasks(prev => 
          prev.map(t => t._id === editingTask._id ? updatedTask : t)
        );
      } else {
        // ADD mode
        res = await fetch(`${API_BASE}/api/projects/${projectId}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Create failed');
        }

        updatedTask = await res.json();
        setTasks(prev => [...prev, updatedTask]);
      }

      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Task submit error:', err);
      if (err.message.includes('401') || err?.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(`Error: ${err.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Tasks</h4>
        <button
          className="btn btn-success btn-sm px-4"
          onClick={() => {
            setEditingTask(null);          // reset to add mode
            setShowTaskModal(true);
          }}
          disabled={saving}
        >
          {saving ? 'Working...' : '+ Add Task'}
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
                 {/* Title + Edit/Delete buttons */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 flex-grow-1">{task.title}</h5>

                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEditTask(task)}
                        title="Edit task"
                        disabled={saving}
                      >
                        <i className="bi bi-pencil">Edit ✏️</i>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteTask(task._id)}
                        title="Delete task"
                        disabled={saving}
                      >
                        <i className="bi bi-trash">🗑️</i>
                      </button>
                    </div>
                  </div>
                  {/* Description */}
                  {task.description && (
                    <p className="card-text text-muted small mb-3 flex-grow-1">
                      {task.description}
                    </p>
                  )}
                  {/* Status & Priority dropdowns */}

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <select
                      className={`form-select form-select-sm w-auto badge bg-${
                        task.status === 'Done' ? 'success' :
                        task.status === 'In Progress' ? 'warning' : 'secondary'
                      }`}
                      value={task.status}
                      onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                      disabled={saving}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>

                    <select
                      className={`form-select form-select-sm w-auto badge bg-${
                        task.priority === 'High' ? 'danger' :
                        task.priority === 'Medium' ? 'warning' : 'info'
                      }`}
                      value={task.priority}
                      onChange={(e) => handleUpdateTask(task._id, { priority: e.target.value })}
                      disabled={saving}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                 {/* Due Date display */}
                  {task.dueDate && (
                    <small className="text-muted mt-2 d-block">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </small>
                  )}
                  {(task.startTime || task.endTime) && (
                    <small className="text-muted mt-1 d-block">
                      {task.startTime && (
                        <>
                          Start: {new Date(task.startTime).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </>
                      )}
                      {task.startTime && task.endTime && ' – '}
                      {task.endTime && (
                        <>
                          End: {new Date(task.endTime).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </>
                      )}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal props */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}        
        initialData={editingTask || {}}
        isEditMode={!!editingTask}
      />
    </>
  );
}