
const express = require('express');
const router = express.Router();
const axios = require('axios');

const Listing = require('../models/Listing');

// Get recommendations for a project
router.get('/:projectId', async (req, res) => {
  try {
    // 1. Find the project in MongoDB
    const project = await Listing.findOne({
      _id: req.params.projectId,
      type: 'find-teammate'
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // 2. Find students looking for a team
    const students = await Listing.find({
      type: 'find-team'
    });

    // 3. Exclude the project owner's own listing
    const filteredStudents = students.filter(student =>
      (student.email || '').toLowerCase() !==
      (project.email || '').toLowerCase()
    );

    // 4. Prepare data to send to Python
    const requestData = {
      project: {
        name: project.name || '',
        email: project.email || '',
        projectTitle: project.projectTitle || '',
        description: project.description || '',
        skills: project.skills || ''
      },

      students: filteredStudents.map(student => ({
        listingId: student._id.toString(),
        name: student.name || '',
        email: student.email || '',
        projectTitle: student.projectTitle || '',
        description: student.description || '',
        skills: student.skills || ''
      }))
    };

    // 5. Send data to Python ML service
    const response = await axios.post(
      'http://127.0.0.1:8000/recommend',
      requestData
    );

    // 6. Return Python's recommendations
    res.json({
      project: project.projectTitle,
      recommendations: response.data.recommendations
    });

  } catch (error) {
    console.error('Recommendation error:', error.message);

    res.status(500).json({
      message: 'Could not generate recommendations',
      error: error.message
    });
  }
});

module.exports = router;
