---
title: 'Web Bundles'
description: 为 Google Gemini Gems 和 ChatGPT Custom GPTs 打包的 BMad skills
---

在 Web LLM 订阅里跑 BMad 的规划侧，再把 artifact 带回 IDE。

## 什么是 Web Bundle？

Web bundle 是把 BMad skill 重新打包，安装成 **Google Gemini Gem** 或 **ChatGPT Custom GPT**。每个 bundle 包含：作为 knowledge file 上传的 `SKILL.md` 协议、粘贴到 Gem 或 GPT instructions 的 `INSTRUCTIONS.md` 块，以及 skill 所需的数据文件（CSV、模板、校验清单，以及按需逐步披露的内容）。persona 在粘贴的 instructions 里；协议在 knowledge file 里。换 persona 不用动协议。

安装不是一键，但步骤有引导。**从 [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/) 安装**。站点用卡片网格列出每个 bundle，内联展示 Gemini 和 ChatGPT 安装步骤，并提供 ZIP 下载。这是唯一支持的安装路径；架子上的模式一致，装过一个，下一个就是机械操作。

BMad V4 曾 ship web bundles。V6 把它们带回来，为当前的 Gem 和 Custom GPT 平台重写，面向 Canvas、Deep Research 和图像生成。

## 为什么用它们

规划工作和实现工作想要不同的工具。Web bundles 让各用其长。

| 关注点 | Web LLM（Gem 或 GPT） | IDE（Claude Code、Cursor） |
| --- | --- | --- |
| 成本模型 | 固定费率订阅 | 按 token 计费 |
| 最强项 | 对话、Canvas、Deep Research、图像 | 文件、终端、代码库上下文 |
| 最适合 | 头脑风暴、brief、PRD、研究 | 实现、重构、代码审查 |

在 IDE 里跑完整 PRD 或市场研究会烧 token，而 Gem 或 Custom GPT 用现有订阅价就能扛。打磨好的 artifact 再丢进 repo，Claude Code 或 Cursor 接手后续。

:::tip[在 Web 里规划，在 IDE 里构建]
成本节省在长周期里 compound。PRFAQ 一轮加三轮研究，在 Gem 里零边际美元；同样工作在 IDE 里是实打实的 spend。
:::

## 架子上有什么

当前 bundle 集覆盖分析和规划阶段：

| Bundle | 阶段 | Persona  lineage |
| --- | --- | --- |
| Brainstorming Coach | Analysis | Osborn（默认）、Minto（swap） |
| Product Brief Coach | Analysis | Mary（BMad analyst） |
| PRFAQ Coach | Analysis | Working Backwards（Bezos） |
| PRD Coach | Planning | Cagan |
| UX Coach | Planning | Norman |
| Market & Industry Research | Analysis | Porter and Christensen |

每个 bundle 带有默认 persona（若所属 BMad agent 存在则继承），以及对比 swap 示例，演示换 voice 的模式。

## 一次会话怎么跑

1. **打开 Gem 或 Custom GPT。** Persona 以角色身份问候，开启对话式 discovery。
2. **发现 scope。** Persona 问你要做什么、手头有什么、约束是什么。没有填表。
3. **在 Canvas 里干活。** 协议在会话开始就打开 Canvas 并持续更新。Mermaid 图和 HTML 表格与正文并存。
4. **交接。** 结束时你有一份 Canvas 文档，可导出、粘贴进 repo，或喂给 IDE 里的 BMad skill 进入下一阶段。

对集成 Deep Research 的 bundle（当前是 Market & Industry Research），persona 会在会话中途起草 Deep Research brief，供你粘贴到 Gemini 或 ChatGPT 的 Deep Research 模式，再 ingest 返回的报告。

## 何时用 web bundle

- 你在做项目前期思考，想要带 persona、Canvas、Deep Research 的 focused 工具。
- 想把 IDE token spend 留给实际编码。
- 要把规划 artifact 分享给没有 IDE 环境的协作者。

## 何时留在 IDE

- 工作需要读或改 repo 里的代码。
- 你已在实现中途，想保持上下文。
- 没有 Gemini Advanced 或 ChatGPT Plus 订阅。

## 更新与自定义

Bundle 会演进。拉新版本时，典型更新在 knowledge files（`SKILL.md` 协议及附带的模板、CSV、校验清单）。重新上传到 Gem 或 Custom GPT 即可更新。instructions 块通常不变。

若要按团队或 voice 自定义，改 **粘贴到 Gem 或 GPT 的 instructions 块**，不要改 knowledge files。instructions 块放 persona、偏好和本地 override；knowledge files 是 bundle 自带的协议。自定义放在 instructions 块里，未来更新就是换附件，不是 merge 你的编辑回去。

:::tip[自定义 instructions，挂载 knowledge]
Persona swap、默认用户名、团队 guardrails、偏好措辞——都在粘贴的 instructions 块里。Knowledge files 保持 stock，刷新时不丢你的改动。
:::

## 自己构建

Web bundles 用 `bmad-os-skill-to-bundle` 工具 skill 从 BMad skills 生成。指向任意 BMad skill 文件夹，产出 bundle 文件，persona 从所属 agent 继承。

从 [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/) 安装任意 bundle。
