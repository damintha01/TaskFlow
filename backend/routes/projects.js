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

module.exports = router;