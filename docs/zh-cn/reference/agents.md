---
title: "智能体"
description: 默认 BMM 智能体的 skill ID、触发器与主要 workflow 速查。
sidebar:
  order: 2
---

本页列出 BMad Method 默认提供的 BMM（Agile 套件）智能体，包括它们的 skill ID、菜单触发器和主要 workflow。

## 默认智能体列表

| 智能体 | Skill ID | 触发器 | 主要 workflow |
| --- | --- | --- | --- |
| Analyst (Mary) | `bmad-analyst` | `BP`、`MR`、`DR`、`TR`、`CB`、`WB`、`DP` | Brainstorm、Market Research、Domain Research、Technical Research、Create Brief、PRFAQ Challenge、Document Project |
| Product Manager (John) | `bmad-pm` | `CP`、`VP`、`EP`、`CE`、`IR`、`CC` | Create/Validate/Edit PRD、Create Epics and Stories、Implementation Readiness、Correct Course |
| Architect (Winston) | `bmad-architect` | `CA`、`IR` | Create Architecture、Implementation Readiness |
| Developer (Amelia) | `bmad-agent-dev` | `BD`、`QA`、`CR`、`SP`、`ER` | Build、QA Test Generation、Code Review、Sprint Planning、Epic Retrospective |
| UX Designer (Sally) | `bmad-ux-designer` | `CU` | Create UX Design |

:::note[Paige 去哪儿了？]
技术文档工程师 Paige 正在休整——她将在未来以更强大的能力回归。项目文档功能仍然可用：`DP`（Document Project）触发器可通过 Analyst 智能体使用，或直接调用 `bmad-document-project` 技能。
:::

## 使用说明

- `Skill ID` 是直接调用该智能体的名称（例如 `bmad-agent-dev`）
- 触发器是进入智能体会话后可使用的菜单短码
- QA 测试生成由 `bmad-qa-generate-e2e-tests` workflow skill 处理，通过 Developer 智能体调用；完整 TEA 能力位于独立模块

## 触发器类型

触发器会直接启动结构化 workflow。你只需输入触发码，然后按流程提示提供信息。

示例：`CP`（Create PRD）、`CA`（Create Architecture）、`BD`（Build）

## 相关参考

- [技能（Skills）参考](./commands.md)
- [工作流地图](./workflow-map.md)
- [核心工具参考](./core-tools.md)
