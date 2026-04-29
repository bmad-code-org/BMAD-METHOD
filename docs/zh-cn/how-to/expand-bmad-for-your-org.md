---
title: "如何为组织扩展 BMad"
description: 五个自定义方案，无需 fork 即可重塑 BMad——涵盖智能体全局规则、工作流约定、外部发布、模板替换和花名册变更
sidebar:
  order: 9
---

BMad 的自定义机制让组织无需编辑已安装文件或 fork 技能就能重塑行为。本指南介绍五个方案，覆盖大部分企业级需求。

:::note[前置条件]

- 已在项目中安装 BMad（参见[如何安装 BMad](./install-bmad.md)）
- 熟悉自定义模型（参见[如何自定义 BMad](./customize-bmad.md)）
- PATH 中有 Python 3.11+（解析器只用标准库，不需要 `pip install`）
:::

:::tip[如何应用这些方案]
下面的**逐技能方案**（方案 1–4）可以通过运行 `bmad-customize` 技能并描述意图来应用——它会选择正确的配置面、生成覆盖文件并验证合并结果。方案 5（中央配置的花名册覆盖）超出 v1 技能范围，仍需手动编写。本文档中的方案是覆盖**什么**的权威参考；`bmad-customize` 负责处理**怎么做**的部分（针对智能体/工作流层面）。
:::

## 三层心智模型

在选择方案之前，先理解你的覆盖落在哪一层：

| 层 | 覆盖文件位置 | 作用范围 |
|---|---|---|
| **智能体**（如 Amelia、Mary、John） | `_bmad/custom/bmad-agent-{role}.toml` 中的 `[agent]` 段 | 跟随人设进入**该智能体分发的每个工作流** |
| **工作流**（如 product-brief、create-prd） | `_bmad/custom/{workflow-name}.toml` 中的 `[workflow]` 段 | 仅作用于该工作流的单次运行 |
| **中央配置** | `_bmad/custom/config.toml` 中的 `[agents.*]`、`[core]`、`[modules.*]` | 花名册（party-mode、retrospective、elicitation 可用的角色）、全组织统一的安装设置 |

经验法则：如果规则应当在工程师做任何开发工作时生效，就自定义**开发智能体**。如果只在撰写产品摘要时生效，就自定义 **product-brief 工作流**。如果要改变"谁在场"（重命名智能体、添加自定义角色、统一产物路径），就编辑**中央配置**。

## 方案 1：让智能体的规则贯穿其分发的所有工作流

**场景：** 统一工具使用和外部系统集成，让智能体分发的每个工作流都继承这些行为。这是影响面最大的模式。

**示例：Amelia（开发智能体）查库文档一律用 Context7，本地 epics 列表找不到 story 时回退到 Linear。**

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

# 每次激活时加载。传递到 dev-story、quick-dev、
# create-story、code-review、qa-generate——Amelia 分发的每个技能。
persistent_facts = [
  "For any library documentation lookup (React, TypeScript, Zod, Prisma, etc.), call the context7 MCP tool (`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`) before relying on training-data knowledge. Up-to-date docs trump memorized APIs.",
  "When a story reference isn't found in {planning_artifacts}/epics-and-stories.md, search Linear via `mcp__linear__search_issues` using the story ID or title before asking the user to clarify. If Linear returns a match, treat it as the authoritative story source.",
]
```

**为什么有效：** 两句话就能重塑组织内所有开发工作流，无需逐工作流重复配置、无需改源码。每个新工程师拉下仓库就自动继承这些约定。

**团队文件 vs 个人文件：**
- `bmad-agent-dev.toml`：提交到 git，对整个团队生效
- `bmad-agent-dev.user.toml`：已 gitignore，个人偏好叠加在上面

## 方案 2：在特定工作流中强制执行组织规范

**场景：** 塑造工作流输出的*内容*，使其满足合规、审计或下游消费者的要求。

**示例：每份产品摘要都必须包含合规字段，智能体知晓组织的发布规范。**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "Every brief must include an 'Owner' field, a 'Target Release' field, and a 'Security Review Status' field.",
  "Non-commercial briefs (internal tools, research projects) must still include a user-value section, but can omit market differentiation.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

**效果：** 这些事实在工作流激活的第 3 步加载。当智能体起草摘要时，它已了解必填字段和企业规范文档。内置默认值（`file:{project-root}/**/project-context.md`）仍会加载，因为这是追加操作。

## 方案 3：将完成的产出发布到外部系统

**场景：** 工作流生成输出后，自动发布到企业级记录系统（Confluence、Notion、SharePoint）并创建后续工作项（Jira、Linear、Asana）。

**示例：摘要自动发布到 Confluence，并提供可选的 Jira Epic 创建。**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

# 终端钩子。标量覆盖会整体替换空默认值。
on_complete = """
Publish and offer follow-up:

1. Read the finalized brief file path from the prior step.
2. Call `mcp__atlassian__confluence_create_page` with:
   - space: "PRODUCT"
   - parent: "Product Briefs"
   - title: the brief's title
   - body: the brief's markdown contents
   Capture the returned page URL.
3. Tell the user: "Brief published to Confluence: <url>".
4. Ask: "Want me to open a Jira epic for this brief now?"
5. If yes, call `mcp__atlassian__jira_create_issue` with:
   - type: "Epic"
   - project: "PROD"
   - summary: the brief's title
   - description: a short summary plus a link back to the Confluence page.
   Report the epic key and URL.
6. If no, exit cleanly.

If either MCP tool fails, report the failure, print the brief path,
and ask the user to publish manually.
"""
```

**为什么用 `on_complete` 而不是 `activation_steps_append`：** `on_complete` 只在终端阶段运行一次，在工作流主输出写入之后。这是发布产物的正确时机。`activation_steps_append` 在每次激活时运行，在工作流开始之前。

**权衡：**
- **Confluence 发布是非破坏性的**，完成时始终运行
- **Jira Epic 创建对全团队可见**，会触发 Sprint 规划信号，因此需用户确认
- **优雅降级：** 如果 MCP 工具失败，交给用户手动处理，而不是静默丢弃输出

## 方案 4：替换为你自己的输出模板

**场景：** 默认输出结构不符合组织期望的格式，或同一仓库中不同团队需要不同模板。

**示例：将 product-brief 工作流指向企业自有模板。**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**原理：** 工作流自带的 `customize.toml` 中 `brief_template = "resources/brief-template.md"`（裸路径，从技能根目录解析）。你的覆盖指向 `{project-root}` 下的文件，智能体在第 4 步读取你的模板而非内置模板。

**模板编写建议：**
- 将模板放在 `{project-root}/docs/` 或 `{project-root}/_bmad/custom/templates/` 下，使它们与覆盖文件一起版本管理
- 沿用内置模板的结构约定（章节标题、frontmatter），智能体会适配实际内容
- 对于多团队仓库，使用 `.user.toml` 让各团队指向自己的模板，无需改动已提交的团队文件

## 方案 5：自定义花名册

**场景：** 改变 `bmad-party-mode`、`bmad-retrospective` 和 `bmad-advanced-elicitation` 等花名册驱动技能中*谁在场*，无需编辑源码或 fork。以下是三种常见变体。

### 5a. 在全组织范围内重塑 BMad 智能体

每个真实智能体都有一段安装器从 `module.yaml` 合成的描述符。覆盖它可以在所有花名册消费者中改变语气和定位：

```toml
# _bmad/custom/config.toml（提交到 git——对每个开发者生效）

[agents.bmad-agent-analyst]
description = "Mary the Regulatory-Aware Business Analyst — channels Porter and Minto, but lives and breathes FDA audit trails. Speaks like a forensic investigator presenting a case file."
```

Party-mode 会用新描述来生成 Mary。分析师激活流程本身不受影响，因为 Mary 的行为由她的每技能 `customize.toml` 控制。这个覆盖改变的是**外部技能如何感知和介绍她**，而不是她的内部工作方式。

### 5b. 添加虚构或自定义智能体

一段完整的描述符就足以让花名册功能识别，不需要技能目录。适合在 party mode 或头脑风暴中增加性格多样性：

```toml
# _bmad/custom/config.user.toml（个人——已 gitignore）

[agents.spock]
team = "startrek"
name = "Commander Spock"
title = "Science Officer"
icon = "🖖"
description = "Logic first, emotion suppressed. Begins observations with 'Fascinating.' Never rounds up. Counterpoint to any argument that relies on gut instinct."

[agents.mccoy]
team = "startrek"
name = "Dr. Leonard McCoy"
title = "Chief Medical Officer"
icon = "⚕️"
description = "Country doctor's warmth, short fuse. 'Dammit Jim, I'm a doctor not a ___.' Ethics-driven counterweight to Spock."
```

让 party-mode "邀请企业号船员"，它会按 `team = "startrek"` 过滤并生成 Spock 和 McCoy。真实的 BMad 智能体（Mary、Amelia）也可以同桌。

### 5c. 锁定团队安装设置

安装器会向每个开发者提示 `planning_artifacts` 路径等值。当组织需要一个统一答案时，在中央配置中锁定——任何开发者本地的提示回答都会在解析时被覆盖：

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

个人设置如 `user_name`、`communication_language` 或 `user_skill_level` 留在各开发者自己的 `_bmad/config.user.toml` 中。团队文件不应触碰这些。

**为什么用中央配置而不是逐智能体的 customize.toml：** 逐智能体文件塑造*一个*智能体激活时的行为。中央配置塑造花名册消费者*查看全局时看到的内容：*有哪些智能体、叫什么、属于哪个团队，以及整个仓库共识的安装设置。两个层面，各司其职。

## 在 IDE 会话文件中强化全局规则

BMad 的自定义在技能激活时加载。许多 IDE 工具还会在**每次会话开始时**加载一个全局指令文件，在任何技能运行之前（`CLAUDE.md`、`AGENTS.md`、`.cursor/rules/`、`.github/copilot-instructions.md` 等）。对于即使在 BMad 技能之外也应生效的规则，请在全局指令中也声明一份。

**何时需要"双重声明"：**
- 规则足够重要，即使在普通对话（没有激活技能）中也应遵守
- 你需要"双保险"，因为模型的训练数据默认值可能会拉偏方向
- 规则足够精简，重复一次不会让会话文件臃肿

**示例：在仓库的 `CLAUDE.md` 中强化方案 1 的开发智能体规则。**

```markdown
<!-- Any file-read of library docs goes through the context7 MCP tool
(`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`)
before relying on training-data knowledge. -->
```

一句话，每次会话加载。它与 `bmad-agent-dev.toml` 自定义配合，使规则在 Amelia 的工作流内和与助手的临时对话中都生效。各层各管各的范围：

| 层 | 作用范围 | 用途 |
|---|---|---|
| IDE 会话文件（`CLAUDE.md` / `AGENTS.md`） | 每次会话，在任何技能激活之前 | 简短的、应在 BMad 之外也生效的通用规则 |
| BMad 智能体自定义 | 该智能体分发的每个工作流 | 智能体人设相关的行为 |
| BMad 工作流自定义 | 单次工作流运行 | 工作流特定的输出格式、发布钩子、模板 |
| BMad 中央配置 | 花名册 + 共享安装设置 | 谁在场、团队使用的共享路径 |

IDE 会话文件要**精简**。十几行精挑细选的规则比长篇大论有效得多。模型每轮都会读取它，噪声会淹没信号。

## 组合使用

五个方案可以自由组合。一个典型的企业级 `bmad-product-brief` 覆盖可能同时设置 `persistent_facts`（方案 2）、`on_complete`（方案 3）和 `brief_template`（方案 4）。智能体级规则（方案 1）在另一个以智能体命名的文件中，中央配置（方案 5）锁定共享花名册和团队设置，四者并行生效。

```toml
# _bmad/custom/bmad-product-brief.toml（工作流级）

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml（智能体级——Mary 分发 product-brief）

[agent]
persistent_facts = ["Always include a 'Regulatory Review' section when the domain involves healthcare, finance, or children's data."]
```

效果：Mary 在人设激活时加载监管评审规则。当用户选择 product-brief 菜单项时，工作流加载自己的规范、写入企业模板，完成后发布到 Confluence。每一层各有贡献，且无一需要编辑 BMad 源码。

## 故障排查

**覆盖没有生效？** 检查文件是否在 `_bmad/custom/` 下且使用了准确的技能目录名（如 `bmad-agent-dev.toml`，而非 `bmad-dev.toml`）。参见[如何自定义 BMad](./customize-bmad.md)。

**MCP 工具名称不确定？** 使用 MCP 服务器在当前会话中暴露的准确名称。如果不确定，让 Claude Code 列出可用的 MCP 工具。在 `persistent_facts` 或 `on_complete` 中硬编码的名称，在 MCP 服务器未连接时不会生效。

**方案不适用于你的场景？** 以上方案是示例性的。底层机制（三层合并、结构化规则、智能体贯穿工作流）支持更多模式，按需组合即可。
