---
title: "Documentation Style Guide"
description: 基于 Google 文档风格与 Diataxis 的项目文档规范
---

本项目遵循 [Google Developer Documentation Style Guide](https://developers.google.com/style)，并使用 [Diataxis](https://diataxis.fr/) 组织文档。以下仅补充项目级约束。

## 项目特定规则

| 规则 | 规范 |
| --- | --- |
| 禁用水平分割线（`---`） | 会打断阅读流 |
| 禁用 `####` 标题 | 用加粗短句或 admonition 替代 |
| 避免 “Related/Next” 章节 | 交给侧边栏导航 |
| 避免深层嵌套列表 | 拆成新段落或新小节 |
| 非代码内容不要放代码块 | 对话/提示用 admonition |
| 不用整段粗体做提醒 | 统一用 admonition |
| 每节 1-2 个 admonition | 教程大节可放宽到 3-4 个 |
| 表格单元格/列表项 | 控制在 1-2 句 |
| 标题预算 | 每篇约 8-12 个 `##`，每节 2-3 个 `###` |

## 提示块（Starlight 语法）

```md
:::tip[Title]
Shortcuts, best practices
:::

:::note[Title]
Context, definitions, examples, prerequisites
:::

:::caution[Title]
Caveats, potential issues
:::

:::danger[Title]
Critical warnings only — data loss, security issues
:::
```

### 标准用途

| 提示块 | 适用场景 |
| --- | --- |
| `:::note[Prerequisites]` | 开始前依赖与前置条件 |
| `:::tip[Quick Path]` | 文档顶部 TL;DR |
| `:::caution[Important]` | 关键风险提醒 |
| `:::note[Example]` | 命令/响应示例说明 |

## 标准表格模板

**阶段（Phases）：**

```md
| Phase | Name     | What Happens                                 |
| ----- | -------- | -------------------------------------------- |
| 1     | Analysis | Brainstorm, research *(optional)*            |
| 2     | Planning | Requirements — PRD or spec *(required)* |
```

**技能（Skills）：**

```md
| Skill                | Agent   | Purpose                              |
| -------------------- | ------- | ------------------------------------ |
| `bmad-brainstorming` | Analyst | Brainstorm a new project             |
| `bmad-create-prd`    | PM      | Create Product Requirements Document |
```

## 文件结构块（Folder Structure）

用于 “What You've Accomplished” 类章节：

````md
```
your-project/
├── _bmad/                                   # BMad configuration
├── _bmad-output/
│   ├── planning-artifacts/
│   │   └── PRD.md                           # Your requirements document
│   ├── implementation-artifacts/
│   └── project-context.md                   # Implementation rules (optional)
└── ...
```
````

## 教程（Tutorial）结构

```text
1. Title + Hook（1-2 句结果导向开场）
2. Version/Module Notice（可选，信息或警告提示块）
3. What You'll Learn（结果清单）
4. Prerequisites（前置条件提示块）
5. Quick Path（TL;DR 提示块）
6. Understanding [Topic]（步骤前的背景说明，可配表格）
7. Installation（可选）
8. Step 1: [First Major Task]
9. Step 2: [Second Major Task]
10. Step 3: [Third Major Task]
11. What You've Accomplished（总结 + 文件结构）
12. Quick Reference（skills 表）
13. Common Questions（FAQ）
14. Getting Help（社区入口）
15. Key Takeaways（末尾 tip 提示块）
```

### 教程检查清单

- [ ] Hook 用 1-2 句明确结果
- [ ] 包含 “What You'll Learn”
- [ ] 前置条件放在 admonition
- [ ] 顶部有 Quick Path TL;DR
- [ ] 关键信息用 phases/skills/agents 表格
- [ ] 包含 “What You've Accomplished”
- [ ] 包含 Quick Reference 表
- [ ] 包含 Common Questions
- [ ] 包含 Getting Help
- [ ] 末尾包含 Key Takeaways 提示块

## How-to 结构

```text
1. Title + Hook（单句，形如 "Use the `X` workflow to..."）
2. When to Use This（3-5 条场景）
3. When to Skip This（可选）
4. Prerequisites（note 提示块）
5. Steps（编号 `###` 动词开头）
6. What You Get（产出物说明）
7. Example（可选）
8. Tips（可选）
9. Next Steps（可选）
```

### How-to 检查清单

- [ ] Hook 以 “Use the `X` workflow to...” 开头
- [ ] “When to Use This” 有 3-5 条场景
- [ ] 明确前置条件
- [ ] 步骤为编号 `###` 子标题且动词开头
- [ ] “What You Get” 明确产出物

## Explanation 结构

### 类型

| 类型 | 示例 |
| --- | --- |
| **Index/Landing** | `core-concepts/index.md` |
| **Concept** | `what-are-agents.md` |
| **Feature** | `quick-dev.md` |
| **Philosophy** | `why-solutioning-matters.md` |
| **FAQ** | `established-projects-faq.md` |

### 通用模板

```text
1. Title + Hook（1-2 句）
2. Overview/Definition（是什么，为什么重要）
3. Key Concepts（`###` 小节）
4. Comparison Table（可选）
5. When to Use / When Not to Use（可选）
6. Diagram（可选，单文档最多 1 个 mermaid）
7. Next Steps（可选）
```

### Index/Landing 页面

```text
1. Title + Hook（单句）
2. Content Table（链接 + 描述）
3. Getting Started（编号步骤）
4. Choose Your Path（可选，决策树）
```

### 概念解释页（Concept）

```text
1. Title + Hook（定义性开场）
2. Types/Categories（可选，`###`）
3. Key Differences Table
4. Components/Parts
5. Which Should You Use?
6. Creating/Customizing（指向 how-to）
```

### 功能解释页（Feature）

```text
1. Title + Hook（功能作用）
2. Quick Facts（可选）
3. When to Use / When Not to Use
4. How It Works（可选 mermaid）
5. Key Benefits
6. Comparison Table（可选）
7. When to Graduate/Upgrade（可选）
```

### 原理/哲学页（Philosophy）

```text
1. Title + Hook（核心原则）
2. The Problem
3. The Solution
4. Key Principles（`###`）
5. Benefits
6. When This Applies
```

### Explanation 检查清单

- [ ] Hook 清楚说明“本文解释什么”
- [ ] 内容分布在可扫读的 `##` 区块
- [ ] 3 个以上选项时使用对比表
- [ ] 图示有清晰标签
- [ ] 程序性问题链接到 how-to
- [ ] 每篇控制在 2-3 个 admonition

## Reference 结构

### 类型

| 类型 | 示例 |
| --- | --- |
| **Index/Landing** | `workflows/index.md` |
| **Catalog** | `agents/index.md` |
| **Deep-Dive** | `document-project.md` |
| **Configuration** | `core-tasks.md` |
| **Glossary** | `glossary/index.md` |
| **Comprehensive** | `bmgd-workflows.md` |

### Reference 索引页

```text
1. Title + Hook（单句）
2. Content Sections（每类一个 `##`）
   - 链接 + 简短描述
```

### Catalog 参考页

```text
1. Title + Hook
2. Items（每项一个 `##`）
   - 单句说明
   - **Skills:** 或 **Key Info:** 平铺列表
3. Universal/Shared（可选）
```

### Deep-Dive 参考页

```text
1. Title + Hook（单句说明用途）
2. Quick Facts（可选 note 提示块）
   - Module, Skill, Input, Output
3. Purpose/Overview（`##`）
4. How to Invoke（代码块）
5. Key Sections（每个方面一个 `##`）
   - 子选项使用 `###`
6. Notes/Caveats（tip/caution）
```

### Configuration 参考页

```text
1. Title + Hook
2. Table of Contents（可选，4 项以上建议）
3. Items（每项一个 `##`）
   - **Bold summary**（单句）
   - **Use it when:** 场景列表
   - **How it works:** 3-5 步
   - **Output:**（可选）
```

### 综合参考页（Comprehensive）

```text
1. Title + Hook
2. Overview（`##`）
   - 用图或表解释组织方式
3. Major Sections（每个阶段/类别一个 `##`）
   - Items（每项 `###`）
   - 统一字段：Skill, Agent, Input, Output, Description
4. Next Steps（可选）
```

### Reference 检查清单

- [ ] Hook 说明“本文引用什么”
- [ ] 结构匹配参考页类型
- [ ] 条目结构前后一致
- [ ] 结构化信息优先表格表达
- [ ] 概念深度指向 explanation 页面
- [ ] 每篇 1-2 个 admonition

## Glossary 结构

Starlight 右侧 “On this page” 来自标题层级：

- 分类使用 `##`（会进入右侧导航）
- 术语放在表格行中（不要给每个术语单独标题）
- 不要再写内联 TOC

### 表格模板

```md
## Category Name

| Term         | Definition                                                                               |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Agent**    | Specialized AI persona with specific expertise that guides users through workflows.      |
| **Workflow** | Multi-step guided process that orchestrates AI agent activities to produce deliverables. |
```

### 定义规则

| 推荐 | 避免 |
| --- | --- |
| 直接写“它是什么/做什么” | 以 “This is...” 或 “A [term] is...” 开头 |
| 控制在 1-2 句 | 多段长解释 |
| 术语名称加粗 | 术语用普通文本 |

### 语境标记（Context Markers）

在定义开头用斜体标记适用范围：

- `*Quick Flow only.*`
- `*BMad Method/Enterprise.*`
- `*Phase N.*`
- `*BMGD.*`
- `*Established projects.*`

### Glossary 检查清单

- [ ] 术语以表格维护，不用独立标题
- [ ] 同分类内按字母序排序
- [ ] 定义控制在 1-2 句
- [ ] 语境标记使用斜体
- [ ] 术语名称在单元格中加粗
- [ ] 避免 “A [term] is...” 句式

## FAQ 章节模板

```md
## Questions

- [Do I always need architecture?](#do-i-always-need-architecture)
- [Can I change my plan later?](#can-i-change-my-plan-later)

### Do I always need architecture?

Only for BMad Method and Enterprise tracks. Quick Flow skips to implementation.

### Can I change my plan later?

Yes. The SM agent has a `bmad-correct-course` workflow for handling scope changes.

**Have a question not answered here?** [Open an issue](...) or ask in [Discord](...).
```

## 校验命令

提交文档改动前，建议执行：

```bash
npm run docs:fix-links            # 预览链接修复结果
npm run docs:fix-links -- --write # 写回链接修复
npm run docs:validate-links       # 校验链接是否存在
npm run docs:build                # 校验站点构建
```
