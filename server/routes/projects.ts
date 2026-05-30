import { Router, Response } from 'express';
import Project from '../models/Project';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/projects - Get all projects (public)
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects - Create project (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { projectName, images, description, technologies, clientIndustry, projectUrl } = req.body;
    
    if (!projectName || !description || !clientIndustry) {
      return res.status(400).json({ error: 'Project name, description, and client industry are required' });
    }

    const project = await Project.create({
      projectName,
      images: images || [],
      description,
      technologies: technologies || [],
      clientIndustry,
      projectUrl,
    });

    return res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { projectName, images, description, technologies, clientIndustry, projectUrl } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { projectName, images, description, technologies, clientIndustry, projectUrl },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
