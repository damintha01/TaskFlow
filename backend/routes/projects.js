// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Import the model

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = new Project({
      name,
      description,
    });

    const project = await newProject.save();
    res.status(201).json(project); // 201 means 'Created'
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    console.log('Update request received for ID:', req.params.id);
    
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    const updatedProject = await project.save();
    console.log('Project updated successfully');
    res.json(updatedProject);
  } catch (err) {
    console.error('Update error:', err);
    if (err.kind === 'ObjectId' || err.name === 'CastError') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete('/:id', async (req, res) => {
  try {
    console.log('Delete request received for ID:', req.params.id);
    
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      console.log('Project not found');
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    console.log('Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    if (err.kind === 'ObjectId' || err.name === 'CastError') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;