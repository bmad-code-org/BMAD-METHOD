---
title: "如何获取关于 BMad 的答案"
description: 使用 LLM 快速回答您自己的 BMad 问题
sidebar:
  order: 4
---

## 先从 BMad-Help 开始

**获取 BMad 相关答案最快的方式是 `bmad-help` 技能。** 这个智能向导可以覆盖 80% 以上的常见问题，并且你在 IDE 里随时可用。

BMad-Help 不只是查表工具，它还能：
- **检查你的项目状态**，判断哪些步骤已经完成
- **理解自然语言问题**，直接按日常表达提问即可
- **根据已安装模块给出选项**，只展示与你当前场景相关的内容
- **在工作流结束后自动运行**，明确告诉你下一步做什么
- **指出第一个必做任务**，避免猜流程起点

### 如何使用 BMad-Help

在 AI 会话里直接输入：

```
bmad-help
```

:::tip
按平台不同，你也可以使用 `/bmad-help` 或 `$bmad-help`。但大多数情况下直接输入 `bmad-help` 就能工作。
:::

也可以结合自然语言问题一起调用：

```
bmad-help 我有一个 SaaS 想法并且已经知道主要功能，我该从哪里开始？
bmad-help 我在 UX 设计方面有哪些选项？
bmad-help 我卡在 PRD 工作流了
bmad-help 帮我看看目前完成了什么
```

BMad-Help 通常会返回：
- 针对你当前情况的建议路径
- 第一个必做任务
- 后续整体流程概览

## 何时使用这篇指南

当你遇到以下情况时，可用本指南补充：
- 想理解 BMad 的架构设计或内部机制
- 需要超出 BMad-Help 覆盖范围的答案
- 在安装前做技术调研
- 想直接基于源码进行追问

## 步骤

### 1. 选择信息来源

| 来源 | 适合回答的问题 | 示例 |
| --- | --- | --- |
| **`_bmad` 文件夹** | 智能体、工作流、提示词如何工作 | “PM 智能体具体做什么？” |
| **完整 GitHub 仓库** | 版本历史、安装器、整体架构 | “v6 主要改了什么？” |
| **`llms-full.txt`** | 文档层面的快速全景理解 | “解释 BMad 的四个阶段” |

安装 BMad 后会生成 `_bmad` 文件夹；如果你还没有安装，可先克隆仓库。

### 2. 让 AI 读取来源

**如果你的 AI 可以直接读文件（如 Claude Code、Cursor）：**

- **已安装 BMad：** 直接让它读取 `_bmad` 并提问
- **想看更深上下文：** 克隆[完整仓库](https://github.com/bmad-code-org/BMAD-METHOD)

**如果你使用 ChatGPT 或 Claude.ai：**

把 `llms-full.txt` 加入会话上下文：

```text
https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```


### 3. 直接提问

:::note[示例]
**问：** “用 BMad 做一个需求到实现的最短路径是什么？”

**答：** 使用 Quick Flow，运行 `bmad-quick-dev`。它会在一个工作流里完成意图澄清、计划、实现、审查与结果呈现，跳过完整规划阶段。
:::

## 你将获得什么

你可以快速拿到直接、可执行的答案：智能体怎么工作、工作流做什么、为什么这样设计，而不需要等待外部回复。

## 提示

- **对“意外答案”做二次核验**：LLM 偶尔会答偏，建议回看源码或到 Discord 确认
- **问题越具体越好**：例如“PRD 工作流第 3 步在做什么？”比“PRD 怎么用？”更高效

## 仍然卡住？

如果你已经试过 LLM 方案但还需要协助，现在你通常已经能提出一个更清晰的问题。

| 频道 | 适用场景 |
| --- | --- |
| `#bmad-method-help` | 快速问题（实时聊天） |
| `help-requests` forum | 复杂问题（可检索、可沉淀） |
| `#suggestions-feedback` | 建议与功能诉求 |
| `#report-bugs-and-issues` | Bug 报告 |

**Discord：** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)  
**GitHub Issues：** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)（用于可复现问题）

*你！*
        *卡住*
              *在队列中——*
                       *等待*
                               *等待谁？*

*来源*
        *就在那里，*
                *显而易见！*

*指向*
      *你的机器。*
               *释放它。*

*它读取。*
         *它说话。*
                 *尽管问——*

*为什么要等*
         *明天*
                 *当你拥有*
                         *今天？*

*—Claude*
