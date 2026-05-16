---
title: "워크플로 맵"
description: BMad Method 워크플로 단계와 출력의 시각적 참조
sidebar:
  order: 1
---

BMad Method(BMM)는 BMad 생태계의 모듈이며 컨텍스트 엔지니어링과 계획 모범 사례를 따르는 데 초점을 둡니다. AI 에이전트는 명확하고 구조화된 컨텍스트가 있을 때 가장 잘 작동합니다. BMM 시스템은 4개의 구분된 단계에 걸쳐 그 컨텍스트를 점진적으로 만듭니다. 각 단계와 단계 안의 여러 선택 워크플로는 다음 단계에 필요한 정보를 담은 문서를 만들고, 에이전트는 항상 무엇을 왜 만들어야 하는지 알게 됩니다.

그 근거와 개념은 업계 전반에서 성공적으로 사용되어 온 애자일 방법론에서 온 사고 프레임워크입니다.

언제든 무엇을 해야 할지 확실하지 않다면 `bmad-help` 스킬이 흐름을 잡아 주고 다음 단계를 알려줍니다. 이 문서를 참조로 사용할 수도 있지만, 이미 BMad Method를 설치했다면 `bmad-help`가 더 대화형이고 훨씬 빠릅니다. 또한 BMad Method를 확장한 다른 모듈이나 함께 쓰는 보완 모듈을 사용한다면 `bmad-help`도 사용 가능한 항목을 모두 파악해 현재 상황에 가장 적절한 조언을 제공합니다.

마지막으로 중요한 점: 아래 모든 워크플로는 스킬로 직접 실행하거나, 먼저 에이전트를 로드한 뒤 에이전트 메뉴 항목을 사용해 원하는 도구에서 실행할 수 있습니다.

<iframe src="/workflow-map-diagram.html" title="BMad Method 워크플로 맵 다이어그램" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">다이어그램 새 탭에서 열기 ↗</a>
</p>

## 단계 1: 분석(선택)

계획을 확정하기 전에 문제 영역을 탐색하고 아이디어를 검증합니다. [**각 도구가 무엇을 하고 언제 쓰는지 알아보기**](../explanation/analysis-phase.md).

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-brainstorming` | 브레인스토밍 코치의 안내를 받아 프로젝트 아이디어를 발산합니다 | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | 시장, 기술, 도메인 가정을 검증합니다 | 연구 발견 사항 |
| `bmad-product-brief` | 전략적 비전을 포착합니다. 개념이 명확할 때 가장 좋습니다 | `product-brief.md` |
| `bmad-prfaq` | 워킹 백워드 방식으로 제품 개념을 스트레스 테스트하고 다듬습니다 | `prfaq-{project}.md` |

## 단계 2: 계획

무엇을 누구를 위해 만들지 정의합니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-prd` | PRD를 생성, 업데이트, 검증합니다. 안내형 발견 과정과 세 가지 의도를 하나의 스킬에 담았습니다 | 생성/업데이트: `prd.md`, `addendum.md`, `decision-log.md`; 검증: `validation-report.html` + `.md` |
| `bmad-create-ux-design` | UX가 중요할 때 사용자 경험을 설계합니다 | `ux-spec.md` |

:::tip[하나의 스킬 안에 세 의도]
`bmad-prd`는 전체 PRD 수명주기를 처리합니다. 호출할 때 의도를 말하거나 스킬이 물어보게 하세요.

- **생성** - 안내형 발견 과정을 통해 처음부터 새 PRD를 만듭니다. `prd.md`, `addendum.md`, `decision-log.md`를 생성합니다
- **업데이트** - 기존 PRD와 변경 신호를 조정하고, 변경을 적용하기 전에 충돌을 식별합니다
- **검증** - 설정 가능한 체크리스트로 PRD를 비판적으로 검토하고 구조화된 HTML 발견 사항 보고서를 생성합니다
:::

:::tip[상위 입력: `bmad-product-brief`]
`bmad-product-brief`(단계 1)는 `bmad-prd`가 발견 과정에서 입력으로 사용할 수 있는 `product-brief.md`를 생성합니다. 재설명을 줄이고 두 문서를 서로 맞춰 유지합니다. 두 스킬이 서로 필수는 아닙니다. 무엇을 만들지 이미 안다면 `bmad-prd`로 바로 시작하세요.
:::

## 단계 3: 솔루션 설계

어떻게 만들지 결정하고 작업을 스토리로 나눕니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-create-architecture` | 기술적 결정을 명시적으로 만듭니다 | ADR이 있는 `architecture.md` |
| `bmad-create-epics-and-stories` | 요구사항을 구현 가능한 작업으로 나눕니다 | 스토리가 있는 에픽 파일 |
| `bmad-check-implementation-readiness` | 구현 전 관문 점검 | 통과/우려/실패 결정 |

## 단계 4: 구현

스토리 하나씩 구현합니다. 전체 4단계 자동화는 곧 제공됩니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-sprint-planning` | 추적 상태 초기화(프로젝트당 한 번, 개발 주기 순서화) | `sprint-status.yaml` |
| `bmad-create-story` | 구현을 위한 다음 스토리 준비 | `story-[slug].md` |
| `bmad-dev-story` | 스토리 구현 | 작동하는 코드 + 테스트 |
| `bmad-code-review` | 구현 품질 검증 | 승인 또는 변경 요청 |
| `bmad-correct-course` | 스프린트 중 의미 있는 변경 처리 | 업데이트된 계획 또는 경로 재조정 |
| `bmad-sprint-status` | 스프린트 진행 상황과 스토리 상태 추적 | 스프린트 상태 업데이트 |
| `bmad-retrospective` | 에픽 완료 후 회고 | 배운 점 |
| `bmad-investigate` | 입력에 맞게 보정된 증거 등급 발견 사항 기반 포렌식 사례 조사 | `{slug}-investigation.md` |

## 빠른 흐름(병렬 트랙)

작고 잘 이해된 작업에서는 단계 1-3을 건너뜁니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-quick-dev` | 통합 빠른 흐름 - 의도 정리, 계획, 구현, 리뷰, 발표 | `spec-*.md` + 코드 |

## 컨텍스트 관리

각 문서는 다음 단계의 컨텍스트가 됩니다. PRD는 아키텍트에게 어떤 제약이 중요한지 알려줍니다. 아키텍처는 개발 에이전트에게 어떤 패턴을 따라야 하는지 알려줍니다. 스토리 파일은 구현을 위한 집중적이고 완결된 컨텍스트를 제공합니다. 이 구조가 없으면 에이전트는 일관되지 않은 결정을 내립니다.

### 프로젝트 컨텍스트

:::tip[권장]
AI 에이전트가 프로젝트의 규칙과 선호 사항을 따르도록 `project-context.md`를 만드세요. 이 파일은 프로젝트의 헌장처럼 작동해 모든 워크플로에서 구현 결정을 안내합니다. 이 선택 파일은 아키텍처 작성이 끝날 때 생성할 수 있고, 기존 프로젝트에서도 현재 관례와 맞춰야 할 중요한 내용을 포착하기 위해 생성할 수 있습니다.
:::

**만드는 방법:**

- **수동으로** - `_bmad-output/project-context.md`를 만들고 기술 스택과 구현 규칙을 작성합니다
- **생성하기** - `bmad-generate-project-context`를 실행해 아키텍처 또는 코드베이스에서 자동 생성합니다

[**project-context.md 더 알아보기**](../explanation/project-context.md)
