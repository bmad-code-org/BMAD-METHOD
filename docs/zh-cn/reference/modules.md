---
title: "官方模块"
description: BMad 可选模块参考：能力边界、适用场景与外部资源
sidebar:
  order: 4
---

BMad 通过可选模块扩展能力。你可以在安装时按需选择模块，为当前项目增加特定领域的 `agent`、`workflow` 与 `skill`。

:::tip[安装模块]
运行 `npx bmad-method install`，在交互步骤中勾选所需模块。安装器会自动生成对应 skills 并写入当前 IDE 的 skills 目录。
:::

## 先看总览

| 模块 | 代码 | 最适合 | 核心能力 |
| --- | --- | --- | --- |
| BMad Builder | `bmb` | 扩展 BMad 本身 | 构建自定义 agent / workflow / module |
| Creative Intelligence Suite | `cis` | 前期创意与问题探索 | 头脑风暴、设计思维、创新策略 |
| Game Dev Studio | `gds` | 游戏方向研发 | 游戏设计文档、原型推进、叙事支持 |
| Test Architect（TEA） | `tea` | 企业级测试治理 | 测试策略、可追溯性、质量门控 |

## BMad Builder（`bmb`）

用于“构建 BMad”的元模块，重点是把你的方法沉淀成可复用能力。

**你会得到：**
- Agent Builder：创建具备特定专业能力的 agent
- Workflow Builder：设计有步骤与决策点的 workflow
- Module Builder：将 agent/workflow 打包为可发布模块
- 交互式配置与发布支持（YAML + npm）

**外部资源（英文）：**
- npm: [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- GitHub: [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

## Creative Intelligence Suite（`cis`）

用于前期探索与创意发散，帮助团队在进入规划前澄清问题与方向。

**你会得到：**
- 多个创意向 agent（如创新策略、设计思维、头脑风暴）
- 问题重构与系统化思考支持
- 常见构思框架（含 SCAMPER、逆向头脑风暴等）

**外部资源（英文）：**
- npm: [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- GitHub: [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

## Game Dev Studio（`gds`）

面向游戏开发场景，覆盖从概念到实现的结构化 workflow。

**你会得到：**
- 游戏设计文档（GDD）生成流程
- 面向快速迭代的 Quick Dev 模式
- 叙事设计支持（角色、对话、世界观）
- 多引擎适配建议（Unity/Unreal/Godot 等）

**外部资源（英文）：**
- npm: [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- GitHub: [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

## Test Architect（TEA，`tea`）

面向高要求测试场景的独立模块。与内置 QA 相比，TEA 更强调策略、追溯与发布门控。

**你会得到：**
- Murat 测试架构师 agent
- 覆盖测试设计、ATDD、自动化、审查、追溯的 workflow
- NFR 评估、CI 集成与测试框架脚手架
- P0-P3 风险优先级策略与可选工具集成

**外部资源（英文）：**
- 文档: [TEA Module Docs](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- npm: [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- GitHub: [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

## 如何选择模块

- 你要“扩展框架能力”而不是只用框架：优先 `bmb`
- 你还在探索方向、需要结构化创意过程：优先 `cis`
- 你是游戏项目：优先 `gds`
- 你需要测试治理、质量门控或审计追溯：优先 `tea`

:::note[模块可以组合安装]
模块之间不是互斥关系。你可以按项目阶段增量安装，并在后续重新运行安装器同步 skills。
:::

## 相关参考

- [测试选项](./testing.md)
- [技能（Skills）参考](./commands.md)
- [工作流地图](./workflow-map.md)
