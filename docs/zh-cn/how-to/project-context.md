---
title: "管理项目上下文"
description: 创建并维护 project-context.md 以指导 AI 智能体
sidebar:
  order: 8
---

使用 `project-context.md`，确保 AI 智能体在各类工作流中遵循项目的技术偏好与实现规则。
为了保证这份上下文始终可见，你也可以在工具上下文或 always-rules 文件（如 `AGENTS.md`）
中加入这句：
`Important project context and conventions are located in [path to project context]/project-context.md`

:::note[前置条件]
- 已安装 BMad Method
- 了解项目的技术栈与团队约定
:::

## 何时使用

- 在开始架构（architecture）前，你已有明确的技术偏好
- 已完成架构设计，希望把关键决策沉淀到实施阶段
- 正在处理具有既定模式的既有代码库
- 发现智能体在不同用户故事（story）之间决策不一致

## 步骤 1：选择路径

**手动创建** — 适合你已经明确知道要沉淀哪些规则

**架构后生成** — 适合把 solutioning 阶段形成的架构决策沉淀下来

**为既有项目生成** — 适合从现有代码库中自动发现团队约定与模式

## 步骤 2：创建文件

### 选项 A：手动创建

在 `_bmad-output/project-context.md` 创建文件：

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

然后补充技术栈与实现规则：

```markdown
---
project_name: '我的项目'
user_name: '你的名字'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# AI 智能体项目上下文

## 技术栈与版本

- Node.js 20.x, TypeScript 5.3, React 18.2
- 状态管理：Zustand
- 测试：Vitest, Playwright
- 样式：Tailwind CSS

## 关键实现规则

**TypeScript：**
- 开启严格模式，禁止使用 `any` 类型
- 对外 API 使用 `interface`，联合类型使用 `type`

**代码组织：**
- 组件放在 `/src/components/`，并与测试文件同目录（co-located）
- API 调用统一使用 `apiClient` 单例，不要直接使用 `fetch`

**测试：**
- 单元测试聚焦业务逻辑
- 集成测试使用 MSW 模拟 API
```

### 选项 B：架构后生成

在新的会话中运行：

```bash
bmad-generate-project-context
```

该工作流会扫描架构文档和项目文件，生成能够反映已做决策的上下文文件。

### 选项 C：为既有项目生成

对于既有项目，运行：

```bash
bmad-generate-project-context
```

该工作流会分析代码库中的约定，然后生成可供你审阅和完善的上下文文件。

## 步骤 3：验证内容

审查生成文件，并确认它覆盖了：

- 正确的技术版本
- 你的真实约定（不是通用最佳实践）
- 能预防常见错误的规则
- 框架相关模式

如果有缺漏或误判，直接手动补充和修正。

## 你将获得

一个 `project-context.md` 文件，它可以：

- 确保所有智能体遵循相同约定
- 避免在不同用户故事（story）中出现不一致决策
- 为实施阶段保留架构决策
- 作为项目模式与规则的长期参考

## 提示

:::tip[最佳实践]
- **聚焦“不明显但重要”的规则**：优先记录智能体容易漏掉的项目约束，而不是
  “变量要有意义”这类通用建议。
- **保持精简**：此文件会被多数实现工作流加载，过长会浪费上下文窗口。避免写入
  只适用于单一 story 的细节。
- **按需更新**：当团队约定变化时手动更新，或在架构发生较大变化后重新生成。
- **适用于 Quick Flow 与完整 BMad Method**：两种模式都可共享同一份项目上下文。
:::

## 后续步骤

- [**项目上下文说明**](../explanation/project-context.md) - 了解其工作原理
- [**工作流程图**](../reference/workflow-map.md) - 查看哪些工作流会加载项目上下文
