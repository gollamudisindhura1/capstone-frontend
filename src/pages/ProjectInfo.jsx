// Reusable component - shows project header + edit modal

import { useState } from 'react';

export default function ProjectInfo({ project, setProject }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(project.name || '');
  const [editDesc, setEditDesc] = useState(project.description || '');

  const handleEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      setProject(data);
      setShowEditModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{project.name}</h2>
        <button className="btn btn-outline-primary" onClick={() => setShowEditModal(true)}>
          Edit Project
        </button>
      </div>

      <p className="text-muted mb-4">{project.description || 'No description'}</p>

      <small className="text-muted d-block mb-5">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </small>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEdit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}