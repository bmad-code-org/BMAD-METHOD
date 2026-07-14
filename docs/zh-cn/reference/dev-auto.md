---
title: 自主开发循环
description: 以 bmad-dev-auto 作为单次迭代 worker，运行无人值守 BMad 开发循环的参考说明
sidebar:
  order: 7
---

要在自主开发循环里使用 BMad，请用 `bmad-dev-auto` skill。它类似 [Quick Dev](../explanation/quick-dev.md)，但设计为在无人交互的情况下持续推进。你可以在交互式会话里用它，主要用途是被 orchestrator 调用。

## 它做什么

`bmad-dev-auto` 执行一次无人值守的开发循环迭代：

1. 澄清传入 intent
2. 创建（或找到并恢复）spec 文件
3. 实现变更
4. 审查结果
5. 结束时把终端 status 写入 spec 文件或 fallback result artifact

## 前置条件

该 skill 依赖运行 subagent 的能力。若 subagent 不可用，workflow 会以 `blocked` 和 `no subagents`  halt。若你在 subagent 会话里调用 skill 本身（例如「嘿 Claude，用 bmad-dev-auto skill 跑 story 2–10，每个 story 一个 subagent」），该会话需要能 spawn 自己的 subagent。

版本控制可选但强烈建议。若存在，工作区不得有 uncommitted changes。

## 输入

### 主要调用输入

主输入是 invocation prompt。`bmad-dev-auto` 把该 prompt 当作 workflow 输入，而不是 finished implementation plan。

支持的 intent 形态包括：

- 简短的自由格式变更请求
- ticket、issue 或 story 标识符
- intent 文件路径
- 本 workflow 生成的既有 spec 文件路径
- spec 文件夹 + story id，无具体 spec 文件路径（**folder+id dispatch** —— 见下文）

### 恢复输入

若调用指向 frontmatter 里 `status` 为已知值的既有 spec 文件，workflow 从该状态恢复：

| Spec status | 入口 |
| --- | --- |
| `draft` | plan |
| `ready-for-dev` | implement |
| `in-progress` | implement |
| `in-review` | review |
| `done` | 作为新的 follow-up pass 再 review |
| `blocked` | 立即 halt |

### Folder+ID Dispatch

调用 prompt 可传 spec 文件夹和 story id，而不传 spec 文件路径。任何额外 prompt 文本（例如 caller 追加的 `invoke_dev_with` 指引）作为额外 planning 上下文携带，而不是对工作的 competing 描述。

workflow 读取 `<spec-folder>/stories.yaml`，查找 `id` 匹配的条目。它只取该条目的 `title` 和 `description` —— `spec_checkpoint`、`done_checkpoint`、`invoke_dev_with` 是 dispatching caller 的字段，不会从文件本身读取。

然后检查 `<spec-folder>/stories/<story-id>-*.md`（id 前缀匹配），区分首次 dispatch 与 resume：

| 磁盘匹配 | 结果 |
| --- | --- |
| 无 | 首次 dispatch。要求 `<spec-folder>/SPEC.md` 存在（否则 halt `blocked` / `no epic spec found`）。加载 `SPEC.md` 及其 companion，然后进入 planning。 |
| 恰好一个 | Resume：按该文件 `status` 路由，与 Resume Input 表相同。此处 `blocked` 报告 blocking condition `story already blocked`，不是 `blocked spec supplied` —— dev-auto 通过 id 发现文件，caller 没有 handed blocked spec。缺失或无法识别的 `status` 则 halt `blocked` / `unrecognized status in existing story file`。 |
| 多于一个 | Halt `blocked` / `ambiguous story file match`。 |

`blocked` story 文件是永久的：该 id 的后续 dispatch 都会 halt `story already blocked`，即使原因已修复。要重试，删除 story 文件 —— id 会读作 pending，下次 dispatch 从头开始。

只要 planning 运行 —— 首次 dispatch，或中断 planning（`draft`）的 resume —— workflow 还会加载 `<spec-folder>/stories/*.md` 的每个其他匹配文件，把各自的 Code Map、Design Notes、Spec Change Log、Tasks & Acceptance checklist 状态和 Auto Run Result 细节作为额外 planning 上下文，以便一个 story 的 planning 能看到同文件夹其他 story 已决定或产出的内容。跳过 planning 的 resume 也跳过这一步。

每次 invocation 只 dispatch 恰好一个 `stories.yaml` 条目：无论结果如何，workflow 不会读其他条目或 advance 到其他 story id。

### 上下文输入

激活时，workflow 解析：

- `_bmad/config.toml` 及其 override 层中的 BMad 配置
- `customize.toml`、团队 override、用户 override 中的 workflow 自定义
- workflow 配置中列出的 persistent facts
- 若存在的 `project-context.md` 文件

还可能查看：

- BMAD planning artifacts
- epic 工作的 cached 或新编译 epic context 文件
- 同一 epic 最近完成的 prior-story spec，以保持 continuity
- folder+id dispatch 下同 spec 文件夹的其他 `stories/*.md` 记录（见 Folder+ID Dispatch）

## Spec Status

spec frontmatter 的 `status` 是 orchestration 的主要 machine-readable 状态：

| Spec Status | 含义 |
| --- | --- |
| `draft` | Spec 存在但未通过 ready-for-dev 校验 |
| `ready-for-dev` | Spec 足够完整可 implement |
| `in-progress` | Implementation 进行中 |
| `in-review` | Review/triage 进行中 |
| `done` | Workflow 成功完成 |
| `blocked` | Workflow 无法安全 unattended 继续 |

### 在 `ready-for-dev` 时

`ready-for-dev` 通常是 workflow 直通 implement 的 resume 状态。当 invocation prompt 指示 planning 后 halt 时，它成为真正的 halt 结果：spec 通过 READY FOR DEVELOPMENT gate 后，workflow 设 status `ready-for-dev` 并停在那里，而不是继续 implement。重新 dispatch 同一 spec（或同一 spec 文件夹和 story id）会经上述路由在 implement resume。

### 在 `done` 时

成功完成时，workflow 写入或更新 spec，包含：

- 最终 `status: done`
- 含以下内容的 `Auto Run Result` 节：
  - 已实现变更摘要
  - 变更文件
  - Review findings  breakdown
  - 已执行 verification
  - Residual risks
- `followup_review_recommended` 标志。若 LLM 认为值得再 review 一轮则为 true。只是建议，非必须。最简单的二次 review 是重新运行 skill 并指向 spec 文件。
- `baseline_revision` 和 `final_revision` —— implement 前与最终 commit 的 HEAD。一起 bracket 本次 run 的 commits：`git log baseline_revision..final_revision` 列出它产出的内容；相等表示无 commit。无版本控制时两者均为 `NO_VCS`。

若有版本控制，workflow 会 commit 变更，不 push。

### 在 `blocked` 时

blocked 完成时，workflow 写入：

- 若 spec 存在则最终 `status: blocked`
- Blocking condition
- Spec 或 fallback result artifact 中的 supporting detail

典型 blocking conditions 包括：

- `unclear intent`
- `intent gap`
- `no subagents`
- `missing spec_file before implementation`
- `implementation verification failed`
- `review repair loop exceeded 5 iterations (non-convergence)`
- `blocked spec supplied`（直接调用的 spec 文件已有 `status: blocked`）
- `no stories.yaml found`
- `story id not found in stories.yaml`
- `no epic spec found`
- `ambiguous story file match`
- `unrecognized status in existing story file`
- `story already blocked`（仅 folder+id dispatch —— 与上文 `blocked spec supplied` 对比）

`intent gap` 表示 captured intent 无法回答 run 碰到的问题 —— 可在 planning step（尚无任何代码）或 review step halt。review 因此 halt 时，working tree 照常 revert，但 attempted change 先保存为 `{implementation_artifacts}` 中的 patch 文件，从 spec triage log 和 halt 输出引用。patch 展示 run 对 intent 的哪种 reading 被 implement —— 修复 intent 的具体证据。若 attempted reading 其实正确，可 `git apply` patch 并把 spec status 设为 `in-review`，在该基础上 resume review，而不是从头重跑。

## 输出 Artifacts

workflow 总是尽量留下 durable artifact 描述发生了什么。

### 主 Spec Artifact

对新工作，workflow 创建：

`{implementation_artifacts}/spec-<slug>.md`

该 spec 是 planning、implementation 和 review 之间的 contract，包含：

- Frontmatter status
- 不可变的 `<intent-contract>` 块
- Code map
- Tasks 和 acceptance criteria
- Spec change log
- Review triage log
- Verification notes

### Story Spec Artifact（Folder+ID Dispatch）

folder+id dispatch 下，workflow 写入 `<spec-folder>/stories/<story-id>-<slug>.md`，而不是 primary spec 或 fallback result 路径 —— 包括 planning 开始前的 halt。此模式下不使用下文 fallback result artifact。

halt 发生在尚无法从 story title  derive slug 时，write-back 回退到固定 slug segment：

| 情况 | 使用的 slug segment |
| --- | --- |
| `stories.yaml` 缺失/无法解析，或无条目匹配 story id | `unresolved` |
| 多于一个磁盘文件已匹配 `<story-id>-*.md` | `ambiguous` |
| 条目已 resolve 且无磁盘歧义 | 从 `title` derive slug（必要时加 `description`） |

若 resolved 路径已存在，workflow 更新其 `status` frontmatter 并在 `## Auto Run Result` 下追加 result detail，与 primary spec artifact 相同。若不存在，workflow 创建 skeletal story spec：frontmatter status、标题（条目的 title，或无法 resolve/磁盘匹配 ambiguous 时为 `Story <story_id>`）、`## Auto Run Result` 节。

### Fallback Result Artifact

workflow 在尚无 valid `spec_file` 时 halt（folder+id dispatch 外 —— 见上），写入：

`{implementation_artifacts}/bmad-dev-auto-result-<slug-or-timestamp>.md`

记录 terminal status 和 blocking condition。

### 其他 Artifacts

视路由，workflow 还可能写入：

- `{implementation_artifacts}/epic-<N>-context.md`
- `{implementation_artifacts}/deferred-work.md`
- review step 因 `intent gap` halt 时保存 attempted change 的 patch 文件（路径记录在 spec triage log）

## Orchestrator 职责

集成 `bmad-dev-auto` 的 orchestrator 应：

- 一次传一个 coherent intent
- Resume 时优先传 spec 路径 —— 或 folder+id dispatch 下同一 spec 文件夹和 story id
- 监控产出的 spec 文件、story spec artifact 或 fallback result 文件的 terminal state
- 读 `status`、`blocking condition`、`followup_review_recommended`，不要只从 chat 输出推断成功
- 用 `baseline_revision..final_revision` 识别 run 产出的 commits，不要从 git state 推断
- 预期 autonomous 文件变更和可能的 local commit
- 把 `blocked` 当作 routing signal，而不只是 failure signal

实践中，`blocked` 通常表示 workflow 碰到 unattended 执行会不安全的局面。这往往是更高层 orchestrator、其他 workflow 或人工接手的节点。

解决 blocked run 后，orchestrator 通常应启动新的 `bmad-dev-auto` run。若要复用 prior work，应传 explicit known-good spec 路径，而不是依赖 implicit discovery。
