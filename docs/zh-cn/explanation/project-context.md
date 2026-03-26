---
title: "项目上下文"
description: project-context.md 如何使用项目规则和偏好指导 AI 智能体
sidebar:
  order: 7
---

`project-context.md` 是面向 AI 智能体的项目级上下文文件。它的定位不是教程步骤，而是“实现约束说明”：把你的技术偏好、架构边界和工程约定沉淀成可复用规则，让不同工作流、不同智能体在多个 `story` 中做出一致决策。

## project context 解决什么问题

没有统一上下文时，智能体往往会：
- 套用通用最佳实践，而不是你的项目约定
- 在不同 `story` 中做出不一致实现
- 漏掉代码里不易推断的隐性约束

有 `project-context.md` 时，这些高频偏差会明显减少，因为关键规则在进入实现前已经被显式声明。

## 它如何被工作流使用

多数实现相关工作流会自动加载 `project-context.md`（若存在），并把它作为共享上下文参与决策。

**常见加载方包括：**
- `bmad-create-architecture`：在 solutioning 时纳入你的技术偏好
- `bmad-create-story`：按项目约定拆分和描述 story
- `bmad-dev-story`：约束实现路径和代码风格
- `bmad-code-review`：按项目标准做一致性校验
- `bmad-quick-dev`：在快速实现中避免偏离既有模式
- `bmad-sprint-planning`、`bmad-retrospective`、`bmad-correct-course`：读取项目级背景

## 什么时候建立或更新

| 场景 | 建议时机 | 目标 |
|----------|----------------|---------|
| **新项目（架构前）** | 在 `bmad-create-architecture` 前手动创建 | 先声明技术偏好，避免架构偏航 |
| **新项目（架构后）** | 通过 `bmad-generate-project-context` 生成并补充 | 把架构决策转成可执行规则 |
| **既有项目** | 先生成，再人工校对 | 让智能体学习现有约定而非重造体系 |
| **Quick Flow 场景** | 在 `bmad-quick-dev` 前或过程中维护 | 弥补跳过完整规划带来的上下文缺口 |

:::tip[推荐做法]
如果你有强技术偏好（例如数据库、状态管理、目录规范），尽量在架构前写入。否则可在架构后生成，再按项目现实补齐。
:::

## 应该写哪些内容

建议聚焦两类信息：**技术栈与版本**、**关键实现规则**。原则是记录“智能体不容易从代码片段直接推断”的内容。

### 1. 技术栈与版本

```markdown
## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand (not Redux)
- Testing: Vitest, Playwright, MSW
- Styling: Tailwind CSS with custom design tokens
```

### 2. 关键实现规则

```markdown
## Critical Implementation Rules

**TypeScript Configuration:**
- Strict mode enabled — no `any` types without explicit approval
- Use `interface` for public APIs, `type` for unions/intersections

**Code Organization:**
- Components in `/src/components/` with co-located `.test.tsx`
- API calls use the `apiClient` singleton — never fetch directly

**Testing Patterns:**
- Integration tests use MSW to mock API responses
- E2E tests cover critical user journeys only
```

## 常见误解

- **误解 1：它是操作手册。**  
  不是。操作步骤请看 how-to；这里强调的是规则与边界。
- **误解 2：写得越全越好。**  
  不对。冗长且泛化的“最佳实践”会稀释有效约束。
- **误解 3：写一次就结束。**  
  这是动态文件。架构变化、约定变化后要同步更新。

## 文件位置

默认位置是 `_bmad-output/project-context.md`。工作流优先在该位置查找，也会扫描项目内的 `**/project-context.md`。

## 继续阅读

如需可执行步骤说明，请阅读 [How-to：项目上下文](../how-to/project-context.md)；如果你在既有项目落地这套机制，可参考 [既有项目常见问题](./established-projects-faq.md)。整体流程定位见 [工作流地图](../reference/workflow-map.md)。

- [管理项目上下文（How-to）](../how-to/project-context.md)
- [既有项目常见问题](./established-projects-faq.md)
- [工作流地图](../reference/workflow-map.md)
