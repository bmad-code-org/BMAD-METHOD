---
title: 'BMad 커스터마이징 방법'
description: 업데이트 호환성을 유지하면서 에이전트와 워크플로를 커스터마이징합니다
sidebar:
  order: 8
---

설치된 파일을 수정하지 않고 에이전트 페르소나를 조정하고, 도메인 컨텍스트를 주입하고, 기능을 추가하고, 워크플로 동작을 설정하세요. 커스터마이징은 업데이트 후에도 유지됩니다.

:::tip[TOML을 직접 쓰고 싶지 않나요? `bmad-customize`를 사용하세요]
`bmad-customize` 스킬은 이 문서에서 설명하는 **스킬별 에이전트/워크플로 오버라이드 영역**을 안내형으로 작성해 주는 도우미입니다. 설치된 항목 중 무엇을 커스터마이즈할 수 있는지 스캔하고, 의도에 맞는 영역(에이전트 또는 워크플로)을 고르게 하고, 오버라이드 파일을 작성하고, 병합이 적용되었는지 검증합니다. 중앙 설정 오버라이드(`_bmad/custom/config.toml`)는 v1 범위 밖이므로 아래 중앙 설정 섹션에 따라 직접 작성해야 합니다.
:::

## 사용 시점

- 에이전트의 성격이나 커뮤니케이션 스타일을 바꾸고 싶습니다
- 에이전트가 계속 기억할 사실이 필요합니다(예: "우리 조직은 AWS만 사용")
- 매 세션 시작 시 에이전트가 반드시 수행해야 하는 절차적 단계를 추가하고 싶습니다
- 자체 스킬이나 프롬프트를 실행하는 커스텀 메뉴 항목을 추가하고 싶습니다
- 팀 공통 커스터마이징은 git에 커밋하고, 개인 선호는 그 위에 덧씌우고 싶습니다

:::note[필수 조건]

- 프로젝트에 BMad 설치([BMad 설치 방법](./install-bmad.md) 참고)
- PATH의 Python 3.11+(병합 스크립트용, stdlib `tomllib`만 사용하며 `pip install`, `uv`, virtualenv 불필요)
- TOML 파일을 편집할 텍스트 에디터
:::

## 작동 방식

커스터마이즈 가능한 모든 스킬은 기본값이 들어 있는 `customize.toml` 파일을 제공합니다. 이 파일은 스킬의 전체 커스터마이징 영역을 정의합니다. 무엇을 바꿀 수 있는지 보려면 이 파일을 읽으세요. 이 파일은 직접 편집하지 않습니다. 대신 바꾸려는 필드만 담은 오버라이드 파일을 만듭니다.

### 3계층 오버라이드 모델

```text
우선순위 1(승리): _bmad/custom/{skill-name}.user.toml  (개인, git 무시)
우선순위 2:        _bmad/custom/{skill-name}.toml        (팀/조직, 커밋)
우선순위 3(마지막): 스킬 자체 customize.toml              (기본값)
```

`_bmad/custom/` 폴더는 처음엔 비어 있습니다. 누군가 실제로 커스터마이즈할 때만 파일이 생깁니다.

### 병합 규칙(필드명이 아니라 모양 기준)

병합 스크립트는 네 가지 구조 규칙을 적용합니다. 필드명은 특별 취급되지 않습니다. 값의 구조가 동작을 결정합니다.

| 모양 | 규칙 |
| --- | --- |
| 스칼라 값(문자열, 정수, 불리언, 실수) | 오버라이드가 이깁니다 |
| 테이블 | 깊은 병합(재귀적으로 이 규칙을 적용) |
| 모든 항목이 **같은** 식별자 필드(`code` 또는 `id`)를 공유하는 테이블 배열 | 해당 키로 병합합니다. 같은 키는 **제자리에서 교체**, 새 키는 **추가**됩니다 |
| 그 밖의 배열(스칼라 값, 식별자가 없는 테이블, `code`와 `id`가 섞인 배열) | **추가**됩니다. 기본값, 팀, 사용자 순서입니다 |

**삭제 메커니즘은 없습니다.** 오버라이드는 기본값 항목을 지울 수 없습니다. 기본 메뉴 항목을 숨겨야 한다면 같은 `code`로 동작 없는 설명이나 프롬프트를 넣어 덮어쓰세요. 배열을 더 깊게 재구성해야 한다면 스킬을 포크하세요.

**`code` / `id` 관례.** BMad는 테이블 배열의 병합 키로 `code`(예: `"BP"`, `"R1"` 같은 짧은 식별자)와 `id`(더 긴 안정 식별자)를 사용합니다. 직접 만든 테이블 배열이 추가 전용이 아니라 키로 교체 가능해야 한다면 한 가지 관례만 고르고 전체 배열에서 일관되게 사용하세요. 일부 항목은 `code`, 일부 항목은 `id`를 쓰면 키 병합 대신 추가 방식으로 처리됩니다.

### 일부 에이전트 필드는 읽기 전용입니다

`agent.name`과 `agent.title`은 기준 메타데이터로 `customize.toml`에 있지만, 에이전트의 SKILL.md는 런타임에 이를 읽지 않습니다. 정체성은 하드코딩되어 있습니다. 오버라이드 파일에 `name = "Bob"`을 넣어도 효과가 없습니다. 정말 다른 이름의 에이전트가 필요하다면 스킬 폴더를 복사해 이름을 바꾸고 커스텀 스킬로 배포하세요.

## 단계

### 1. 스킬의 커스터마이징 영역 찾기

설치된 디렉터리에서 스킬의 `customize.toml`을 확인합니다. PM 에이전트 예:

```text
.claude/skills/bmad-agent-pm/customize.toml
```

경로는 IDE별로 다릅니다. Cursor는 `.cursor/skills/`, Cline은 `.cline/skills/`를 사용합니다.

이 파일이 기준 스키마입니다. 읽기 전용 정체성 필드를 제외하고 보이는 모든 필드는 커스터마이즈할 수 있습니다.

### 2. 오버라이드 파일 만들기

프로젝트 루트에 `_bmad/custom/` 디렉터리가 없다면 만듭니다. 그런 다음 스킬 이름을 딴 파일을 만듭니다.

```text
_bmad/custom/
  bmad-agent-pm.toml        # 팀 오버라이드(git에 커밋)
  bmad-agent-pm.user.toml   # 개인 선호(git에서 무시)
```

:::caution[전체 `customize.toml`을 복사하지 마세요]
오버라이드 파일은 **희소**입니다. 바꾸는 필드만 포함하세요. 생략한 필드는 아래 계층(팀은 기본값에서, 사용자는 팀 또는 기본값에서) 자동 상속됩니다.

전체 `customize.toml`을 오버라이드로 복사하면 해롭습니다. 다음 업데이트가 새 기본값을 제공해도 오버라이드 파일이 옛 값을 고정하기 때문에 릴리스마다 조용히 어긋납니다.
:::

**예시 - 아이콘을 바꾸고 원칙 하나 추가:**

```toml
# _bmad/custom/bmad-agent-pm.toml
# 바꾸는 필드만 둡니다. 나머지는 모두 상속됩니다.

[agent]
icon = "🏥"
principles = [
  "FDA 감사를 통과할 수 없는 것은 출시하지 않습니다.",
]
```

이 설정은 새 원칙을 기본값에 추가하고(제공된 원칙은 그대로 유지), 아이콘을 교체합니다. 나머지 필드는 제공된 값으로 남습니다.

### 3. 필요한 항목 커스터마이즈하기

아래 예시는 BMad의 평면 에이전트 스키마를 가정합니다. 필드는 `[agent]` 아래에 직접 위치하며 중첩된 `metadata`나 `persona` 하위 테이블은 없습니다.

**스칼라 값(icon, 역할, 정체성, communication_style).** 스칼라 값 오버라이드가 이깁니다. 바꾸는 필드만 설정하면 됩니다.

```toml
# _bmad/custom/bmad-agent-pm.toml

[agent]
icon = "🏥"
role = "규제 대상 헬스케어 도메인의 제품 발견을 이끕니다."
communication_style = "정밀하고 규제를 의식하며, 초반부터 컴플라이언스 관점의 질문을 던집니다."
```

**영구 사실, 원칙, 활성화 후크(추가 배열).** 아래 네 배열은 추가 전용입니다. 팀 항목은 기본값 뒤에 실행되고, 사용자 항목은 마지막에 실행됩니다.

```toml
[agent]
# 에이전트가 세션 내내 염두에 둘 정적 사실입니다. 조직 규칙, 도메인
# 상수, 사용자 선호 등이 여기에 들어갑니다. 런타임 메모리 사이드카와는 다릅니다.
#
# 각 항목은 문장 그대로이거나, 내용을 사실로 로드하는 `file:` 참조입니다
# glob 패턴도 지원합니다.
persistent_facts = [
  "우리 조직은 AWS만 사용합니다. GCP나 Azure를 제안하지 마세요.",
  "모든 PRD는 엔지니어링 착수 전에 법무 승인을 받아야 합니다.",
  "대상 사용자는 환자가 아니라 임상의입니다. 예시도 그에 맞춰 구성하세요.",
  "file:{project-root}/docs/compliance/hipaa-overview.md",
  "file:{project-root}/_bmad/custom/company-glossary.md",
]

# 에이전트의 가치 체계에 추가합니다
principles = [
  "FDA 감사를 통과할 수 없는 것은 출시하지 않습니다.",
  "사용자 가치를 먼저, 컴플라이언스는 항상 지킵니다.",
]

# 표준 활성화(페르소나, persistent_facts, 설정, 인사) 전에 실행합니다.
activation_steps_prepend = [
  "{project-root}/docs/compliance/를 스캔하고 HIPAA 관련 문서를 컨텍스트로 로드하세요.",
]

# 인사 후, 메뉴 전에 실행합니다.
activation_steps_append = [
  "{project-root}/_bmad/custom/company-glossary.md가 있으면 읽으세요.",
]
```

두 후크는 역할이 다릅니다. Prepend는 인사 전에 실행되어 인사 자체를 개인화하는 데 필요한 컨텍스트를 로드할 수 있습니다. Append는 인사 후 실행되어 무거운 스캔이 끝날 때까지 사용자가 빈 화면만 보지 않게 합니다.

**메뉴 커스터마이징(`code`로 병합).** 메뉴는 테이블 배열입니다. 각 항목에는 `code` 필드가 있으므로 병합 스크립트는 코드로 병합합니다. 같은 코드는 제자리에서 교체되고, 새 코드는 추가됩니다.

TOML 테이블 배열 문법은 항목마다 `[[agent.menu]]`를 사용합니다.

```toml
# 기존 CE 항목을 커스텀 스킬로 교체
[[agent.menu]]
code = "CE"
description = "우리 전달 프레임워크로 에픽 생성"
skill = "custom-create-epics"

# 새 항목 추가(기본값에는 RC 코드가 없음)
[[agent.menu]]
code = "RC"
description = "컴플라이언스 사전 점검 실행"
prompt = """
{project-root}/_bmad/custom/compliance-checklist.md를 읽고
{planning_artifacts}의 모든 문서를 그 기준에 맞춰 스캔하세요.
공백이 있으면 관련 규제 조항을 인용해 보고하세요.
"""
```

각 메뉴 항목은 `skill`(등록된 스킬 호출) 또는 `prompt`(텍스트 직접 실행) 중 정확히 하나를 가집니다. 오버라이드에 나열하지 않은 항목은 기본값을 유지합니다.

**파일 참조.** `persistent_facts`, `activation_steps_prepend`/`activation_steps_append`, 메뉴 항목의 `prompt`처럼 텍스트가 파일을 가리켜야 할 때는 `{project-root}`를 기준으로 한 전체 경로를 사용하세요. 파일이 `_bmad/custom/`에서 오버라이드 옆에 있더라도 `{project-root}/_bmad/custom/info.md`처럼 전체 경로를 적습니다.

### 4. 개인 vs 팀

**팀 파일**(`bmad-agent-pm.toml`): git에 커밋합니다. 조직 전체에 공유됩니다. 컴플라이언스 규칙, 회사 페르소나, 커스텀 기능에 사용합니다.

**개인 파일**(`bmad-agent-pm.user.toml`): 자동으로 git에서 무시됩니다. 말투 조정, 개인 워크플로 선호 사항, 에이전트가 기억해야 하는 개인 사실에 사용합니다.

```toml
# _bmad/custom/bmad-agent-pm.user.toml

[agent]
persistent_facts = [
  "선택지를 제시할 때 항상 대략적인 복잡도 추정(낮음/중간/높음)을 포함하세요.",
]
```

## 해석이 작동하는 방식

활성화 시 에이전트의 SKILL.md가 공유 Python 스크립트를 실행해 3계층 병합을 수행하고 해석된 블록을 JSON으로 반환합니다. 스크립트는 Python 표준 라이브러리의 `tomllib`만 사용하므로 기본 `python3`이면 충분합니다.

```bash
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill {skill-root} \
  --key agent
```

**요구사항**: Python 3.11+(이전 버전에는 `tomllib`이 없습니다). `pip install`, `uv`, virtualenv는 필요 없습니다. `python3 --version`으로 확인하세요. Homebrew 없는 macOS나 Ubuntu 22.04 같은 플랫폼은 기본 `python3`이 3.10 이하일 수 있으므로 3.11+를 별도 설치해야 할 수 있습니다.

`--skill`은 스킬이 설치된 디렉터리(`customize.toml`이 있는 위치)를 가리킵니다. 스킬 이름은 디렉터리의 basename에서 파생되며, 스크립트는 `_bmad/custom/{skill-name}.toml`과 `{skill-name}.user.toml`을 자동으로 찾습니다.

유용한 호출:

```bash
# 전체 에이전트 블록 해석
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent

# 단일 필드 해석
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm \
  --key agent.icon

# 전체 덤프
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /abs/path/to/bmad-agent-pm
```

출력은 항상 JSON입니다. 특정 플랫폼에서 스크립트를 사용할 수 없다면 SKILL.md는 에이전트에게 세 TOML 파일을 직접 읽고 같은 병합 규칙을 적용하라고 지시합니다.

## 워크플로 커스터마이징

`bmad-product-brief`처럼 여러 단계 프로세스를 구동하는 워크플로(스킬)도 에이전트와 같은 오버라이드 메커니즘을 공유합니다. 커스터마이즈 가능한 영역은 `[agent]` 대신 `[workflow]` 아래에 있습니다.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
activation_steps_prepend = [
  "Load {project-root}/docs/product/north-star-principles.md as context.",
]

activation_steps_append = []

persistent_facts = [
  "모든 개요에는 명시적인 규제 위험 섹션이 포함되어야 합니다.",
  "file:{project-root}/docs/compliance/product-brief-checklist.md",
]

on_complete = "개요를 세 개의 글머리표로 요약하고 gws-gmail-send 스킬로 이메일 발송을 제안하세요."
```

동일한 필드 관례가 에이전트/워크플로 경계를 넘습니다. `activation_steps_prepend`/`activation_steps_append`, `persistent_facts`(`file:` 참조 포함), 그리고 키 기반 병합용 `code`/`id`가 있는 메뉴 스타일 `[[...]]` 테이블이 모두 같은 방식으로 동작합니다. 병합 스크립트는 최상위 키와 관계없이 네 구조 규칙을 적용합니다. SKILL.md 참조는 네임스페이스를 따릅니다: `{workflow.activation_steps_prepend}`, `{workflow.persistent_facts}`, `{workflow.on_complete}`. 워크플로가 노출하는 추가 필드(출력 경로, 토글, 리뷰 설정, 단계 플래그 등)도 같은 구조 기반 병합 규칙을 따릅니다. 무엇을 커스터마이즈할 수 있는지는 워크플로의 `customize.toml`을 읽으세요.

### 활성화 순서

커스터마이즈 가능한 워크플로는 후크가 언제 실행되는지 알 수 있도록 고정된 순서로 활성화됩니다.

1. `[workflow]` 블록 해석(기본값 → 팀 → 사용자 병합)
2. `activation_steps_prepend`를 순서대로 실행
3. 실행의 기반 컨텍스트로 `persistent_facts` 로드
4. 설정(`_bmad/bmm/config.yaml`) 로드 및 표준 변수(프로젝트 이름, 언어, 경로, 날짜) 해석
5. 사용자에게 인사
6. `activation_steps_append`를 순서대로 실행

6단계 이후 워크플로 본문이 시작됩니다. 인사를 개인화하기 전에 컨텍스트가 필요하면 `activation_steps_prepend`를 사용하고, 설정이 무거워 사용자에게 인사를 먼저 보여주고 싶다면 `activation_steps_append`를 사용하세요.

### 현재 초기 단계의 범위

커스터마이징은 점진적으로 출시됩니다. 위에서 문서화한 `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`는 모든 커스터마이즈 가능한 워크플로가 노출하는 **기준 영역**이며 버전 간 안정적으로 유지됩니다. 오늘 당장 사전/사후 단계 주입, 기반 컨텍스트 고정, 후속 작업 트리거 같은 큰 단위의 제어를 제공합니다.

시간이 지나면 개별 워크플로가 실제로 하는 일에 맞춘 **더 세밀한 커스터마이징 지점**을 노출할 것입니다. 단계별 토글, 단계 플래그, 출력 템플릿 경로, 리뷰 게이트 같은 것들입니다. 그런 항목이 추가되면 기준 필드를 대체하지 않고 그 위에 쌓이므로 오늘 작성한 커스터마이징은 계속 동작합니다.

아직 노출되지 않은 세밀한 조절점이 필요하다면 `activation_steps_*`와 `persistent_facts`로 동작을 조정하거나, 원하는 커스터마이징 지점을 구체적으로 설명하는 이슈를 열어 주세요.

## 중앙 설정

스킬별 `customize.toml`은 **깊은 동작**(후크, 메뉴, persistent_facts, 단일 에이전트/워크플로의 페르소나 오버라이드)을 다룹니다. 별도 영역은 **공유 상태**를 다룹니다. 설치 답변과 `bmad-party-mode`, `bmad-retrospective`, `bmad-advanced-elicitation` 같은 외부 스킬이 사용하는 에이전트 명단입니다. 이 영역은 프로젝트 루트의 네 TOML 파일에 있습니다.

```text
_bmad/config.toml               (설치 프로그램 소유)  팀 범위:     설치 답변 + 에이전트 명단
_bmad/config.user.toml          (설치 프로그램 소유)  사용자 범위: user_name, 언어, 스킬 수준
_bmad/custom/config.toml        (사람이 작성)         팀 오버라이드(git에 커밋)
_bmad/custom/config.user.toml   (사람이 작성)         개인 오버라이드(git에서 무시)
```

### 4계층 병합

```text
우선순위 1(승리): _bmad/custom/config.user.toml
우선순위 2:        _bmad/custom/config.toml
우선순위 3:        _bmad/config.user.toml
우선순위 4(기반):  _bmad/config.toml
```

스킬별 커스터마이즈와 같은 구조 규칙을 사용합니다. 스칼라 값 오버라이드, 테이블 깊은 병합, `code`/`id` 키 기반 배열 병합, 그 밖의 배열 추가입니다.

### 무엇이 어디에 있나요?

설치 프로그램은 `module.yaml`의 각 프롬프트에 선언된 `scope:`에 따라 답변을 나눕니다.

- `[core]`와 `[modules.<code>]` 섹션 - 설치 답변입니다. `team` 범위는 `_bmad/config.toml`에, `user` 범위는 `_bmad/config.user.toml`에 들어갑니다.
- `[agents.<code>]` - 각 모듈의 `module.yaml` `agents:` 블록에서 추출한 에이전트 핵심 정보(코드, 이름, 직함, 아이콘, 설명, 팀)입니다. 항상 팀 범위입니다.

### 편집 규칙

- `_bmad/config.toml`과 `_bmad/config.user.toml`은 **설치할 때마다 재생성**됩니다. 읽기 전용 출력으로 취급하세요. 직접 수정하면 다음 설치에서 덮어쓰입니다. 설치 답변을 지속적으로 바꾸려면 설치 프로그램을 다시 실행하거나 `_bmad/custom/config.toml`에서 값을 덮어쓰세요.
- `_bmad/custom/config.toml`과 `_bmad/custom/config.user.toml`은 설치 프로그램이 **절대 건드리지 않습니다**. 커스텀 에이전트, 에이전트 설명자 오버라이드, 팀 강제 설정, 설치 답변과 무관하게 고정하려는 값을 넣는 올바른 영역입니다.

### 예시 - 에이전트 리브랜딩

```toml
# _bmad/custom/config.toml (git에 커밋, 모든 개발자에게 적용)

[agents.bmad-agent-pm]
description = "헬스케어 PM - 규제를 의식하고 이해관계자 중심이며, FDA 관점의 질문을 먼저 던집니다."
icon = "🏥"
```

병합 스크립트가 설치 프로그램이 작성한 `[agents.bmad-agent-pm]` 위로 병합합니다. `bmad-party-mode`와 명단을 사용하는 스킬은 새 설명을 자동으로 사용합니다.

### 예시 - 가상 에이전트 추가

```toml
# _bmad/custom/config.user.toml (개인용, git에서 무시)

[agents.kirk]
team = "startrek"
name = "Captain James T. Kirk"
title = "우주선 선장"
icon = "🖖"
description = "대담하고 규칙을 굽힐 줄 아는 지휘관입니다. 극적인 쉼표를 두고 말하며 지휘의 무게를 소리 내어 생각합니다."
```

스킬 폴더가 없어도 핵심 정보만으로 파티 모드가 Kirk를 하나의 목소리로 생성할 수 있습니다. `team` 필드로 필터링해 엔터프라이즈 승무원만 라운드테이블에 초대할 수 있습니다.

### 예시 - 모듈 설치 설정 오버라이드

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "/shared/org-planning-artifacts"
```

오버라이드는 각 개발자가 로컬 설치 중 답한 값보다 우선합니다. 팀 관례를 고정할 때 유용합니다.

### 어떤 영역을 사용할까요?

| 필요 | 사용 |
| --- | --- |
| 모든 개발 워크플로에 MCP 도구 호출 추가 | 스킬별: `_bmad/custom/bmad-agent-dev.toml` `persistent_facts` |
| 에이전트에 메뉴 항목 추가 | 스킬별: `_bmad/custom/bmad-agent-{role}.toml` `[[agent.menu]]` |
| 워크플로의 출력 템플릿 교체 | 스킬별: `_bmad/custom/{workflow}.toml` 스칼라 값 오버라이드 |
| 에이전트 공개 설명자 리브랜딩 | **중앙**: `_bmad/custom/config.toml` `[agents.<code>]` |
| 커스텀 또는 가상 에이전트를 명단에 추가 | **중앙**: `_bmad/custom/config.*.toml` 새 `[agents.<code>]` 항목 |
| 팀 강제 설치 설정 고정 | **중앙**: `_bmad/custom/config.toml` `[modules.<code>]` 또는 `[core]` |

필요에 따라 한 프로젝트에서 두 영역을 함께 사용하세요.

## 실전 예시

에이전트가 실행하는 모든 워크플로에 걸친 동작 조정, 조직 관례 강제, Confluence와 Jira로 출력 게시, 에이전트 명단 커스터마이즈, 출력 템플릿 교체 같은 엔터프라이즈 지향 레시피는 [조직을 위해 BMad 확장하기](./expand-bmad-for-your-org.md)를 참고하세요.

## 문제 해결

**커스터마이징이 보이지 않나요?**

- 파일이 `_bmad/custom/`에 올바른 스킬 이름으로 있는지 확인하세요
- TOML 문법을 확인하세요. 문자열은 따옴표가 필요하고, 테이블 헤더는 `[section]`, 테이블 배열은 `[[section]]`입니다. 테이블의 스칼라 값 또는 배열 키는 해당 테이블의 `[[subtables]]`보다 먼저 와야 합니다
- 에이전트의 경우 커스터마이징은 `[agent]` 아래에 있습니다. 그 헤더 아래에 쓴 필드는 다른 테이블 헤더가 시작될 때까지 `agent`에 속합니다
- `agent.name`과 `agent.title`은 읽기 전용입니다. 오버라이드해도 효과가 없습니다

**업데이트가 커스터마이징을 망가뜨렸나요?**

- 전체 `customize.toml`을 오버라이드 파일에 복사했나요? **하지 마세요.** 오버라이드 파일은 바꾸는 필드만 포함해야 합니다. 전체 복사는 옛 기본값을 고정하고 릴리스마다 조용히 어긋납니다. 오버라이드를 변경분만 남기도록 줄이세요.

**무엇을 커스터마이즈할 수 있는지 봐야 하나요?**

- `bmad-customize` 스킬을 실행하세요. 프로젝트에 설치된 모든 커스터마이즈 가능한 스킬을 열거하고, 이미 오버라이드가 있는 항목을 보여주며, 추가 또는 업데이트 과정을 안내합니다
- 또는 스킬의 `customize.toml`을 직접 읽으세요. `name`과 `title`을 제외하고 모든 필드가 커스터마이즈 가능합니다

**초기화가 필요하나요?**

- `_bmad/custom/`에서 오버라이드 파일을 삭제하세요. 스킬은 내장 기본값으로 돌아갑니다
