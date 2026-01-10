import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

const router = Router();

// In-memory project store (replace with database in production)
const projects: Map<string, {
  id: string;
  name: string;
  description?: string;
  complexityLevel: number;
  selectedModules: string[];
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}> = new Map();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  description: z.string().optional(),
  complexityLevel: z.number().min(0).max(4).default(2),
  selectedModules: z.array(z.string()).default(['bmm']),
});

const updateProjectSchema = createProjectSchema.partial();

// Get all projects for user
router.get('/', (req, res) => {
  const userProjects = Array.from(projects.values())
    .filter(p => p.userId === req.user?.id)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  res.json({
    success: true,
    data: userProjects,
  });
});

// Get project by ID
router.get('/:id', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROJECT_NOT_FOUND', message: 'Projeto nao encontrado' },
    });
  }

  if (project.userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Acesso negado' },
    });
  }

  res.json({
    success: true,
    data: project,
  });
});

// Create project
router.post('/', (req, res, next) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = {
      id: uuid(),
      ...data,
      status: 'draft',
      userId: req.user!.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    projects.set(project.id, project);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.errors[0].message },
      });
    }
    next(error);
  }
});

// Update project
router.put('/:id', (req, res, next) => {
  try {
    const project = projects.get(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROJECT_NOT_FOUND', message: 'Projeto nao encontrado' },
      });
    }

    if (project.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Acesso negado' },
      });
    }

    const data = updateProjectSchema.parse(req.body);
    const updatedProject = {
      ...project,
      ...data,
      updatedAt: new Date(),
    };

    projects.set(project.id, updatedProject);

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.errors[0].message },
      });
    }
    next(error);
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROJECT_NOT_FOUND', message: 'Projeto nao encontrado' },
    });
  }

  if (project.userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Acesso negado' },
    });
  }

  projects.delete(req.params.id);

  res.json({
    success: true,
  });
});

// Get project artifacts
router.get('/:id/artifacts', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROJECT_NOT_FOUND', message: 'Projeto nao encontrado' },
    });
  }

  if (project.userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Acesso negado' },
    });
  }

  // TODO: Implement artifact retrieval
  res.json({
    success: true,
    data: [],
  });
});

// Get project workflows
router.get('/:id/workflows', (req, res) => {
  const project = projects.get(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROJECT_NOT_FOUND', message: 'Projeto nao encontrado' },
    });
  }

  if (project.userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Acesso negado' },
    });
  }

  // TODO: Implement workflow retrieval
  res.json({
    success: true,
    data: [],
  });
});

export { router as projectsRouter };
