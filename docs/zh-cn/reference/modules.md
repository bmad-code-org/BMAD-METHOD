---
title: "官方模块"
description: 用于构建自定义智能体、创意智能、游戏开发和测试的附加模块
sidebar:
  order: 4
---

BMad 通过您在安装期间选择的官方模块进行扩展。这些附加模块为内置核心和 BMM（敏捷套件）之外的特定领域提供专门的智能体、工作流和任务。

:::tip[安装模块]
运行 `npx bmad-method install` 并选择您需要的模块。安装程序会自动处理下载、配置和 IDE 集成。
:::

## BMad Builder

在引导式协助下创建自定义智能体、工作流和特定领域的模块。BMad Builder 是用于扩展框架本身的元模块。

- **代码：** `bmb`
- **npm：** [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- **GitHub：** [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

**提供：**

- 智能体构建器 —— 创建具有自定义专业知识和工具访问权限的专用 AI 智能体
- 工作流构建器 —— 设计包含步骤和决策点的结构化流程
- 模块构建器 —— 将智能体和工作流打包为可共享、可发布的模块
- 交互式设置，支持 YAML 配置和 npm 发布

## 创意智能套件

用于早期开发阶段的结构化创意、构思和创新的 AI 驱动工具。该套件提供多个智能体，利用经过验证的框架促进头脑风暴、设计思维和问题解决。

- **代码：** `cis`
- **npm：** [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- **GitHub：** [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

**提供：**

- 创新策略师、设计思维教练和头脑风暴教练智能体
- 问题解决者和创意问题解决者，用于系统性和横向思维
- 故事讲述者和演示大师，用于叙事和推介
- 构思框架，包括 SCAMPER、逆向头脑风暴和问题重构

## 游戏开发工作室

适用于 Unity、Unreal、Godot 和自定义引擎的结构化游戏开发工作流。通过 Quick Flow 支持快速原型制作，并通过史诗驱动的冲刺支持全面规模的生产。

- **代码：** `gds`
- **npm：** [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- **GitHub：** [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

**提供：**

- 游戏设计文档（GDD）生成工作流
- 用于快速原型制作的 Quick Dev 模式
- 针对角色、对话和世界构建的叙事设计支持
- 覆盖 21+ 种游戏类型，并提供特定引擎的架构指导

## 测试架构师（TEA）

通过专家智能体和九个结构化工作流提供企业级测试策略、自动化指导和发布门控决策。TEA 远超内置 QA 智能体，提供基于风险的优先级排序和需求可追溯性。

- **代码：** `tea`
- **npm：** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- **GitHub：** [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

**提供：**

- Murat 智能体（主测试架构师和质量顾问）
- 用于测试设计、ATDD、自动化、测试审查和可追溯性的工作流
- NFR 评估、CI 设置和框架脚手架
- P0-P3 优先级排序，可选 Playwright Utils 和 MCP 集成

## 社区模块

社区模块和模块市场即将推出。请查看 [BMad GitHub 组织](https://github.com/bmad-code-org) 获取最新更新。

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **workflow**：工作流。指一系列有序的任务或步骤，用于完成特定的业务流程或开发流程。
- **module**：模块。指可独立开发、测试和部署的软件单元，用于扩展系统功能。
- **meta-module**：元模块。指用于创建或扩展其他模块的模块，是模块的模块。
- **ATDD**：验收测试驱动开发（Acceptance Test-Driven Development）。一种敏捷开发实践，在编写代码之前先编写验收测试。
- **NFR**：非功能性需求（Non-Functional Requirement）。指系统在性能、安全性、可维护性等方面的质量属性要求。
- **CI**：持续集成（Continuous Integration）。一种软件开发实践，频繁地将代码集成到主干分支，并进行自动化测试。
- **MCP**：模型上下文协议（Model Context Protocol）。一种用于在 AI 模型与外部工具或服务之间进行通信的协议。
- **SCAMPER**：一种创意思维技巧，包含替代、组合、调整、修改、其他用途、消除和重组七个维度。
- **GDD**：游戏设计文档（Game Design Document）。用于描述游戏设计理念、玩法、机制等内容的详细文档。
- **P0-P3**：优先级分级。P0 为最高优先级（关键），P3 为最低优先级（可选）。
- **sprint**：冲刺。敏捷开发中的固定时间周期，通常为 1-4 周，用于完成预定的工作。
- **epic**：史诗。敏捷开发中的大型工作项，可分解为多个用户故事或任务。
- **Quick Flow**：快速流程。一种用于快速原型开发的工作流模式。
