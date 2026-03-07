---
title: "测试选项"
description: 比较内置 QA 智能体（Quinn）与测试架构师（TEA）模块的测试自动化。
sidebar:
  order: 5
---

BMad 提供两条测试路径：用于快速生成测试的内置 QA 智能体，以及用于企业级测试策略的可安装测试架构师模块。

## 应该使用哪一个？

| 因素 | Quinn（内置 QA） | TEA 模块 |
| --- | --- | --- |
| **最适合** | 中小型项目、快速覆盖 | 大型项目、受监管或复杂领域 |
| **设置** | 无需安装——包含在 BMM 中 | 通过 `npx bmad-method install` 单独安装 |
| **方法** | 快速生成测试，稍后迭代 | 先规划，再生成并保持可追溯性 |
| **测试类型** | API 和 E2E 测试 | API、E2E、ATDD、NFR 等 |
| **策略** | 快乐路径 + 关键边界情况 | 基于风险的优先级排序（P0-P3） |
| **工作流数量** | 1（Automate） | 9（设计、ATDD、自动化、审查、可追溯性等） |

:::tip[从 Quinn 开始]
大多数项目应从 Quinn 开始。如果后续需要测试策略、质量门控或需求可追溯性，可并行安装 TEA。
:::

## 内置 QA 智能体（Quinn）

Quinn 是 BMM（敏捷套件）模块中的内置 QA 智能体。它使用项目现有的测试框架快速生成可运行的测试——无需配置或额外安装。

**触发方式：** `QA` 或 `bmad-bmm-qa-automate`

### Quinn 的功能

Quinn 运行单个工作流（Automate），包含五个步骤：

1. **检测测试框架**——扫描 `package.json` 和现有测试文件以识别框架（Jest、Vitest、Playwright、Cypress 或任何标准运行器）。如果不存在，则分析项目技术栈并推荐一个。
2. **识别功能**——询问要测试的内容或自动发现代码库中的功能。
3. **生成 API 测试**——覆盖状态码、响应结构、快乐路径和 1-2 个错误情况。
4. **生成 E2E 测试**——使用语义定位器和可见结果断言覆盖用户工作流。
5. **运行并验证**——执行生成的测试并立即修复失败。

Quinn 会生成测试摘要，保存到项目的实现产物文件夹中。

### 测试模式

生成的测试遵循"简单且可维护"的理念：

- **仅使用标准框架 API**——不使用外部工具或自定义抽象
- UI 测试使用**语义定位器**（角色、标签、文本而非 CSS 选择器）
- **独立测试**，无顺序依赖
- **无硬编码等待或休眠**
- **清晰的描述**，可作为功能文档阅读

:::note[范围]
Quinn 仅生成测试。如需代码审查和故事验证，请改用代码审查工作流（`CR`）。
:::

### 何时使用 Quinn

- 为新功能或现有功能快速实现测试覆盖
- 无需高级设置的初学者友好型测试自动化
- 任何开发者都能阅读和维护的标准测试模式
- 不需要全面测试策略的中小型项目

## 测试架构师（TEA）模块

TEA 是一个独立模块，提供专家智能体（Murat）和九个结构化工作流，用于企业级测试。它超越了测试生成，涵盖测试策略、基于风险的规划、质量门控和需求可追溯性。

- **文档：** [TEA 模块文档](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- **安装：** `npx bmad-method install` 并选择 TEA 模块
- **npm：** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

### TEA 提供的功能

| Workflow | Purpose |
| --- | --- |
| Test Design | 创建与需求关联的全面测试策略 |
| ATDD | 基于干系人标准的验收测试驱动开发 |
| Automate | 使用高级模式和工具生成测试 |
| Test Review | 根据策略验证测试质量和覆盖范围 |
| Traceability | 将测试映射回需求，用于审计和合规 |
| NFR Assessment | 评估非功能性需求（性能、安全性） |
| CI Setup | 在持续集成管道中配置测试执行 |
| Framework Scaffolding | 设置测试基础设施和项目结构 |
| Release Gate | 基于数据做出发布/不发布决策 |

TEA 还支持 P0-P3 基于风险的优先级排序，以及与 Playwright Utils 和 MCP 工具的可选集成。

### 何时使用 TEA

- 需要需求可追溯性或合规文档的项目
- 需要在多个功能间进行基于风险的测试优先级排序的团队
- 发布前具有正式质量门控的企业环境
- 在编写测试前必须规划测试策略的复杂领域
- 已超出 Quinn 单一工作流方法的项目

## 测试如何融入工作流

Quinn 的 Automate 工作流出现在 BMad 方法工作流图的第 4 阶段（实现）。典型序列：

1. 使用开发工作流（`DS`）实现一个故事
2. 使用 Quinn（`QA`）或 TEA 的 Automate 工作流生成测试
3. 使用代码审查（`CR`）验证实现

Quinn 直接从源代码工作，无需加载规划文档（PRD、架构）。TEA 工作流可以与上游规划产物集成以实现可追溯性。

有关测试在整体流程中的位置，请参阅[工作流图](./workflow-map.md)。

---
## 术语说明

- **QA (Quality Assurance)**：质量保证。确保产品或服务满足质量要求的过程。
- **E2E (End-to-End)**：端到端。测试整个系统从开始到结束的完整流程。
- **ATDD (Acceptance Test-Driven Development)**：验收测试驱动开发。在编码前先编写验收测试的开发方法。
- **NFR (Non-Functional Requirement)**：非功能性需求。描述系统如何运行而非做什么的需求，如性能、安全性等。
- **P0-P3**：优先级级别。P0 为最高优先级，P3 为最低优先级，用于基于风险的测试排序。
- **Happy path**：快乐路径。测试系统在理想条件下的正常工作流程。
- **Semantic locators**：语义定位器。使用有意义的元素属性（如角色、标签、文本）而非 CSS 选择器来定位 UI 元素。
- **Quality gates**：质量门控。在开发流程中设置的检查点，用于确保质量标准。
- **Requirements traceability**：需求可追溯性。能够追踪需求从设计到测试再到实现的完整链路。
- **agent**：智能体。在人工智能与编程文档中，指具备自主决策或执行能力的单元。
- **CI (Continuous Integration)**：持续集成。频繁地将代码集成到主干，并自动运行测试的实践。
- **MCP (Model Context Protocol)**：模型上下文协议。用于在 AI 模型与外部工具之间通信的协议。
