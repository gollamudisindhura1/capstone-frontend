/* eslint-disable react-hooks/set-state-in-effect */
// Reusable modal for adding or editing a task

import { useState, useEffect } from "react";

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: null,
    startTime: null,
    endTime: null
  },
  isEditMode = false
}) {
  // All form fields in one state object (easier to reset)
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'To Do',
    priority: initialData.priority || 'Medium',
    dueDate: '',
    startTime: '',
    endTime: ''
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'To Do',
        priority: initialData.priority || 'Medium',
        dueDate: initialData?.dueDate && !isNaN(new Date(initialData.dueDate).getTime())
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
        startTime: initialData?.startTime && !isNaN(new Date(initialData.startTime).getTime())
          ? new Date(initialData.startTime).toTimeString().slice(0, 5)
          : '',
        endTime: initialData?.endTime && !isNaN(new Date(initialData.endTime).getTime())
          ? new Date(initialData.endTime).toTimeString().slice(0, 5)
          : ''
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // Helper: Create local Date from date + time string, then convert to UTC ISO
  const createLocalDateTime = (dateStr, timeStr) => {
    if (!timeStr) return null;
    const baseDate = dateStr || new Date().toISOString().split('T')[0];
    // Parse as local time (no timezone shift yet)
    const [year, month, day] = baseDate.split('-');
    const [hours, minutes] = timeStr.split(':');
    // Create Date in local timezone
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), 0).toISOString();
  };

  const formattedData = {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
    dueDate: formData.dueDate ? new Date(formData.dueDate + 'T00:00:00').toISOString() : null,
    startTime: createLocalDateTime(formData.dueDate, formData.startTime),
    endTime: createLocalDateTime(formData.dueDate, formData.endTime),
  };

  onSubmit(formattedData);
  onClose();
};

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ opacity: 0.5 }}></div>

      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow-lg border-0">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                {isEditMode ? 'Edit Task' : 'Add New Task'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body pt-2">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control form-control-lg rounded-3"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Finish API documentation"
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    name="description"
                    className="form-control rounded-3"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Details, notes, or acceptance criteria..."
                  />
                </div>

                {/* Status & Priority */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      name="status"
                      className="form-select form-select-lg rounded-3"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Priority</label>
                    <select
                      name="priority"
                      className="form-select form-select-lg rounded-3"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Due Date (optional)</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-control form-control-lg rounded-3"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                  <small className="text-muted d-block mt-1">
                    Tasks with a due date will appear in the Day Planner.
                  </small>
                </div>

                {/* Start & End Time */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Start Time (optional)</label>
                    <input
                      type="time"
                      name="startTime"
                      className="form-control form-control-lg rounded-3"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">End Time (optional)</label>
                    <input
                      type="time"
                      name="endTime"
                      className="form-control form-control-lg rounded-3"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <small className="text-muted d-block mb-3">
                  Select both start and end time for timed events (e.g., meetings). 
                  They will appear as timed blocks in the Day Planner.
                </small>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 rounded-3 fw-bold"
                >
                  {isEditMode ? 'Save Changes' : 'Add Task'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}