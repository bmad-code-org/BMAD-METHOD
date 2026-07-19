---
title: 자율 개발 루프
description: bmad-dev-auto를 한 번의 반복을 맡는 작업자로 사용해 사람 개입 없는 BMad 개발 루프를 실행하는 방법
sidebar:
  order: 7
---

BMad로 자율 개발 루프를 실행하려면 `bmad-dev-auto` 스킬을 사용하세요. [빠른 개발](../explanation/quick-dev.md)과 비슷하지만, 사람의 입력을 기다리지 않고 계속 진행하도록 설계되었습니다. 대화형 세션에서도 쓸 수 있지만, 주로 오케스트레이터가 호출하는 작업자 역할을 합니다.

## 하는 일

`bmad-dev-auto`는 사람 개입 없는 개발 루프를 한 번 실행합니다.

1. 입력된 의도를 명확히 합니다
2. spec 파일을 만들거나, 기존 파일을 찾아 이어서 진행합니다
3. 변경을 구현합니다
4. 결과를 리뷰합니다
5. 최종 상태를 spec 파일 또는 대체 결과 산출물에 기록해 실행을 마칩니다

## 전제 조건

실행 환경에서 하위 에이전트를 사용할 수 있어야 합니다. 사용할 수 없다면 워크플로는 `no subagents` 조건과 `blocked` 상태로 멈춥니다. 예를 들어 "Claude, 2-10번 스토리를 구현하되, 각 스토리마다 `bmad-dev-auto` 스킬을 실행하는 하위 에이전트를 사용해 줘"처럼 이 스킬을 하위 에이전트 세션에서 호출한다면, 그 세션도 자체 하위 에이전트를 생성할 수 있어야 합니다.

버전 관리는 선택 사항이지만 사용을 강력히 권장합니다. 버전 관리를 사용한다면 커밋되지 않은 변경 사항이 없어야 합니다.

## 입력

### 기본 호출 입력

기본 입력은 호출 프롬프트입니다. `bmad-dev-auto`는 이 프롬프트를 완성된 구현 계획이 아닌 워크플로 입력으로 다룹니다.

다음과 같은 형태로 의도를 전달할 수 있습니다.

- 짧은 자유 형식 변경 요청
- 티켓, 이슈 또는 스토리 식별자
- 의도 파일 경로
- 이 워크플로가 만든 기존 spec 파일 경로
- 특정 spec 파일 경로 없이 spec 폴더와 스토리 ID를 함께 전달하는 형태(**폴더+ID 디스패치**, 아래 참고)

### 재개 입력

호출이 기존 spec 파일을 가리키고 프런트매터에 알려진 `status` 값이 있으면, 워크플로는 해당 상태부터 재개합니다.

| Spec status | 진입 지점 |
| --- | --- |
| `draft` | 계획 |
| `ready-for-dev` | 구현 |
| `in-progress` | 구현 |
| `in-review` | 리뷰 |
| `done` | 새로운 후속 검토로 다시 리뷰 |
| `blocked` | 즉시 중단 |

### 폴더+ID 디스패치

호출 프롬프트에 특정 spec 파일 경로 대신 spec 폴더와 스토리 ID를 전달할 수도 있습니다. 이때 호출자가 덧붙인 `invoke_dev_with` 지침 같은 나머지 프롬프트 텍스트는 작업 설명을 대체하지 않고 계획에 필요한 추가 컨텍스트로 전달됩니다.

워크플로는 `<spec-folder>/stories.yaml`을 읽고 `id`가 일치하는 항목을 찾은 뒤, 그 항목의 `title`과 `description`만 사용합니다. `spec_checkpoint`, `done_checkpoint`, `invoke_dev_with`는 디스패치를 요청한 호출자가 쓰는 필드이므로 파일에서는 읽지 않습니다.

그런 다음 `<spec-folder>/stories/<story-id>-*.md`를 ID 접두사로 확인해 첫 디스패치인지, 이어서 진행하는 상황인지 판단합니다.

| 디스크에서 찾은 항목 | 결과 |
| --- | --- |
| 없음 | 첫 디스패치입니다. `<spec-folder>/SPEC.md`가 있어야 합니다. 없으면 `no epic spec found` 조건으로 `blocked`에서 멈춥니다. `SPEC.md`와 동반 파일을 읽은 뒤 계획으로 진행합니다. |
| 정확히 하나 | 해당 파일의 `status`에 따라 위 표와 같은 방식으로 재개합니다. 여기서 `blocked` 상태는 `blocked spec supplied`가 아니라 `story already blocked` 조건을 보고합니다. 호출자가 막힌 spec을 직접 넘긴 것이 아니라 dev-auto가 ID로 파일을 찾았기 때문입니다. `status`가 없거나 인식할 수 없으면 `unrecognized status in existing story file` 조건과 `blocked` 상태로 멈춥니다. |
| 둘 이상 | `ambiguous story file match` 조건으로 `blocked`에서 멈춥니다. |

`blocked` 상태의 스토리 파일은 영구 차단된 것으로 취급됩니다. 원인을 고친 뒤에도 같은 ID를 다시 디스패치하면 항상 `story already blocked`로 멈춥니다. 다시 시도하려면 스토리 파일을 삭제하세요. 그러면 해당 ID는 대기 상태로 돌아가고 다음 디스패치가 처음부터 시작됩니다.

계획 단계가 실행될 때마다 워크플로는 `<spec-folder>/stories/*.md`와 일치하는 다른 파일도 모두 읽습니다. 첫 디스패치뿐 아니라 `draft` 상태에서 중단된 계획을 재개할 때도 마찬가지입니다. 각 파일의 Code Map, Design Notes, Spec Change Log, Tasks & Acceptance 체크리스트 상태, Auto Run Result 세부 내용을 추가 계획 컨텍스트로 가져오므로, 같은 폴더의 다른 스토리가 이미 결정하거나 만든 내용을 현재 계획에 반영할 수 있습니다. 계획 단계를 건너뛰는 재개 경로에서는 이 과정도 생략합니다.

한 번의 호출에서는 `stories.yaml` 항목 하나만 디스패치합니다. 결과와 관계없이 다른 항목을 읽거나 다른 스토리 ID로 넘어가지 않습니다.

### 컨텍스트 입력

활성화되면 워크플로는 다음 항목을 확인합니다.

- `_bmad/bmm/config.yaml`
- `customize.toml`, 팀 오버라이드, 사용자 오버라이드에 설정된 워크플로 커스터마이징
- 워크플로 설정에 나열된 지속 사실
- 존재하는 경우 `project-context.md` 파일

필요하면 다음도 참고합니다.

- BMAD 계획 산출물
- 에픽 기반 작업을 위한 캐시된 또는 새로 컴파일한 에픽 컨텍스트 파일
- 같은 에픽에서 가장 최근에 완료된 이전 스토리 spec
- 폴더+ID 디스패치에서는 같은 spec 폴더 아래의 다른 `stories/*.md` 기록(위의 폴더+ID 디스패치 참고)

## Spec 상태

Spec 프런트매터의 `status`는 오케스트레이터가 읽는 핵심 상태값입니다.

| Spec Status | 의미 |
| --- | --- |
| `draft` | Spec은 있지만 ready-for-dev 검증을 아직 통과하지 않았습니다 |
| `ready-for-dev` | 구현할 만큼 spec이 충분히 완성되었습니다 |
| `in-progress` | 구현이 진행 중입니다 |
| `in-review` | 리뷰 또는 분류가 진행 중입니다 |
| `done` | 워크플로가 성공적으로 완료되었습니다 |
| `blocked` | 사람 개입 없이 안전하게 계속할 수 없습니다 |

### `ready-for-dev`일 때

`ready-for-dev`는 보통 워크플로가 구현으로 넘어가며 통과하는 재개 상태입니다. 다만 호출 프롬프트가 계획 후 멈추라고 지시했다면 실제 중단 결과가 됩니다. spec이 READY FOR DEVELOPMENT 관문을 통과하면 워크플로는 상태를 `ready-for-dev`로 설정하고 구현으로 넘어가지 않습니다. 같은 spec 또는 같은 spec 폴더와 스토리 ID를 다시 디스패치하면 위 라우팅에 따라 구현부터 재개합니다.

### `done`일 때

성공적으로 완료되면 워크플로는 spec에 다음을 작성하거나 갱신합니다.

- 최종 `status: done`
- 구현한 변경의 요약, 변경 파일, 리뷰 발견 사항 분류, 수행한 검증, 남은 위험을 담은 `Auto Run Result` 섹션
- `followup_review_recommended` 플래그. LLM이 추가 검토가 유용하다고 판단하면 `true`가 됩니다. 의무가 아니라 제안이며, 같은 spec 파일을 가리켜 스킬을 다시 실행하면 가장 간단하게 두 번째 검토를 시작할 수 있습니다.
- `baseline_revision`과 `final_revision`. 구현 전 HEAD와 최종 커밋 후 HEAD입니다. 두 값은 실행이 만든 커밋 범위를 표시합니다. `git log baseline_revision..final_revision`은 해당 실행이 정확히 무엇을 만들었는지 보여주며, 값이 같다면 커밋이 만들어지지 않았다는 뜻입니다. 버전 관리를 사용할 수 없으면 둘 다 `NO_VCS`입니다.

버전 관리를 사용할 수 있으면 워크플로는 변경을 커밋합니다. push는 하지 않습니다.

### `blocked`일 때

차단 상태로 끝나면 워크플로는 다음을 작성합니다.

- spec이 있으면 최종 `status: blocked`
- 차단 조건
- spec 또는 대체 결과 산출물의 관련 세부 정보

대표적인 차단 조건은 다음과 같습니다.

- `unclear intent`
- `intent gap`
- `no subagents`
- `missing spec_file before implementation`
- `implementation verification failed`
- `review repair loop exceeded 5 iterations (non-convergence)`
- `blocked spec supplied`(직접 호출한 spec 파일이 이미 `status: blocked`였던 경우)
- `no stories.yaml found`
- `story id not found in stories.yaml`
- `no epic spec found`
- `ambiguous story file match`
- `unrecognized status in existing story file`
- `story already blocked`(폴더+ID 디스패치 전용. 위의 `blocked spec supplied`와 다릅니다)

`intent gap`은 실행 중 생긴 질문에 기록된 의도만으로 답할 수 없다는 뜻입니다. 코드가 만들어지기 전인 계획 단계에서 멈출 수도 있고, 리뷰 단계에서 멈출 수도 있습니다. 리뷰 중 이 조건으로 멈추면 작업 트리를 평소처럼 되돌리되, 먼저 시도한 변경을 `{implementation_artifacts}` 아래의 패치 파일로 저장하고 spec의 triage log와 중단 출력에 경로를 기록합니다. 이 패치는 워크플로가 의도를 어떻게 해석해 구현했는지 보여주는 구체적인 근거입니다. 그 해석이 맞다면 `git apply`로 패치를 적용하고 spec 상태를 `in-review`로 바꿔, 처음부터 다시 실행하지 않고 해당 변경의 리뷰를 이어갈 수 있습니다.

## 출력 산출물

워크플로는 실행 결과를 나중에도 확인할 수 있도록 영구 산출물을 남깁니다.

### 기본 Spec 산출물

새 작업에서는 다음을 만듭니다.

`{implementation_artifacts}/spec-<slug>.md`

이 spec은 계획, 구현, 리뷰를 잇는 계약으로 다음 내용을 담습니다.

- 프런트매터 상태
- 수정할 수 없는 `<intent-contract>` 블록
- Code map
- 작업과 인수 기준
- Spec change log
- Review triage log
- 검증 메모

### 스토리 Spec 산출물(폴더+ID 디스패치)

폴더+ID 디스패치에서는 기본 spec 또는 대체 결과 경로 대신 `<spec-folder>/stories/<story-id>-<slug>.md`에 씁니다. 계획이 시작되기 전에 멈추는 경우도 여기에 포함됩니다. 이 모드에서는 아래의 대체 결과 산출물을 사용하지 않습니다.

스토리 제목에서 slug를 만들기 전에 멈추면 쓰기 경로에 고정된 slug 조각을 사용합니다.

| 상황 | 사용하는 slug 조각 |
| --- | --- |
| `stories.yaml`이 없거나 파싱할 수 없거나, 일치하는 항목이 없음 | `unresolved` |
| 이미 디스크에 `<story-id>-*.md`와 일치하는 파일이 둘 이상 있음 | `ambiguous` |
| 항목을 찾았고 디스크의 파일 일치가 모호하지 않음 | `title`에서 만든 slug. 필요하면 `description`도 사용 |

결정된 경로에 파일이 이미 있으면 워크플로는 프런트매터의 `status`를 갱신하고, 기본 spec 산출물과 마찬가지로 `## Auto Run Result` 아래에 결과를 덧붙입니다. 파일이 없으면 최소 구성의 스토리 spec을 만듭니다. 이 파일에는 프런트매터 상태, 제목, `## Auto Run Result` 섹션이 들어갑니다. 제목은 해당 항목의 `title`을 사용하되, 항목을 찾을 수 없거나 디스크의 파일 일치가 모호하면 `Story <story_id>`를 사용합니다.

### 대체 결과 산출물

유효한 `spec_file`이 생기기 전에 워크플로가 멈추면, 폴더+ID 디스패치 밖에서는 다음을 씁니다.

`{implementation_artifacts}/bmad-dev-auto-result-<slug-or-timestamp>.md`

여기에는 최종 상태와 차단 조건이 기록됩니다.

### 추가 산출물

경로에 따라 워크플로가 다음도 쓸 수 있습니다.

- `{implementation_artifacts}/epic-<N>-context.md`
- `{implementation_artifacts}/deferred-work.md`
- 리뷰 단계가 `intent gap`으로 멈출 때 시도했던 변경을 보존한 패치 파일(spec의 triage log에 경로 기록)

## 오케스트레이터 책임

`bmad-dev-auto`를 통합하는 오케스트레이터는 다음을 해야 합니다.

- 한 번에 하나의 일관된 의도를 전달합니다
- 이전 작업을 재개할 때는 spec 경로를 직접 전달하는 방식을 우선합니다. 폴더+ID 디스패치라면 같은 spec 폴더와 스토리 ID를 전달합니다
- 생성된 spec 파일, 스토리 spec 산출물 또는 대체 결과 파일에서 최종 상태를 확인합니다
- 채팅 출력만 보고 성공을 추정하지 말고 `status`, `blocking condition`, `followup_review_recommended`를 읽습니다
- git 상태만 보고 추정하지 말고 `baseline_revision..final_revision`으로 실행이 만든 커밋을 식별합니다
- 자율 실행으로 파일 변경과 로컬 커밋이 생길 수 있음을 예상합니다
- `blocked`를 단순 실패가 아니라 라우팅 신호로 처리합니다

`blocked`는 대개 워크플로가 사람 개입 없이 계속하기에는 안전하지 않은 상황을 만났다는 뜻입니다. 이때는 상위 오케스트레이터나 다른 워크플로, 또는 사람이 이어받는 편이 적절합니다.

차단 원인을 해결한 뒤에는 보통 `bmad-dev-auto`를 새로 실행해야 합니다. 기존 작업을 재사용하려면 자동 탐색에 기대지 말고 검증된 spec 경로를 명시적으로 전달하세요.
