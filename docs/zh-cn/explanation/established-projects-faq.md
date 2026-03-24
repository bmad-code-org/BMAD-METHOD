---
title: "既有项目常见问题"
description: 关于在既有项目上使用 BMad Method 的常见问题
sidebar:
  order: 8
---
关于在 established projects（既有项目）中使用 BMad Method 的高频问题，快速说明如下。

## 问题

- [我必须先运行文档梳理工作流吗？](#我必须先运行文档梳理工作流吗)
- [如果我忘了运行文档梳理怎么办？](#如果我忘了运行文档梳理怎么办)
- [既有项目可以直接用 Quick Flow 吗？](#既有项目可以直接用-quick-flow-吗)
- [如果现有代码不符合最佳实践怎么办？](#如果现有代码不符合最佳实践怎么办)
- [什么时候该从 Quick Flow 切到完整方法？](#什么时候该从-quick-flow-切到完整方法)

### 我必须先运行文档梳理工作流吗？

不绝对必须，但通常强烈建议先运行 `bmad-document-project`，尤其当：
- 项目文档缺失或明显过时
- 新成员或智能体难以快速理解现有系统
- 你希望后续 `workflow` 基于真实现状而不是猜测执行

如果你已有完整且最新的文档（包含 `docs/index.md`），并且能通过其他方式提供足够上下文，也可以跳过。

### 如果我忘了运行文档梳理怎么办？

可以随时补跑，不影响你继续推进当前任务。很多团队会在迭代中期或里程碑后再运行一次，用来把”代码现状”回写到文档里。

### 既有项目可以直接用 Quick Flow 吗？

可以。Quick Flow（例如 `bmad-quick-dev`）在既有项目里通常很高效，尤其适合：
- 小功能增量
- 缺陷修复
- 风险可控的局部改动

它会尝试识别现有技术栈、代码模式和约定，并据此生成更贴近现状的实现方案。

### 如果现有代码不符合最佳实践怎么办？

工作流会优先问你：“是否沿用当前约定？”你可以主动选择：
- **沿用**：优先保持一致性，降低短期改动风险
- **升级**：建立新标准，并在 tech-spec 或架构中写明迁移理由与范围

BMad Method 不会强制“立即现代化”，而是把决策权交给你。

### 什么时候该从 Quick Flow 切到完整方法？

当任务出现以下信号时，建议从 Quick Flow 升级到完整 BMad Method：
- 改动跨多个 `epic` 或多个子系统
- 需要明确 `architecture` 决策，否则容易冲突
- 涉及较大协作面、较高回归风险或复杂验收要求

如果你不确定，先让 `bmad-help` 判断当前阶段更稳妥的 workflow。

**还有问题？** 欢迎在 [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) 或 [Discord](https://discord.gg/gk8jAdXWmj) 提问。

如果你想了解这套接入方式的操作步骤，可继续阅读 [How-to：既有项目](../how-to/established-projects.md) 与 [How-to：项目上下文](../how-to/project-context.md)。想理解快速流程在方法论中的定位，可参见 [快速开发](./quick-dev.md)。

## 继续阅读

- [既有项目（How-to）](../how-to/established-projects.md)
- [项目上下文（Explanation）](./project-context.md)
- [管理项目上下文（How-to）](../how-to/project-context.md)
