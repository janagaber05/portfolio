import React, { useState } from 'react';
import { useProjects, useFeaturedProjects } from '../../hooks/useProjects';
import { createProject, updateProject, deleteProject } from '../../lib/api/projects';

/**
 * Example component demonstrating CRUD operations with Projects
 */
const ProjectsExample = () => {
  const { projects, loading, error } = useProjects();
  const { projects: featuredProjects } = useFeaturedProjects();
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    category: [],
    slug: '',
    is_published: false,
    is_featured: false,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission (CREATE)
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccess(false);

    const { error: createError } = await createProject(formData);

    if (createError) {
      setSubmitError(createError);
    } else {
      setSuccess(true);
      setFormData({
        title_en: '',
        title_ar: '',
        category: [],
        slug: '',
        is_published: false,
        is_featured: false,
      });
      // Projects list will auto-refresh via the hook
    }
    setSubmitLoading(false);
  };

  // Handle update
  const handleUpdate = async (id, updates) => {
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccess(false);

    const { error: updateError } = await updateProject(id, updates);

    if (updateError) {
      setSubmitError(updateError);
    } else {
      setSuccess(true);
    }
    setSubmitLoading(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    const { error: deleteError } = await deleteProject(id);

    if (deleteError) {
      setSubmitError(deleteError);
    } else {
      setSuccess(true);
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Projects CRUD Example</h1>

      {/* CREATE Form */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Create New Project</h2>
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Title (EN):
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Title (AR):
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Slug:
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              Published
            </label>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
          <button
            type="submit"
            disabled={submitLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {submitLoading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
        {submitError && <div style={{ color: 'red', marginTop: '10px' }}>Error: {submitError}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>Success!</div>}
      </section>

      {/* READ - Display Projects */}
      <section>
        <h2>All Projects ({projects.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3>{project.title_en}</h3>
              <p>Slug: {project.slug}</p>
              <p>Published: {project.is_published ? 'Yes' : 'No'}</p>
              <p>Featured: {project.is_featured ? 'Yes' : 'No'}</p>
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleUpdate(project.id, { is_published: !project.is_published })}
                  style={{
                    padding: '5px 10px',
                    marginRight: '5px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Toggle Published
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ marginTop: '40px' }}>
        <h2>Featured Projects ({featuredProjects.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: '15px',
                border: '2px solid #007bff',
                borderRadius: '8px',
                backgroundColor: '#e7f3ff',
              }}
            >
              <h3>{project.title_en}</h3>
              <p>{project.slug}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsExample;

