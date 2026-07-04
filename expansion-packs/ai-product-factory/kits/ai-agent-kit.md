# AI Agent Kit — AI Product Factory

Complete production workflow for AI agent/assistant products.

## Included Workflows

| Phase | Skill/Agent | Output |
|---|---|---|
| Validation | `bmad-apf-validate-idea` | Validation report |
| Product | `bmad-apf-generate-prd` | Agent PRD |
| Architecture | `bmad-apf-choose-stack` | Agent architecture |
| Build | `bmad-apf-build-mvp` | Agent codebase |
| RAG | Platform agent | Vector DB + retrieval |
| Memory | Platform agent | Conversation memory |
| Tools | Platform agent | Function calling / MCP |
| Deploy | `bmad-apf-deploy-app` | Cloud deployment |
| Observability | Platform agent | Langfuse/Helicone |

## Default Stack

- Frontend: Next.js (chat UI)
- Backend: Python (FastAPI) or Node.js
- LLM: OpenAI / Anthropic API
- Vector DB: Supabase pgvector / Pinecone
- Memory: Redis / PostgreSQL
- Tools: Function calling + MCP servers
- Deployment: Vercel + Railway / Modal
- Observability: Langfuse

## Agent Essentials

- [ ] Chat interface
- [ ] System prompt management
- [ ] RAG pipeline (document ingestion + retrieval)
- [ ] Conversation memory (short + long term)
- [ ] Tool/function calling
- [ ] Rate limiting
- [ ] Usage tracking / billing
- [ ] Admin dashboard
- [ ] Observability (traces, costs)

## Getting Started

```
> use the bmad-apf-launch-startup skill
> Product type: ai-agent
> Platform: web
```
