---
title: '조직을 위해 BMad 확장하기'
description: 포크 없이 BMad를 재구성하는 여섯 가지 커스터마이징 패턴 - 에이전트 전반 규칙, 워크플로 관례, 외부 게시, 템플릿 교체, 에이전트 명단 변경, 고급 통합 패턴
sidebar:
  order: 11
---

BMad의 커스터마이징 영역을 사용하면 설치된 파일을 수정하거나 스킬을 포크하지 않고도 조직에 맞게 동작을 바꿀 수 있습니다. 이 가이드는 대부분의 엔터프라이즈 요구를 다루는 여섯 가지 레시피를 소개합니다.

:::note[필수 조건]

- 프로젝트에 BMad 설치([BMad 설치 방법](./install-bmad.md) 참고)
- 커스터마이징 모델 이해([BMad 커스터마이징 방법](./customize-bmad.md) 참고)
- PATH의 Python 3.11+(병합 스크립트용, stdlib만 사용하며 `pip install` 불필요)
:::

:::tip[이 레시피 적용하기]
아래 **스킬별 레시피**(레시피 1-4)는 `bmad-customize` 스킬을 실행하고 의도를 설명해 적용할 수 있습니다. 스킬이 적절한 영역을 고르고 오버라이드 파일을 작성하고 병합을 검증합니다. 레시피 5(에이전트 명단에 대한 중앙 설정 오버라이드)는 v1 스킬 범위 밖이라 직접 작성해야 합니다. 이 문서의 레시피는 *무엇을* 오버라이드할지의 참고 기준이고, `bmad-customize`는 에이전트/워크플로 영역의 *방법*을 처리합니다.
:::

## 3계층 모델

레시피를 고르기 전에 오버라이드가 어디에 들어가는지 알아두세요.

| 계층 | 오버라이드 위치 | 범위 |
| --- | --- | --- |
| **에이전트**(예: Amelia, Mary, John) | `_bmad/custom/bmad-agent-{role}.toml`의 `[agent]` 섹션 | 에이전트를 통해 실행되는 **모든 워크플로**에 페르소나와 함께 이동 |
| **워크플로**(예: 제품 개요, PRD 생성) | `_bmad/custom/{workflow-name}.toml`의 `[workflow]` 섹션 | 해당 워크플로 실행에만 적용 |
| **중앙 설정** | `_bmad/custom/config.toml`의 `[agents.*]`, `[core]`, `[modules.*]` | 에이전트 명단(파티 모드, 회고, 도출에서 누가 가능한지), 조직 전체로 고정된 설치 시 설정 |

경험칙: 규칙이 엔지니어의 모든 개발 작업에 적용되어야 한다면 **개발자 에이전트**를 커스터마이즈하세요. 제품 개요를 쓸 때만 적용된다면 **제품 개요 워크플로**를 커스터마이즈하세요. *방에 누가 있는지*를 바꾸는 일(에이전트 이름 변경, 커스텀 목소리 추가, 공유 산출물 경로 강제)은 **중앙 설정**을 편집하세요.

## 레시피 1: 에이전트가 실행하는 모든 워크플로에 규칙 적용

**사용 사례:** 에이전트를 통해 실행되는 모든 워크플로가 같은 도구 사용과 외부 시스템 통합 규칙을 상속하도록 표준화합니다. 가장 영향력이 큰 패턴입니다.

**예시: Amelia 개발자 에이전트가 라이브러리 문서는 항상 Context7을 사용하고, 에픽 목록에 스토리가 없으면 Linear를 대체 경로로 사용합니다.**

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

# 모든 활성화에 적용됩니다. Amelia가 실행하는 모든 스킬
# 스토리 구현, 빠른 개발, 스토리 생성, 코드 리뷰, QA 생성으로 이어집니다.
persistent_facts = [
  "라이브러리 문서(React, TypeScript, Zod, Prisma 등)를 찾을 때는 학습 데이터 지식에 의존하기 전에 context7 MCP 도구(`mcp__context7__resolve_library_id`, 이후 `mcp__context7__get_library_docs`)를 호출하세요. 최신 문서가 기억된 API보다 우선합니다.",
  "스토리 참조를 {planning_artifacts}/epics-and-stories.md에서 찾을 수 없으면 사용자에게 확인을 요청하기 전에 스토리 ID나 제목으로 Linear의 `mcp__linear__search_issues`를 검색하세요. Linear가 일치 항목을 반환하면 권위 있는 스토리 소스로 취급하세요.",
]
```

**왜 동작하나요:** 두 문장이 조직의 모든 개발 워크플로를 재구성합니다. 워크플로마다 반복하지 않아도 되고 소스 변경도 없습니다. 저장소를 가져오는 모든 새 엔지니어가 자동으로 관례를 상속합니다.

**팀 파일 vs 개인 파일:**

- `bmad-agent-dev.toml`: git에 커밋하고 팀 전체에 적용합니다
- `bmad-agent-dev.user.toml`: git에서 무시되며 개인 선호를 위에 덧씌웁니다

## 레시피 2: 특정 워크플로 안에서 조직 관례 강제

**사용 사례:** 워크플로 출력의 *내용*이 컴플라이언스, 감사, 후속 사용자의 요구를 만족하도록 만듭니다.

**예시: 모든 제품 개요에 컴플라이언스 필드가 포함되고 에이전트가 조직의 게시 관례를 압니다.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "모든 개요에는 '소유자', '대상 릴리스', '보안 리뷰 상태' 필드가 포함되어야 합니다.",
  "비상업용 개요(내부 도구, 리서치 프로젝트)도 사용자 가치 섹션은 포함해야 하지만 시장 차별화는 생략할 수 있습니다.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

**일어나는 일:** 사실 목록은 워크플로 활성화 3단계에서 로드됩니다. 에이전트가 제품 개요를 작성할 때 필수 필드와 엔터프라이즈 관례 문서를 알고 있습니다. 기본값(`file:{project-root}/**/project-context.md`)도 추가 방식이므로 계속 로드됩니다.

## 레시피 3: 완료된 출력을 외부 시스템에 게시

**사용 사례:** 워크플로가 출력을 만든 뒤 엔터프라이즈 기록 시스템(Confluence, Notion, SharePoint)에 자동 게시하고 후속 작업(Jira, Linear, Asana)을 엽니다.

**예시: 제품 개요를 Confluence에 자동 게시하고 선택적으로 Jira 에픽 생성을 제안합니다.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

# 종료 후크입니다. 스칼라 값 오버라이드는 빈 기본값 전체를 교체합니다.
on_complete = """
게시하고 후속 작업을 제안하세요:

1. 이전 단계에서 확정된 개요 파일 경로를 읽습니다.
2. 다음 인자로 `mcp__atlassian__confluence_create_page`를 호출합니다:
   - space: "PRODUCT"
   - parent: "Product Briefs"
   - title: 개요 제목
   - body: 개요의 Markdown 내용
   반환된 페이지 URL을 기록합니다.
3. 사용자에게 "개요가 Confluence에 게시되었습니다: <url>"이라고 알립니다.
4. "이 개요에 대한 Jira 에픽을 지금 만들까요?"라고 묻습니다.
5. 사용자가 동의하면 다음 인자로 `mcp__atlassian__jira_create_issue`를 호출합니다:
   - type: "Epic"
   - project: "PROD"
   - summary: 개요 제목
   - description: 짧은 요약과 Confluence 페이지 링크
   에픽 키와 URL을 보고합니다.
6. 동의하지 않으면 깔끔하게 종료합니다.

어느 MCP 도구든 실패하면 실패를 보고하고 개요 경로를 출력한 뒤
사용자에게 수동 게시를 요청하세요.
"""
```

**왜 `activation_steps_append`가 아니라 `on_complete`인가요:** `on_complete`는 워크플로의 주 출력이 작성된 뒤 마지막 단계에서 정확히 한 번 실행됩니다. 산출물 게시에는 이 시점이 맞습니다. `activation_steps_append`는 워크플로가 일을 시작하기 전에 매 활성화마다 실행됩니다.

**절충점:**

- **Confluence 게시 작업은 비파괴적**이며 완료 시 항상 실행됩니다
- **Jira 에픽 생성은 팀 전체에 보이고 스프린트 계획 신호를 만들기 때문에** 사용자 확인으로 통제합니다
- **안전한 대체 경로:** MCP 도구가 실패하면 조용히 출력을 버리지 말고 사용자에게 맡깁니다

## 레시피 4: 자체 출력 템플릿으로 교체

**사용 사례:** 기본 출력 구조가 조직의 예상 형식과 맞지 않거나, 같은 저장소의 서로 다른 조직이 다른 템플릿을 필요로 합니다.

**예시: product-brief 워크플로가 엔터프라이즈 소유 템플릿을 보게 합니다.**

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**작동 방식:** 워크플로의 `customize.toml`은 `brief_template = "resources/brief-template.md"`(스킬 루트 기준 경로)를 제공합니다. 오버라이드는 `{project-root}` 아래 파일을 가리키므로 에이전트가 제공된 템플릿 대신 당신의 템플릿을 4단계에서 읽습니다.

**템플릿 작성 팁:**

- 템플릿은 `{project-root}/docs/` 또는 `{project-root}/_bmad/custom/templates/`에 두어 오버라이드 파일과 함께 버전 관리합니다
- 제공된 템플릿과 같은 구조 관례(섹션 헤딩, 프런트매터)를 사용하세요. 에이전트는 그 구조에 적응합니다
- 다중 조직 저장소에서는 `.user.toml`로 개별 팀이 커밋된 팀 파일을 건드리지 않고 자체 템플릿을 가리키게 할 수 있습니다

## 레시피 5: 에이전트 명단 커스터마이즈

**사용 사례:** 소스를 수정하거나 포크하지 않고 `bmad-party-mode`, `bmad-retrospective`, `bmad-advanced-elicitation` 같은 명단 기반 스킬에서 *방에 누가 있는지* 바꿉니다. 세 가지 흔한 변형은 다음과 같습니다.

### 5a. BMad 에이전트를 조직 전체에서 리브랜딩

실제 에이전트마다 설치 프로그램이 `module.yaml`에서 합성한 설명자가 있습니다. 이를 오버라이드하면 명단을 사용하는 모든 스킬에서 목소리와 표현 방식을 바꿀 수 있습니다.

```toml
# _bmad/custom/config.toml (커밋됨 - 모든 개발자에게 적용)

[agents.bmad-agent-analyst]
description = "규제를 의식하는 비즈니스 분석가 Mary - Porter와 Minto의 사고법을 따르지만 FDA 감사 추적을 중시합니다. 사건 파일을 제시하는 포렌식 조사관처럼 말합니다."
```

파티 모드는 새 설명으로 Mary를 생성합니다. 분석가 활성화 자체는 Mary의 동작이 스킬별 `customize.toml`에 있으므로 정상 동작합니다. 이 오버라이드는 **외부 스킬이 Mary를 어떻게 인식하고 소개하는지**를 바꾸며, 내부 작업 방식은 바꾸지 않습니다.

### 5b. 가상 또는 커스텀 에이전트 추가

스킬 폴더 없이 전체 설명자만으로 명단 기반 기능에 충분합니다. 파티 모드나 브레인스토밍 세션에서 페르소나 다양성을 줄 때 유용합니다.

```toml
# _bmad/custom/config.user.toml (개인용 - git에서 무시)

[agents.spock]
team = "startrek"
name = "스팍 사령관"
title = "과학 장교"
icon = "🖖"
description = "논리를 우선하고 감정을 억제합니다. 관찰을 '흥미롭군요.'로 시작합니다. 절대 올림하지 않습니다. 직감에 의존하는 주장에 반대 관점을 제공합니다."

[agents.mccoy]
team = "startrek"
name = "레너드 맥코이 박사"
title = "수석 의무관"
icon = "⚕️"
description = "시골 의사의 따뜻함과 짧은 인내심을 지녔습니다. '제기랄 짐, 난 ___가 아니라 의사라고.' 윤리 중심으로 스팍의 균형을 잡습니다."
```

파티 모드에 "엔터프라이즈 승무원을 초대해 줘"라고 요청하면 `team = "startrek"`으로 필터링하고 스팍과 맥코이를 생성합니다. 요청하면 실제 BMad 에이전트(Mary, Amelia)도 같은 테이블에 앉을 수 있습니다.

### 5c. 팀 설치 설정 고정

설치 프로그램은 각 개발자에게 `planning_artifacts` 경로 같은 값을 묻습니다. 조직이 팀 전체에 하나의 답을 강제해야 한다면 중앙 설정에 고정하세요. 각 개발자의 로컬 프롬프트 답변은 해석 시점에 오버라이드됩니다.

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

`user_name`, `communication_language`, `user_skill_level` 같은 개인 설정은 각 개발자의 `_bmad/config.user.toml` 아래에 둡니다. 팀 파일은 이를 건드리지 않는 것이 좋습니다.

**왜 중앙 설정인가요:** 에이전트별 파일은 *하나의* 에이전트가 활성화될 때 동작을 조정합니다. 중앙 설정은 명단을 사용하는 스킬이 명단을 조회할 때 *무엇을 보게 되는지*를 조정합니다. 어떤 에이전트가 존재하는지, 무엇이라고 불리는지, 어떤 팀에 속하는지, 저장소가 합의한 공유 설치 설정이 무엇인지입니다.

## IDE 세션 파일에 전역 규칙 보강

BMad 커스터마이징은 스킬이 활성화될 때 로드됩니다. 많은 IDE 도구는 스킬이 실행되기 전 **모든 세션 시작 시** 전역 지침 파일도 로드합니다(`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md` 등). BMad 스킬 밖에서도 지켜져야 하는 규칙은 거기에도 핵심만 반복하세요.

**중복해 둘 때:**

- 일반 채팅 대화(활성 스킬 없음)에서도 지켜야 할 만큼 중요한 규칙입니다
- 학습 데이터 기반 기본값이 모델을 다른 방향으로 끌 수 있어 이중 안전장치가 필요합니다
- 세션 파일을 부풀리지 않을 만큼 간결한 규칙입니다

**예시: 레시피 1의 dev 에이전트 규칙을 저장소의 `CLAUDE.md`에 한 줄로 보강.**

```markdown
<!-- 라이브러리 문서를 읽을 때는 학습 데이터 지식에 의존하기 전에
context7 MCP 도구(`mcp__context7__resolve_library_id` 이후
`mcp__context7__get_library_docs`)를 거칩니다. -->
```

한 문장이 매 세션에 로드됩니다. `bmad-agent-dev.toml` 커스터마이징과 짝을 이뤄 Amelia의 워크플로 안과 어시스턴트와의 임시 채팅 모두에 규칙을 적용합니다.

| 계층 | 범위 | 사용처 |
| --- | --- | --- |
| IDE 세션 파일(`CLAUDE.md` / `AGENTS.md`) | 모든 세션, 스킬 활성화 전 | BMad 밖에서도 살아야 하는 짧은 보편 규칙 |
| BMad 에이전트 커스터마이징 | 에이전트가 실행하는 모든 워크플로 | 에이전트 페르소나별 동작 |
| BMad 워크플로 커스터마이징 | 하나의 워크플로 실행 | 워크플로별 출력 형태, 게시 후크, 템플릿 |
| BMad 중앙 설정 | 에이전트 명단 + 공유 설치 설정 | 방에 누가 있고 팀이 어떤 공유 경로를 쓰는지 |

IDE 파일은 **간결하게** 유지하세요. 잘 고른 열두 줄이 긴 목록보다 효과적입니다. 모델은 이를 매 턴 읽고, 노이즈는 신호를 밀어냅니다.

## 레시피 6: 고급 통합 패턴

몇몇 BMad 워크플로는 레시피 1-5에서 다룬 기본을 넘어 더 풍부한 설정 영역을 노출합니다. 온디맨드 지식 소스, 자동 출력 게시, 완료 시점 문서 표준, 교체 가능한 템플릿 같은 패턴은 여러 워크플로에 걸쳐 나타납니다. 어떤 필드를 노출하는지는 워크플로의 `customize.toml`을 확인하세요. 아래 예시는 모든 필드를 노출하는 `bmad-prd`를 사용하지만, 같은 패턴은 해당 필드가 있는 어디서나 적용됩니다.

### 온디맨드 지식 소스(`external_sources`)

워크플로를 내부 지식 베이스, 경쟁사 데이터베이스, 컴플라이언스 참조에 연결합니다. 에이전트는 대화에서 일치하는 필요가 나타날 때만 온디맨드로 참조하고 선제적으로 호출하지 않습니다.

```toml
# _bmad/custom/bmad-prd.toml  (external_sources를 노출하는 모든 워크플로에서 같은 패턴 사용)

[workflow]
external_sources = [
  "사용자가 경쟁사나 시장 세그먼트를 언급하면 차별화 섹션 초안을 작성하기 전에 corp:competitive_db(category={project_name})를 조회하세요.",
  "규제 도메인(헬스케어, 핀테크, 교육)에서는 도메인별 섹션 초안을 작성하기 전에 corp:compliance_reference를 참고하세요.",
]
```

각 항목은 MCP 도구 이름, 트리거 조건, 도구에 필요한 필드를 자연어로 지정합니다. 런타임에 도구가 없으면 워크플로는 표준 동작으로 돌아가고 공백을 알립니다.

### 자동 출력 게시(`external_handoffs`)

워크플로가 완료된 뒤 완성된 산출물을 외부 기록 시스템으로 보냅니다. 레시피 3의 `on_complete`와 달리 `external_handoffs`는 전용 추가 배열입니다. 팀 항목이 쌓이고 각 전달 작업은 도구가 없을 때 점진적 기능 저하와 함께 독립 실행됩니다.

```toml
# _bmad/custom/bmad-prd.toml  (external_handoffs를 노출하는 모든 워크플로에서 같은 패턴 사용)

[workflow]
external_handoffs = [
  "완료 후 corp:confluence_upload(space_key='PROD', parent_page='PRDs', label='prd', author={user_name})로 prd.md와 addendum.md를 Confluence에 업로드하세요. 반환된 페이지 URL을 기록하고 보여 주세요.",
  "notion:create_page(database_id='abc123', title='PRD: ' + {project_name})로 Notion에도 복제하세요.",
]
```

지정된 도구가 없으면 전달 작업은 건너뛰고 표시됩니다. 로컬 파일은 항상 존재합니다.

### 완료 시점 문서 표준(`doc_standards`)

사람이 읽을 문서에 조직 작성 표준을 완료 시점에 적용합니다. 내용이 완료된 후, 사용자가 출력을 보기 전입니다. 각 항목은 `skill:`, `file:`, 일반 텍스트 지시문일 수 있으며 각 검토 단계는 병렬 서브에이전트로 실행됩니다.

```toml
# _bmad/custom/bmad-prd.toml  (doc_standards를 노출하는 모든 워크플로에서 같은 패턴 사용)

[workflow]
doc_standards = [
  "file:{project-root}/docs/enterprise/voice-and-tone.md",
  "모든 날짜는 ISO 8601 형식(YYYY-MM-DD)을 사용해야 합니다.",
  "'활용'을 사용한 곳은 모두 '사용'으로 바꾸세요.",
]
```

`doc_standards`는 추가 배열입니다. 팀 항목은 워크플로가 제공하는 기본값 위에 쌓입니다. 넓은 구조 검토가 좁은 문장 검토보다 먼저 와야 합니다.

### 교체 가능한 템플릿과 체크리스트

구조화된 문서를 만드는 워크플로는 일반적으로 템플릿과 체크리스트 경로를 오버라이드 가능한 스칼라 값으로 노출합니다. `{project-root}` 아래 조직 소유 파일을 가리키면 소스를 수정하지 않고 다른 구조를 강제할 수 있습니다.

```toml
# _bmad/custom/bmad-prd.toml

[workflow]
# 규제 산업용 PRD 구조
prd_template = "{project-root}/docs/enterprise/prd-template-hipaa.md"

# 조직별 검증 기준
validation_checklist = "{project-root}/docs/enterprise/prd-checklist-regulated.md"
```

에이전트는 템플릿이 정의한 구조에 적응합니다. 템플릿은 `{project-root}/docs/` 또는 `{project-root}/_bmad/custom/templates/` 아래에 두어 오버라이드 파일과 함께 버전 관리하세요. 다중 조직 저장소에서는 `.user.toml`로 개별 팀이 커밋된 팀 파일을 건드리지 않고 자체 템플릿을 가리키게 할 수 있습니다.

## 레시피 조합

여섯 레시피는 모두 조합됩니다. 현실적인 엔터프라이즈용 `bmad-product-brief` 오버라이드는 한 파일에서 `persistent_facts`(레시피 2), `on_complete`(레시피 3), `brief_template`(레시피 4)을 설정할 수 있습니다. 에이전트 수준 규칙(레시피 1)은 에이전트 이름의 별도 파일에 있고, 중앙 설정(레시피 5)은 공유 명단과 팀 설정을 고정하며, 고급 통합 패턴(레시피 6)은 외부 소스와 전달 작업을 설정합니다. 모든 계층은 나란히 적용됩니다.

```toml
# _bmad/custom/bmad-product-brief.toml (워크플로 수준)

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml (에이전트 수준 - Mary가 product-brief를 실행)

[agent]
persistent_facts = ["도메인이 헬스케어, 금융, 아동 데이터와 관련되면 항상 '규제 검토' 섹션을 포함하세요."]
```

결과: Mary는 페르소나 활성화에서 규제 리뷰 규칙을 로드합니다. 사용자가 제품 개요 메뉴 항목을 선택하면 워크플로는 자체 관례를 그 위에 로드하고 엔터프라이즈 템플릿에 작성한 뒤 완료 시 Confluence에 게시합니다. 모든 계층이 함께 작동하며 BMad 소스는 수정하지 않습니다.

## 문제 해결

**오버라이드가 적용되지 않나요?** 파일이 `_bmad/custom/` 아래 정확한 스킬 디렉터리 이름으로 있는지 확인하세요(예: `bmad-agent-dev.toml`, `bmad-dev.toml` 아님). [BMad 커스터마이징 방법](./customize-bmad.md)을 참고하세요.

**MCP 도구 이름을 모르겠나요?** 현재 세션에서 MCP 서버가 노출하는 정확한 이름을 사용하세요. 확실하지 않다면 Claude Code에 사용 가능한 MCP 도구 목록을 보여달라고 요청하세요. `persistent_facts`나 `on_complete`에 하드코딩한 이름은 MCP 서버가 연결되어 있지 않으면 동작하지 않습니다.

**패턴이 내 설정에 맞지 않나요?** 위 레시피는 예시입니다. 기반 메커니즘(3계층 병합, 구조 규칙, 에이전트가 여러 워크플로에 걸쳐 동작하는 방식)은 훨씬 많은 패턴을 지원합니다. 필요에 맞게 조합하세요.
