---
title: "如何自定义 BMad"
description: 自定义智能体、工作流和模块，同时保持更新兼容性
sidebar:
  order: 7
---

使用 `.customize.yaml` 文件来调整智能体行为、角色和菜单，同时在更新过程中保留您的更改。

## 何时使用此功能

- 您想要更改智能体的名称、个性或沟通风格
- 您需要智能体记住项目特定的上下文
- 您想要添加自定义菜单项来触发您自己的工作流或提示
- 您希望智能体在每次启动时执行特定操作

:::note[前置条件]
- 在项目中安装了 BMad（参见[如何安装 BMad](./install-bmad.md)）
- 用于编辑 YAML 文件的文本编辑器
:::

:::caution[保护您的自定义配置]
始终使用此处描述的 `.customize.yaml` 文件，而不是直接编辑智能体文件。安装程序在更新期间会覆盖智能体文件，但会保留您的 `.customize.yaml` 更改。
:::

## 步骤

### 1. 定位自定义文件

安装后，在以下位置为每个智能体找到一个 `.customize.yaml` 文件：

```text
_bmad/_config/agents/
├── core-bmad-master.customize.yaml
├── bmm-dev.customize.yaml
├── bmm-pm.customize.yaml
└── ...（每个已安装的智能体一个文件）
```

### 2. 编辑自定义文件

打开您想要修改的智能体的 `.customize.yaml` 文件。每个部分都是可选的——只自定义您需要的内容。

| 部分               | 行为     | 用途                                           |
| ------------------ | -------- | ---------------------------------------------- |
| `agent.metadata`   | 替换     | 覆盖智能体的显示名称                           |
| `persona`          | 替换     | 设置角色、身份、风格和原则                     |
| `memories`         | 追加     | 添加智能体始终会记住的持久上下文               |
| `menu`             | 追加     | 为工作流或提示添加自定义菜单项                 |
| `critical_actions` | 追加     | 定义智能体的启动指令                           |
| `prompts`          | 追加     | 创建可重复使用的提示供菜单操作使用             |

标记为 **替换** 的部分会完全覆盖智能体的默认设置。标记为 **追加** 的部分会添加到现有配置中。

**智能体名称**

更改智能体的自我介绍方式：

```yaml
agent:
  metadata:
    name: 'Spongebob' # 默认值："Amelia"
```

**角色**

替换智能体的个性、角色和沟通风格：

```yaml
persona:
  role: 'Senior Full-Stack Engineer'
  identity: 'Lives in a pineapple (under the sea)'
  communication_style: 'Spongebob annoying'
  principles:
    - 'Never Nester, Spongebob Devs hate nesting more than 2 levels deep'
    - 'Favor composition over inheritance'
```

`persona` 部分会替换整个默认角色，因此如果您设置它，请包含所有四个字段。

**记忆**

添加智能体将始终记住的持久上下文：

```yaml
memories:
  - 'Works at Krusty Krab'
  - 'Favorite Celebrity: David Hasslehoff'
  - 'Learned in Epic 1 that it is not cool to just pretend that tests have passed'
```

**菜单项**

向智能体的显示菜单添加自定义条目。每个条目需要一个 `trigger`、一个目标（`workflow` 路径或 `action` 引用）和一个 `description`：

```yaml
menu:
  - trigger: my-workflow
    workflow: 'my-custom/workflows/my-workflow.yaml'
    description: My custom workflow
  - trigger: deploy
    action: '#deploy-prompt'
    description: Deploy to production
```

**关键操作**

定义智能体启动时运行的指令：

```yaml
critical_actions:
  - 'Check the CI Pipelines with the XYZ Skill and alert user on wake if anything is urgently needing attention'
```

**自定义提示**

创建可重复使用的提示，菜单项可以通过 `action="#id"` 引用：

```yaml
prompts:
  - id: deploy-prompt
    content: |
      Deploy the current branch to production:
      1. Run all tests
      2. Build the project
      3. Execute deployment script
```

### 3. 应用您的更改

编辑后，重新编译智能体以应用更改：

```bash
npx bmad-method install
```

安装程序会检测现有安装并提供以下选项：

| Option                       | What It Does                                                        |
| ---------------------------- | ------------------------------------------------------------------- |
| **Quick Update**             | 将所有模块更新到最新版本并重新编译所有智能体                 |
| **Recompile Agents**         | 仅应用自定义配置，不更新模块文件                             |
| **Modify BMad Installation** | 用于添加或删除模块的完整安装流程                             |

对于仅自定义配置的更改，**Recompile Agents** 是最快的选项。

## 故障排除

**更改未生效？**

- 运行 `npx bmad-method install` 并选择 **Recompile Agents** 以应用更改
- 检查您的 YAML 语法是否有效（缩进很重要）
- 验证您编辑的是该智能体正确的 `.customize.yaml` 文件

**智能体无法加载？**

- 使用在线 YAML 验证器检查 YAML 语法错误
- 确保在取消注释后没有留下空字段
- 尝试恢复到原始模板并重新构建

**需要重置智能体？**

- 清空或删除智能体的 `.customize.yaml` 文件
- 运行 `npx bmad-method install` 并选择 **Recompile Agents** 以恢复默认设置

## 工作流自定义

对现有 BMad Method 工作流和技能的自定义即将推出。

## 模块自定义

关于构建扩展模块和自定义现有模块的指南即将推出。

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **workflow**：工作流。指一系列有序的任务或步骤，用于完成特定目标。
- **persona**：角色。指智能体的身份、个性、沟通风格和行为原则的集合。
- **memory**：记忆。指智能体持久存储的上下文信息，用于在对话中保持连贯性。
- **critical action**：关键操作。指智能体启动时必须执行的指令或任务。
- **prompt**：提示。指发送给智能体的输入文本，用于引导其生成特定响应或执行特定操作。
