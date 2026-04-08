---
title: "非交互式安装"
description: 使用命令行参数安装 BMad，适用于 CI/CD 流水线和自动化部署
sidebar:
  order: 2
---

使用命令行参数（flags）以非交互方式安装 BMad。适用于以下场景：

## 使用场景

- 自动化部署和 CI/CD 流水线
- 脚本化安装
- 跨多个项目的批量安装
- 使用已知配置的快速安装

:::note[前置条件]
需要 [Node.js](https://nodejs.org) v20+ 和 `npx`（随 npm 附带）。
:::

## 可用参数（Flags）

### 安装选项

| 参数 | 描述 | 示例 |
|------|-------------|---------|
| `--directory <path>` | 安装目录 | `--directory ~/projects/myapp` |
| `--modules <modules>` | 逗号分隔的模块 ID | `--modules bmm,bmb` |
| `--tools <tools>` | 逗号分隔的工具/IDE ID（使用 `none` 跳过） | `--tools claude-code,cursor` 或 `--tools none` |
| `--action <type>` | 对现有安装的操作：`install`（默认）、`update` 或 `quick-update` | `--action quick-update` |

### 核心配置

| 参数 | 描述 | 默认值 |
|------|-------------|---------|
| `--user-name <name>` | 智能体使用的名称 | 系统用户名 |
| `--communication-language <lang>` | 智能体通信语言 | 英语 |
| `--document-output-language <lang>` | 文档输出语言 | 英语 |
| `--output-folder <path>` | 输出文件夹路径 | _bmad-output |

### 其他选项

| 参数 | 描述 |
|------|-------------|
| `-y, --yes` | 接受所有默认值并跳过提示 |
| `-d, --debug` | 启用清单生成的调试输出 |

## 模块 ID

`--modules` 参数可用的模块 ID：

- `bmm` — BMad Method Master
- `bmb` — BMad Builder

查看 [BMad 注册表](https://github.com/bmad-code-org) 获取可用的外部模块。

## 工具/IDE ID

`--tools` 参数可用的工具 ID：

**推荐：** `claude-code`、`cursor`

运行一次 `npx bmad-method install` 交互式安装以查看完整的当前支持工具列表，或查看 [平台代码配置](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/tools/installer/ide/platform-codes.yaml)。

## 安装模式

| 模式 | 描述 | 示例 |
|------|-------------|---------|
| 完全非交互式 | 提供所有参数以跳过所有提示 | `npx bmad-method install --directory . --modules bmm --tools claude-code --yes` |
| 半交互式 | 提供部分参数；BMad 提示其余部分 | `npx bmad-method install --directory . --modules bmm` |
| 仅使用默认值 | 使用 `-y` 接受所有默认值 | `npx bmad-method install --yes` |
| 不包含工具 | 跳过工具/IDE 配置 | `npx bmad-method install --modules bmm --tools none` |

## 示例

### CI/CD 流水线安装

```bash
#!/bin/bash
# install-bmad.sh

npx bmad-method install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules bmm \
  --tools claude-code \
  --user-name "CI Bot" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output \
  --yes
```

### 更新现有安装

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action update \
  --modules bmm,bmb,custom-module
```

### 快速更新（保留设置）

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action quick-update
```

## 安装结果

- 项目中完全配置的 `_bmad/` 目录
- 为所选模块和工具配置的智能体和工作流
- 用于生成产物的 `_bmad-output/` 文件夹

## 参数校验与错误处理

BMad 会验证你提供的所有参数：

- **目录** — 必须是具有写入权限的有效路径
- **模块** — 对无效的模块 ID 发出警告（但不会失败）
- **工具** — 对无效的工具 ID 发出警告（但不会失败）
- **操作** — 必须是以下之一：`install`、`update`、`quick-update`

无效值将：
1. 显示错误并退出（对于目录等关键选项）
2. 显示警告并跳过（对于可选项目）
3. 回退到交互式提示（对于缺失的必需值）

:::tip[最佳实践]
- 为 `--directory` 使用绝对路径以避免歧义
- 在 CI/CD 流水线中使用前先在本地测试参数
- 结合 `-y` 实现真正的无人值守安装
- 如果在安装过程中遇到问题，使用 `--debug`
:::

## 故障排除

### 安装失败，提示 `Invalid directory`

- 目录路径必须存在（或其父目录必须存在）
- 您需要写入权限
- 路径必须是绝对路径或相对于当前目录的正确相对路径

### 未找到模块

- 验证模块 ID 是否正确
- 外部模块必须在注册表中可用

:::note[仍然卡住了？]
使用 `--debug` 获取详细输出，尝试交互模式定位问题，或在 <https://github.com/bmad-code-org/BMAD-METHOD/issues> 提交反馈。
:::

