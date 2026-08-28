---
title: '워크플로 맵'
description: BMad Method의 단계, 워크플로, 산출물을 정리한 참고 자료
sidebar:
  order: 1
---

BMad Method(BMM)는 소프트웨어 전달 과정을 네 단계로 구성합니다. 선택형 탐색에서 계획, 솔루션 설계, 구현으로 이어지며 각 단계에서는 현재 작업에 필요한 만큼의 컨텍스트만 추가합니다.

변경에 이 맵을 어느 정도까지 적용할지는 [개발 경로 선택하기](../how-to/choose-a-development-path.md)를 참고하세요. 아래 스킬은 이름으로 바로 실행할 수 있습니다. 설치된 프로젝트에서 다음 작업을 확신하기 어렵다면 `bmad-help`를 실행하세요.

<iframe src="/workflow-map-diagram-ko.html" title="BMad Method 워크플로 맵 다이어그램" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram-ko.html" target="_blank" rel="noopener noreferrer">다이어그램 새 탭에서 열기 ↗</a>
</p>

## 단계 1: 분석(선택)

계획을 확정하기 전에 문제 영역을 탐색하고 아이디어를 검증합니다. [**각 도구가 무엇을 하고 언제 쓰는지 알아보기**](../explanation/analysis-phase.md).

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-brainstorming` | 브레인스토밍 코치의 안내를 받아 프로젝트 아이디어를 발산합니다 | `brainstorm.html` 보관본과 선택적 `brainstorm-intent.md` |
| `bmad-forge-idea` | 아이디어를 단련하고 입증하거나 적은 비용으로 폐기할 때까지 압박 검증합니다 | 매 실행마다 `forge-report.html`; 아이디어가 단련되면 `forged-idea.md` |
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
- **업데이트** - 기존 PRD와 변경 신호를 조정하고 변경을 적용하기 전에 충돌을 식별합니다
- **검증** - 설정 가능한 체크리스트로 PRD를 비판적으로 검토하고 구조화된 HTML 발견 사항 보고서를 생성합니다
:::

:::note[`bmad-spec`]
`bmad-spec`은 기계가 읽을 수 있는 표준 계약을 만듭니다. 다섯 필드 커널(Why, Capabilities, Constraints, Non-goals, Success signal)과 동반 파일로 구성되며 원문의 핵심 주장을 모두 보존했는지 검증합니다. `SPEC.md`를 작성할 수 있는 유일한 스킬입니다. 다른 스킬은 의도를 표현하거나 업데이트해야 할 때 비대화형 모드로 이 스킬을 호출합니다. 요청하면 스토리 분해(Story Breakdown)를 실행해 여러 세션에서 에픽을 구현할 때 사용할 순서가 지정된 `stories.yaml`도 만듭니다. [개발 경로 선택하기](../how-to/choose-a-development-path.md#4-에픽-규모-작업-시작)를 참고하세요.
:::

:::tip[상위 입력: `bmad-product-brief`]
`bmad-product-brief`(단계 1)는 `bmad-prd`가 요구사항을 구체화할 때 입력으로 사용할 수 있는 `product-brief.md`를 생성합니다. 재설명을 줄이고 두 문서를 서로 맞춰 유지합니다. 두 스킬이 서로 필수는 아닙니다. 무엇을 만들지 이미 안다면 `bmad-prd`로 바로 시작하세요.
:::

## 단계 3: 솔루션 설계

어떻게 만들지 결정하고 작업을 스토리로 나눕니다.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-architecture` | 기술 결정을 명시적으로 만듭니다 | 기본 핵심 문서는 `ARCHITECTURE-SPINE.md`이며 필요한 출력이나 프레젠테이션 형태로 확장해 씁니다 |
| `bmad-create-epics-and-stories` | 요구사항을 구현 가능한 작업으로 나눕니다 | 스토리가 있는 에픽 파일 |
| `bmad-sprint-planning` | 구현 전 준비도 게이트를 거친 뒤 스토리 추적과 상태 보기를 제공합니다 | PASS/CONCERNS/FAIL + `sprint-status.yaml` |

준비도 게이트, 결정론적 추적, 상태 보기가 함께 작동하는 방식은 [스프린트 계획](../explanation/sprint-planning.md)을 참고하세요.

## 단계 4: 구현

구현은 세션 단위의 작업으로 진행합니다. `bmad-build`는 사람이 참여하는 작업 단위를, `bmad-build-auto`는 무인 작업 단위 하나를 처리합니다. 큰 계획 경로는 이러한 작업 단위에 필요한 컨텍스트를 만들고 보존합니다. 사람이 참여하는 경로는 [변경 사항 구현하기](../build/build-a-change.md), 완성된 변경을 살펴보는 방법은 [변경 사항 둘러보기](../build/walk-through-a-change.md), 테스트 경로를 고르는 방법은 [완료된 작업 테스트하기](../build/test-completed-work.md)를 참고하세요.

| 워크플로 | 목적 | 산출물 |
| --- | --- | --- |
| `bmad-build` | 직접 입력한 의도나 계획된 스토리 하나를 사람의 체크포인트를 거쳐 구현하고 검토 | 구현 기록 + 코드 |
| `bmad-build-auto` | 호출자 또는 오케스트레이터를 위해 작업 단위 하나를 무인으로 구현하고 검토 | 구현 기록 + 코드 + 종료 상태 |
| `bmad-code-review` | 필요할 때 원하는 코드 변경을 별도로 리뷰 | 발견 사항 + 적용된 패치 |
| `bmad-correct-course` | 스프린트 중 의미 있는 변경 처리 | 업데이트된 계획 또는 경로 재조정 |
| `bmad-retrospective` | 완료된 에픽을 인수 기준과 근거에 따라 검토 | 회고 문서, 실행 항목, 인수 판정 |

### 직접 진입과 계획 후 진입

명확한 단일 세션 작업은 `bmad-build`에 바로 넣을 수 있습니다. 사양 기반 에픽은 스토리 분해로 하나의 `SPEC.md` 아래에 여러 작업 단위를 만듭니다. 여러 에픽으로 구성된 프로젝트라면 각 작업 단위를 선택하기 전에 PRD, UX, 아키텍처, 에픽, 준비도 결과, 스프린트 추적을 추가할 수 있습니다.

Build Auto 자체가 이 작업 단위를 조율하지는 않습니다. AI 코딩 세션이나 bmad-loop 같은 별도 오케스트레이터가 작업 단위마다 작업자 하나를 선택하고 실행합니다. 작업자와 오케스트레이션 계약은 [자율 개발 루프](./build-auto.md)를 참고하세요.

## 컨텍스트 관리

각 문서는 이후 결정에 필요한 컨텍스트가 됩니다. PRD는 제품 요구사항을, 아키텍처는 각 구현 단위가 따라야 할 패턴과 경계를 기록합니다. 사양과 스토리 기록은 작업을 나누고 다시 합치는 동안 의도, 결정, 완료 상태를 보존합니다.

### 프로젝트 컨텍스트

:::tip[권장]
AI 에이전트가 모든 워크플로에서 프로젝트 규칙을 따르도록 저장소를 설정하세요. `bmad-project-context`가 `AGENTS.md`의 간결하고 검증된 규칙 블록을 관리합니다. 계획이 끝날 때 아키텍처를 바탕으로 만들거나, 언제든 기존 코드베이스에서 필요한 규칙을 찾아 만들 수 있습니다.
:::

**만드는 방법:**

- `bmad-project-context`를 실행하세요. 그린필드는 사양 또는 아키텍처에서 시작합니다. 브라운필드는 코드베이스에서 규칙을 찾고 검증한 뒤 사용자 확인을 거칩니다. 이전 `bmad-generate-project-context`는 폐기됐으며 이 스킬로 연결됩니다. 기존 `project-context.md`가 있다면 내용을 흡수할지 제안합니다.

[**프로젝트 컨텍스트 더 알아보기**](../explanation/project-context.md)
