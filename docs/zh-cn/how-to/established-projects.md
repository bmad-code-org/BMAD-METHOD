---
title: "既有项目"
description: 如何在现有代码库中使用 BMad Method
sidebar:
  order: 6
---

当你在现有项目或遗留代码库上工作时，本指南帮助你更稳妥地使用 BMad Method。

如果你是从零开始的新项目，建议先看[快速入门](../tutorials/getting-started.md)；本文主要面向既有项目接入场景。

:::note[前置条件]
- 已安装 BMad Method（`npx bmad-method install`）
- 一个你想要处理的现有代码库
- 访问 AI 驱动的 IDE（Claude Code 或 Cursor）
:::

## 步骤 1：清理已完成的规划产物

如果你通过 BMad 流程完成了所有 PRD 史诗和用户故事，请清理这些文件。归档它们、删除它们，或者在需要时依赖版本历史。不要将这些文件保留在：

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## 步骤 2：创建项目上下文（project context）

:::tip[推荐用于既有项目]
生成 `project-context.md`，梳理现有代码库的模式与约定，确保 AI 智能体在实施变更时遵循你既有的工程实践。
:::

运行生成项目上下文工作流：

```bash
bmad-generate-project-context
```

这将扫描你的代码库以识别：
- 技术栈和版本
- 代码组织模式
- 命名约定
- 测试方法
- 框架相关模式

你可以先审阅并完善生成内容；如果更希望手动维护，也可以直接在
`_bmad-output/project-context.md` 创建并编辑。

[了解更多关于项目上下文](../explanation/project-context.md)

## 步骤 3：维护高质量项目文档

你的 `docs/` 文件夹应包含简洁、组织良好的文档，准确代表你的项目：

- 意图和业务理由
- 业务规则
- 架构
- 任何其他相关的项目信息

对于复杂项目，可考虑使用 `bmad-document-project` 工作流。它会扫描整个项目并记录当前真实状态。

## 步骤 4：获取帮助

### BMad-Help：默认起点

**当你不确定下一步做什么时，随时运行 `bmad-help`。** 这个智能指南会：

- 检查项目当前状态，识别哪些工作已经完成
- 根据你安装的模块给出可行选项
- 理解自然语言查询

```
bmad-help 我有一个现有的 Rails 应用，我应该从哪里开始？
bmad-help Quick Flow 和完整方法有什么区别？
bmad-help 显示我当前有哪些可用工作流
```

BMad-Help 还会在**每个工作流结束时自动运行**，明确告诉你下一步该做什么。

### 选择你的方法

根据变更范围，你有两个主要选项：

| 范围 | 推荐方法 |
| --- | --- |
| **小型更新或新增** | 运行 `bmad-quick-dev`，在单个工作流中完成意图澄清、规划、实现与审查。完整四阶段 BMad Method 往往过重。 |
| **重大变更或新增** | 从完整 BMad Method 开始，再按项目风险和协作需求调整流程严谨度。 |

### 在创建 PRD 期间

在创建简报或直接进入 PRD 时，确保智能体：

- 查找并分析你现有的项目文档
- 读取与你当前系统匹配的项目上下文（project context）

你可以显式补充指令，但核心目标是让新功能与现有 architecture 和代码约束自然融合。

### UX 考量

UX 工作是可选项。是否需要进入 UX 流程，不取决于“项目里有没有 UX”，而取决于：

- 你是否真的在做 UX 层面的变更
- 是否需要新增重要的 UX 设计或交互模式

如果本次只是对现有页面做小幅调整，通常不需要完整 UX 流程。

### 架构考量（architecture）

在进行架构工作时，确保架构师：

- 使用正确且最新的文档输入
- 扫描并理解现有代码库

这一点非常关键：可避免“重复造轮子”，也能减少与现有架构冲突的设计决策。

## 更多信息

- **[快速修复](./quick-fixes.md)** - 错误修复和临时变更
- **[既有项目 FAQ](../explanation/established-projects-faq.md)** - 关于在既有项目上工作的常见问题
