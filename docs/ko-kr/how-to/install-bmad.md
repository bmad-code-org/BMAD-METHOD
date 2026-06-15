---
title: 'BMad 설치 방법'
description: 로컬 개발, 팀, CI를 위해 BMad를 설치, 업데이트, 고정합니다
sidebar:
  order: 1
---

프로젝트에 BMad를 설정하려면 `npx bmad-method install`을 사용하세요. 하나의 명령으로 최초 설치, 업그레이드, 채널 전환, 스크립트 기반 CI 실행을 처리합니다. 이 페이지에서 그 전체를 다룹니다.

## 사용 시점

- BMad로 새 프로젝트를 시작합니다
- 기존 설치에 모듈을 추가하거나 제거합니다
- 모듈을 main 브랜치 최신 커밋으로 전환하거나 특정 릴리스에 고정합니다
- CI 파이프라인, Dockerfile, 엔터프라이즈 배포를 위해 설치를 스크립트화합니다

:::note[필수 조건]

- **Node.js** 20+ (설치 프로그램에 필요)
- **Git** (외부 모듈 복제용)
- Claude Code 또는 Cursor 같은 **AI 도구**(지원 도구 목록은 `npx bmad-method install --list-tools`로 확인)

:::

## 최초 설치(빠른 경로)

```bash
npx bmad-method install
```

대화형 흐름은 다섯 가지를 묻습니다.

1. 설치 디렉터리(기본값은 현재 작업 디렉터리)
2. 설치할 모듈(core, bmm, bmb, cis, gds, tea 체크박스)
3. **"Ready to install (all stable)?"** - **Yes**를 선택하면 모든 외부 모듈의 최신 릴리스 태그를 사용합니다
4. 연동할 AI 도구/IDE(`claude-code`, `cursor` 등)
5. 모듈별 설정(이름, 언어, 출력 폴더)

기본값을 받아들이면 선택한 도구에 맞게 설정된 각 모듈의 최신 안정 릴리스가 설치됩니다.

:::tip[최신 사전 릴리스만 원하나요?]

```bash
npx bmad-method@next install
```

core와 bmm의 더 새로운 스냅샷이 포함된 사전 릴리스 설치 프로그램을 실행합니다. 변화는 더 잦지만 개발과 릴리스 사이의 지연이 줄어듭니다.
:::

## 특정 버전 선택

디스크에 무엇이 설치되는지는 두 개의 독립 축으로 제어됩니다.

### 축 1: 외부 모듈 채널

bmb, cis, gds, tea, 커뮤니티 모듈 등 모든 외부 모듈은 세 채널 중 하나로 설치됩니다.

| 채널 | 설치되는 것 | 누가 선택하나 |
| --- | --- | --- |
| `stable`(기본값) | 가장 높은 시맨틱 버전 릴리스 태그. `v2.0.0-alpha.1` 같은 사전 릴리스는 제외됩니다. | 대부분의 사용자 |
| `next` | 설치 시점의 main 브랜치 최신 커밋 | 기여자, 초기 채택자 |
| `pinned` | 지정한 특정 태그 | 엔터프라이즈 설치, CI 재현성 |

채널은 모듈마다 정할 수 있습니다. bmb는 `next`로 두고 cis는 `stable`로 둘 수 있습니다. 아래 플래그로 자유롭게 섞을 수 있습니다.

### 축 2: 설치 프로그램 바이너리 버전

`bmad-method` npm 패키지 자체에는 두 npm 배포 태그(dist-tag)가 있습니다.

| 명령 | 받는 것 |
| --- | --- |
| `npx bmad-method install`(`@latest`) | 최신 안정 설치 프로그램 릴리스 |
| `npx bmad-method@next install` | main에 푸시될 때마다 자동 배포되는 최신 사전 릴리스 설치 프로그램 |

**설치 프로그램 바이너리가 core와 bmm 버전을 결정합니다.** 이 두 모듈은 별도 저장소에서 복제되지 않고 설치 프로그램 패키지 안에 번들됩니다.

### core와 bmm에 자체 채널이 없는 이유

두 모듈은 실행한 설치 프로그램 바이너리에 묶여 있습니다.

- `npx bmad-method install` → 최신 안정 core 및 bmm
- `npx bmad-method@next install` → 사전 릴리스 core 및 bmm
- `node /path/to/local-checkout/tools/installer/bmad-cli.js install` → 로컬 체크아웃의 내용

`--pin bmm=v6.3.0`과 `--next=bmm`은 번들 모듈에는 효과가 없고, 시도하면 설치 프로그램이 경고합니다. 향후 릴리스에서 bmm가 설치 프로그램 패키지에서 분리되면 bmb처럼 적절한 채널 선택기를 갖게 됩니다.

## 기존 설치 업데이트

이미 `_bmad/`가 있는 디렉터리에서 `npx bmad-method install`을 실행하면 메뉴가 나타납니다.

| 실제 메뉴 선택 | 하는 일 |
| --- | --- |
| **Quick Update** | 기존 설정으로 설치를 다시 실행합니다. 파일을 새로 고치고, 안정 채널의 패치와 마이너 업그레이드를 적용하며, 메이저 업그레이드는 거부합니다. 빠르고 비대화형입니다. |
| **Modify Install** | 전체 대화형 흐름입니다. 모듈을 추가/제거하고, 설정을 다시 구성하고, 기존 모듈 채널을 검토하고 전환할 수 있습니다. |

### 업그레이드 프롬프트

`Modify`가 `stable`에 설치된 모듈의 새 안정 태그를 감지하면 변경 폭을 분류하고 그에 맞게 묻습니다.

| 업그레이드 유형 | 예시 | 기본값 |
| --- | --- | --- |
| 패치 | v1.7.0 → v1.7.1 | `Y` |
| 마이너 | v1.7.0 → v1.8.0 | `Y` |
| 메이저 | v1.7.0 → v2.0.0 | **`N`** |

메이저 업그레이드는 호환성 깨짐이 예상치 못한 "불안정"으로 나타나는 경우가 많기 때문에 기본값이 `N`입니다. 프롬프트에는 변경 내용을 읽을 수 있는 GitHub 릴리스 노트 URL이 포함됩니다.

`--yes`에서는 패치와 마이너 업그레이드가 자동 적용됩니다. 메이저 업그레이드는 고정된 채로 유지됩니다. 비대화형으로 수락하려면 `--pin <code>=<new-tag>`를 전달하세요.

### 모듈 채널 전환

**대화형:** **Modify**를 선택하고 `"Review channel assignments?"`에 **Yes**로 답한 뒤, 각 외부 모듈에서 Keep, Switch to stable, Switch to next, Pin to a tag 중 하나를 선택합니다.

**플래그로:** 다음 섹션의 레시피가 일반적인 경우를 다룹니다.

## Headless CI

### 플래그 참조

| 플래그 | 목적 |
| --- | --- |
| `--yes`, `-y` | 모든 프롬프트를 건너뛰고 플래그 값과 기본값을 수락합니다 |
| `--directory <path>` | 이 디렉터리에 설치합니다(기본값: 현재 작업 디렉터리) |
| `--modules <a,b,c>` | 정확한 모듈 집합입니다. core는 자동 추가됩니다. 증분 목록이 아니므로 유지하려는 모든 것을 나열하세요 |
| `--tools <a,b>` | IDE/도구 선택입니다. 새 `--yes` 설치에는 필수입니다. 유효 ID는 `--list-tools`로 확인하세요 |
| `--list-tools` | 지원되는 모든 도구/IDE ID와 대상 디렉터리를 출력하고 종료합니다 |
| `--action <type>` | `install`, `update`, `quick-update`. 기본값은 기존 설치 상태에 따라 달라집니다 |
| `--custom-source <urls>` | Git URL 또는 로컬 경로에서 커스텀 모듈을 설치합니다 |
| `--channel <stable\|next>` | 모든 외부 모듈에 적용합니다(`--all-stable` / `--all-next` 별칭) |
| `--all-stable` | `--channel=stable` 별칭 |
| `--all-next` | `--channel=next` 별칭 |
| `--next=<code>` | 한 모듈을 next 채널에 둡니다. 반복 가능합니다 |
| `--pin <code>=<tag>` | 한 모듈을 특정 태그에 고정합니다. 반복 가능합니다 |
| `--set <module>.<key>=<value>` | 모듈 설정 옵션을 비대화형으로 설정합니다(권장, [모듈 설정 오버라이드](#모듈-설정-오버라이드) 참고). 반복 가능합니다 |
| `--list-options [module]` | 내장 및 로컬 캐시된 공식 모듈의 모든 `--set` 키를 출력하고 종료합니다. 모듈 코드를 전달하면 범위를 좁힙니다 |
| `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder` | `--set core.<key>=<value>`와 동등한 레거시 단축 플래그입니다(계속 지원) |

플래그가 겹칠 때 우선순위는 `--pin` > `--next=` > `--channel` / `--all-*` > 레지스트리 기본값(`stable`)입니다.

:::note[해결 예시]
`--all-next --pin cis=v0.2.0`은 bmb, gds, tea를 next에 두고 cis를 v0.2.0에 고정합니다.
:::

### 레시피

**기본 설치 - 모든 것을 최신 안정 버전으로:**

```bash
npx bmad-method install --yes --modules bmm,bmb,cis --tools claude-code
```

**엔터프라이즈 고정 - 바이트 단위로 재현 가능:**

```bash
npx bmad-method install --yes \
  --modules bmm,bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.2.0 \
  --tools claude-code
```

**최신 개발판 - 외부 모듈을 main 브랜치 최신 커밋으로:**

```bash
npx bmad-method install --yes --modules bmm,bmb --all-next --tools claude-code
```

**기존 설치에 모듈 추가**(나머지는 유지):

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,gds
```

`--tools`는 의도적으로 생략했습니다. `--action update`는 최초 설치 때 설정한 도구를 재사용합니다.

**채널 혼합 - bmb는 next, gds는 stable:**

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,cis,gds \
  --next=bmb
```

### 모듈 설정 오버라이드

`--set <module>.<key>=<value>`는 모듈 설정 옵션을 비대화형으로 설정합니다. 반복 가능하고 앞으로 추가될 모듈에도 같은 방식으로 적용됩니다. 이 플래그는 설치 후 패치로 적용됩니다. 설치 프로그램이 정상 흐름을 먼저 실행한 뒤 `--set`이 각 값을 `_bmad/config.toml`(팀 범위) 또는 `_bmad/config.user.toml`(사용자 범위), 그리고 `_bmad/<module>/config.yaml`에 갱신 또는 삽입하여 선언된 값이 다음 설치로 이어지게 합니다.

**예시 - 명시적 프로젝트 지식과 스킬 수준으로 bmm 설치:**

```bash
npx bmad-method install --yes \
  --modules bmm \
  --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```

**모듈에서 사용할 수 있는 키 찾기:**

```bash
npx bmad-method install --list-options bmm
```

`--list-options`(인자 없음)는 설치 프로그램이 로컬에서 찾을 수 있는 모든 키를 나열합니다. 내장 모듈(`core`, `bmm`)과 현재 캐시된 공식 모듈이 포함됩니다. 캐시는 머신별이고 지워질 수 있으므로, 이전에 설치한 공식 모듈도 새 체크아웃이나 임시 CI 작업자에서는 다시 설치되기 전까지 나타나지 않습니다. 커뮤니티 및 커스텀 모듈은 여기서 열거되지 않습니다. 모듈의 `module.yaml`을 직접 읽어 선언된 키를 확인하세요.

**작동 방식:**

- **경로 선택.** 패치 단계는 먼저 `config.user.toml`에서 `[modules.<module>] <key>`(또는 `[core] <key>`)를 찾고, 있으면 그 파일을 업데이트합니다. 그렇지 않으면 팀 범위 `config.toml`에 씁니다. 그래서 `core.user_name`, `bmm.user_skill_level` 같은 사용자 범위 키는 `config.user.toml`에, 팀 범위 키는 `config.toml`에 들어갑니다.
- **그대로 쓰는 값.** 값은 제공한 그대로 기록됩니다. `result:` 템플릿 렌더링은 없습니다. 렌더링된 형태(예: `{project-root}/research`)를 원하면 명시적으로 전달하세요: `--set bmm.project_knowledge='{project-root}/research'`.
- **다음 설치로 이어지는 선언된 키.** `module.yaml`에 선언된 키 값은 `_bmad/<module>/config.yaml`에도 쓰이므로 다음 설치 때 프롬프트 기본값으로 살아남습니다.
- **다음 설치로 이어지지 않는 미선언 키.** 모듈 스키마가 선언하지 않은 키 값은 현재 설치의 `config.toml`에 들어가지만 다음 설치 때 다시 생성되지 않습니다(매니페스트 작성기의 엄격한 스키마 분리 단계가 알 수 없는 키를 떨어뜨립니다). 계속 유지해야 한다면 `--set`을 다시 전달하거나 `_bmad/config.toml`을 직접 수정하세요.
- **검증 없음.** `single-select` 값은 허용 선택지와 대조하지 않고, 알 수 없는 키도 거부하지 않습니다. 지정한 값이 그대로 쓰입니다.
- **`--modules`에 없는 모듈.** 포함하지 않은 모듈에 값을 설정하면 경고를 출력하고 값은 버려집니다(설치되지 않은 모듈용 파일은 생성되지 않습니다).

레거시 core 단축 플래그(`--user-name`, `--output-folder` 등)은 하위 호환성을 위해 계속 동작하고 문서화되어 있지만, `--set core.user_name=...`과 동등합니다.

:::note[quick-update와 함께 동작]
`--set`은 설치 후 패치이므로 작업 유형과 관계없이 동일하게 적용됩니다. `bmad install --action quick-update` 또는 기존 설치에서 `--yes`(기본이 quick-update)로 실행해도 일반 설치처럼 마지막에 중앙 설정 파일을 패치합니다.
:::

:::caution[공유 IP의 요청 제한]
익명 GitHub API 호출은 IP당 시간당 60회로 제한됩니다. 한 번의 설치는 안정 태그를 확인하기 위해 외부 모듈마다 API를 한 번 호출합니다. NAT 뒤의 사무실, CI 러너 풀, VPN은 함께 이 한도를 소진할 수 있습니다.

환경 변수에 `GITHUB_TOKEN=<personal access token>`을 설정하면 계정당 시간당 5000회로 한도가 올라갑니다. 공개 저장소 읽기용 개인 액세스 토큰(PAT)이면 충분하며 범위는 필요 없습니다.
:::

## 설치된 내용

설치 후 `_bmad/_config/manifest.yaml`은 디스크에 있는 내용을 정확히 기록합니다.

```yaml
modules:
  - name: bmb
    version: v1.7.0 # 태그 또는 next용 "main"
    channel: stable # stable | next | pinned
    sha: 86033fc9aeae2ca6d52c7cdb675c1f4bf17fc1c1
    source: external
    repoUrl: https://github.com/bmad-code-org/bmad-builder
```

`sha` 필드는 git 기반 모듈(외부, 커뮤니티, URL 기반 커스텀)에 기록됩니다. 번들 모듈(core, bmm)과 로컬 경로 커스텀 모듈에는 없습니다. 그 코드는 복제 가능한 참조가 아니라 설치 프로그램 바이너리 또는 파일시스템 상태에 따라 달라집니다.

머신 간 재현성을 위해 같은 `--modules` 명령을 다시 실행하는 것에 의존하지 마세요. 안정 채널 설치는 **설치 시점**의 가장 높은 릴리스 태그로 해석되므로 나중에 다시 실행하면 그 사이 릴리스된 버전으로 설치됩니다. `manifest.yaml`의 기록된 태그를 대상 머신에서 명시적 `--pin` 플래그로 바꾸세요. 예:

```bash
npx bmad-method install --yes --modules bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.4.2 --tools claude-code
```

## 문제 해결

### "Could not resolve stable tag" 또는 "API rate limit exceeded"

GitHub의 익명 시간당 60회 한도에 도달했습니다. `GITHUB_TOKEN`을 설정하고 다시 시도하세요. 이미 토큰이 있다면 만료되었거나 해당 토큰 자체의 한도에 걸렸을 수 있습니다. 다른 토큰을 시도하거나 시간당 한도가 초기화될 때까지 기다리세요.

### "Tag 'vX.Y.Z' not found"

`--pin`에 전달한 태그가 모듈 저장소에 없습니다. GitHub의 저장소 릴리스 페이지에서 유효한 태그를 확인하세요.

### 고정 설치가 계속 업그레이드됨

고정 설치는 업그레이드되지 않습니다. `Quick Update`는 안정 채널의 패치와 마이너만 적용하며 `pinned`나 `next`는 건드리지 않습니다. 고정 설치가 바뀌었다면 `_bmad/_config/manifest.yaml`을 여세요. 명시적으로 플래그로 오버라이드하지 않는 한 `channel: pinned`와 고정된 `version`, `sha`가 실행 간 유지되어야 합니다.

### `--pin bmm=X`가 아무 것도 하지 않음

bmm은 번들 모듈입니다. `--pin`과 `--next=`가 적용되지 않습니다. 사전 릴리스 core/bmm을 원하면 `npx bmad-method@next install`을 사용하거나 bmad-bmm 저장소를 체크아웃하고 설치 프로그램을 로컬에서 실행해 아직 릴리스되지 않은 변경을 받으세요.
