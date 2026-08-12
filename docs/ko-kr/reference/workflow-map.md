---
title: "워크플로 맵"
description: BMad Method 워크플로 단계와 산출물을 한눈에 보는 참고 자료
sidebar:
  order: 1
---

BMad Method(BMM)는 BMad 생태계에서 컨텍스트 엔지니어링과 계획의 모범 사례를 적용하는 모듈입니다. AI 에이전트는 명확하고 구조화된 컨텍스트가 있을 때 가장 잘 작동합니다. BMM은 네 단계에 걸쳐 그 컨텍스트를 점진적으로 쌓습니다. 각 단계와 그 안의 선택형 워크플로는 다음 단계에 필요한 문서를 만듭니다. 덕분에 에이전트는 무엇을 왜 만들어야 하는지 항상 알 수 있습니다.

이 구조는 업계 전반에서 널리 활용되어 온 애자일 방법론을 사고의 틀로 삼습니다.

무엇을 해야 할지 확실하지 않을 때는 언제든 `bmad-help` 스킬을 실행하세요. 현재 흐름을 파악해 다음 단계를 알려줍니다. 이 문서를 참고해도 되지만, BMad Method를 이미 설치했다면 `bmad-help`가 더 대화형이고 훨씬 빠릅니다. BMad Method를 확장하거나 보완하는 다른 모듈을 사용하고 있어도, `bmad-help`가 사용 가능한 항목을 모두 파악해 현재 상황에 가장 알맞은 방법을 제안합니다.

마지막으로, 아래 모든 워크플로는 스킬로 직접 실행할 수 있습니다. 먼저 에이전트를 불러온 뒤 메뉴에서 선택해도 됩니다. 어느 방식이든 원하는 도구에서 실행할 수 있습니다.

<iframe src="/workflow-map-diagram-ko.html" title="BMad Method 워크플로 맵 다이어그램" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram-ko.html" target="_blank" rel="noopener noreferrer">다이어그램 새 탭에서 열기 ↗</a>
</p>

## 단계 1: 분석(선택)

계획을 확정하기 전에 문제 영역을 탐색하고 아이디어를 검증합니다. [**각 도구가 무엇을 하고 언제 쓰는지 알아보기**](../explanation/analysis-phase.md).

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-brainstorming` | 브레인스토밍 코치의 안내를 받아 프로젝트 아이디어를 발산합니다 | `brainstorm.html` 보관본과 선택적 `brainstorm-intent.md` |
| `bmad-forge-idea` | 아이디어를 단련하고, 입증하거나, 적은 비용으로 폐기할 때까지 압박 검증합니다 | 매 실행마다 `forge-report.html`; 아이디어가 단련되면 `forged-idea.md` |
| `bmad-deep-recon` | 의사결정을 위해 어떤 주제든 조사합니다. 심층 리서치 도구용 프롬프트를 만들거나, 해당 도구의 보고서를 처리하거나, 현재 환경에서 리서치를 실행합니다. 검증과 인용을 포함한 여섯 가지 유형 팩을 제공합니다 | 리서치 보고서 또는 요약 + 선택적 HTML 브리핑 |
| `bmad-product-brief` | 전략적 비전을 포착합니다. 개념이 명확할 때 가장 좋습니다 | `brief.md` + `addendum.md`, 필요한 HTML 또는 프레젠테이션 출력 |
| `bmad-prfaq` | 워킹 백워드 방식으로 제품 개념을 고객 우선 관점에서 스트레스 테스트합니다 | `prfaq-{project}.md` |

Deep Recon의 세 가지 모드와 리서치 실행 내부 동작은 [Deep Recon](../explanation/deep-recon.md)을 참고하세요.

## 단계 2: 계획

무엇을 누구를 위해 만들지 정의합니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-prd` | PRD를 생성, 업데이트, 검증합니다. 단계별 질문으로 요구사항을 구체화하며 세 가지 의도를 하나의 스킬에서 처리합니다 | 생성/업데이트: `prd.md`, `addendum.md`, `.memlog.md`; 검증: `validation-report.html` + `.md` |
| `bmad-ux` | UX가 중요할 때 사용자 경험을 설계합니다. DESIGN.md(시각)와 EXPERIENCE.md(동작)라는 두 핵심 문서를 만듭니다 | `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md` |
| `bmad-spec` | 브리프, PRD, 대화록, 브레인 덤프, 디자인 폴더 같은 다양한 의도 입력을 간결한 `SPEC.md` 계약과 동반 파일로 정제합니다. HOW를 정하기 전에 WHAT을 확정합니다 | `{output_folder}/specs/spec-{slug}/` 아래 `SPEC.md` + 동반 파일, 필요한 경우 `stories.yaml` |

:::tip[하나의 스킬 안에 세 의도]
`bmad-prd`는 전체 PRD 수명주기를 처리합니다. 호출할 때 의도를 말하거나 스킬이 물어보게 하세요.

- **생성** - 단계별 질문으로 요구사항을 구체화해 처음부터 새 PRD를 만듭니다. `prd.md`, `addendum.md`, `.memlog.md`를 생성합니다
- **업데이트** - 기존 PRD와 변경 신호를 조정하고, 변경을 적용하기 전에 충돌을 식별합니다
- **검증** - 설정 가능한 체크리스트로 PRD를 비판적으로 검토하고 구조화된 HTML 발견 사항 보고서를 생성합니다
:::

:::note[`bmad-spec`]
`bmad-spec`은 기계가 읽을 수 있는 표준 계약을 만듭니다. 다섯 필드 커널(Why, Capabilities, Constraints, Non-goals, Success signal)과 동반 파일로 구성됩니다. 원문의 핵심 주장을 모두 보존했는지도 검증합니다. `SPEC.md`를 작성할 수 있는 유일한 스킬입니다. 다른 스킬은 의도를 표현하거나 업데이트해야 할 때 비대화형 모드로 이 스킬을 호출합니다. 요청하면 사양을 순서가 있는 `stories.yaml`로 나눠 자율 실행에 넘길 수도 있습니다. 자세한 내용은 [자율 개발 루프](./build-auto.md)를 참고하세요.
:::

:::tip[상위 입력: `bmad-product-brief`]
`bmad-product-brief`(단계 1)는 `bmad-prd`가 요구사항을 구체화할 때 입력으로 사용할 수 있는 `product-brief.md`를 생성합니다. 재설명을 줄이고 두 문서를 서로 맞춰 유지합니다. 두 스킬이 서로 필수는 아닙니다. 무엇을 만들지 이미 안다면 `bmad-prd`로 바로 시작하세요.
:::

## 단계 3: 솔루션 설계

어떻게 만들지 결정하고 작업을 스토리로 나눕니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-architecture` | 기술 결정을 명시적으로 만듭니다 | 기본 핵심 문서는 `ARCHITECTURE-SPINE.md`이며, 필요한 출력이나 프레젠테이션 형태로 확장해 씁니다 |
| `bmad-create-epics-and-stories` | 요구사항을 구현 가능한 작업으로 나눕니다 | 스토리가 있는 에픽 파일 |
| `bmad-sprint-planning` | 구현 전 준비도 게이트를 거친 뒤 스토리 추적과 상태 보기를 제공합니다 | PASS/CONCERNS/FAIL + `sprint-status.yaml` |

준비도 게이트, 결정론적 추적, 상태 보기가 함께 작동하는 방식은 [스프린트 계획](../explanation/sprint-planning.md)을 참고하세요.

## 단계 4: 구현

모든 구현 경로는 `bmad-build`로 모입니다. 직접 입력한 의도, 이슈, 사양 또는 계획된 스토리를 받아 입력에 필요한 만큼 의도 명확화, 계획, 구현, 리뷰 깊이를 선택합니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-build` | 직접 입력한 의도나 계획된 스토리를 구현하고 리뷰한 코드로 전환 | `spec-*.md` + 코드 |
| `bmad-code-review` | 필요할 때 원하는 코드 변경을 별도로 리뷰 | 발견 사항 + 적용된 패치 |
| `bmad-correct-course` | 스프린트 중 의미 있는 변경 처리 | 업데이트된 계획 또는 경로 재조정 |
| `bmad-retrospective` | 완료된 에픽을 인수 기준과 근거에 따라 검토 | 회고 문서, 실행 항목, 인수 판정 |

### 직접 진입과 계획 후 진입

명확한 작업은 `bmad-build`에 바로 넣을 수 있습니다. 큰 이니셔티브는 먼저 PRD, UX 설계, 아키텍처, 에픽, 스토리, 준비도 결과, 스프린트 계획을 만들 수 있습니다. 이 산출물은 컨텍스트를 더할 뿐, 다른 구현 워크플로를 선택하지는 않습니다.

자율 실행이 적합하다면 `bmad-build-auto`가 같은 개발 모델을 사람의 개입 없이 반복 실행할 수 있습니다.

`bmad-build-auto`로 사람의 개입 없는 개발 루프를 실행하는 방법은 [자율 개발 루프](./build-auto.md)를 참고하세요.

## 컨텍스트 관리

각 문서는 다음 단계의 컨텍스트가 됩니다. PRD는 아키텍트에게 어떤 제약이 중요한지 알려줍니다. 아키텍처는 개발 에이전트에게 어떤 패턴을 따라야 하는지 알려줍니다. 사양 파일은 구현을 위한 집중적이고 완결된 컨텍스트를 제공합니다. 이 구조가 없으면 에이전트는 일관되지 않은 결정을 내립니다.

### 프로젝트 컨텍스트

:::tip[권장]
AI 에이전트가 모든 워크플로에서 프로젝트 규칙을 따르도록 저장소를 설정하세요. `bmad-project-context`가 `AGENTS.md`의 간결하고 검증된 규칙 블록을 관리합니다. 계획이 끝날 때 아키텍처를 바탕으로 만들거나, 언제든 기존 코드베이스에서 필요한 규칙을 찾아 만들 수 있습니다.
:::

**만드는 방법:**

- `bmad-project-context`를 실행하세요. 그린필드는 사양 또는 아키텍처에서 시작합니다. 브라운필드는 코드베이스에서 규칙을 찾고 검증한 뒤 사용자 확인을 거칩니다. 이전 `bmad-generate-project-context`는 폐기됐으며 이 스킬로 연결됩니다. 기존 `project-context.md`가 있다면 내용을 흡수할지 제안합니다.

[**프로젝트 컨텍스트 더 알아보기**](../explanation/project-context.md)
