---
title: "防止智能体冲突"
description: 架构如何在多个智能体实现系统时防止冲突
sidebar:
  order: 4
---

当多个 AI 智能体并行实现系统时，冲突并不罕见。`architecture` 的作用，就是在 `solutioning` 阶段先统一关键决策，避免到 `epic/story` 实施时才暴露分歧。

## 冲突最常出现在哪些地方

### API 风格冲突

没有架构约束时：
- 智能体 A 使用 REST，路径是 `/users/{id}`
- 智能体 B 使用 GraphQL mutations
- 结果：接口模式不一致，调用方和集成层都变复杂

有架构约束时：
- ADR 明确规定：“客户端与服务端统一使用 GraphQL”
- 所有智能体遵循同一套 API 规则

### 数据库与命名冲突

没有架构约束时：
- 智能体 A 使用 `snake_case` 列名
- 智能体 B 使用 `camelCase` 列名
- 结果：schema 不一致，查询与迁移成本上升

有架构约束时：
- 标准文档统一命名约定和迁移策略
- 所有智能体按同一模式实现

### 状态管理冲突

没有架构约束时：
- 智能体 A 使用 Redux
- 智能体 B 使用 React Context
- 结果：状态层碎片化，维护复杂度增加

有架构约束时：
- ADR 明确状态管理方案
- 不同 `story` 的实现保持一致

## architecture 如何前置消解冲突

### 1. 用 ADR 固化关键决策

每个关键技术选择都至少包含：
- 背景（为什么要做这个决策）
- 备选方案（有哪些选择）
- 最终决策（采用什么）
- 理由（为什么这样选）
- 后果（接受哪些权衡）

### 2. 把 FR/NFR 映射到技术实现

`architecture` 不是抽象原则清单，而是把需求落到可执行方案：
- FR-001（用户管理）→ GraphQL mutations
- FR-002（移动端性能）→ 查询裁剪与缓存策略

### 3. 统一基础约定

至少覆盖以下共识：
- 目录结构
- 命名约定
- 代码组织方式
- 测试策略

## architecture 是所有 epic 的共享上下文

把架构文档看作每个智能体在实施前都要阅读的“公共协议”：

```text
PRD: "做什么"
     ↓
architecture: "如何做"
     ↓
智能体 A 读 architecture → 实现 Epic 1
智能体 B 读 architecture → 实现 Epic 2
智能体 C 读 architecture → 实现 Epic 3
     ↓
结果：实现一致、集成顺畅
```

## 优先写清的 ADR 主题

| 主题 | 示例决策 |
| ---------------- | -------------------------------------------- |
| API 风格 | GraphQL vs REST vs gRPC |
| 数据存储 | PostgreSQL vs MongoDB |
| 认证机制 | JWT vs Session |
| 状态管理 | Redux vs Context vs Zustand |
| 样式方案 | CSS Modules vs Tailwind vs Styled Components |
| 测试体系 | Jest + Playwright vs Vitest + Cypress |

## 常见误区

:::caution[常见错误]
- **隐式决策**：边写边定规则，最终通常会分叉
- **过度文档化**：把每个小选择都写 ADR，造成分析瘫痪
- **架构陈旧**：文档不更新，智能体继续按过时规则实现
:::

:::tip[更稳妥的做法]
- 先记录跨 `epic`、高冲突概率的决策
- 把精力放在”会影响多个 story 的规则”
- 随着项目演进持续更新架构文档
- 出现重大偏移时使用 `bmad-correct-course`
:::

如需先理解为什么要在实施前做 solutioning，可阅读 [为什么解决方案设计很重要](./why-solutioning-matters.md)；如果你想把这些约束落地到项目执行，可继续看 [项目上下文](./project-context.md)。流程全景见 [工作流地图](../reference/workflow-map.md)。

## 继续阅读

- [为什么解决方案阶段很重要](./why-solutioning-matters.md)
- [项目上下文](./project-context.md)
- [工作流地图](../reference/workflow-map.md)
