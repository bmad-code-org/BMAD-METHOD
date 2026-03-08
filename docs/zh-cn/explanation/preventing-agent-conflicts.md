---
title: "防止智能体冲突"
description: 架构如何在多个智能体实现系统时防止冲突
sidebar:
  order: 4
---

当多个 AI 智能体实现系统的不同部分时，它们可能会做出相互冲突的技术决策。架构文档通过建立共享标准来防止这种情况。

## 常见冲突类型

### API 风格冲突

没有架构时：
- 智能体 A 使用 REST，路径为 `/users/{id}`
- 智能体 B 使用 GraphQL mutations
- 结果：API 模式不一致，消费者困惑

有架构时：
- ADR 指定："所有客户端-服务器通信使用 GraphQL"
- 所有智能体遵循相同的模式

### 数据库设计冲突

没有架构时：
- 智能体 A 使用 snake_case 列名
- 智能体 B 使用 camelCase 列名
- 结果：模式不一致，查询混乱

有架构时：
- 标准文档指定命名约定
- 所有智能体遵循相同的模式

### 状态管理冲突

没有架构时：
- 智能体 A 使用 Redux 管理全局状态
- 智能体 B 使用 React Context
- 结果：多种状态管理方法，复杂度增加

有架构时：
- ADR 指定状态管理方法
- 所有智能体一致实现

## 架构如何防止冲突

### 1. 通过 ADR 明确决策

每个重要的技术选择都记录以下内容：
- 上下文（为什么这个决策很重要）
- 考虑的选项（有哪些替代方案）
- 决策（我们选择了什么）
- 理由（为什么选择它）
- 后果（接受的权衡）

### 2. FR/NFR 特定指导

架构将每个功能需求映射到技术方法：
- FR-001：用户管理 → GraphQL mutations
- FR-002：移动应用 → 优化查询

### 3. 标准和约定

明确记录以下内容：
- 目录结构
- 命名约定
- 代码组织
- 测试模式

## 架构作为共享上下文

将架构视为所有智能体在实现之前阅读的共享上下文：

```text
PRD："构建什么"
     ↓
架构："如何构建"
     ↓
智能体 A 阅读架构 → 实现 Epic 1
智能体 B 阅读架构 → 实现 Epic 2
智能体 C 阅读架构 → 实现 Epic 3
     ↓
结果：一致的实现
```

## Key ADR Topics

防止冲突的常见决策：

| Topic            | Example Decision                             |
| ---------------- | -------------------------------------------- |
| API Style        | GraphQL vs REST vs gRPC                      |
| Database         | PostgreSQL vs MongoDB                        |
| Auth             | JWT vs Sessions                              |
| State Management | Redux vs Context vs Zustand                  |
| Styling          | CSS Modules vs Tailwind vs Styled Components |
| Testing          | Jest + Playwright vs Vitest + Cypress        |

## 避免的反模式

:::caution[常见错误]
- **隐式决策** — "我们边做边确定 API 风格"会导致不一致
- **过度文档化** — 记录每个次要选择会导致分析瘫痪
- **过时架构** — 文档写一次后从不更新，导致智能体遵循过时的模式
:::

:::tip[正确方法]
- 记录跨越 epic 边界的决策
- 专注于容易产生冲突的领域
- 随着学习更新架构
- 对重大变更使用 `correct-course`
:::

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **ADR**：架构决策记录（Architecture Decision Record）。用于记录重要架构决策及其背景、选项和后果的文档。
- **FR**：功能需求（Functional Requirement）。系统必须具备的功能或行为。
- **NFR**：非功能需求（Non-Functional Requirement）。系统性能、安全性、可扩展性等质量属性。
- **Epic**：史诗。大型功能或用户故事的集合，通常需要多个迭代完成。
- **snake_case**：蛇形命名法。单词之间用下划线连接，所有字母小写的命名风格。
- **camelCase**：驼峰命名法。除第一个单词外，每个单词首字母大写的命名风格。
- **GraphQL mutations**：GraphQL 变更操作。用于修改服务器数据的 GraphQL 操作类型。
- **Redux**：JavaScript 状态管理库。用于管理应用全局状态的可预测状态容器。
- **React Context**：React 上下文 API。用于在组件树中传递数据而无需逐层传递 props。
- **Zustand**：轻量级状态管理库。用于 React 应用的简单状态管理解决方案。
- **CSS Modules**：CSS 模块。将 CSS 作用域限制在组件内的技术。
- **Tailwind**：Tailwind CSS。实用优先的 CSS 框架。
- **Styled Components**：样式化组件。使用 JavaScript 编写样式的 React 库。
- **Jest**：JavaScript 测试框架。用于编写和运行测试的工具。
- **Playwright**：端到端测试框架。用于自动化浏览器测试的工具。
- **Vitest**：Vite 原生测试框架。快速且轻量的单元测试工具。
- **Cypress**：端到端测试框架。用于 Web 应用测试的工具。
- **gRPC**：远程过程调用框架。Google 开发的高性能 RPC 框架。
- **JWT**：JSON Web Token。用于身份验证的开放标准令牌。
- **PRD**：产品需求文档（Product Requirements Document）。描述产品功能、需求和目标的文档。
