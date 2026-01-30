# Quant Method

> **v1.0.0-alpha.1** -- Early access. APIs and workflows are evolving.

**AI-Driven Investment Quant Development and Research Framework** -- Specialized AI agents and structured workflows for systematic strategy research, backtesting, risk management, and production deployment.

Built on the [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD), adapted for quantitative finance.

---

## Why Quant Method?

Quantitative investment research demands rigor at every stage -- from hypothesis formation through statistical validation to live monitoring. Traditional tools leave gaps between research notebooks and production systems. Quant Method fills those gaps with AI agents that act as expert collaborators across the entire quant lifecycle.

### Key Capabilities

- **Bias Prevention** -- Agents enforce point-in-time data correctness, flag look-ahead bias in vectorized operations, and require out-of-sample validation before any strategy advances
- **Statistical Rigor** -- Walk-forward analysis, significance testing, and reproducibility requirements (random seeds, data versioning, parameter logging) are built into every workflow
- **Structured Research Process** -- Guided workflows grounded in quantitative finance best practices across research, strategy design, validation, and production
- **Quant-Adaptive Depth** -- Adjusts rigor based on strategy complexity: a simple momentum factor needs different treatment than a multi-asset statistical arbitrage system
- **Full Lifecycle Coverage** -- From alpha research and factor discovery through backtesting, risk decomposition, and live performance attribution

---

## Quick Start

**Prerequisites**: [Node.js](https://nodejs.org) v20+

```bash
npx quant-method install
```

Follow the installer prompts, then open your AI IDE (Claude Code, Cursor, Windsurf, etc.) in the project folder.

---

## Workflow Paths

### Rapid Strategy Path (Quick Flow)

For quick hypothesis testing, single-factor strategies, and clear signals:

1. **`/strategy-spec`** -- Analyze your data and produce a strategy specification with implementation tasks
2. **`/dev-strategy`** -- Implement each task (signals, backtest, risk checks)
3. **`/strategy-review`** -- Validate statistical rigor and code quality

### Full Research Path (Quant Method)

For multi-factor strategies, portfolio-level research, and production deployment:

| Step | Command | What Happens |
|------|---------|-------------|
| 1 | `/research-brief` | Define investment thesis, universe, and data requirements |
| 2 | `/create-strategy-design` | Full spec: signal definitions, risk constraints, performance targets |
| 3 | `/create-architecture` | Technical infrastructure: data pipelines, execution, monitoring |
| 4 | `/create-research-plan` | Break work into prioritized research and implementation tasks |
| 5 | `/research-planning` | Initialize research tracking and sequencing |
| 6 | Per task: `/create-task` | Prepare individual research or implementation tasks |
| 7 | Per task: `/dev-task` | Execute tasks (signal implementation, backtesting, risk checks) |
| 8 | Per task: `/task-review` | Validate statistical correctness and code quality |

---

## Research Lifecycle

### Phase 1: Research

- Market and academic literature review
- Factor discovery and screening
- Data exploration and alternative data evaluation
- Investment thesis development

### Phase 2: Strategy Design

- Signal specification and universe selection
- Risk constraint definition (drawdown limits, VaR/CVaR targets)
- Performance target setting (Sharpe, information ratio, alpha decay)
- Model specification -- statistical, ML, or rules-based

### Phase 3: Validation

- Backtesting with walk-forward analysis
- Out-of-sample testing (mandatory, not optional)
- Statistical significance validation
- Transaction cost, slippage, and capacity analysis
- Risk decomposition and stress testing
- Regime-conditional performance review

### Phase 4: Production

- Deployment and system integration
- Live monitoring and alerting
- Performance attribution
- Research retrospective and strategy refinement

---

## Specialized Agents

Each agent brings domain-specific expertise to the research process:

| Agent | Persona | Role | Focus |
|-------|---------|------|-------|
| **Quant Researcher** | Elena | Alpha Research + Factor Analysis | Signal discovery, literature review, statistical analysis |
| **Portfolio Manager** | Catherine | Portfolio Construction + Allocation | Position sizing, rebalancing, benchmark-aware optimization |
| **Quant Architect** | Victor | Systems Design + Infrastructure | Data pipelines, execution systems, backtesting frameworks |
| **Quant Developer** | Marcus | Strategy Implementation | Signal code, backtest harnesses, production adapters |
| **Data Engineer** | Priya | Market Data + Alternative Data | Data pipelines, quality validation, feature engineering |
| **Risk Analyst** | Quinn | Risk Management + Model Validation | Drawdown analysis, stress testing, regime detection |
| **Research Director** | David | Research Process + Coordination | Pipeline management, prioritization, tracking |
| **Research Documentarian** | Paige | Research Reports + Documentation | Strategy docs, research logs, compliance records |
| **Strategy Developer** | Barry | Rapid Prototyping | Quick hypothesis testing, single-factor research |

### Built-In Safeguards

Agents enforce quant best practices throughout the workflow:

- **No look-ahead bias** -- Vectorized operations must respect temporal ordering
- **Point-in-time data correctness** -- Non-negotiable for backtesting pipelines
- **Reproducibility** -- Random seeds, data versioning, and parameter logging required
- **Out-of-sample validation** -- Every strategy must pass before advancing
- **Realistic assumptions** -- Transaction costs, slippage, and capacity constraints must be modeled
- **Risk metrics** -- Drawdown, VaR, CVaR, and regime-conditional analysis required

---

## What You Can Build

- **Single-factor momentum or value strategies** using the Quick Flow path
- **Multi-factor equity models** with statistical validation and risk decomposition
- **Statistical arbitrage systems** with cointegration testing and regime detection
- **Alternative data signal pipelines** with feature engineering and quality validation
- **Portfolio construction frameworks** with position sizing and rebalancing logic
- **Backtesting infrastructure** with walk-forward analysis and transaction cost modeling

---

## Project Structure

```text
src/
  bmm/              Quant Method module (agents, workflows, data)
    agents/          9 specialized quant agents
    workflows/       4-phase research lifecycle + quick flow
    teams/           Agent team configurations
    data/            Templates and context files
  core/              Core framework (shared agents, resources)
  utility/           Shared utilities and components

tools/
  cli/               Command-line interface
  schema/            Agent schema validation
  flattener/         Document processing tools

docs/                Tutorials, guides, and reference
```

---

## Documentation

| Resource | Description |
|----------|-------------|
| [Getting Started](docs/tutorials/) | Installation and first strategy walkthrough |
| [Quick Flow Guide](docs/explanation/quick-flow.md) | Rapid prototyping methodology |
| [Workflow Map](docs/reference/workflow-map.md) | Complete visual workflow reference |
| [Customization](docs/how-to/customize-bmad.md) | Adapting agents and workflows |

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License -- see [LICENSE](LICENSE) for details.
