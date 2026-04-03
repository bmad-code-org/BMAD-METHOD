---
title: "快速修复"
description: 如何进行快速修复和临时更改
sidebar:
  order: 5
---

对于 bug 修复、重构或小范围改动，使用 **Quick Dev** 即可，不必走完整的 BMad Method。

## 何时使用本指南

- 原因明确且已知的 bug 修复
- 包含在少数文件中的小型重构（重命名、提取、重组）
- 次要功能调整或配置更改
- 依赖更新

:::note[前置条件]
- 已安装 BMad Method（`npx bmad-method install`）
- AI 驱动的 IDE（Claude Code、Cursor 或类似工具）
:::

## 步骤

### 1. 开启新会话

在 AI IDE 中开启一个**全新的聊天会话**。复用之前工作流留下的会话，容易引发上下文冲突。

### 2. 提供你的意图

Quick Dev 支持自由表达意图，你可以在调用前、调用时或调用后补充说明。示例：

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

纯文本、文件路径、GitHub issue 链接、缺陷跟踪地址都可以，只要 LLM 能解析成明确意图。

### 3. 回答问题并批准

Quick Dev 可能会先问澄清问题，或在实现前给出一份简短方案供你确认。回答问题后，在你认可方案时再批准继续。

### 4. 审查和推送

Quick Dev 会实现改动、执行自检并修补问题，然后在本地提交。完成后，它会在编辑器中打开受影响文件。

- 快速浏览 diff，确认改动符合你的意图
- 如果有偏差，直接告诉智能体要改什么，它可以在同一会话里继续迭代

确认无误后推送提交。Quick Dev 会提供推送和创建 PR 的选项。

:::caution[如果出现问题]
如果推送的更改导致意外问题，请使用 `git revert HEAD` 干净地撤销最后一次提交。然后启动新聊天并再次运行 Quick Dev 以尝试不同的方法。
:::

## 你将获得

- 已应用修复或重构的修改后的源文件
- 通过的测试（如果你的项目有测试套件）
- 带有约定式提交消息的准备推送的提交

## 延迟工作

Quick Dev 每次只聚焦一个目标。如果你的请求包含多个独立目标，或审查过程中发现与你本次改动无关的存量问题，Quick Dev 会把它们记录到 `deferred-work.md`（位于实现产物目录），而不是一次性全都处理。

每次运行后都建议看一下这个文件，它就是你的后续待办清单。你可以把其中任何一项在后续新的 Quick Dev 会话里单独处理。

## 何时升级到正式规划

在以下情况下考虑使用完整的 BMad Method：

- 更改影响多个系统或需要在许多文件中进行协调更新
- 你不确定范围，需要先进行需求发现
- 你需要为团队记录文档或架构决策

参见 [Quick Dev](../explanation/quick-dev.md) 了解 Quick Dev 在 BMad Method 中的位置与边界。
