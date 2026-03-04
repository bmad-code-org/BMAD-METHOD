---
title: "管理项目上下文"
description: 创建并维护 project-context.md 以指导 AI 智能体
sidebar:
  order: 7
---

使用 `project-context.md` 文件确保 AI 智能体在所有工作流程中遵循项目的技术偏好和实现规则。

:::note[前置条件]
- 已安装 BMad Method
- 了解项目的技术栈和约定
:::

## 何时使用

- 在开始架构设计之前有明确的技术偏好
- 已完成架构设计并希望为实施捕获决策
- 正在处理具有既定模式的现有代码库
- 注意到智能体在不同用户故事中做出不一致的决策

## 步骤 1：选择方法

**手动创建** — 当您确切知道要记录哪些规则时最佳

**架构后生成** — 最适合捕获解决方案制定过程中所做的决策

**为现有项目生成** — 最适合在现有代码库中发现模式

## 步骤 2：创建文件

### 选项 A：手动创建

在 `_bmad-output/project-context.md` 创建文件：

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

添加技术栈和实现规则：

```markdown
---
project_name: 'MyProject'
user_name: 'YourName'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# AI 智能体的项目上下文

## 技术栈与版本

- Node.js 20.x, TypeScript 5.3, React 18.2
- 状态管理：Zustand
- 测试：Vitest, Playwright
- 样式：Tailwind CSS

## 关键实现规则

**TypeScript：**
- 启用严格模式，不使用 `any` 类型
- 公共 API 使用 `interface`，联合类型使用 `type`

**代码组织：**
- 组件位于 `/src/components/` 并附带同位置测试
- API 调用使用 `apiClient` 单例 — 绝不直接使用 fetch

**测试：**
- 单元测试专注于业务逻辑
- 集成测试使用 MSW 进行 API 模拟
```

### 选项 B：架构后生成

在新的聊天中运行工作流程：

```bash
/bmad-bmm-generate-project-context
```

工作流程扫描架构文档和项目文件，生成捕获所做决策的上下文文件。

### 选项 C：为现有项目生成

对于现有项目，运行：

```bash
/bmad-bmm-generate-project-context
```

工作流程分析代码库以识别约定，然后生成上下文文件供您审查和完善。

## 步骤 3：验证内容

审查生成的文件并确保它捕获了：

- 正确的技术版本
- 实际约定（而非通用最佳实践）
- 防止常见错误的规则
- 框架特定的模式

手动编辑以添加任何缺失内容或删除不准确之处。

## 您将获得

一个 `project-context.md` 文件，它：

- 确保所有智能体遵循相同的约定
- 防止在不同用户故事中做出不一致的决策
- 为实施捕获架构决策
- 作为项目模式和规则的参考

## 提示

:::tip[关注非显而易见的内容]
记录智能体可能遗漏的模式，例如"在每个公共类、函数和变量上使用 JSDoc 风格注释"，而不是像"使用有意义的变量名"这样的通用实践，因为 LLM 目前已经知道这些。
:::

:::tip[保持精简]
此文件由每个实施工作流程加载。长文件会浪费上下文。不要包含仅适用于狭窄范围或特定用户故事或功能的内容。
:::

:::tip[根据需要更新]
当模式发生变化时手动编辑，或在重大架构更改后重新生成。
:::

:::tip[适用于所有项目类型]
对于快速流程和完整的 BMad Method 项目同样有用。
:::

## 后续步骤

- [**项目上下文说明**](../explanation/project-context_cn.md) — 了解其工作原理
- [**工作流程图**](../reference/workflow-map_cn.md) — 查看哪些工作流程加载项目上下文

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **workflow**：工作流程。指完成特定任务的一系列步骤或过程。
- **codebase**：代码库。指项目的所有源代码和资源的集合。
- **implementation**：实施。指将设计或架构转化为实际代码的过程。
- **architecture**：架构。指系统的整体结构和设计。
- **stack**：技术栈。指项目使用的技术组合，如编程语言、框架、工具等。
- **convention**：约定。指团队或项目中遵循的编码规范和最佳实践。
- **singleton**：单例。一种设计模式，确保类只有一个实例。
- **co-located**：同位置。指相关文件（如测试文件）与主文件放在同一目录中。
- **mocking**：模拟。在测试中用模拟对象替代真实对象的行为。
- **context**：上下文。指程序运行时的环境信息或背景信息。
- **LLM**：大语言模型。Large Language Model 的缩写，指大型语言模型。
