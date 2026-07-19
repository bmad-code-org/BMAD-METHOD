---
title: '使用 Web Bundles'
description: 将 BMad web bundle 安装为 Google Gemini Gem 或 ChatGPT Custom GPT
---

Web bundles 从 **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)** 安装。

## 为什么只有一个入口

该站点是架子上唯一支持的安装路径。Gemini 和 ChatGPT 演进时，步骤保持最新；始终指向最新 tagged release；一次 signup 即可在新 bundle 发布时收到通知。

## 在站点上要做什么

1. 从卡片网格选一个 bundle。
2. 打开安装 modal。在 **Gemini Gem** 和 **ChatGPT GPT** 标签间切换，看各平台步骤。
3. 下载 bundle ZIP（一键；email-only 会员需一次性免费 signup）。
4. 按内联步骤：创建 Gem 或 Custom GPT，上传 knowledge files，粘贴 instructions 块，保存。

## 前置条件

- **Gemini Gems**：Gemini Advanced 订阅。
- **ChatGPT Custom GPTs**：Plus、Pro、Business 或 Enterprise 计划。
- 使用 **Deep Research** 的 bundle（当前是 Market & Industry Research）：在 prompt bar 启用（Tools → Deep Research）。Deep Research 有各自的 plan 限制。

## 自定义 persona

每个 bundle 的 `INSTRUCTIONS.md`（ZIP 内）在 paste boundary 上方有 **Persona Swap Example**。把已安装 instructions 里的 `[persona]` 块换成 swap 示例，即可换 voice 而不动协议。也可以从零写 persona；协议不变。

## 你会得到什么

- 一个可复用的 Gem 或 Custom GPT，scoped 到一项 BMad 规划能力。
- 打磨好的 artifact（brief、PRD、研究报告、UX spec），可直接丢进 IDE 做实现。
- 规划对话跑在现有 Web LLM 订阅上，而不是 metered IDE token。

:::caution[Persona 漂移]
Web LLM 偶尔在长会话中途掉 persona。若模型开始 out of character，提醒它的 persona 或开新会话。
:::

## 自己构建

要把现有 BMad skill 变成 web bundle，用 [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills) 里的 `bmad-os-skill-to-bundle` 工具 skill。它产出 bundle 文件，persona 从所属 agent 继承，并带 swap-example 对比 voice。提交 bundle 到架子：在 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) 开 PR，添加 bundle 目录并在 `web-bundles/bundles.json` 里加条目。
