---
title: "智能体"
description: 默认 BMM 智能体及其菜单触发器和主要工作流
sidebar:
  order: 2
---

## 默认智能体

本页列出了随 BMad Method 安装的默认 BMM（Agile 套件）智能体，以及它们的菜单触发器和主要工作流。

## 注意事项

- 触发器是显示在每个智能体菜单中的简短菜单代码（例如 `CP`）和模糊匹配。
- 斜杠命令是单独生成的。斜杠命令列表及其定义位置请参阅[命令](./commands.md)。
- QA（Quinn）是 BMM 中的轻量级测试自动化智能体。完整的测试架构师（TEA）位于其独立模块中。

| 智能体                      | 触发                            | 主要工作流                                                                                           |
| --------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Analyst (Mary)              | `BP`, `RS`, `CB`, `DP`            | 头脑风暴项目、研究、创建简报、文档化项目                                                              |
| Product Manager (John)      | `CP`, `VP`, `EP`, `CE`, `IR`, `CC` | 创建/验证/编辑 PRD、创建史诗和用户故事、实施就绪、纠正方向                                            |
| Architect (Winston)         | `CA`, `IR`                        | 创建架构、实施就绪                                                                                   |
| Scrum Master (Bob)          | `SP`, `CS`, `ER`, `CC`            | 冲刺规划、创建用户故事、史诗回顾、纠正方向                                                           |
| Developer (Amelia)          | `DS`, `CR`                        | 开发用户故事、代码评审                                                                               |
| QA Engineer (Quinn)         | `QA`                              | 自动化（为现有功能生成测试）                                                                         |
| Quick Flow Solo Dev (Barry) | `QD`, `CR`                         | 快速开发、代码评审                                                                                   |
| UX Designer (Sally)         | `CU`                              | 创建 UX 设计                                                                                         |
| Technical Writer (Paige)    | `DP`, `WD`, `US`, `MG`, `VD`, `EC` | 文档化项目、撰写文档、更新标准、Mermaid 生成、验证文档、解释概念                                      |

---
## 术语说明

- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **BMM**：BMad Method 中的默认智能体套件，涵盖敏捷开发流程中的各类角色。
- **PRD**：产品需求文档（Product Requirements Document）。
- **Epic**：史诗。大型功能或需求集合，可拆分为多个用户故事。
- **Story**：用户故事。描述用户需求的简短陈述。
- **Sprint**：冲刺。敏捷开发中的固定时间周期迭代。
- **QA**：质量保证（Quality Assurance）。
- **TEA**：测试架构师（Test Architect）。
- **Mermaid**：一种用于生成图表和流程图的文本语法。
