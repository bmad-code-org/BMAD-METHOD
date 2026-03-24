---
title: "测试选项"
description: 内置 QA（Quinn）与 TEA 模块对比：何时用哪个、各自边界是什么
sidebar:
  order: 5
---

BMad 有两条测试路径：
- **Quinn（内置 QA）**：快速生成可运行测试
- **TEA（可选模块）**：企业级测试策略与治理能力

## 该选 Quinn 还是 TEA？

| 维度 | Quinn（内置 QA） | TEA 模块 |
| --- | --- | --- |
| 最适合 | 中小项目、快速补覆盖 | 大型项目、受监管或复杂业务 |
| 安装成本 | 无需额外安装（BMM 内置） | 需通过安装器单独选择 |
| 方法 | 先生成测试，再迭代 | 先定义策略，再执行并追溯 |
| 测试类型 | API + E2E | API、E2E、ATDD、NFR 等 |
| 风险策略 | 快乐路径 + 关键边界 | P0-P3 风险优先级 |
| workflow 数量 | 1（Automate） | 9（设计/自动化/审查/追溯等） |

:::tip[默认建议]
大多数项目先用 Quinn。只有当你需要质量门控、合规追溯或系统化测试治理时，再引入 TEA。
:::

## 内置 QA（Quinn）

Quinn 是 BMM 内置 agent，目标是用你现有测试栈快速落地测试，不要求额外配置。

**触发方式：**
- 菜单触发器：`QA`
- skill：`bmad-qa-generate-e2e-tests`

### Quinn 会做什么

Quinn 的 Automate 流程通常包含 5 步：
1. 检测现有测试框架（如 Jest、Vitest、Playwright、Cypress）
2. 确认待测功能（手动指定或自动发现）
3. 生成 API 测试（状态码、结构、主路径与错误分支）
4. 生成 E2E 测试（语义定位器 + 可见结果断言）
5. 执行并修复基础失败项

**默认风格：**
- 仅使用标准框架 API
- UI 测试优先语义定位器（角色、标签、文本）
- 测试互相独立，不依赖顺序
- 避免硬编码等待/休眠

:::note[范围边界]
Quinn 只负责“生成测试”。如需实现质量评审与故事验收，请配合代码审查 workflow（`CR` / `bmad-code-review`）。
:::

### 何时用 Quinn

- 要快速补齐某个功能的测试覆盖
- 团队希望先获得可运行基线，再逐步增强
- 项目暂不需要完整测试治理体系

## TEA（Test Architect）模块

TEA 提供专家测试 agent（Murat）与 9 个结构化 workflow，覆盖策略、执行、审查、追溯和发布门控。

**外部资源（英文）：**
- 文档: [TEA Module Docs](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- npm: [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

**安装：** `npx bmad-method install` 后选择 TEA 模块。

### TEA 的 9 个 workflow

| Workflow | 用途 |
| --- | --- |
| Test Design | 按需求建立测试策略 |
| ATDD | 基于验收标准驱动测试设计 |
| Automate | 使用高级模式生成自动化测试 |
| Test Review | 评估测试质量与覆盖完整性 |
| Traceability | 建立“需求—测试”追溯链路 |
| NFR Assessment | 评估性能/安全等非功能需求 |
| CI Setup | 配置 CI 中的测试执行 |
| Framework Scaffolding | 搭建测试工程基础结构 |
| Release Gate | 基于数据做发布/不发布决策 |

### 何时用 TEA

- 需要合规、审计或强追溯能力
- 需要跨功能做风险优先级管理
- 发布前存在明确质量门控流程
- 业务复杂，必须先建策略再写测试

## 测试放在流程的哪个位置

按 BMad workflow-map，测试位于阶段 4（实施）：

1. epic 内逐个 story：开发（`DS` / `bmad-dev-story`）+ 代码审查（`CR` / `bmad-code-review`）
2. epic 完成后：用 Quinn 或 TEA 的 Automate 统一生成/补齐测试
3. 最后执行复盘（`bmad-retrospective`）

Quinn 主要依据代码直接生成测试；TEA 可结合上游规划产物（如 PRD、architecture）实现更强追溯。

## 相关参考

- [官方模块](./modules.md)
- [工作流地图](./workflow-map.md)
- [智能体参考](./agents.md)
