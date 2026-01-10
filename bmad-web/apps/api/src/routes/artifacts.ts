import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

const router = Router();

// In-memory artifact store (replace with database in production)
const artifacts: Map<string, {
  id: string;
  projectId: string;
  type: string;
  name: string;
  content: string;
  version: number;
  history: { version: number; content: string; updatedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}> = new Map();

// Validation schemas
const createArtifactSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['prd', 'architecture', 'epic', 'story', 'spec', 'diagram', 'tech-spec', 'test-plan']),
  name: z.string().min(1),
  content: z.string(),
});

const updateArtifactSchema = z.object({
  name: z.string().min(1).optional(),
  content: z.string().optional(),
});

// Get artifact by ID
router.get('/:id', (req, res) => {
  const artifact = artifacts.get(req.params.id);

  if (!artifact) {
    return res.status(404).json({
      success: false,
      error: { code: 'ARTIFACT_NOT_FOUND', message: 'Artefato nao encontrado' },
    });
  }

  res.json({
    success: true,
    data: artifact,
  });
});

// Create artifact
router.post('/', (req, res, next) => {
  try {
    const data = createArtifactSchema.parse(req.body);

    const artifact = {
      id: uuid(),
      ...data,
      version: 1,
      history: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    artifacts.set(artifact.id, artifact);

    res.status(201).json({
      success: true,
      data: artifact,
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

// Update artifact
router.put('/:id', (req, res, next) => {
  try {
    const artifact = artifacts.get(req.params.id);

    if (!artifact) {
      return res.status(404).json({
        success: false,
        error: { code: 'ARTIFACT_NOT_FOUND', message: 'Artefato nao encontrado' },
      });
    }

    const data = updateArtifactSchema.parse(req.body);

    // Save current version to history
    artifact.history.push({
      version: artifact.version,
      content: artifact.content,
      updatedAt: artifact.updatedAt,
    });

    // Update artifact
    const updatedArtifact = {
      ...artifact,
      ...data,
      version: artifact.version + 1,
      updatedAt: new Date(),
    };

    artifacts.set(artifact.id, updatedArtifact);

    res.json({
      success: true,
      data: updatedArtifact,
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

// Get artifact versions
router.get('/:id/versions', (req, res) => {
  const artifact = artifacts.get(req.params.id);

  if (!artifact) {
    return res.status(404).json({
      success: false,
      error: { code: 'ARTIFACT_NOT_FOUND', message: 'Artefato nao encontrado' },
    });
  }

  const versions = [
    ...artifact.history,
    {
      version: artifact.version,
      content: artifact.content,
      updatedAt: artifact.updatedAt,
    },
  ].sort((a, b) => b.version - a.version);

  res.json({
    success: true,
    data: versions,
  });
});

// Export artifact
router.post('/:id/export', (req, res) => {
  const artifact = artifacts.get(req.params.id);

  if (!artifact) {
    return res.status(404).json({
      success: false,
      error: { code: 'ARTIFACT_NOT_FOUND', message: 'Artefato nao encontrado' },
    });
  }

  const { format = 'md' } = req.body;

  // TODO: Implement different export formats (pdf, docx, etc.)
  if (format === 'md') {
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${artifact.name}.md"`);
    res.send(artifact.content);
  } else {
    res.json({
      success: false,
      error: { code: 'UNSUPPORTED_FORMAT', message: `Formato ${format} nao suportado ainda` },
    });
  }
});

// Delete artifact
router.delete('/:id', (req, res) => {
  const artifact = artifacts.get(req.params.id);

  if (!artifact) {
    return res.status(404).json({
      success: false,
      error: { code: 'ARTIFACT_NOT_FOUND', message: 'Artefato nao encontrado' },
    });
  }

  artifacts.delete(req.params.id);

  res.json({
    success: true,
  });
});

export { router as artifactsRouter };
