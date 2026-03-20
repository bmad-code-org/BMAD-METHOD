---
title: "文档分片指南"
description: 将大型 Markdown 文件拆分为更小的组织化文件，以更好地管理上下文
sidebar:
  order: 9
---

如果需要将大型 Markdown 文件拆分为更小、组织良好的文件以更好地管理上下文，请使用 `shard-doc` 工具。

:::caution[已弃用]
不再推荐使用此方法，随着工作流程的更新以及大多数主要 LLM 和工具支持子进程，这很快将变得不再必要。
:::

## 何时使用

仅当你发现所选工具/模型组合无法在需要时加载和读取所有文档作为输入时，才使用此方法。

## 什么是文档分片？

文档分片根据二级标题（`## Heading`）将大型 Markdown 文件拆分为更小、组织良好的文件。

### 架构

```text
分片前：
_bmad-output/planning-artifacts/
└── PRD.md（大型 50k token 文件）

分片后：
_bmad-output/planning-artifacts/
└── prd/
    ├── index.md                    # 带有描述的目录
    ├── overview.md                 # 第 1 节
    ├── user-requirements.md        # 第 2 节
    ├── technical-requirements.md   # 第 3 节
    └── ...                         # 其他章节
```

## 步骤

### 1. 运行 Shard-Doc 工具

```bash
/bmad-shard-doc
```

### 2. 遵循交互式流程

```text
智能体：您想要分片哪个文档？
用户：docs/PRD.md

智能体：默认目标位置：docs/prd/
       接受默认值？[y/n]
用户：y

智能体：正在分片 PRD.md...
       ✓ 已创建 12 个章节文件
       ✓ 已生成 index.md
       ✓ 完成！
```

## 工作流程发现机制

BMad 工作流程使用**双重发现系统**：

1. **首先尝试完整文档** - 查找 `document-name.md`
2. **检查分片版本** - 查找 `document-name/index.md`
3. **优先级规则** - 如果两者都存在，完整文档优先 - 如果希望使用分片版本，请删除完整文档

## 工作流程支持

所有 BMM 工作流程都支持这两种格式：

- 完整文档
- 分片文档
- 自动检测
- 对用户透明

---
## 术语说明

- **sharding**：分片。将大型文档或数据集拆分为更小、更易管理的部分的过程。
- **token**：令牌。在自然语言处理和大型语言模型中，文本的基本单位，通常对应单词或字符的一部分。
- **subprocesses**：子进程。由主进程创建的独立执行单元，可以并行运行以执行特定任务。
- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
