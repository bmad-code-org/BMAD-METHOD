---
title: "如何升级到 v6"
description: 从 BMad v4 迁移到 v6
sidebar:
  order: 3
---

使用 BMad 安装程序从 v4 升级到 v6，其中包括自动检测旧版安装和迁移辅助。

## 何时使用本指南

- 您已安装 BMad v4（`.bmad-method` 文件夹）
- 您希望迁移到新的 v6 架构
- 您有需要保留的现有规划产物

:::note[前置条件]
- Node.js 20+
- 现有的 BMad v4 安装
:::

## 步骤

### 1. 运行安装程序

按照[安装程序说明](./install-bmad_cn.md)操作。

### 2. 处理旧版安装

当检测到 v4 时，您可以：

- 允许安装程序备份并删除 `.bmad-method`
- 退出并手动处理清理

如果您将 bmad method 文件夹命名为其他名称 - 您需要手动删除该文件夹。

### 3. 清理 IDE 命令

手动删除旧版 v4 IDE 命令 - 例如如果您使用 claude，查找任何以 bmad 开头的嵌套文件夹并删除它们：

- `.claude/commands/BMad/agents`
- `.claude/commands/BMad/tasks`

### 4. 迁移规划产物

**如果您有规划文档（Brief/PRD/UX/Architecture）：**

将它们移动到 `_bmad-output/planning-artifacts/` 并使用描述性名称：

- 在文件名中包含 `PRD` 用于 PRD 文档
- 相应地包含 `brief`、`architecture` 或 `ux-design`
- 分片文档可以放在命名的子文件夹中

**如果您正在进行规划：** 考虑使用 v6 工作流重新开始。将现有文档作为输入——新的渐进式发现工作流配合网络搜索和 IDE 计划模式会产生更好的结果。

### 5. 迁移进行中的开发

如果您已创建或实现了故事：

1. 完成 v6 安装
2. 将 `epics.md` 或 `epics/epic*.md` 放入 `_bmad-output/planning-artifacts/`
3. 运行 Scrum Master 的 `sprint-planning` 工作流
4. 告诉 SM 哪些史诗/故事已经完成

## 您将获得

**v6 统一结构：**

```text
your-project/
├── _bmad/               # 单一安装文件夹
│   ├── _config/         # 您的自定义配置
│   │   └── agents/      # 智能体自定义文件
│   ├── core/            # 通用核心框架
│   ├── bmm/             # BMad Method 模块
│   ├── bmb/             # BMad Builder
│   └── cis/             # Creative Intelligence Suite
└── _bmad-output/        # 输出文件夹（v4 中为 doc 文件夹）
```

## 模块迁移

| v4 模块                       | v6 状态                                   |
| ----------------------------- | ----------------------------------------- |
| `.bmad-2d-phaser-game-dev`    | 已集成到 BMGD 模块                        |
| `.bmad-2d-unity-game-dev`     | 已集成到 BMGD 模块                        |
| `.bmad-godot-game-dev`        | 已集成到 BMGD 模块                        |
| `.bmad-infrastructure-devops` | 已弃用 — 新的 DevOps 智能体即将推出       |
| `.bmad-creative-writing`      | 未适配 — 新的 v6 模块即将推出             |

## 主要变更

| 概念         | v4                                      | v6                                   |
| ------------ | --------------------------------------- | ------------------------------------ |
| **核心**     | `_bmad-core` 实际上是 BMad Method      | `_bmad/core/` 是通用框架             |
| **方法**     | `_bmad-method`                          | `_bmad/bmm/`                         |
| **配置**     | 直接修改文件                            | 每个模块使用 `config.yaml`           |
| **文档**     | 需要设置分片或非分片                    | 完全灵活，自动扫描                   |

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **epic**：史诗。在敏捷开发中，指大型的工作项，可分解为多个用户故事。
- **story**：故事。在敏捷开发中，指用户故事，描述用户需求的功能单元。
- **Scrum Master**：Scrum 主管。敏捷开发 Scrum 框架中的角色，负责促进团队流程和移除障碍。
- **sprint-planning**：冲刺规划。Scrum 框架中的会议，用于确定下一个冲刺期间要完成的工作。
- **sharded**：分片。将大型文档拆分为多个较小的文件以便于管理和处理。
- **PRD**：产品需求文档（Product Requirements Document）。描述产品功能、需求和特性的文档。
- **Brief**：简报。概述项目目标、范围和关键信息的文档。
- **UX**：用户体验（User Experience）。用户在使用产品或服务过程中的整体感受和交互体验。
- **Architecture**：架构。系统的结构设计，包括组件、模块及其相互关系。
- **BMGD**：BMad Game Development。BMad 游戏开发模块。
- **DevOps**：开发运维（Development Operations）。结合开发和运维的实践，旨在缩短系统开发生命周期。
- **BMad Method**：BMad 方法。BMad 框架的核心方法论模块。
- **BMad Builder**：BMad 构建器。BMad 框架的构建工具。
- **Creative Intelligence Suite**：创意智能套件。BMad 框架中的创意工具集合。
- **IDE**：集成开发环境（Integrated Development Environment）。提供代码编辑、调试等功能的软件开发工具。
- **progressive discovery**：渐进式发现。逐步深入探索和理解需求的过程。
- **web search**：网络搜索。通过互联网检索信息的能力。
- **plan mode**：计划模式。IDE 中的一种工作模式，用于规划和设计任务。
