// Reusable modal for adding or editing a task

import { useState } from 'react';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = { title: '', description: '', status: 'To Do', priority: 'Medium' } 
}) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [status, setStatus] = useState(initialData.status);
  const [priority, setPriority] = useState(initialData.priority);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, status, priority });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ opacity: 0.5 }}></div>

      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow-lg border-0">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Add New Task</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body pt-2">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Finish API documentation"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details, notes, or acceptance criteria..."
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select form-select-lg rounded-3"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Priority</label>
                    <select
                      className="form-select form-select-lg rounded-3"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-bold">
                  Add Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}