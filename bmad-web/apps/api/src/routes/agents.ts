import { Router } from 'express';
import { BMADAdapter } from '../bmad/adapter.js';

const router = Router();
const bmadAdapter = new BMADAdapter();

// Get all available agents
router.get('/', async (req, res, next) => {
  try {
    const agents = await bmadAdapter.getAllAgents();

    res.json({
      success: true,
      data: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        title: agent.title,
        icon: agent.icon,
        module: agent.module,
        persona: {
          role: agent.persona.role,
          communicationStyle: agent.persona.communicationStyle,
        },
        menuCount: agent.menu.length,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get agent by ID
router.get('/:id', async (req, res, next) => {
  try {
    const agent = await bmadAdapter.getAgent(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: 'Agente nao encontrado' },
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    next(error);
  }
});

// Get agent actions (menu)
router.get('/:id/actions', async (req, res, next) => {
  try {
    const actions = await bmadAdapter.getAgentActions(req.params.id);

    res.json({
      success: true,
      data: actions,
    });
  } catch (error) {
    next(error);
  }
});

// Start chat with agent
router.post('/:id/chat', async (req, res, next) => {
  try {
    const { message, conversationId, projectId } = req.body;
    const agentId = req.params.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_MESSAGE', message: 'Mensagem e obrigatoria' },
      });
    }

    const response = await bmadAdapter.processMessage(agentId, message, {
      conversationId,
      projectId,
      userId: req.user?.id,
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

// Get agents by module
router.get('/module/:moduleId', async (req, res, next) => {
  try {
    const agents = await bmadAdapter.getAgentsByModule(req.params.moduleId);

    res.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
});

export { router as agentsRouter };
