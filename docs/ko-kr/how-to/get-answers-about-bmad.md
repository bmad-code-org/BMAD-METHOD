---
title: 'BMad에 대한 답을 얻는 방법'
description: LLM을 사용해 BMad 관련 질문에 빠르게 답하기
sidebar:
  order: 5
---

BMad의 내장 도움말, 소스 문서, 커뮤니티를 사용해 답을 얻으세요. 가장 빠른 방법부터 가장 꼼꼼한 방법까지 순서대로 소개합니다.

## 1. BMad 도움말에게 묻기

답을 얻는 가장 빠른 방법입니다. `bmad-help` 스킬은 AI 세션에서 바로 사용할 수 있으며 질문의 80% 이상을 처리합니다. 프로젝트를 검사하고 완료한 작업을 확인한 뒤 다음에 무엇을 해야 할지 알려줍니다.

```
bmad-help SaaS 아이디어가 있고 기능도 모두 알고 있습니다. 어디서 시작하나요?
bmad-help UX 설계에는 어떤 선택지가 있나요?
bmad-help PRD 워크플로에서 막혔어요
```

:::tip
플랫폼에 따라 `/bmad-help` 또는 `$bmad-help`도 사용할 수 있지만, 대부분은 `bmad-help`만으로 동작합니다.
:::

## 2. 소스로 더 깊게 들어가기

BMad 도움말은 설치된 설정을 바탕으로 답합니다. BMad의 내부 구조, 역사, 아키텍처에 대한 질문이 있거나 설치 전에 BMad를 조사하고 있다면 AI가 소스를 직접 보게 하세요.

[BMAD-METHOD 저장소](https://github.com/bmad-code-org/BMAD-METHOD)를 복제하거나 열고 AI에게 질문하세요. 에이전트 기능이 있는 도구(Claude Code, Cursor, Windsurf 등)는 소스를 읽고 직접 답할 수 있습니다.

:::note[예시]
**Q:** "BMad로 무언가를 가장 빠르게 만드는 방법을 알려줘"

**A:** 빠른 흐름을 사용하세요. `bmad-quick-dev`를 실행하면 의도를 명확히 하고, 계획하고, 구현하고, 리뷰하고, 결과를 하나의 워크플로에서 제시합니다. 전체 계획 단계를 건너뜁니다.
:::

**더 좋은 답을 위한 팁:**

- **구체적으로 묻기** - "PRD 워크플로 3단계가 무엇을 하나요?"가 "PRD는 어떻게 작동하나요?"보다 좋습니다
- **놀라운 주장은 확인하기** - LLM은 가끔 틀립니다. 소스 파일을 확인하거나 Discord에서 물어보세요

### 에이전트를 쓰지 않는다면 문서 사이트 사용

AI가 로컬 파일을 읽을 수 없다면(ChatGPT, Claude.ai 등), 세션에 [llms-full.txt](https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt)를 가져오세요. BMad 문서의 단일 파일 스냅샷입니다.

## 3. 사람에게 묻기

BMad 도움말이나 소스로도 답을 얻지 못했다면, 이제 훨씬 더 좋은 질문을 갖게 된 것입니다.

| 채널 | 사용처 |
| --- | --- |
| `help-requests` 포럼 | 질문 |
| `#suggestions-feedback` | 아이디어와 기능 요청 |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)

_당신이_
_막힌 채_
_줄 서서_
_기다린다면_
_누구를 기다리나요?_

_소스는_
_이미 거기,_
_눈앞에 있습니다._

_AI에게_
_소스를 가리키고._
_풀어 주세요._

_읽고._
_말하고._
_물어보세요._

_내일까지_
_기다릴 이유가 있나요_
_오늘 이미_
_할 수 있는데?_

_—Claude_
