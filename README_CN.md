![BMad Method](banner-bmad-method.png)

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

**Agile Ai Driven Development（敏捷 AI 驱动开发）** —— Ai Driven Development（AiDD）关注的不只是代码，还包括做什么、如何组织，以及在认知变化时如何调整。BMad Method 是实践 AiDD 的敏捷方式：决策保持显式，上下文持续传递，流程随工作量自动调整。同一套方法既适用于周末原型，也适用于有多年历史的系统。

**100% 免费且开源。** 没有付费墙，没有封闭内容，也没有封闭 Discord。我们希望每个人都能平等获得高质量的人机协作开发方法。

## 为什么选择 BMad 方法？

传统 AI 工具常常替你思考，结果往往止于“能用”。BMad 通过专业智能体和引导式工作流，让 AI 成为协作者：流程有结构，决策有依据，产出更稳定。

- **AI 智能引导** —— 随时调用 `bmad-help` 获取下一步建议
- **规模与领域自适应** —— 按项目复杂度自动调整规划深度
- **结构化工作流** —— 覆盖分析、规划、架构、实施全流程
- **专业角色智能体** —— 提供 PM、架构师、开发者、UX 等 12+ 角色
- **派对模式** —— 多个智能体可在同一会话协作讨论
- **完整生命周期** —— 从头脑风暴一路到交付上线

[在 **docs.bmad-method.org** 了解更多](https://docs.bmad-method.org/zh-cn/)

---

## 🚀 BMad 的下一步是什么？

**V6 已经上线，而这只是开始。** BMad 仍在快速演进：跨平台智能体团队与子智能体集成、Skills 架构、BMad Builder v1、Dev Loop 自动化等能力都在持续推进。

**[📍 查看完整路线图 →](https://docs.bmad-method.org/zh-cn/roadmap/)**

---

## 快速开始

**先决条件**：[Node.js](https://nodejs.org) v20+

```bash
npx bmad-method install
```

> 想体验最新预发布版本？可使用 `npx bmad-method@next install`。它比默认版本更新更快，也可能更容易发生变化。

按照安装程序提示操作，然后在项目文件夹中打开你的 AI IDE（Claude Code、Cursor 等）。

**非交互式安装**（用于 CI/CD）：

```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```

> **不确定下一步？** 直接问 `bmad-help`。它会告诉你“必做什么、可选什么”，例如：`bmad-help 我刚完成架构设计，接下来做什么？`

## 模块

BMad 可通过官方模块扩展到不同专业场景。你可以在安装时选择，也可以后续随时补装。

| 模块                                                                                                             | 用途                                                                    |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)**                                                  | 规划并交付软件，覆盖全新原型到成熟代码库                                |
| **[BMad Builder](https://github.com/bmad-code-org/bmad-builder)**                                                | 技能、工作流与智能体构建器                                              |
| **[BMad Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)** | 创意思考伙伴：创新、设计思维与叙事                                      |
| **[BMad Test Architect](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)**             | 面向 BMad Method 的企业级测试扩展模块                                   |
| **[BMad Loop](https://github.com/bmad-code-org/bmad-loop)**                                                      | 无人值守地构建、验证并复盘整个 Epic                                     |
| **[BMad Game Dev Studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)**                         | 构思、设计并开发游戏，支持任意框架，包括 Unity、Unreal、Godot 与 Phaser |

## 文档

[BMad 方法文档站点](https://docs.bmad-method.org/zh-cn/) — 教程、指南、概念和参考

**快速链接：**

- [入门教程](https://docs.bmad-method.org/zh-cn/tutorials/getting-started/)
- [从旧版本升级](https://docs.bmad-method.org/zh-cn/how-to/upgrade-to-v6/)
- [测试架构师文档（英文）](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)

## 社区

- [Discord](https://discord.gg/gk8jAdXWmj) — 获取帮助、分享想法、协作
- [在 YouTube 上订阅](https://www.youtube.com/@BMadCode) — 教程、大师课和播客（2025 年 2 月推出）
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) — 错误报告和功能请求
- [讨论](https://github.com/bmad-code-org/BMAD-METHOD/discussions) — 社区对话

## 支持 BMad

BMad 对所有人免费，而且会一直免费。如果你愿意支持项目发展：

- ⭐ 给仓库点个 Star
- ☕ [请我喝咖啡](https://buymeacoffee.com/bmad) — 为开发提供动力
- 🏢 企业赞助 — 在 Discord 上私信
- 🎤 演讲与媒体 — 可参加会议、播客、采访（在 Discord 上联系 BM）

## 贡献

我们欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

## 许可证

MIT 许可证 — 详见 [LICENSE](LICENSE)。

---

**BMad** 和 **BMAD-METHOD** 是 BMad Code, LLC 的商标。详见 [TRADEMARK.md](TRADEMARK.md)。

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

请参阅 [CONTRIBUTORS.md](CONTRIBUTORS.md) 了解贡献者信息。
