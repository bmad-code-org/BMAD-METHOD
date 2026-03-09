---
title: "工作流程图"
description: BMad Method 工作流程阶段与输出的可视化参考
sidebar:
  order: 1
---

BMad Method（BMM）是 BMad 生态系统中的一个模块，旨在遵循上下文工程与规划的最佳实践。AI 智能体在清晰、结构化的上下文中表现最佳。BMM 系统在 4 个不同阶段中逐步构建该上下文——每个阶段以及每个阶段内的多个可选工作流程都会生成文档，这些文档为下一阶段提供信息，因此智能体始终知道要构建什么以及为什么。

其基本原理和概念来自敏捷方法论，这些方法论在整个行业中被广泛用作思维框架，并取得了巨大成功。

如果您在任何时候不确定该做什么，`/bmad-help` 命令将帮助您保持正轨或了解下一步该做什么。您也可以随时参考此文档以获取参考信息——但如果您已经安装了 BMad Method，`/bmad-help` 是完全交互式的，速度要快得多。此外，如果您正在使用扩展了 BMad Method 或添加了其他互补非扩展模块的不同模块——`/bmad-help` 会不断演进以了解所有可用内容，从而为您提供最佳即时建议。

最后的重要说明：以下每个工作流程都可以通过斜杠命令直接使用您选择的工具运行，或者先加载智能体，然后使用智能体菜单中的条目来运行。

<iframe src="/workflow-map-diagram.html" title="BMad Method Workflow Map Diagram" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">在新标签页中打开图表 ↗</a>
</p>

## 阶段 1：分析（可选）

在投入规划之前探索问题空间并验证想法。

| 工作流程                        | 目的                                                                    | 产出                  |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `bmad-brainstorming`            | 在头脑风暴教练的引导协助下进行项目想法头脑风暴 | `brainstorming-report.md` |
| `bmad-bmm-research`             | 验证市场、技术或领域假设                          | 研究发现         |
| `bmad-bmm-create-product-brief` | 捕捉战略愿景                                                   | `product-brief.md`        |

## 阶段 2：规划

定义要构建什么以及为谁构建。

| 工作流程                    | 目的                                  | 产出     |
| --------------------------- | ---------------------------------------- | ------------ |
| `bmad-bmm-create-prd`       | 定义需求（FRs/NFRs）           | `PRD.md`     |
| `bmad-bmm-create-ux-design` | 设计用户体验（当 UX 重要时） | `ux-spec.md` |

## 阶段 3：解决方案设计

决定如何构建它并将工作分解为故事。

| 工作流程                                  | 目的                                    | 产出                    |
| ----------------------------------------- | ------------------------------------------ | --------------------------- |
| `bmad-bmm-create-architecture`            | 明确技术决策          | 包含 ADR 的 `architecture.md` |
| `bmad-bmm-create-epics-and-stories`       | 将需求分解为可实施的工作 | 包含故事的 Epic 文件     |
| `bmad-bmm-check-implementation-readiness` | 实施前的关卡检查           | PASS/CONCERNS/FAIL 决策 |

## 阶段 4：实施

逐个故事地构建它。即将推出完整的阶段 4 自动化！

| 工作流程                   | 目的                                                                  | 产出                         |
| -------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `bmad-bmm-sprint-planning` | 初始化跟踪（每个项目一次，以排序开发周期）         | `sprint-status.yaml`             |
| `bmad-bmm-create-story`    | 准备下一个故事以供实施                                    | `story-[slug].md`                |
| `bmad-bmm-dev-story`       | 实施该故事                                                      | 工作代码 + 测试             |
| `bmad-bmm-code-review`     | 验证实施质量                                          | 批准或请求更改    |
| `bmad-bmm-correct-course`  | 处理冲刺中的重大变更                                    | 更新的计划或重新路由       |
| `bmad-bmm-automate`        | 为现有功能生成测试 - 在完整的 epic 完成后使用 | 端到端 UI 专注测试套件 |
| `bmad-bmm-retrospective`   | 在 epic 完成后回顾                                             | 经验教训                  |

## 快速流程（并行轨道）

对于小型、易于理解的工作，跳过阶段 1-3。

| 工作流程              | 目的                                    | 产出                                      |
| --------------------- | ------------------------------------------ | --------------------------------------------- |
| `bmad-bmm-quick-spec` | 定义临时变更                    | `tech-spec.md`（小型变更的故事文件） |
| `bmad-bmm-quick-dev`  | 根据规范或直接指令实施 | 工作代码 + 测试                          |

## 上下文管理

每个文档都成为下一阶段的上下文。PRD 告诉架构师哪些约束很重要。架构告诉开发智能体要遵循哪些模式。故事文件为实施提供专注、完整的上下文。没有这种结构，智能体会做出不一致的决策。

### 项目上下文

:::tip[推荐]
创建 `project-context.md` 以确保 AI 智能体遵循您项目的规则和偏好。该文件就像您项目的宪法——它指导所有工作流程中的实施决策。这个可选文件可以在架构创建结束时生成，或者在现有项目中也可以生成它，以捕捉与当前约定保持一致的重要内容。
:::

**如何创建它：**

- **手动** — 使用您的技术栈和实施规则创建 `_bmad-output/project-context.md`
- **生成它** — 运行 `/bmad-bmm-generate-project-context` 以从您的架构或代码库自动生成

[**了解更多关于 project-context.md**](../explanation/project-context.md)

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **BMad Method (BMM)**：BMad 方法。BMad 生态系统中的一个模块，用于上下文工程与规划。
- **FRs/NFRs**：功能需求/非功能需求。Functional Requirements/Non-Functional Requirements 的缩写。
- **PRD**：产品需求文档。Product Requirements Document 的缩写。
- **UX**：用户体验。User Experience 的缩写。
- **ADR**：架构决策记录。Architecture Decision Record 的缩写。
- **Epic**：史诗。大型功能或用户故事的集合，通常需要多个冲刺才能完成。
- **Story**：用户故事。描述用户需求的简短陈述。
- **Sprint**：冲刺。敏捷开发中的固定时间周期，用于完成预定的工作。
- **Slug**：短标识符。URL 友好的标识符，通常用于文件命名。
- **Context**：上下文。为 AI 智能体提供的环境信息和背景资料。
