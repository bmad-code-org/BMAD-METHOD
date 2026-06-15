---
title: "시작하기"
description: BMad를 설치하고 첫 프로젝트를 만듭니다
---

계획, 아키텍처, 구현을 안내하는 전문 에이전트 기반 AI 워크플로로 소프트웨어를 더 빠르게 만드세요.

## 배울 내용

- 새 프로젝트에 BMad Method를 설치하고 초기화합니다
- 다음에 무엇을 해야 할지 아는 지능형 안내자 **BMad 도움말**을 사용합니다
- 프로젝트 규모에 맞는 계획 트랙을 선택합니다
- 요구사항부터 작동하는 코드까지 단계별로 진행합니다
- 에이전트와 워크플로를 효과적으로 사용합니다

:::note[필수 조건]
- **Node.js 20+** - 설치 프로그램에 필요합니다
- **Git** - 버전 관리를 위해 권장합니다
- **AI 기반 IDE** - Claude Code, Cursor 또는 유사 도구
- **프로젝트 아이디어** - 학습용이라면 단순한 아이디어도 충분합니다
:::

:::tip[가장 쉬운 경로]
**설치** → `npx bmad-method install`
**질문** → `bmad-help 먼저 무엇을 해야 하나요?`
**빌드** → BMad 도움말의 안내에 따라 워크플로를 진행하세요
:::

## BMad 도움말 만나기: 지능형 안내자

**BMad 도움말은 BMad를 시작하는 가장 빠른 방법입니다.** 워크플로나 단계를 외울 필요가 없습니다. 그냥 물어보면 BMad 도움말이 다음을 수행합니다.

- **프로젝트를 검사**해 이미 완료된 작업을 확인합니다
- 설치된 모듈을 기준으로 **선택지를 보여줍니다**
- 첫 필수 작업을 포함해 **다음 단계를 추천합니다**
- "SaaS 아이디어가 있는데 어디서 시작하지?" 같은 **질문에 답합니다**

### BMad 도움말 사용 방법

AI IDE에서 스킬을 호출해 실행합니다.

```
bmad-help
```

컨텍스트가 있는 안내를 받으려면 질문과 함께 사용할 수도 있습니다.

```
bmad-help SaaS 제품 아이디어가 있고 원하는 기능도 모두 알고 있습니다. 어디서 시작하면 좋나요?
```

BMad 도움말은 다음을 답합니다.

- 현재 상황에 권장되는 선택지
- 첫 번째 필수 작업
- 나머지 과정의 모습

### 워크플로 끝에서도 동작합니다

BMad 도움말은 질문에 답하기만 하지 않습니다. **모든 워크플로 끝에서 자동으로 실행되어** 다음에 무엇을 해야 할지 알려줍니다. 추측하거나 문서를 뒤질 필요 없이 다음 필수 워크플로에 대한 명확한 안내를 받습니다.

:::tip[여기서 시작하세요]
BMad를 설치한 뒤 바로 `bmad-help` 스킬을 호출하세요. 설치된 모듈을 감지하고 프로젝트에 맞는 시작점으로 안내합니다.
:::

## BMad 이해하기

BMad는 전문 AI 에이전트가 있는 안내형 워크플로를 통해 소프트웨어를 만들도록 돕습니다. 과정은 네 단계로 진행됩니다.

| 단계 | 이름 | 일어나는 일 |
| --- | --- | --- |
| 1 | 분석 | 브레인스토밍, 리서치, 제품 개요 또는 PRFAQ *(선택)* |
| 2 | 계획 | 요구사항 작성(PRD 또는 사양) |
| 3 | 솔루션 설계 | 아키텍처 설계 *(BMad Method/엔터프라이즈 전용)* |
| 4 | 구현 | 에픽별, 스토리별 구현 |

단계, 워크플로, 컨텍스트 관리를 살펴보려면 **[워크플로 맵 열기](../reference/workflow-map.md)**를 확인하세요.

프로젝트 복잡도에 따라 BMad는 세 가지 계획 트랙을 제공합니다.

| 트랙 | 적합한 경우 | 생성되는 문서 |
| --- | --- | --- |
| **빠른 흐름** | 버그 수정, 단순 기능, 명확한 범위(1-15개 스토리) | 기술 사양만 |
| **BMad Method** | 제품, 플랫폼, 복잡한 기능(10-50개 이상 스토리) | PRD + 아키텍처 + UX |
| **엔터프라이즈** | 컴플라이언스, 멀티테넌트 시스템(30개 이상 스토리) | PRD + 아키텍처 + 보안 + DevOps |

:::note
스토리 수는 기준이 아니라 안내입니다. 스토리 수 계산보다 계획 필요성에 따라 트랙을 선택하세요.
:::

## 설치

프로젝트 디렉터리에서 터미널을 열고 실행합니다.

```bash
npx bmad-method install
```

기본 릴리스 채널 대신 최신 사전 릴리스 빌드를 원한다면 `npx bmad-method@next install`을 사용하세요.

모듈 선택 프롬프트가 나오면 **BMad Method**를 선택합니다.

설치 프로그램은 두 폴더를 만듭니다.

- `_bmad/` - 에이전트, 워크플로, 작업, 설정
- `_bmad-output/` - 지금은 비어 있지만 산출물이 저장될 위치입니다

:::tip[다음 단계]
프로젝트 폴더에서 AI IDE를 열고 다음을 실행하세요.

```
bmad-help
```

BMad 도움말이 완료된 작업을 감지하고 정확한 다음 단계를 추천합니다. "내 선택지는 무엇인가요?" 또는 "SaaS 아이디어가 있는데 어디서 시작해야 하나요?"처럼 물어볼 수도 있습니다.
:::

:::note[에이전트를 로드하고 워크플로를 실행하는 방법]
각 워크플로에는 IDE에서 이름으로 호출하는 **스킬**이 있습니다(예: `bmad-prd`). AI 도구가 `bmad-*` 이름을 인식하고 실행하므로 에이전트를 따로 로드할 필요가 없습니다. 일반 대화를 위해 에이전트 스킬을 직접 호출할 수도 있습니다(예: PM 에이전트용 `bmad-agent-pm`).
:::

:::caution[새 채팅]
각 워크플로는 항상 새 채팅에서 시작하세요. 이렇게 하면 컨텍스트 제한으로 인한 문제를 예방할 수 있습니다.
:::

## 1단계: 계획 만들기

1-3단계를 진행합니다. **각 워크플로는 새 채팅에서 실행하세요.**

:::tip[프로젝트 컨텍스트(선택)]
시작하기 전에 `project-context.md`를 만들어 기술 선호도와 구현 규칙을 문서화하는 것을 고려하세요. 이렇게 하면 모든 AI 에이전트가 프로젝트 전반에서 당신의 규칙을 따릅니다.

`_bmad-output/project-context.md`에 직접 만들거나 아키텍처 이후 `bmad-generate-project-context`로 생성할 수 있습니다. [자세히 알아보기](../explanation/project-context.md).
:::

### 1단계: 분석(선택)

이 단계의 모든 워크플로는 선택 사항입니다. [**무엇을 써야 할지 모르겠나요?**](../explanation/analysis-phase.md)

- **브레인스토밍**(`bmad-brainstorming`) - 안내형 아이디어 발산
- **리서치**(`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) - 시장, 도메인, 기술 리서치
- **제품 개요**(`bmad-product-brief`) - 개념이 명확할 때 권장되는 기초 문서
- **PRFAQ**(`bmad-prfaq`) - 제품 개념을 압박하고 다듬는 워킹 백워드 챌린지

### 2단계: 계획(필수)

**BMad Method 및 엔터프라이즈 트랙:**

1. 새 채팅에서 `bmad-prd`를 실행합니다. 의도(생성, 업데이트, 검증)를 직접 말하거나 스킬이 묻게 둡니다
2. 출력: `prd.md`, `addendum.md`, `decision-log.md`

:::note[`bmad-prd` 의도]
- **생성** - 처음부터 코칭형 발견 과정을 진행합니다. 스킬이 워크스페이스 폴더 이름을 정하고 만족할 만한 PRD까지 안내합니다
- **업데이트** - 기존 PRD와 변경 신호를 지정합니다. 변경을 적용하기 전에 충돌을 드러냅니다
- **검증** - 완료된 PRD를 체크리스트로 비평하고 HTML 발견 사항 보고서를 생성합니다
:::

**빠른 흐름 트랙:**

- `bmad-quick-dev`를 실행합니다. 계획과 구현을 하나의 워크플로에서 처리하므로 구현 단계로 바로 넘어갑니다

:::note[UX 설계(선택)]
프로젝트에 사용자 인터페이스가 있다면 PRD를 만든 뒤 **UX 디자이너 에이전트**(`bmad-agent-ux-designer`)를 호출하고 UX 설계 워크플로(`bmad-ux`)를 실행하세요.
:::

### 3단계: 솔루션 설계(BMad Method/엔터프라이즈)

**아키텍처 만들기**

1. 새 채팅에서 **아키텍트 에이전트**(`bmad-agent-architect`)를 호출합니다
2. `bmad-create-architecture`(`bmad-create-architecture`)를 실행합니다
3. 출력: 기술 결정이 담긴 아키텍처 문서

**에픽과 스토리 만들기**

:::tip[V6 개선]
이제 에픽과 스토리는 아키텍처 *이후* 생성됩니다. 데이터베이스, API 패턴, 기술 스택 같은 아키텍처 결정이 작업 분해 방식에 직접 영향을 주므로 스토리 품질이 좋아집니다.
:::

1. 새 채팅에서 **PM 에이전트**(`bmad-agent-pm`)를 호출합니다
2. `bmad-create-epics-and-stories`(`bmad-create-epics-and-stories`)를 실행합니다
3. 워크플로는 PRD와 아키텍처를 모두 사용해 기술적 맥락이 반영된 스토리를 만듭니다

**구현 준비도 점검** *(강력 권장)*

1. 새 채팅에서 **아키텍트 에이전트**(`bmad-agent-architect`)를 호출합니다
2. `bmad-check-implementation-readiness`(`bmad-check-implementation-readiness`)를 실행합니다
3. 모든 계획 문서 간 응집성을 검증합니다

## 2단계: 프로젝트 만들기

계획이 완료되면 구현으로 이동합니다. **각 워크플로는 새 채팅에서 실행해야 합니다.**

### 스프린트 계획 초기화

**개발자 에이전트**(`bmad-agent-dev`)를 호출하고 `bmad-sprint-planning`(`bmad-sprint-planning`)을 실행합니다. 모든 에픽과 스토리를 추적하는 `sprint-status.yaml`이 생성됩니다.

### 빌드 사이클

각 스토리마다 새 채팅으로 이 사이클을 반복합니다.

| 단계 | 에이전트 | 워크플로 | 명령 | 목적 |
| --- | --- | --- | --- | --- |
| 1 | DEV | `bmad-create-story` | `bmad-create-story` | 에픽에서 스토리 파일 생성 |
| 2 | DEV | `bmad-dev-story` | `bmad-dev-story` | 스토리 구현 |
| 3 | DEV | `bmad-code-review` | `bmad-code-review` | 품질 검증 *(권장)* |

에픽의 모든 스토리를 완료한 뒤 **개발자 에이전트**(`bmad-agent-dev`)를 호출하고 `bmad-retrospective`(`bmad-retrospective`)를 실행합니다.

## 달성한 것

BMad로 빌드하는 기초를 배웠습니다.

- BMad를 설치하고 IDE에 맞게 설정했습니다
- 선택한 계획 트랙으로 프로젝트를 초기화했습니다
- 계획 문서(PRD, 아키텍처, 에픽과 스토리)를 만들었습니다
- 구현을 위한 빌드 사이클을 이해했습니다

이제 프로젝트에는 다음이 있습니다.

```text
your-project/
├── _bmad/                                   # BMad 설정
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # 요구사항 문서
│   │   ├── architecture.md                  # 기술 결정
│   │   └── epics/                           # 에픽과 스토리 파일
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # 스프린트 추적
│   └── project-context.md                   # 구현 규칙(선택)
└── ...
```

## 빠른 참조

| 워크플로 | 명령 | 에이전트 | 목적 |
| --- | --- | --- | --- |
| **`bmad-help`** | `bmad-help` | 무관 | **무엇이든 물어볼 수 있는 지능형 안내자** |
| `bmad-prd` | `bmad-prd` | 무관 | PRD 생성, 업데이트 또는 검증 |
| `bmad-create-architecture` | `bmad-create-architecture` | 아키텍트 | 아키텍처 문서 생성 |
| `bmad-generate-project-context` | `bmad-generate-project-context` | 분석가 | 프로젝트 컨텍스트 파일 생성 |
| `bmad-create-epics-and-stories` | `bmad-create-epics-and-stories` | PM | PRD를 에픽으로 분해 |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | 아키텍트 | 계획 응집성 검증 |
| `bmad-sprint-planning` | `bmad-sprint-planning` | DEV | 스프린트 추적 초기화 |
| `bmad-create-story` | `bmad-create-story` | DEV | 스토리 파일 생성 |
| `bmad-dev-story` | `bmad-dev-story` | DEV | 스토리 구현 |
| `bmad-code-review` | `bmad-code-review` | DEV | 구현된 코드 리뷰 |

## 자주 묻는 질문

**항상 아키텍처가 필요한가요?**
오직 BMad Method와 엔터프라이즈 트랙에서만 필요합니다. 빠른 흐름은 사양에서 구현으로 바로 넘어갑니다.

**나중에 계획을 바꿀 수 있나요?**
네. `bmad-correct-course` 워크플로가 구현 중 범위 변경을 처리합니다.

**먼저 브레인스토밍하고 싶다면요?**
PRD를 시작하기 전에 분석가 에이전트(`bmad-agent-analyst`)를 호출하고 `bmad-brainstorming`(`bmad-brainstorming`)을 실행하세요.

**엄격한 순서를 따라야 하나요?**
반드시 그렇지는 않습니다. 흐름에 익숙해지면 위의 빠른 참조를 사용해 워크플로를 직접 실행할 수 있습니다.

## 도움 받기

:::tip[첫 번째 목적지: BMad 도움말]
**언제든 `bmad-help`를 호출하세요.** 막혔을 때 가장 빠른 방법입니다. 무엇이든 물어보세요.

- "설치 후 무엇을 해야 하나요?"
- "워크플로 X에서 막혔어요"
- "Y에 대한 선택지는 무엇인가요?"
- "지금까지 완료된 것을 보여 주세요"

BMad 도움말은 프로젝트를 검사하고 완료한 작업을 감지한 뒤 다음에 무엇을 해야 할지 정확히 알려줍니다.
:::

- **워크플로 중** - 에이전트가 질문과 설명으로 안내합니다
- **커뮤니티** - [Discord](https://discord.gg/gk8jAdXWmj)(#bmad-method-help, #report-bugs-and-issues)

## 핵심 요약

:::tip[이것만 기억하세요]
- **`bmad-help`로 시작하세요** - 프로젝트와 선택지를 아는 지능형 안내자입니다
- **항상 새 채팅을 사용하세요** - 각 워크플로마다 새 채팅을 시작합니다
- **트랙이 중요합니다** - 빠른 흐름은 `bmad-quick-dev`를 사용하고, BMad Method/엔터프라이즈는 PRD와 아키텍처가 필요합니다
- **BMad 도움말은 자동으로 실행됩니다** - 모든 워크플로는 다음 단계 안내로 끝납니다
:::

시작할 준비가 되었나요? BMad를 설치하고 `bmad-help`를 호출한 뒤 안내에 따라 첫 흐름을 시작하세요.
