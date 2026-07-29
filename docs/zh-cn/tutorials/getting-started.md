---
title: "快速入门"
description: 安装 BMad 并构建你的第一个项目
---

使用 AI 驱动的工作流更快地构建软件，通过专门的智能体引导你完成规划、架构设计和实现。

## 你将学到

- 为新项目安装并初始化 BMad Method
- 使用 **BMad-Help** —— 你的智能向导，它知道下一步该做什么
- 为当前工作选择合适的规划深度
- 从需求到可用代码，逐步推进各个阶段
- 有效使用智能体和工作流

:::note[前置条件]
- **Node.js 20.12+** — 安装程序必需
- **Git** — 推荐用于版本控制
- **AI 驱动的 IDE** — Claude Code、Cursor 或类似工具
- **一个项目想法** — 即使是简单的想法也可以用于学习
:::

:::tip[最简单的路径]
**安装** → `npx bmad-method install`
**询问** → `bmad-help 我应该先做什么？`
**构建** → 让 BMad-Help 逐个工作流地引导你
:::

## 认识 BMad-Help：你的智能向导

**BMad-Help 是开始使用 BMad 的最快方式。** 你不需要记住工作流或阶段 —— 只需询问，BMad-Help 就会：

- **检查你的项目**，看看已经完成了什么
- **根据你安装的模块显示你的选项**
- **推荐下一步** —— 包括第一个必需任务
- **回答问题**，比如"我有一个 SaaS 想法，应该从哪里开始？"

### 如何使用 BMad-Help

在你的 AI IDE 中直接调用技能名：

```
bmad-help
```

也可以带着问题一起调用，获得更贴合上下文的建议：

```
bmad-help 我有一个 SaaS 产品的想法，我已经知道我想要的所有功能。我应该从哪里开始？
```

BMad-Help 将回应：
- 针对你的情况推荐什么
- 第一个必需任务是什么
- 其余流程是什么样的

### 它也驱动工作流

BMad-Help 不仅回答问题 —— **它会在每个工作流结束时自动运行**，告诉你确切地下一步该做什么。无需猜测，无需搜索文档 —— 只需对下一个必需工作流的清晰指导。

:::tip[从这里开始]
安装 BMad 后，立即运行 `bmad-help`。它将检测你安装了哪些模块，并引导你找到项目的正确起点。
:::

## 了解 BMad

BMad 通过带有专门 AI 智能体的引导工作流帮助你构建软件。该过程遵循四个阶段：

| 阶段 | 名称           | 发生什么                                           |
| ---- | -------------- | -------------------------------------------------- |
| 1    | 分析           | 头脑风暴、研究、产品简报 *（可选）*                |
| 2    | 规划           | 创建需求（PRD 或技术规范）                         |
| 3    | 解决方案设计   | 按需要设计架构                                     |
| 4    | 实现           | 每个变更或 story 都通过 Quick Dev                  |

**[打开工作流地图](../reference/workflow-map.md)** 以探索阶段、工作流和上下文管理。

规划深度可以灵活调整：

| 规划深度 | 最适合 | 实施前可用上下文 |
| --- | --- | --- |
| **直接** | 清晰的修复、功能、issue 或现有规格 | 意图、issue 或规格 |
| **产品规划** | 产品、平台和复杂功能 | PRD 与可选 UX 设计 |
| **完整方案设计** | 跨系统、高风险或协同项目 | PRD、UX、架构、epics、stories 与 sprint 计划 |

:::note
这些不是独立的实施路径。所有入口都汇入 `bmad-quick-dev`；规划只会改变实施前已有的上下文量。
:::

## 安装

在项目目录中打开终端并运行：

```bash
npx bmad-method install
```

如果你想使用最新预发布版本（而不是默认发布通道），可以改用 `npx bmad-method@next install`。

当提示选择模块时，选择 **BMad Method**。

安装程序会创建两个文件夹：
- `_bmad/` — 智能体、工作流、任务和配置
- `_bmad-output/` — 目前为空，但这是你的工件将被保存的地方

:::tip[你的下一步]
在项目文件夹中打开你的 AI IDE 并运行：

```
bmad-help
```

BMad-Help 将检测你已完成的内容，并准确推荐下一步该做什么。你也可以问它诸如"我的选项是什么？"或"我有一个 SaaS 想法，我应该从哪里开始？"之类的问题。
:::

:::note[如何加载智能体和运行工作流]
每个工作流都可以通过技能名直接调用（例如 `bmad-prd`）。你的 AI IDE 会识别 `bmad-*` 技能并执行，无需额外单独加载智能体。你也可以直接调用智能体技能进行通用对话（例如 PM 智能体用 `bmad-agent-pm`）。
:::

:::caution[新对话]
始终为每个工作流开始一个新的对话。这可以防止上下文限制导致问题。
:::

## 步骤 1：选择规划深度

根据工作需要选用阶段 1-3。对于清晰且边界明确的工作，可以直接进入[步骤 2](#步骤-2构建你的项目)。**为每个工作流使用新对话。**

:::tip[项目上下文（可选）]
在开始之前，考虑创建 `project-context.md` 来记录你的技术偏好和实现规则。这确保所有 AI 智能体在整个项目中遵循你的约定。

在 `_bmad-output/project-context.md` 手动创建它，或在架构之后使用 `bmad-generate-project-context` 生成它。[了解更多](../explanation/project-context.md)。
:::

### 阶段 1：分析（可选）

此阶段中的所有工作流都是可选的：
- **头脑风暴**（`bmad-brainstorming`） — 引导式构思
- **研究**（`bmad-deep-recon`） — 为你自己的深度研究工具起草提示词、将完成的研究报告加工为可供下游使用的精炼摘要，或直接在此执行研究——覆盖市场、领域、技术、竞争、用户之声与学术类型，带论断核实与刷新生命周期
- **创建产品简报**（`bmad-create-product-brief`） — 推荐的基础文档

### 阶段 2：规划（按需）

对于需要产品规划的工作：
1. 在新对话中调用 **PM 智能体**（`bmad-agent-pm`）
2. 运行 `bmad-prd` 工作流（`bmad-prd`）
3. 输出：`PRD.md`

:::note[UX 设计（可选）]
如果你的项目有用户界面，在创建 PRD 后调用 **UX-Designer 智能体**（`bmad-agent-ux-designer`），然后运行 UX 设计工作流（`bmad-ux`）。
:::

### 阶段 3：解决方案设计（按需）

**创建架构**
1. 在新对话中调用 **Architect 智能体**（`bmad-agent-architect`）
2. 运行 `bmad-architecture`（`bmad-architecture`）
3. 输出：包含技术决策的架构文档

**创建史诗和故事**

:::tip[V6 改进]
史诗和故事现在在架构*之后*创建。这会产生更高质量的故事，因为架构决策（数据库、API 模式、技术栈）直接影响工作应该如何分解。
:::

1. 在新对话中调用 **PM 智能体**（`bmad-agent-pm`）
2. 运行 `bmad-create-epics-and-stories`（`bmad-create-epics-and-stories`）
3. 工作流使用 PRD 和架构来创建技术信息丰富的故事

**实现就绪检查** *（强烈推荐）*
1. 在新对话中调用 **Architect 智能体**（`bmad-agent-architect`）
2. 运行 `bmad-check-implementation-readiness`（`bmad-check-implementation-readiness`）
3. 验证所有规划文档之间的一致性

## 步骤 2：构建你的项目

携带现有上下文进入实现阶段：直接请求、issue、规格或完整规划的 story。**每个工作流应该在新对话中运行。**

对于已规划工作，运行 `bmad-quick-dev` 并指出选定的 story 或 sprint 项，例如：`实现 _bmad-output/planning-artifacts/epics.md 中的 story 2.3`。

### 初始化冲刺规划（用于规划工作）

调用 **Developer 智能体**（`bmad-agent-dev`）并运行 `bmad-sprint-planning`（`bmad-sprint-planning`）。这会创建 `sprint-status.yaml` 来跟踪所有史诗和故事。

当 Quick Dev 在该文件中解析出选定 story 时，它会在实施期间把状态改为 `in-progress`，并在实施完成后改为 `review`。

### 构建周期

对于每个直接变更或已规划 story，使用新对话重复此周期：

| 步骤 | 智能体 | 工作流       | 命令                    | 目的                            |
| ---- | ------ | ------------ | ----------------------- | ------------------------------- |
| 1    | DEV    | `bmad-quick-dev`    | `bmad-quick-dev`    | 按需澄清、规划、实现、审查与呈现 |
| 2    | DEV    | `bmad-code-review`  | `bmad-code-review`  | 额外质量验证 *（推荐）*          |

Quick Dev 的审查是每次运行的一部分。`bmad-code-review` 是在全新上下文中执行的可选独立验证层。

完成史诗中的所有故事后，调用 **Developer 智能体**（`bmad-agent-dev`）并运行 `bmad-retrospective`（`bmad-retrospective`）。

## 你已完成的工作

你已经学习了使用 BMad 构建的基础：

- 安装了 BMad 并为你的 IDE 进行了配置
- 为当前工作选择了合适的规划深度
- 创建了规划文档（PRD、架构、史诗和故事）
- 了解了实现的构建周期

你的项目现在拥有：

```text
your-project/
├── _bmad/                                   # BMad 配置
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # 你的需求文档
│   │   ├── architecture.md                  # 技术决策
│   │   └── epics/                           # 史诗和故事文件
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # 冲刺跟踪
│   └── project-context.md                   # 实现规则（可选）
└── ...
```

## 快速参考

| 工作流                              | 命令                                    | 智能体   | 目的                                         |
| ----------------------------------- | --------------------------------------- | -------- | -------------------------------------------- |
| **`bmad-help`** ⭐                  | `bmad-help`                            | 任意     | **你的智能向导 —— 随时询问任何问题！**        |
| `bmad-prd`                   | `bmad-prd`                      | PM       | 创建产品需求文档                             |
| `bmad-architecture`          | `bmad-architecture`             | Architect | 创建架构文档                                |
| `bmad-generate-project-context`     | `bmad-generate-project-context`        | Analyst  | 创建项目上下文文件                           |
| `bmad-create-epics-and-stories`     | `bmad-create-epics-and-stories`        | PM       | 将 PRD 分解为史诗                            |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | 验证规划一致性                              |
| `bmad-sprint-planning`              | `bmad-sprint-planning`                 | DEV      | 初始化冲刺跟踪                               |
| `bmad-quick-dev`                    | `bmad-quick-dev`                       | DEV      | 实施意图、issue、功能、修复或已规划 story     |
| `bmad-code-review`                  | `bmad-code-review`                     | DEV      | 审查已实现的代码                             |

## 常见问题

**我总是需要架构吗？**
不需要。只有当技术决策或跨系统约束需要显式记录时才使用架构。清晰工作可以直接进入 `bmad-quick-dev`；大型项目则把规划产物带入同一个 workflow。

**我可以稍后更改我的计划吗？**
可以。`bmad-correct-course` 工作流用于处理实现过程中的范围变化。

**如果我想先进行头脑风暴怎么办？**
在开始 PRD 之前，调用 Analyst 智能体（`bmad-agent-analyst`）并运行 `bmad-brainstorming`（`bmad-brainstorming`）。

**我需要遵循严格的顺序吗？**
不一定。一旦你了解了流程，你可以使用上面的快速参考直接运行工作流。

## 获取帮助

:::tip[第一站：BMad-Help]
**随时运行 `bmad-help`** —— 这是摆脱困境的最快方式。问它任何问题：
- "安装后我应该做什么？"
- "我在工作流 X 上卡住了"
- "我在 Y 方面有什么选项？"
- "向我展示到目前为止已完成的工作"

BMad-Help 检查你的项目，检测你已完成的内容，并确切地告诉你下一步该做什么。
:::

- **在工作流期间** — 智能体通过问题和解释引导你
- **社区** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## 关键要点

:::tip[记住这些]
- **从 `bmad-help` 开始** — 你的智能向导，了解你的项目和选项
- **始终使用新对话** — 为每个工作流开始新对话
- **规划深度可变** — 直接意图和完整规划的 story 都进入 `bmad-quick-dev`
- **BMad-Help 自动运行** — 每个工作流结束时都会提供下一步的指导
:::

准备好开始了吗？安装 BMad，运行 `bmad-help`，让你的智能向导为你引路。
