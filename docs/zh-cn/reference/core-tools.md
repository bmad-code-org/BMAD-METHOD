---
title: "核心工具"
description: 每个 BMad 安装默认可用的任务与 workflow 参考。
sidebar:
  order: 2
---

核心工具是跨模块可复用的一组通用能力：不依赖特定业务项目，也不要求先进入某个智能体角色。只要安装了 BMad，你就可以直接调用它们。

:::tip[快速入口]
在 IDE 中直接输入工具 skill 名（例如 `bmad-help`）即可调用，无需先加载智能体。
:::

## 概览

| 工具 | 类型 | 主要用途 |
| --- | --- | --- |
| [`bmad-help`](#bmad-help) | Task | 基于项目上下文推荐下一步 |
| [`bmad-brainstorming`](#bmad-brainstorming) | Workflow | 引导式头脑风暴与想法扩展 |
| [`bmad-party-mode`](#bmad-party-mode) | Workflow | 多智能体协作讨论 |
| [`bmad-distillator`](#bmad-distillator) | Task | 无损压缩文档，提升 LLM 消费效率 |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Task | 通过多轮技法增强 LLM 输出 |
| [`bmad-review-adversarial-general`](#bmad-review-adversarial-general) | Task | 对抗式问题发现审查 |
| [`bmad-review-edge-case-hunter`](#bmad-review-edge-case-hunter) | Task | 边界与分支路径穷举审查 |
| [`bmad-editorial-review-prose`](#bmad-editorial-review-prose) | Task | 文案可读性与表达清晰度审查 |
| [`bmad-editorial-review-structure`](#bmad-editorial-review-structure) | Task | 文档结构裁剪、合并与重组建议 |
| [`bmad-shard-doc`](#bmad-shard-doc) | Task | 将大文档拆分为章节文件 |
| [`bmad-index-docs`](#bmad-index-docs) | Task | 为目录生成/更新文档索引 |

## bmad-help

**定位：** 你的默认导航入口，告诉你“下一步该做什么”。

**适用场景：**
- 刚完成一个 workflow，不确定如何衔接
- 新接触项目，需要先看当前进度
- 变更模块后，想知道可用能力和推荐顺序

**工作机制：**
1. 扫描已存在产物（PRD、architecture、stories 等）
2. 检测已安装模块及其可用 workflow
3. 按优先级输出“必需步骤 + 可选步骤”

**输入：** 可选自然语言问题（如 `bmad-help 我该先做 PRD 还是 architecture？`）  
**输出：** 带 skill 名称的下一步建议列表

## bmad-brainstorming

**定位：** 用结构化创意技法快速扩展想法池。

**适用场景：**
- 启动新主题，想先打开问题空间
- 团队卡在同一思路，需要外部技法打破惯性
- 需要把“模糊方向”变成可讨论候选方案

**工作机制：**
1. 建立主题会话
2. 从方法库选择创意技法
3. 逐轮引导产出并记录想法
4. 生成可追溯的会话文档

**输入：** 主题或问题陈述（可附上下文文件）  
**输出：** `brainstorming-session-{date}.md`

## bmad-party-mode

**定位：** 让多个智能体围绕同一议题协作讨论。

**适用场景：**
- 决策涉及产品、架构、实现、质量等多视角
- 希望不同角色显式冲突并暴露假设差异
- 需要在短时间内收集多方案观点

**工作机制：**
1. 读取已安装智能体清单
2. 选取最相关的 2-3 个角色先发言
3. 轮换角色、持续交叉讨论
4. 使用 `goodbye` / `end party` / `quit` 结束

**输入：** 讨论主题（可指定希望参与的角色）  
**输出：** 多智能体实时对话过程

## bmad-distillator

**定位：** 在不丢失信息前提下压缩文档，降低 token 成本。

**适用场景：**
- 源文档超过上下文窗口
- 需要把研究/规格材料转成高密度引用版本
- 想验证压缩结果是否可逆

**工作机制：**
1. 分析源文档结构与信息密度
2. 压缩为高密度结构化表达
3. 校验信息完整性
4. 可选执行往返重构验证（round-trip）

**输入：**
- `source_documents`（必填）
- `downstream_consumer`（可选）
- `token_budget`（可选）
- `--validate`（可选标志）

**输出：** 精馏文档 + 压缩比报告

## bmad-advanced-elicitation

**定位：** 对已有 LLM 输出做第二轮深挖与改写强化。

**适用场景：**
- 结果“看起来对”，但深度不够
- 想从多个思维框架交叉审视同一内容
- 在交付前提升论证质量与完整性

**工作机制：**
1. 加载启发技法库
2. 选择匹配内容的候选技法
3. 交互式选择并应用技法
4. 多轮迭代直到你确认收敛

**输入：** 待增强内容片段  
**输出：** 增强后的内容版本

## bmad-review-adversarial-general

**定位：** 假设问题存在，主动寻找遗漏与风险。

**适用场景：**
- 文档/规格/实现即将交付前
- 想补足“乐观审查”容易漏掉的问题
- 需要对关键变更做压力测试

**工作机制：**
1. 以怀疑视角检查内容
2. 从完整性、正确性、质量三个维度找问题
3. 强制关注“缺失内容”，而非仅纠错

**输入：** `content`（必填），`also_consider`（可选）  
**输出：** 结构化问题清单

## bmad-review-edge-case-hunter

**定位：** 穷举分支路径与边界条件，只报告未覆盖情况。

**适用场景：**
- 审查核心逻辑的边界健壮性
- 对 diff 做路径级覆盖检查
- 与 adversarial review 形成互补

**工作机制：**
1. 枚举所有分支路径
2. 推导边界类别（missing default、off-by-one、竞态等）
3. 检查每条路径是否已有防护
4. 仅输出未处理路径

**输入：** `content`（必填），`also_consider`（可选）  
**输出：** JSON 发现列表（含触发条件与潜在后果）

## bmad-editorial-review-prose

**定位：** 聚焦表达清晰度的文案审查，不替你改写个人风格。

**适用场景：**
- 内容可用，但读起来费劲
- 需要针对特定读者提升可理解性
- 想做“表达修复”而非“立场重写”

**工作机制：**
1. 跳过 frontmatter 与代码块读取正文
2. 标记影响理解的表达问题
3. 去重同类问题并输出修订建议

**输入：** `content`（必填），`style_guide`（可选），`reader_type`（可选）  
**输出：** 三列表（原文 / 修改后 / 说明）

## bmad-editorial-review-structure

**定位：** 处理文档结构问题：裁剪、合并、重排、精简。

**适用场景：**
- 文档是多来源拼接，结构不连贯
- 想在不丢信息前提下降低篇幅
- 重要信息被埋在低优先级段落

**工作机制：**
1. 按结构模型分析文档组织
2. 识别冗余、越界与信息埋没
3. 输出优先级建议与压缩预估

**输入：** `content`（必填），`purpose`/`target_audience`/`reader_type`/`length_target`（可选）  
**输出：** 结构建议清单 + 预计缩减量

## bmad-shard-doc

**定位：** 把超大 Markdown 文档拆成可维护章节。

**适用场景：**
- 单文件过大（常见 500+ 行）
- 需要并行编辑或分段维护
- 希望降低 LLM 读取成本

**工作机制：**
1. 校验源文件
2. 按 `##` 二级标题分片
3. 生成 `index.md` 与编号章节
4. 提示保留/归档/删除原文件

**输入：** 源文件路径（可选目标目录）  
**输出：** 分片目录（含 `index.md`）

## bmad-index-docs

**定位：** 为目录自动生成可导航文档索引。

**适用场景：**
- 文档目录持续增长，需要统一入口
- 想给 LLM 或新人快速提供全局视图
- 需要保持索引与目录同步

**工作机制：**
1. 扫描目录内非隐藏文件
2. 读取文件并提炼用途
3. 按类型/主题组织条目
4. 生成描述简洁的 `index.md`

**输入：** 目标目录路径  
**输出：** 更新后的 `index.md`

## 相关参考

- [技能（Skills）参考](./commands.md)
- [智能体参考](./agents.md)
- [工作流地图](./workflow-map.md)
