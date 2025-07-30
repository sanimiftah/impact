/**
 * Projects/Opportunities Routes
 * Handles seedboard ideas, open calls, and volunteer opportunities
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');

const router = express.Router();

// Mock projects database
let projects = [
  {
    id: 1,
    title: "Youth Coding Bootcamp",
    description: "Teaching programming skills to underprivileged youth in Kuala Lumpur",
    category: "education",
    type: "seedboard",
    status: "active",
    location: {
      city: "Kuala Lumpur",
      country: "Malaysia",
      remote: false
    },
    creator: {
      id: 1,
      name: "Maya Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    requirements: {
      skills: ["JavaScript", "Teaching", "Communication"],
      timeCommitment: "5 hours/week",
      duration: "3 months",
      volunteers: 5
    },
    sdgGoals: [4, 8, 10], // Quality Education, Decent Work, Reduced Inequalities
    tags: ["education", "youth", "technology", "mentorship"],
    impactMetrics: {
      beneficiaries: 30,
      hoursVolunteered: 150,
      completionRate: 85
    },
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
    deadline: new Date('2025-04-15'),
    isUrgent: false
  },
  {
    id: 2,
    title: "Beach Cleanup Initiative",
    description: "Organizing coastal cleanup to protect marine ecosystems",
    category: "environment",
    type: "opencall",
    status: "urgent",
    location: {
      city: "Mumbai",
      country: "India",
      remote: false
    },
    creator: {
      id: 3,
      name: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    requirements: {
      skills: ["Physical fitness", "Environmental awareness"],
      timeCommitment: "4 hours",
      duration: "1 day",
      volunteers: 100
    },
    sdgGoals: [14, 15], // Life Below Water, Life on Land
    tags: ["environment", "cleanup", "marine", "community"],
    impactMetrics: {
      beneficiaries: 1000,
      hoursVolunteered: 400,
      wasteCollected: "2 tons"
    },
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-26'),
    deadline: new Date('2025-02-05'),
    isUrgent: true
  },
  {
    id: 3,
    title: "Mental Health Support Network",
    description: "Creating safe spaces for workplace mental health conversations",
    category: "health",
    type: "teamspace",
    status: "active",
    location: {
      city: "Manila",
      country: "Philippines",
      remote: true
    },
    creator: {
      id: 4,
      name: "Luna Santos",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    requirements: {
      skills: ["Psychology", "Counseling", "Empathy", "Communication"],
      timeCommitment: "3 hours/week",
      duration: "6 months",
      volunteers: 8
    },
    sdgGoals: [3, 8], // Good Health, Decent Work
    tags: ["mental-health", "workplace", "support", "wellness"],
    impactMetrics: {
      beneficiaries: 200,
      hoursVolunteered: 144,
      sessionsHeld: 24
    },
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-22'),
    deadline: new Date('2025-07-10'),
    isUrgent: false
  }
];

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all projects with filtering and pagination
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [seedboard, opencall, teamspace]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: urgent
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('type').optional().isIn(['seedboard', 'opencall', 'teamspace']),
  query('urgent').optional().isBoolean()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      category,
      type,
      location,
      urgent,
      search
    } = req.query;

    let filteredProjects = [...projects];

    // Apply filters
    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category === category);
    }

    if (type) {
      filteredProjects = filteredProjects.filter(p => p.type === type);
    }

    if (location) {
      filteredProjects = filteredProjects.filter(p => 
        p.location.city.toLowerCase().includes(location.toLowerCase()) ||
        p.location.country.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (urgent === 'true') {
      filteredProjects = filteredProjects.filter(p => p.isUrgent);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by urgency and creation date
    filteredProjects.sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1;
      if (!a.isUrgent && b.isUrgent) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredProjects.length / limit);

    res.json({
      projects: paginatedProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: filteredProjects.length,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        category,
        type,
        location,
        urgent,
        search
      }
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects'
    });
  }
});

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID ${projectId} does not exist`
      });
    }

    res.json({
      project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch project'
    });
  }
});

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *               description:
 *                 type: string
 *                 minLength: 20
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [seedboard, opencall, teamspace]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', [
  body('title').isLength({ min: 5 }).trim().escape(),
  body('description').isLength({ min: 20 }).trim(),
  body('category').isString().trim(),
  body('type').isIn(['seedboard', 'opencall', 'teamspace']),
  body('location.city').optional().isString().trim(),
  body('location.country').optional().isString().trim(),
  body('requirements.skills').optional().isArray(),
  body('sdgGoals').optional().isArray()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      title,
      description,
      category,
      type,
      location = {},
      requirements = {},
      sdgGoals = [],
      tags = [],
      isUrgent = false
    } = req.body;

    // Get user from token (mock)
    const userId = 1; // This would come from JWT token
    const userName = "Current User"; // This would come from JWT token

    const newProject = {
      id: projects.length + 1,
      title,
      description,
      category,
      type,
      status: isUrgent ? 'urgent' : 'active',
      location: {
        city: location.city || '',
        country: location.country || '',
        remote: location.remote || false
      },
      creator: {
        id: userId,
        name: userName,
        avatar: null
      },
      requirements: {
        skills: requirements.skills || [],
        timeCommitment: requirements.timeCommitment || '',
        duration: requirements.duration || '',
        volunteers: requirements.volunteers || 1
      },
      sdgGoals,
      tags,
      impactMetrics: {
        beneficiaries: 0,
        hoursVolunteered: 0,
        completionRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deadline: requirements.deadline ? new Date(requirements.deadline) : null,
      isUrgent
    };

    projects.push(newProject);

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({
      error: 'Failed to create project'
    });
  }
});

/**
 * @swagger
 * /api/v1/projects/stats:
 *   get:
 *     summary: Get project statistics
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: projects.length,
      byType: {
        seedboard: projects.filter(p => p.type === 'seedboard').length,
        opencall: projects.filter(p => p.type === 'opencall').length,
        teamspace: projects.filter(p => p.type === 'teamspace').length
      },
      byCategory: projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {}),
      byStatus: {
        active: projects.filter(p => p.status === 'active').length,
        urgent: projects.filter(p => p.status === 'urgent').length,
        completed: projects.filter(p => p.status === 'completed').length
      },
      totalImpact: {
        beneficiaries: projects.reduce((sum, p) => sum + (p.impactMetrics.beneficiaries || 0), 0),
        hoursVolunteered: projects.reduce((sum, p) => sum + (p.impactMetrics.hoursVolunteered || 0), 0),
        projectsCompleted: projects.filter(p => p.status === 'completed').length
      }
    };

    res.json({
      stats,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
