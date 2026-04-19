---
title: "安装自定义和社区模块"
description: 从社区注册表、Git 仓库或本地路径安装第三方模块
sidebar:
  order: 3
---

使用 BMad 安装程序从社区注册表、第三方 Git 仓库或本地文件路径添加模块。

## 何时使用

- 从 BMad 注册表安装社区贡献的模块
- 从第三方 Git 仓库安装模块（GitHub、GitLab、Bitbucket、自托管）
- 使用 BMad Builder 测试本地开发中的模块
- 从私有或自托管 Git 服务器安装模块

:::note[前置条件]
需要 [Node.js](https://nodejs.org) v20+ 和 `npx`（npm 自带）。自定义和社区模块可以在全新安装时选择，也可以添加到现有安装中。
:::

## 社区模块

社区模块收录在 [BMad 插件市场](https://github.com/bmad-code-org/bmad-plugins-marketplace)。它们按类别组织，并锁定在经过审核的 commit 上以确保安全。

### 1. 运行安装程序

```bash
npx bmad-method install
```

### 2. 浏览社区目录

选择官方模块后，安装程序会询问：

```
Would you like to browse community modules?
```

选择 **Yes** 进入目录浏览器。你可以：

- 按类别浏览
- 查看推荐模块
- 查看所有可用模块
- 按关键词搜索

### 3. 选择模块

从任意类别中选取模块。安装程序显示描述、版本和信任等级。已安装的模块会预选以便更新。

### 4. 继续安装

选择社区模块后，安装程序将继续到自定义来源，然后是工具/IDE 配置及其余安装流程。

## 自定义来源（Git URL 和本地路径）

自定义模块可以来自任何 Git 仓库或本地目录。安装程序会解析来源、分析模块结构，并将其与其他模块一起安装。

### 交互式安装

安装过程中，在社区模块步骤之后，安装程序会询问：

```
Would you like to install from a custom source (Git URL or local path)?
```

选择 **Yes**，然后提供来源：

| 输入类型 | 示例 |
| -------- | ---- |
| HTTPS URL（任意主机） | `https://github.com/org/repo` |
| 带子目录的 HTTPS URL | `https://github.com/org/repo/tree/main/my-module` |
| SSH URL | `git@github.com:org/repo.git` |
| 本地路径 | `/Users/me/projects/my-module` |
| 使用 ~ 的本地路径 | `~/projects/my-module` |

安装程序会克隆仓库（URL 来源）或直接从磁盘读取（本地路径），然后展示发现的模块供你选择。

### 非交互式安装

使用 `--custom-source` 标志从命令行安装自定义模块：

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

提供 `--custom-source` 但未指定 `--modules` 时，只安装 core 和自定义模块。要同时包含官方模块，需添加 `--modules`：

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

多个来源可用逗号分隔：

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## 模块发现机制

安装程序使用两种模式在来源中查找可安装的模块：

| 模式 | 触发条件 | 行为 |
| ---- | -------- | ---- |
| 发现模式 | 来源包含 `.claude-plugin/marketplace.json` | 列出清单中的所有插件；你选择要安装哪些 |
| 直接模式 | 未找到 marketplace.json | 扫描目录中的 skill（包含 `SKILL.md` 的子目录），作为单个模块解析 |

发现模式适用于已发布的模块。直接模式适合本地开发时指向 skills 目录。

:::note[关于 `.claude-plugin/`]
`.claude-plugin/marketplace.json` 路径是多个 AI 工具安装程序采用的标准约定，用于插件可发现性。它不依赖 Claude，不使用 Claude API，也不影响你使用哪个 AI 工具。任何包含此文件的模块都可以被遵循此约定的安装程序发现。
:::

## 本地开发工作流

如果你正在使用 [BMad Builder](https://github.com/bmad-code-org/bmad-builder) 构建模块，可以直接从工作目录安装：

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

本地来源通过路径引用，不会复制到缓存。当你更新模块源码并重新安装时，安装程序会获取最新变更。

:::caution[来源移除]
如果你在安装后删除了本地来源目录，`_bmad/` 中已安装的模块文件会保留。在恢复来源路径之前，该模块在更新时会被跳过。
:::

## 安装结果

安装后，自定义模块与官方模块一起出现在 `_bmad/` 中：

```
your-project/
├── _bmad/
│   ├── core/              # 内置核心模块
│   ├── bmm/               # 官方模块（如已选择）
│   ├── my-module/         # 你的自定义模块
│   │   ├── my-skill/
│   │   │   └── SKILL.md
│   │   └── module-help.csv
│   └── _config/
│       └── manifest.yaml  # 跟踪所有模块、版本和来源
└── ...
```

manifest 记录每个自定义模块的来源（Git 来源为 `repoUrl`，本地来源为 `localPath`），以便快速更新时能重新定位来源。

## 更新自定义模块

自定义模块参与正常的更新流程：

- **快速更新**（`--action quick-update`）：从原始来源刷新所有模块。基于 Git 的模块会重新拉取；本地模块会从来源路径重新读取。
- **完整更新**：重新运行模块选择，你可以添加或移除自定义模块。

## 创建自己的模块

使用 [BMad Builder](https://github.com/bmad-code-org/bmad-builder) 创建可供他人安装的模块：

1. 运行 `bmad-module-builder` 搭建模块结构
2. 使用各种 BMad Builder 工具添加 skill、agent 和 workflow
3. 发布到 Git 仓库或共享文件夹集合
4. 他人使用 `--custom-source <your-repo-url>` 安装

要让模块支持发现模式，请在仓库根目录包含 `.claude-plugin/marketplace.json`（这是跨工具约定，非 Claude 专属）。格式详见 [BMad Builder 文档](https://github.com/bmad-code-org/bmad-builder)。

:::tip[先在本地测试]
开发期间，使用本地路径安装模块以快速迭代，发布到 Git 仓库之前先确认一切正常。
:::
