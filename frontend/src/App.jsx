// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // We will create this file next

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);

  // 1. FETCH DATA FROM OUR API
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect runs once when the component loads
  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. HANDLE FORM SUBMISSION TO CREATE A NEW PROJECT
  const handleCreateProject = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!projectName.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: projectName, 
          description: projectDescription || 'New project from Vite frontend' 
        }),
      });

      if (!response.ok) {
         throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      setProjects(prevProjects => [newProject, ...prevProjects]); // Add new project to the top
      setProjectName(''); // Clear the inputs
      setProjectDescription('');
    } catch (error) {
      console.error("Failed to create project:", error);
      alert('Failed to create project. Please try again.');
    }
  };

  // 3. HANDLE PROJECT DELETION
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    console.log('Attempting to delete project with ID:', projectId);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Delete failed:', errorData);
        throw new Error(errorData.message || 'Failed to delete project');
      }

      // Remove project from state
      setProjects(prevProjects => prevProjects.filter(p => p._id !== projectId));
      
      // Optional: Show success message
      console.log('Project deleted successfully');
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  // 4. START EDITING A PROJECT
  const handleEditStart = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    // Smooth scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. CANCEL EDITING
  const handleEditCancel = () => {
    setEditingProject(null);
    setProjectName('');
    setProjectDescription('');
  };

  // 6. SAVE EDITED PROJECT
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    console.log('Attempting to update project with ID:', editingProject._id);

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: projectName, 
          description: projectDescription 
        }),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Update failed:', errorData);
        throw new Error(errorData.message || 'Failed to update project');
      }

      const updatedProject = await response.json();
      
      // Update project in state
      setProjects(prevProjects => 
        prevProjects.map(p => p._id === updatedProject._id ? updatedProject : p)
      );
      
      // Reset form
      setEditingProject(null);
      setProjectName('');
      setProjectDescription('');
      
      console.log('Project updated successfully');
    } catch (error) {
      console.error("Failed to update project:", error);
      alert(`Failed to update project: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 TaskFlow</h1>
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '30px',
          opacity: 0.9,
          fontWeight: 300,
          letterSpacing: '0.5px'
        }}>
          Manage your projects with ease and style ✨
        </p>
        
        <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="project-form">
          {editingProject && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.95rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              ✏️ Editing: {editingProject.name}
            </div>
          )}
          <div className="form-group">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="✍️ Project Name"
              required
              autoFocus
            />
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="📝 Project Description (optional)"
              rows="3"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingProject ? '✓ Update Project' : '+ Create Project'}
            </button>
            {editingProject && (
              <button type="button" onClick={handleEditCancel} className="btn-secondary">
                ✕ Cancel
              </button>
            )}
          </div>
        </form>

        <div className="project-list">
          <h2>My Projects ({projects.length})</h2>
          {isLoading ? (
            <p className="loading">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="empty-state">No projects yet. Create your first project above! 👆</p>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px' 
            }}>
              {projects.map((project, index) => (
                <div 
                  key={project._id} 
                  className="project-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="project-content">
                    <h3>{project.name}</h3>
                    <p>{project.description || 'No description provided'}</p>
                    <small className="project-date">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <div className="project-actions">
                    <button 
                      onClick={() => handleEditStart(project)} 
                      className="btn-edit"
                      title="Edit this project"
                      aria-label={`Edit ${project.name}`}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project._id)} 
                      className="btn-delete"
                      title="Delete this project"
                      aria-label={`Delete ${project.name}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;