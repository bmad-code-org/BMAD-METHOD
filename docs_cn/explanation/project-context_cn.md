---
title: "项目上下文"
description: project-context.md 如何使用项目的规则和偏好指导 AI 智能体
sidebar:
  order: 7
---

[`project-context.md`](project-context.md) 文件是您的项目面向 AI 智能体的实施指南。类似于其他开发系统中的"宪法"，它记录了确保所有工作流中代码生成一致的规则、模式和偏好。

## 它的作用

AI 智能体不断做出实施决策——遵循哪些模式、如何组织代码、使用哪些约定。如果没有明确指导，它们可能会：
- 遵循与您的代码库不匹配的通用最佳实践
- 在不同的用户故事中做出不一致的决策
- 错过项目特定的需求或约束

[`project-context.md`](project-context.md) 文件通过以简洁、针对 LLM 优化的格式记录智能体需要了解的内容来解决这个问题。

## 它的工作原理

每个实施工作流都会自动加载 [`project-context.md`](project-context.md)（如果存在）。架构师工作流也会加载它，以便在设计架构时尊重您的技术偏好。

**由以下工作流加载：**
- `create-architecture` — 在解决方案设计期间尊重技术偏好
- `create-story` — 使用项目模式指导用户故事创建
- `dev-story` — 指导实施决策
- `code-review` — 根据项目标准进行验证
- `quick-dev` — 在实施技术规范时应用模式
- `sprint-planning`、`retrospective`、`correct-course` — 提供项目范围的上下文

## 何时创建

[`project-context.md`](project-context.md) 文件在项目的任何阶段都很有用：

| 场景 | 何时创建 | 目的 |
|----------|----------------|---------|
| **新项目，架构之前** | 手动，在 `create-architecture` 之前 | 记录您的技术偏好，以便架构师尊重它们 |
| **新项目，架构之后** | 通过 `generate-project-context` 或手动 | 捕获架构决策，供实施智能体使用 |
| **现有项目** | 通过 `generate-project-context` | 发现现有模式，以便智能体遵循既定约定 |
| **快速流程项目** | 在 `quick-dev` 之前或期间 | 确保快速实施尊重您的模式 |

:::tip[推荐]
对于新项目，如果您有强烈的技术偏好，请在架构之前手动创建。否则，在架构之后生成它以捕获这些决策。
:::

## 文件内容

该文件有两个主要部分：

### 技术栈与版本

记录项目使用的框架、语言和工具及其具体版本：

```markdown
## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand (not Redux)
- Testing: Vitest, Playwright, MSW
- Styling: Tailwind CSS with custom design tokens
```

### 关键实施规则

记录智能体可能忽略的模式和约定：

```markdown
## Critical Implementation Rules

**TypeScript Configuration:**
- Strict mode enabled — no `any` types without explicit approval
- Use `interface` for public APIs, `type` for unions/intersections

**Code Organization:**
- Components in `/src/components/` with co-located `.test.tsx`
- Utilities in `/src/lib/` for reusable pure functions
- API calls use the `apiClient` singleton — never fetch directly

**Testing Patterns:**
- Unit tests focus on business logic, not implementation details
- Integration tests use MSW to mock API responses
- E2E tests cover critical user journeys only

**Framework-Specific:**
- All async operations use the `handleError` wrapper for consistent error handling
- Feature flags accessed via `featureFlag()` from `@/lib/flags`
- New routes follow the file-based routing pattern in `/src/app/`
```

专注于那些**不明显**的内容——智能体可能无法从阅读代码片段中推断出来的内容。不要记录普遍适用的标准实践。

## 创建文件

您有三个选择：

### 手动创建

在 `_bmad-output/project-context.md` 创建文件并添加您的规则：

```bash
# In your project root
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

使用您的技术栈和实施规则编辑它。架构师和实施工作流将自动查找并加载它。

### 架构后生成

在完成架构后运行 `generate-project-context` 工作流：

```bash
/bmad-bmm-generate-project-context
```

这将扫描您的架构文档和项目文件，生成一个捕获所做决策的上下文文件。

### 为现有项目生成

对于现有项目，运行 `generate-project-context` 以发现现有模式：

```bash
/bmad-bmm-generate-project-context
```

该工作流分析您的代码库以识别约定，然后生成一个您可以审查和优化的上下文文件。

## 为什么重要

没有 [`project-context.md`](project-context.md)，智能体会做出可能与您的项目不匹配的假设：

| 没有上下文 | 有上下文 |
|----------------|--------------|
| 使用通用模式 | 遵循您的既定约定 |
| 用户故事之间风格不一致 | 实施一致 |
| 可能错过项目特定的约束 | 尊重所有技术需求 |
| 每个智能体独立决策 | 所有智能体遵循相同规则 |

这对于以下情况尤其重要：
- **快速流程** — 跳过 PRD 和架构，因此上下文文件填补了空白
- **团队项目** — 确保所有智能体遵循相同的标准
- **现有项目** — 防止破坏既定模式

## 编辑和更新

[`project-context.md`](project-context.md) 文件是一个动态文档。在以下情况下更新它：

- 架构决策发生变化
- 建立了新的约定
- 模式在实施过程中演变
- 您从智能体行为中发现差距

您可以随时手动编辑它，或者在重大更改后重新运行 `generate-project-context` 来更新它。

:::note[文件位置]
默认位置是 `_bmad-output/project-context.md`。工作流在那里搜索它，并且还会检查项目中任何位置的 `**/project-context.md`。
:::

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **workflow**：工作流。指一系列自动化或半自动化的任务流程。
- **PRD**：产品需求文档（Product Requirements Document）。描述产品功能、需求和目标的文档。
- **LLM**：大语言模型（Large Language Model）。指基于深度学习的自然语言处理模型。
- **singleton**：单例。一种设计模式，确保一个类只有一个实例。
- **E2E**：端到端（End-to-End）。指从用户角度出发的完整测试流程。
- **MSW**：Mock Service Worker。用于模拟 API 响应的库。
- **Vitest**：基于 Vite 的单元测试框架。
- **Playwright**：端到端测试框架。
- **Zustand**：轻量级状态管理库。
- **Redux**：JavaScript 应用状态管理库。
- **Tailwind CSS**：实用优先的 CSS 框架。
- **TypeScript**：JavaScript 的超集，添加了静态类型。
- **React**：用于构建用户界面的 JavaScript 库。
- **Node.js**：基于 Chrome V8 引擎的 JavaScript 运行时。
