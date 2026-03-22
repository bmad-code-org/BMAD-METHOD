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
| Analyst (Mary) | `bmad-analyst` | `BP`、`RS`、`CB`、`DP` | Brainstorm、Research、Create Brief、Document Project |
| Product Manager (John) | `bmad-pm` | `CP`、`VP`、`EP`、`CE`、`IR`、`CC` | Create/Validate/Edit PRD、Create Epics and Stories、Implementation Readiness、Correct Course |
| Architect (Winston) | `bmad-architect` | `CA`、`IR` | Create Architecture、Implementation Readiness |
| Scrum Master (Bob) | `bmad-sm` | `SP`、`CS`、`ER`、`CC` | Sprint Planning、Create Story、Epic Retrospective、Correct Course |
| Developer (Amelia) | `bmad-dev` | `DS`、`CR` | Dev Story、Code Review |
| QA Engineer (Quinn) | `bmad-qa` | `QA` | Automate（为既有功能生成测试） |
| Quick Flow Solo Dev (Barry) | `bmad-master` | `QD`、`CR` | Quick Dev、Code Review |
| UX Designer (Sally) | `bmad-ux-designer` | `CU` | Create UX Design |
| Technical Writer (Paige) | `bmad-tech-writer` | `DP`、`WD`、`US`、`MG`、`VD`、`EC` | Document Project、Write Document、Update Standards、Mermaid Generate、Validate Doc、Explain Concept |

## 使用说明

- `Skill ID` 是直接调用该智能体的名称（例如 `bmad-dev`）
- 触发器是进入智能体会话后可使用的菜单短码
- QA（Quinn）是 BMM 内置轻量测试角色；完整 TEA 能力位于独立模块

## 触发器类型

### 工作流触发器（通常不需要额外参数）

多数触发器会直接启动结构化 workflow。你只需输入触发码，然后按流程提示提供信息。

示例：`CP`（Create PRD）、`DS`（Dev Story）、`CA`（Create Architecture）、`QD`（Quick Dev）

### 会话触发器（需要附带说明）

部分触发器进入自由对话模式，需要你在触发码后描述需求。

| 智能体 | 触发器 | 你需要提供的内容 |
| --- | --- | --- |
| Technical Writer (Paige) | `WD` | 要撰写的文档主题与目标 |
| Technical Writer (Paige) | `US` | 要补充到标准中的偏好/规范 |
| Technical Writer (Paige) | `MG` | 图示类型与图示内容描述 |
| Technical Writer (Paige) | `VD` | 待验证文档与关注点 |
| Technical Writer (Paige) | `EC` | 需要解释的概念名称 |

示例：

```text
WD 写一份 Docker 部署指南
MG 画一个认证流程的时序图
EC 解释模块系统如何运作
```

## 相关参考

- [技能（Skills）参考](./commands.md)
- [工作流地图](./workflow-map.md)
- [核心工具参考](./core-tools.md)
