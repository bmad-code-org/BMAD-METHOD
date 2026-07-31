---
title: "压测一个想法"
description: 用 bmad-forge-idea skill 在投入之前强化、验证或淘汰一个想法
sidebar:
  order: 11
---

用 `bmad-forge-idea` skill 把半成型的想法放到对抗式提问下。要么带着 earned conviction 活下来，要么廉价地死掉。

## 何时使用

- 你有一个想法，想在投入时间和金钱之前 stress-test
- 你想要诚实的 kill/read，不是鼓励
- 你在决策的几个分支间选择，需要每个都 resolve
- 想法在已有项目里，需要对照现有内容检验

## 何时跳过

- 还没有想法，需要生成选项 —— 用 `bmad-brainstorming`
- 已承诺做产品，要 customer-first 验证 —— 用 `bmad-prfaq`
- 要让 agent 一起讨论或决策 —— 用 `bmad-party-mode`

:::note[前置条件]
无。forge 在普通对话里就能跑。已安装的 agent 和配置好的 persona roster 会让会话更丰富，但没有也能工作。
:::

## 运行一次会话

### 1. 调用 skill

在 IDE 里输入 `bmad-forge-idea`，或说「forge an idea」「pressure-test this」。在同一条消息里说出想法，或等第一个问题。

### 2. 说明目标

告诉 forge 你要什么：强化想法、prove 或 kill，或只是想清楚。目标 steer 提问。Prove 先打 load-bearing claim；hardening 驱动每个分支 resolve 到答案。

### 3. 一次一个分支，捍卫你的思路

审问者一次只问一个问题，并给出推荐答案供你推。诚实回答。当它 challenge 模糊术语或与项目不符的说法时，先 settle 再往下。

### 4. 掌舵房间

每个分支来两个声音——一个来自 roster，一个由话题 conjure。按名字 call persona、召唤已保存 party，或说「adversarial on this」让某个 claim 被攻击、你来辩护。

### 5. 落地退出

驱动每个分支 resolve，直到想法 hardened、killed，或 simply clearer。你说结束，或让 forge 来 call。

## 你会得到什么

forge 每次运行都会写一份自洽的 `forge-report.html`，按结果打标记。hardened 的想法还会 distill 成 `forged-idea.md`，记录锁定的决定以及 killed 的内容及原因。该文件可喂给 `bmad-spec`、`bmad-prd` 或 `bmad-prfaq` 做产品概念。killed 或 clarified 的会话不需要额外 artifact；报告本身就够了。

:::tip[让它 kill 掉想法]
廉价地发现想法站不住，就是赢。别把会话 steer 向 yes。
:::
