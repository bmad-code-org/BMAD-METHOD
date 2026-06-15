---
title: '커스텀 및 커뮤니티 모듈 설치'
description: 커뮤니티 레지스트리, Git 저장소, 로컬 경로에서 서드파티 모듈을 설치합니다
sidebar:
  order: 3
---

BMad 설치 프로그램을 사용해 커뮤니티 레지스트리, 서드파티 Git 저장소, 로컬 파일 경로에서 모듈을 추가하세요.

## 사용 시점

- BMad 레지스트리에서 커뮤니티 기여 모듈을 설치합니다
- 서드파티 Git 저장소(GitHub, GitLab, Bitbucket, 자체 호스팅)에서 모듈을 설치합니다
- BMad 빌더로 로컬에서 개발 중인 모듈을 테스트합니다
- 비공개 또는 자체 호스팅 Git 서버에서 모듈을 설치합니다

:::note[필수 조건]
[Node.js](https://nodejs.org) v20+와 `npx`(npm에 포함)가 필요합니다. 커스텀 및 커뮤니티 모듈은 새 설치 중 선택하거나 기존 설치에 추가할 수 있습니다.
:::

## 커뮤니티 모듈

커뮤니티 모듈은 [BMad 플러그인 마켓플레이스](https://github.com/bmad-code-org/bmad-plugins-marketplace)에서 선별됩니다. 카테고리별로 구성되고 안전을 위해 승인된 커밋에 고정됩니다.

### 1. 설치 프로그램 실행

```bash
npx bmad-method install
```

### 2. 커뮤니티 카탈로그 둘러보기

공식 모듈을 선택한 뒤 설치 프로그램이 묻습니다.

```
Would you like to browse community modules?
```

카탈로그 브라우저로 들어가려면 **Yes**를 선택하세요. 할 수 있는 일은 다음과 같습니다.

- 카테고리별 탐색
- 추천 모듈 보기
- 사용 가능한 모든 모듈 보기
- 키워드로 검색

### 3. 모듈 선택

어떤 카테고리에서든 모듈을 선택하세요. 설치 프로그램은 설명, 버전, 신뢰 등급을 보여줍니다. 이미 설치된 모듈은 업데이트 대상으로 미리 체크됩니다.

### 4. 설치 계속

커뮤니티 모듈을 선택하면 설치 프로그램은 커스텀 소스, 도구/IDE 설정, 나머지 설치 흐름으로 이어집니다.

## 커스텀 소스(Git URL과 로컬 경로)

커스텀 모듈은 어떤 Git 저장소나 로컬 디렉터리에서든 올 수 있습니다. 설치 프로그램은 소스를 해석하고 모듈 구조를 분석한 뒤 다른 모듈 옆에 설치합니다.

### 대화형 설치

설치 중 커뮤니티 모듈 단계 이후 설치 프로그램이 묻습니다.

```
Would you like to install from a custom source (Git URL or local path)?
```

**Yes**를 선택한 뒤 소스를 제공합니다.

| 입력 유형 | 예시 |
| --- | --- |
| HTTPS URL(모든 호스트) | `https://github.com/org/repo` |
| HTTP URL(모든 호스트) | `http://host/org/repo` |
| 하위 디렉터리가 있는 HTTPS URL | `https://github.com/org/repo/tree/main/my-module` |
| SSH URL | `git@github.com:org/repo.git` |
| 로컬 경로 | `/Users/me/projects/my-module` |
| 틸드가 있는 로컬 경로 | `~/projects/my-module` |

설치 프로그램은 저장소를 복제(URL인 경우)하거나 디스크에서 직접 읽은 뒤(로컬 경로인 경우), 발견된 모듈을 선택할 수 있게 보여줍니다.

### 비대화형 설치

명령줄에서 커스텀 모듈을 설치하려면 `--custom-source` 플래그를 사용하세요.

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

`--modules` 없이 `--custom-source`를 제공하면 core와 커스텀 모듈만 설치됩니다. 공식 모듈도 포함하려면 `--modules`를 추가하세요.

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

여러 소스는 쉼표로 구분할 수 있습니다.

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## 모듈 발견 방식

설치 프로그램은 소스에서 설치 가능한 모듈을 찾기 위해 두 모드를 사용합니다.

| 모드 | 트리거 | 동작 |
| --- | --- | --- |
| `Discovery` | 소스에 `.claude-plugin/marketplace.json`이 있습니다 | 매니페스트의 모든 플러그인을 나열하고 설치할 항목을 선택하게 합니다 |
| `Direct` | marketplace.json이 없습니다 | 디렉터리에서 스킬(`SKILL.md`가 있는 하위 디렉터리)을 스캔하고 단일 모듈로 해석합니다 |

`Discovery` 모드는 게시된 모듈에 일반적입니다. `Direct` 모드는 로컬 개발 중 스킬 디렉터리를 가리킬 때 편리합니다.

:::note[`.claude-plugin/`에 대해]
`.claude-plugin/marketplace.json` 경로는 여러 AI 도구 설치 프로그램에서 플러그인 발견을 위해 채택한 표준 관례입니다. Claude가 필요하지 않고 Claude API를 사용하지 않으며 어떤 AI 도구를 쓰는지에 영향을 주지 않습니다. 이 파일이 있는 모듈은 관례를 따르는 모든 설치 프로그램에서 발견될 수 있습니다.
:::

## 로컬 개발 워크플로

[BMad 빌더](https://github.com/bmad-code-org/bmad-builder)로 모듈을 만들고 있다면 작업 디렉터리에서 직접 설치할 수 있습니다.

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

로컬 소스는 캐시에 복사되지 않고 경로로 참조됩니다. 모듈 소스를 업데이트하고 다시 설치하면 설치 프로그램이 최신 변경을 가져옵니다.

:::caution[소스 제거]
설치 후 로컬 소스 디렉터리를 삭제해도 `_bmad/`에 설치된 모듈 파일은 보존됩니다. 소스 경로가 복원될 때까지 업데이트 중 해당 모듈은 건너뜁니다.
:::

## 얻는 결과

설치 후 커스텀 모듈은 공식 모듈과 함께 `_bmad/`에 나타납니다.

```
your-project/
├── _bmad/
│   ├── core/              # 내장 core 모듈
│   ├── bmm/               # 공식 모듈(선택한 경우)
│   ├── my-module/         # 커스텀 모듈
│   │   ├── my-skill/
│   │   │   └── SKILL.md
│   │   └── module-help.csv
│   └── _config/
│       └── manifest.yaml  # 모든 모듈, 버전, 소스를 추적
└── ...
```

매니페스트는 각 커스텀 모듈의 소스(Git 소스는 `repoUrl`, 로컬 소스는 `localPath`)를 기록하여 `Quick Update`가 소스를 다시 찾을 수 있게 합니다.

## 커스텀 모듈 업데이트

커스텀 모듈도 일반 업데이트 흐름에 참여합니다.

- **Quick Update**(`--action quick-update`): 모든 모듈을 원래 소스에서 새로 고칩니다. Git 기반 모듈은 다시 가져오고 로컬 모듈은 소스 경로에서 다시 읽힙니다.
- **전체 업데이트**: 모듈 선택을 다시 실행해 커스텀 모듈을 추가하거나 제거할 수 있습니다.

## 직접 모듈 만들기

다른 사람이 설치할 수 있는 모듈을 만들려면 [BMad 빌더](https://github.com/bmad-code-org/bmad-builder)를 사용하세요.

1. `bmad-module-builder`를 실행해 모듈 초기 구조를 생성합니다
2. 여러 BMad 빌더 도구로 스킬, 에이전트, 워크플로를 추가합니다
3. Git 저장소에 게시하거나 폴더 컬렉션을 공유합니다
4. 다른 사용자는 `--custom-source <your-repo-url>`로 설치합니다

모듈이 발견 모드를 지원하려면 저장소 루트에 `.claude-plugin/marketplace.json`을 포함하세요(Claude 전용이 아닌 도구 간 관례입니다). marketplace.json 형식은 [BMad 빌더 문서](https://github.com/bmad-code-org/bmad-builder)를 참고하세요.

:::tip[먼저 로컬에서 테스트]
개발 중에는 Git 저장소에 게시하기 전에 로컬 경로로 모듈을 설치해 빠르게 반복하세요.
:::
