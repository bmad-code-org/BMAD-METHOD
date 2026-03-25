---
title: "如何升级到 v6"
description: 从 BMad v4 迁移到 v6
sidebar:
  order: 3
---

使用 BMad 安装程序把 v4 升级到 v6。安装程序会自动识别旧安装，并提供迁移辅助，帮助你在已有项目中平滑过渡。

## 何时使用本指南

- 你已安装 BMad v4（目录名通常是 `.bmad-method`）
- 你准备迁移到 v6 的统一目录结构
- 你有要保留的规划产物或进行中的开发工作

:::note[前置条件]
- Node.js 20+
- 现有 BMad v4 安装
:::

::::caution[先备份再迁移]
如果当前仓库里仍有未提交的重要变更，先完成提交或备份，再执行升级。
::::

## 步骤

### 1. 运行安装程序

按照[安装程序说明](./install-bmad.md)操作。

### 2. 处理旧版安装目录

当检测到 v4 时，你有两种处理方式：

- 允许安装程序自动备份并删除 `.bmad-method`
- 先退出安装流程，再手动清理旧目录

如果你把 BMad Method 目录改成了其他名字，需要你自己手动定位并删除。

### 3. 清理 IDE 命令与技能目录

手动删除旧版 v4 IDE 命令/技能目录。以 Claude Code 为例，请在旧目录中删除以 `bmad` 开头的嵌套目录：

- `.claude/commands/`

v6 新技能会安装到：

- `.claude/skills/`

### 4. 迁移规划产物

**如果你有规划文档（Brief/PRD/UX/Architecture）：**

把它们移动到 `_bmad-output/planning-artifacts/`，并使用可读的文件名：

- PRD 文档文件名包含 `PRD`
- 其他文档按类型包含 `brief`、`architecture` 或 `ux-design`
- 分片文档可放在命名清晰的子目录中

**如果你仍在规划中：** 建议直接用 v6 工作流重启规划，把现有文档作为输入；新版渐进式发现流程配合 Web 搜索和 IDE 计划模式通常会得到更稳妥的结果。

### 5. 迁移进行中的开发工作

如果你已经创建或实现了部分用户故事（story）：

1. 完成 v6 安装
2. 将 `epics.md` 或 `epics/epic*.md` 放入 `_bmad-output/planning-artifacts/`
3. 运行 Scrum Master 的 `bmad-sprint-planning` 工作流
4. 告诉 SM 哪些史诗/故事已经完成

## 你将获得

**v6 统一结构：**

```text
your-project/
├── _bmad/               # 单一安装目录
│   ├── _config/         # 你的自定义配置
│   │   └── agents/      # 智能体自定义文件
│   ├── core/            # 通用核心框架
│   ├── bmm/             # BMad Method 模块
│   ├── bmb/             # BMad Builder
│   └── cis/             # Creative Intelligence Suite
└── _bmad-output/        # 输出目录（v4 时代常见为 doc 目录）
```

## 模块迁移

| v4 模块                       | v6 状态                                   |
| ----------------------------- | ----------------------------------------- |
| `.bmad-2d-phaser-game-dev`    | 已集成到 BMGD 模块                        |
| `.bmad-2d-unity-game-dev`     | 已集成到 BMGD 模块                        |
| `.bmad-godot-game-dev`        | 已集成到 BMGD 模块                        |
| `.bmad-infrastructure-devops` | 已弃用 — 新的 DevOps 智能体即将推出       |
| `.bmad-creative-writing`      | 未适配 — 新的 v6 模块即将推出             |

## 关键差异（旧名/新名）

| 概念 | v4（旧） | v6（新） | 迁移提示 |
| ------------ | --------------------------------------- | ------------------------------------ | ------------------------------------ |
| **核心框架** | `_bmad-core` 实际上承载的是 BMad Method | `_bmad/core/` 变成通用框架层 | 迁移时不要再把 `_bmad/core/` 当成 Method 本体 |
| **方法模块** | `_bmad-method` | `_bmad/bmm/` | 旧脚本、路径引用需同步更新到 `bmm` |
| **配置方式** | 直接改模块文件 | 每个模块通过 `config.yaml` 管理 | 优先改配置，不要直接改生成文件 |
| **文档读取** | 需要手动区分分片/非分片 | 自动扫描完整文档与分片入口 | 只有在兼容性场景下才建议手动分片 |

## 后续建议

- 升级完成后先运行 `bmad-help`，确认可用工作流与下一步建议
- 如果是既有项目，补充或更新 `project-context.md`，减少后续实现偏差
- 在继续开发前，先做一次关键链路验证（安装、命令触发、文档读取）
- 继续阅读：[如何安装 BMad](./install-bmad.md)、[管理项目上下文](./project-context.md)
