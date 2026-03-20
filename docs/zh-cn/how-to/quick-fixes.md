---
title: "快速修复"
description: 如何进行快速修复和临时更改
sidebar:
  order: 5
---

使用 **Quick Dev** 进行 bug 修复、重构或小型针对性更改，这些操作不需要完整的 BMad Method。

## 何时使用此方法

- 原因明确且已知的 bug 修复
- 包含在少数文件中的小型重构（重命名、提取、重组）
- 次要功能调整或配置更改
- 依赖更新

:::note[前置条件]
- 已安装 BMad Method（`npx bmad-method install`）
- AI 驱动的 IDE（Claude Code、Cursor 或类似工具）
:::

## 步骤

### 1. 启动新的聊天

在 AI IDE 中打开一个**新的聊天会话**。重用之前工作流的会话可能导致上下文冲突。

### 2. 提供你的意图

Quick Dev 接受自由形式的意图——可以在调用之前、同时或之后提供。示例：

```text
run quick-dev — 修复允许空密码的登录验证 bug。
```

```text
run quick-dev — fix https://github.com/org/repo/issues/42
```

```text
run quick-dev — 实现 _bmad-output/implementation-artifacts/my-intent.md 中的意图
```

```text
我觉得问题在 auth 中间件，它没有检查 token 过期。
让我看看... 是的，src/auth/middleware.ts 第 47 行完全跳过了
exp 检查。run quick-dev
```

```text
run quick-dev
> 你想做什么？
重构 UserService 以使用 async/await 而不是回调。
```

纯文本、文件路径、GitHub issue URL、bug 跟踪器链接——任何 LLM 能解析为具体意图的内容都可以。

### 3. 回答问题并批准

Quick Dev 可能会提出澄清问题，或在实现之前呈现简短的规范供你批准。回答它的问题，并在你对计划满意时批准。

### 4. 审查和推送

Quick Dev 实现更改、审查自己的工作、修复问题，并在本地提交。完成后，它会在编辑器中打开受影响的文件。

- 浏览 diff 以确认更改符合你的意图
- 如果看起来有问题，告诉智能体需要修复什么——它可以在同一会话中迭代

满意后，推送提交。Quick Dev 会提供推送和创建 PR 的选项。

:::caution[如果出现问题]
如果推送的更改导致意外问题，请使用 `git revert HEAD` 干净地撤销最后一次提交。然后启动新聊天并再次运行 Quick Dev 以尝试不同的方法。
:::

## 你将获得

- 已应用修复或重构的修改后的源文件
- 通过的测试（如果你的项目有测试套件）
- 带有约定式提交消息的准备推送的提交

## 延迟工作

Quick Dev 保持每次运行聚焦于单一目标。如果你的请求包含多个独立目标，或者审查发现了与你的更改无关的已有问题，Quick Dev 会将它们延迟到一个文件中（实现产物目录中的 `deferred-work.md`），而不是试图一次解决所有问题。

运行后检查此文件——它是你的待办事项积压。每个延迟项目都可以稍后输入到新的 Quick Dev 运行中。

## 何时升级到正式规划

在以下情况下考虑使用完整的 BMad Method：

- 更改影响多个系统或需要在许多文件中进行协调更新
- 你不确定范围，需要先进行需求发现
- 你需要为团队记录文档或架构决策

参见 [Quick Dev](../explanation/quick-dev.md) 了解 Quick Dev 如何融入 BMad Method。

---
## 术语说明

- **Quick Dev**：快速开发。BMad Method 中的快速工作流，用于小型更改的完整实现周期。
- **refactoring**：重构。在不改变代码外部行为的情况下改进其内部结构的过程。
- **breaking changes**：破坏性更改。可能导致现有代码或功能不再正常工作的更改。
- **test suite**：测试套件。一组用于验证软件功能的测试用例集合。
- **CI pipeline**：CI 流水线。持续集成流水线，用于自动化构建、测试和部署代码。
- **diff**：差异。文件或代码更改前后的对比。
- **commit**：提交。将更改保存到版本控制系统的操作。
- **conventional commit**：约定式提交。遵循标准格式的提交消息。
