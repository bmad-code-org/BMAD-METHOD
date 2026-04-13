---
title: "技能（Skills）"
description: BMad 技能参考：它们是什么、如何生成以及如何调用。
sidebar:
  order: 3
---

每次运行 `npx bmad-method install`，BMad 会基于你选择的模块生成一组 **skills**。你可以直接输入 skill 名称调用 workflow、任务、工具或智能体角色。

## Skills 与菜单触发器的区别

| 机制 | 调用方式 | 适用场景 |
| --- | --- | --- |
| **Skill** | 直接输入 skill 名（如 `bmad-help`） | 你已明确要运行哪个功能 |
| **智能体菜单触发器** | 先加载智能体，再输入短触发码（如 `DS`） | 你在智能体会话内连续切换任务 |

菜单触发器依赖“已激活的智能体会话”；skill 可独立运行。

## Skills 如何生成

安装程序会读取已选模块，为每个 agent / workflow / task / tool 生成一个 skill 目录，目录中包含 `SKILL.md` 入口文件。

| Skill 类型 | 生成行为 |
| --- | --- |
| Agent launcher | 加载角色设定并激活菜单 |
| Workflow skill | 加载 workflow 配置并执行步骤 |
| Task skill | 执行独立任务 |
| Tool skill | 执行独立工具 |

:::note[模块变更后要重装]
当你新增、删除或切换模块后，请重新运行安装程序，避免 skill 列表与模块状态不一致。
:::

## Skill 文件位置

| IDE / CLI | Skills 目录 |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| 其他 IDE | 以安装器输出路径为准 |

示例（Claude Code）：

```text
.claude/skills/
├── bmad-help/
│   └── SKILL.md
├── bmad-create-prd/
│   └── SKILL.md
├── bmad-agent-dev/
│   └── SKILL.md
└── ...
```

skill 目录名就是调用名，例如 `bmad-agent-dev/` 对应 skill `bmad-agent-dev`。

## 如何发现可用 skills

- 在 IDE 中直接输入 `bmad-` 前缀查看补全候选
- 运行 `bmad-help` 获取基于当前项目状态的下一步建议
- 打开 skills 目录查看完整清单（这是最权威来源）

:::tip[快速定位]
不确定该跑哪个 workflow 时，先执行 `bmad-help`，通常比人工翻文档更快。
:::

## Skill 分类与示例

### 智能体技能（Agent Skills）

加载一个角色化智能体，并保持其 persona 与菜单上下文。

| 示例 skill | 角色 | 用途 |
| --- | --- | --- |
| `bmad-agent-dev` | Developer（Amelia） | 按规范实现 story |
| `bmad-pm` | Product Manager（John） | 创建与校验 PRD |
| `bmad-architect` | Architect（Winston） | 架构设计与约束定义 |

完整列表见 [智能体参考](./agents.md)。

### Workflow Skills

无需先加载 agent，直接运行结构化流程。

| 示例 skill | 用途 |
| --- | --- |
| `bmad-create-prd` | 创建 PRD |
| `bmad-create-architecture` | 创建架构方案 |
| `bmad-create-epics-and-stories` | 拆分 epics/stories |
| `bmad-dev-story` | 实现指定 story |
| `bmad-code-review` | 代码评审 |
| `bmad-quick-dev` | 快速流程（澄清→规划→实现→审查→呈现） |

按阶段查看见 [工作流地图](./workflow-map.md)。

### Task / Tool Skills

独立任务，不依赖特定智能体上下文。

**`bmad-help`** 是最常用入口：它会读取项目状态并给出“下一步建议 + 对应 skill”。

更多核心任务和工具见 [核心工具参考](./core-tools.md)。

## 命名规则

所有技能统一以 `bmad-` 开头，后接语义化名称（如 `bmad-agent-dev`、`bmad-create-prd`、`bmad-help`）。

## 故障排查

**安装后看不到 skills：** 某些 IDE 需要手动启用 skills，或重启 IDE 才会刷新。

**缺少预期 skill：** 可能模块未安装或安装时未勾选。重新运行安装程序并确认模块选择。

**已移除模块的 skills 仍存在：** 安装器不会自动清理历史目录。手动删除旧 skill 目录后再重装可获得干净结果。

## 相关参考

- [智能体参考](./agents.md)
- [核心工具参考](./core-tools.md)
- [模块参考](./modules.md)
