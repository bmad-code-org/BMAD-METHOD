import { Router } from 'express';
import { BMADAdapter } from '../bmad/adapter.js';

const router = Router();
const bmadAdapter = new BMADAdapter();

// In-memory workflow instances (replace with database in production)
const workflowInstances: Map<string, {
  id: string;
  projectId: string;
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  status: string;
  stepOutputs: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
}> = new Map();

// Get all available workflows
router.get('/', async (req, res, next) => {
  try {
    const workflows = await bmadAdapter.getAllWorkflows();

    res.json({
      success: true,
      data: workflows,
    });
  } catch (error) {
    next(error);
  }
});

// Get workflow by ID
router.get('/:id', async (req, res, next) => {
  try {
    const workflow = await bmadAdapter.getWorkflow(req.params.id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: { code: 'WORKFLOW_NOT_FOUND', message: 'Workflow nao encontrado' },
      });
    }

    res.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    next(error);
  }
});

// Start a workflow
router.post('/:id/start', async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const workflowId = req.params.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PROJECT', message: 'Projeto e obrigatorio' },
      });
    }

    const workflow = await bmadAdapter.getWorkflow(workflowId);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: { code: 'WORKFLOW_NOT_FOUND', message: 'Workflow nao encontrado' },
      });
    }

    const instance = {
      id: crypto.randomUUID(),
      projectId,
      workflowId,
      currentStep: 1,
      totalSteps: workflow.steps.length,
      status: 'active',
      stepOutputs: {},
      startedAt: new Date(),
    };

    workflowInstances.set(instance.id, instance);

    res.status(201).json({
      success: true,
      data: {
        ...instance,
        currentStepDetails: workflow.steps[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get workflow instance status
router.get('/instance/:instanceId/status', (req, res) => {
  const instance = workflowInstances.get(req.params.instanceId);

  if (!instance) {
    return res.status(404).json({
      success: false,
      error: { code: 'INSTANCE_NOT_FOUND', message: 'Instancia nao encontrada' },
    });
  }

  res.json({
    success: true,
    data: instance,
  });
});

// Complete current step and advance
router.post('/instance/:instanceId/step/complete', async (req, res, next) => {
  try {
    const { output } = req.body;
    const instance = workflowInstances.get(req.params.instanceId);

    if (!instance) {
      return res.status(404).json({
        success: false,
        error: { code: 'INSTANCE_NOT_FOUND', message: 'Instancia nao encontrada' },
      });
    }

    if (instance.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'WORKFLOW_NOT_ACTIVE', message: 'Workflow nao esta ativo' },
      });
    }

    // Save step output
    instance.stepOutputs[`step_${instance.currentStep}`] = output;

    // Advance to next step
    if (instance.currentStep >= instance.totalSteps) {
      instance.status = 'completed';
      instance.completedAt = new Date();
    } else {
      instance.currentStep += 1;
    }

    workflowInstances.set(instance.id, instance);

    const workflow = await bmadAdapter.getWorkflow(instance.workflowId);
    const nextStep = instance.status === 'completed'
      ? null
      : workflow?.steps[instance.currentStep - 1];

    res.json({
      success: true,
      data: {
        ...instance,
        currentStepDetails: nextStep,
        completed: instance.status === 'completed',
      },
    });
  } catch (error) {
    next(error);
  }
});

// Pause workflow
router.post('/instance/:instanceId/pause', (req, res) => {
  const instance = workflowInstances.get(req.params.instanceId);

  if (!instance) {
    return res.status(404).json({
      success: false,
      error: { code: 'INSTANCE_NOT_FOUND', message: 'Instancia nao encontrada' },
    });
  }

  instance.status = 'paused';
  workflowInstances.set(instance.id, instance);

  res.json({
    success: true,
    data: instance,
  });
});

// Resume workflow
router.post('/instance/:instanceId/resume', (req, res) => {
  const instance = workflowInstances.get(req.params.instanceId);

  if (!instance) {
    return res.status(404).json({
      success: false,
      error: { code: 'INSTANCE_NOT_FOUND', message: 'Instancia nao encontrada' },
    });
  }

  if (instance.status !== 'paused') {
    return res.status(400).json({
      success: false,
      error: { code: 'WORKFLOW_NOT_PAUSED', message: 'Workflow nao esta pausado' },
    });
  }

  instance.status = 'active';
  workflowInstances.set(instance.id, instance);

  res.json({
    success: true,
    data: instance,
  });
});

export { router as workflowsRouter };
