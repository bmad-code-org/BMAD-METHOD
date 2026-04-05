---
title: "为什么解决方案阶段很重要"
description: 理解为什么解决方案阶段对于多史诗项目至关重要
sidebar:
  order: 3
---

Phase 3（solutioning）把“要做什么”（planning 产出）转成“如何实现”（`architecture` 设计 + 工作拆分）。它的核心价值是：在开发前先把跨 `epic` 的关键技术决策写清楚，让后续 `story` 实施保持一致。

## 不做 solutioning 会出现什么问题

```text
智能体 1 使用 REST API 实现 Epic 1
智能体 2 使用 GraphQL 实现 Epic 2
结果：API 设计不一致，集成成本暴涨
```

当多个智能体在没有共享 `architecture` 指南的前提下并行实现不同 `epic`，它们会各自做局部最优决策，最后在集成阶段发生冲突。

## 做了 solutioning 后会发生什么

```text
architecture 工作流先定规则："所有 API 使用 GraphQL"
所有智能体按同一套决策实现 story
结果：实现一致，集成顺滑
```

solutioning 的本质不是“多写一份文档”，而是把高冲突风险决策前置，作为所有 `story` 的共享上下文。

## solutioning 与 planning 的边界

| 方面 | Planning（阶段 2） | Solutioning（阶段 3） |
| -------- | ----------------------- | --------------------------------- |
| 核心问题 | 做什么，为什么做？ | 如何做，再如何拆分工作？ |
| 输出物 | FRs/NFRs（需求） | `architecture` + `epic/story` 拆分 |
| 主导角色 | PM | Architect → PM |
| 受众 | 利益相关者 | 开发人员 |
| 文档 | PRD（FRs/NFRs） | 架构文档 + epics 文件 |
| 决策层级 | 业务目标与范围 | 技术策略与实现边界 |

## 核心原则

**让跨 `epic` 的关键技术决策显式、可追溯、可复用。**

这能直接降低：
- API 风格冲突（REST vs GraphQL）
- 数据模型与命名约定不一致
- 状态管理方案分裂
- 安全策略分叉
- 中后期返工成本

## 什么时候需要 solutioning

| 流程 | 需要 solutioning？ |
|-------|----------------------|
| Quick Flow | 否 - 完全跳过 |
| BMad Method Simple | 可选 |
| BMad Method Complex | 是 |
| Enterprise | 是 |

:::tip[经验法则]
只要需求会拆成多个 `epic`，并且可能由不同智能体并行实现，就应该做 solutioning。
:::

## 跳过 solutioning 的代价

在复杂项目中跳过该阶段，常见后果是：

- **集成问题**在冲刺中期暴露
- **返工**由实现冲突引发
- **整体研发周期拉长**
- **技术债务**因模式不一致持续累积

:::caution[成本倍增]
在 solutioning 阶段发现对齐问题，通常比在实施中后期才发现更快、更便宜。
:::

想进一步理解冲突是如何发生并被架构约束消除的，可继续阅读 [防止智能体冲突](./preventing-agent-conflicts.md)。如果你要把这些约束落到执行层，请结合 [项目上下文](./project-context.md) 与 [工作流地图](../reference/workflow-map.md) 一起阅读。

## 继续阅读

- [防止智能体冲突](./preventing-agent-conflicts.md)
- [项目上下文](./project-context.md)
- [工作流地图](../reference/workflow-map.md)
