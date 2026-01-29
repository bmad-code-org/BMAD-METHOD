# Quant Method

**AI-Driven Investment Quant Development and Research Framework** -- Specialized AI agents and structured workflows for systematic strategy research, backtesting, risk management, and production deployment.

## Why Quant Method?

Quantitative investment research requires rigorous process discipline -- from hypothesis formation through statistical validation to production monitoring. Traditional tools leave gaps between research notebooks and production systems. Quant Method bridges this with AI agents that act as expert collaborators across the entire quant lifecycle.

- **Structured Research Process**: Guided workflows grounded in quantitative finance best practices across research, strategy design, validation, and production
- **Specialized Agents**: Domain experts including Quant Researcher, Portfolio Manager, Risk Analyst, Data Engineer, and more
- **Quant-Adaptive**: Adjusts depth based on strategy complexity -- a simple momentum factor needs different rigor than a multi-asset statistical arbitrage system
- **Full Lifecycle**: From alpha research through backtesting, risk analysis, and live monitoring

## Quick Start

**Prerequisites**: [Node.js](https://nodejs.org) v20+

```bash
npx quant-method install
```

Follow the installer prompts, then open your AI IDE (Claude Code, Cursor, Windsurf, etc.) in the project folder.

### Rapid Strategy Path (Quick Flow)

Quick hypothesis testing, single-factor strategies, clear signals:

1. `/strategy-spec` -- analyzes your data and produces a strategy specification with implementation tasks
2. `/dev-strategy` -- implements each task (signals, backtest, risk checks)
3. `/strategy-review` -- validates statistical rigor and code quality

### Full Research Path (Quant Method)

Multi-factor strategies, portfolio-level research, production deployment:

1. `/research-brief` -- define investment thesis, universe, and data requirements
2. `/create-strategy-design` -- full specification with signal definitions, risk constraints, and performance targets
3. `/create-architecture` -- technical infrastructure: data pipelines, execution systems, monitoring
4. `/create-research-plan` -- break work into prioritized research and implementation tasks
5. `/research-planning` -- initialize research tracking
6. **Repeat per task:** `/create-task` -> `/dev-task` -> `/task-review`

## Specialized Agents

| Agent | Role | Focus |
|-------|------|-------|
| **Quant Researcher** | Alpha Research + Factor Analysis | Signal discovery, literature review, statistical analysis |
| **Portfolio Manager** | Portfolio Construction + Allocation | Position sizing, rebalancing, benchmark-aware optimization |
| **Quant Architect** | Systems Design + Infrastructure | Data pipelines, execution systems, backtesting frameworks |
| **Quant Developer** | Strategy Implementation | Signal code, backtest harnesses, production adapters |
| **Data Engineer** | Market Data + Alternative Data | Data pipelines, quality validation, feature engineering |
| **Risk Analyst** | Risk Management + Model Validation | Drawdown analysis, stress testing, regime detection |
| **Research Director** | Research Process + Coordination | Research pipeline management, prioritization, tracking |
| **Research Documentarian** | Research Reports + Model Documentation | Strategy documentation, research logs, compliance docs |
| **Strategy Developer** | Rapid Prototyping | Quick hypothesis testing, single-factor research |

## Workflow Phases

### Phase 1: Research

- Market and academic research
- Factor discovery and screening
- Data exploration and alternative data evaluation
- Investment thesis development

### Phase 2: Strategy Design

- Signal specification and universe selection
- Risk constraint definition
- Performance target setting
- Model specification (statistical, ML, rules-based)

### Phase 3: Validation

- Backtesting with walk-forward analysis
- Out-of-sample testing
- Statistical significance validation
- Transaction cost and capacity analysis
- Risk decomposition and stress testing

### Phase 4: Production

- Deployment and integration
- Live monitoring and alerting
- Performance attribution
- Research retrospective and strategy refinement

## Documentation

- Getting Started Tutorial
- Strategy Research Walkthrough
- Backtesting Best Practices
- Risk Management Framework

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License -- see [LICENSE](LICENSE) for details.
