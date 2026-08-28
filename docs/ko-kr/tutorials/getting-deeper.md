---
title: '더 깊이 알아보기'
description: Build와 BMad Spec으로 특정 Django 버전의 명령 확장하기
sidebar:
  order: 1
---

작은 프로젝트에서 Build를 사용해 봤다면 이제 특정 버전의 Django에 적용해 볼 차례입니다. 먼저 범위가 분명한 명령 변경 하나를 구현합니다. 그다음 하나의 BMad Spec으로 정의한 관련 스토리 세 개를 구현합니다. 두 실습에서는 [단일 세션 경로와 에픽 규모 개발 경로](../how-to/choose-a-development-path.md)를 차례로 살펴봅니다.

:::note[필수 조건]
Git, Node.js 20.12+와 `npx`, [uv](https://docs.astral.sh/uv/getting-started/installation/), BMad가 지원하는 코딩 도구가 설치된 macOS 또는 Linux 셸을 사용하세요. 계속하기 전에 [첫 변경 사항 구현하기](../start/build-your-first-change.md)를 완료하세요. 아래 설치 및 실행 명령은 Claude Code를 기준으로 합니다. 다른 지원 도구에서도 Build를 실행할 수 있습니다. VS Code는 선택 사항이지만 있으면 편리합니다. `code` 명령을 사용할 수 있으면 Build가 완성된 작업을 VS Code에서 직접 열어 줍니다.
:::

## 1. 정확한 Django 버전 체크아웃하기

Django 5.2.4를 새 디렉터리에 복제합니다. 예상한 소스 코드인지 확인한 뒤 실습용 브랜치를 만듭니다.

```bash
git clone --depth 1 --branch 5.2.4 https://github.com/django/django.git bmad-django
cd bmad-django
git rev-parse HEAD
git switch -c bmad-getting-deeper
```

`git rev-parse HEAD`는 다음 값을 출력해야 합니다.

```text
c941d0deec0ea08a30670be0fac879f2372f071b
```

## 2. Django 편집 환경 준비하기

Python 3.12를 준비합니다. 예제 앱이 현재 Django 체크아웃을 사용하도록 설치한 뒤 저장소 옆에 작은 Django 프로젝트를 만듭니다.

```bash
uv python install 3.12
uv venv --python 3.12
uv pip install -e .
mkdir ../bmad-django-app
uv run django-admin startproject tutorial_project ../bmad-django-app
```

## 3. 시작 동작 확인하기

JSON 출력을 아직 사용할 수 없는지 확인합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json
```

명령은 다음 오류로 끝납니다.

```text
manage.py diffsettings: error: argument --output: invalid choice: 'json' (choose from hash, unified)
```

## 4. BMad 설치하기

안정 릴리스 채널에서 BMad Method를 설치합니다. 다음 명령은 Claude Code용으로 정확히 설정합니다.

```bash
npx bmad-method install --directory . --modules bmm --tools claude-code --yes
```

Git이 이 튜토리얼에서 만든 BMad 파일과 uv 잠금 파일을 무시하도록 설정합니다.

```bash
cat >> .git/info/exclude <<'EOF'
/_bmad/
/_bmad-output/
/.claude/
/uv.lock
EOF
```

## 5. 구현하기

저장소 루트에서 코딩 도구를 엽니다. Claude Code에서는 다음 명령을 실행하세요.

```bash
claude
```

```text
/bmad-build django-admin diffsettings에 JSON 출력 지원을 추가해 줘. 기존 출력
형식을 유지하고 관련 테스트를 추가한 뒤 명령 문서를 업데이트해 줘. 로컬에서
검토할 수 있도록 구현 결과는 작업 트리에 남겨 둬.
```

Build는 계획을 작성하기 전에 필요한 내용을 질문합니다. 새 JSON 출력에 원하는 방식을 직접 답하세요. 이 실습에 정답으로 정해진 JSON 설계는 없습니다.

Build가 계획을 제시하면 사용자가 승인하거나 변경을 요청할 때까지 기다립니다. 승인 후에는 변경 사항을 구현하고 검토합니다. 발견한 문제를 처리한 뒤 결과를 보여줍니다. 이 실습의 범위는 `diffsettings`의 JSON 출력으로 유지하세요. 필터링, 마스킹, CI 동작은 다음 실습에서 다룹니다.

`code` 명령을 사용할 수 있으면 Build가 프로젝트와 완성된 사양을 VS Code에서 엽니다. 권장 리뷰 순서의 링크를 따라 변경 사항을 살펴볼 수 있습니다.

## 6. 작동 확인하기

셸로 돌아와 Django의 `diffsettings` 테스트를 실행합니다.

```bash
uv run python tests/runtests.py admin_scripts.tests.DiffSettings --verbosity 1
```

테스트가 통과해야 합니다.

이제 명령을 다시 실행합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings --output=json
```

JSON을 살펴보고 Build와 함께 정한 내용과 비교하세요.

## 7. 완성했습니다

이제 복잡한 오픈 소스 코드베이스에서 안정적으로 자리 잡은 Django 명령에 유용한 기능을 추가했습니다. VS Code를 사용한다면 지금 완성된 변경 사항이 열려 있을 것입니다.

## 8. 더 큰 변경을 위한 사양 작성하기

다음 변경에는 Build를 세 번 실행해야 합니다. 무엇을 만들지 정할 때는 `/bmad-forge-idea`를, 초안을 개선할 때는 `/bmad-advanced-elicitation`을 사용할 수 있습니다. 여기서는 요구 사항이 이미 명확하므로 둘 다 필요하지 않습니다. BMad Spec에 바로 전달하세요.

```text
/bmad-spec diffsettings-audit라는 사양을 만들고 정확히 세 개의 스토리로 나눠 줘.
순서는 필터, 마스킹, CI 상태로 해 줘.

사양을 작성하기 전에 현재 diffsettings 구현, 관련 테스트, 명령 문서를 읽어 줘.
기존 출력 형식과 이미 승인한 JSON 설계를 모두 유지해 줘. 여러 번 지정할 수 있는
--include와 --exclude 셸 글로브 필터를 추가해 줘. include 패턴은 OR로 결합하고
exclude 패턴은 항상 우선해야 해. 현재 값과 기본값을 [REDACTED]로 바꾸되 차이의
존재 여부는 바꾸지 않는 반복 가능한 --redact 셸 글로브 마스크를 추가해 줘.
필터링 후 차이가 남으면 1, 그렇지 않으면 0으로 종료하는 --fail-on-difference를
추가해 줘. 각 스토리에는 관련 테스트 추가와 기존 명령 문서 업데이트를 포함해 줘.
Django 문서 파일이나 외부 서비스는 새로 추가하지 마. 사양 폴더 slug는
diffsettings-audit를 사용해 줘.
```

BMad Spec은 `_bmad-output/specs/spec-diffsettings-audit/`에 사양 하나를 작성합니다. 그 안의 `stories.yaml`에는 순서가 정해진 스토리 세 개를 기록합니다. 사양과 스토리를 읽고 BMad Spec의 질문에 답하세요. 위 요구 사항과 일치하면 계속 진행합니다.

## 9. 세 스토리 구현하기

각 스토리마다 Build를 한 번씩 순서대로 실행합니다. 한 번의 Build 실행을 끝내고 다음 스토리로 넘어가세요. 모든 실행에서 같은 사양을 사용합니다. 필터링, 마스킹, 종료 동작이 어떻게 맞물리는지를 정하는 스토리이므로 이번에는 사람이 직접 살펴보며 실행합니다. 이후 에픽에서 안정된 패턴을 반복한다면 자동화에 더 적합할 수 있습니다.

### 스토리 1: 필터

```text
/bmad-build _bmad-output/specs/spec-diffsettings-audit/stories.yaml의
스토리 1인 필터를 구현해 줘.
```

Build가 끝나면 결과를 확인합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DATABASES --include=DEBUG --include=SECRET_KEY \
  --exclude=DATABASES
printf 'exit: %s\n' "$?"
```

출력에는 `DEBUG`와 `SECRET_KEY`가 있지만 `DATABASES`는 없습니다. 마지막에는 `exit: 0`이 표시됩니다. 포함 패턴은 OR로 결합되고 제외 조건이 우선합니다.

### 스토리 2: 마스킹

```text
/bmad-build _bmad-output/specs/spec-diffsettings-audit/stories.yaml의
스토리 2인 마스킹을 구현해 줘.
```

unified 출력을 확인합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=unified --include=SECRET_KEY --redact='SECRET*'
printf 'exit: %s\n' "$?"
```

비밀 값은 나타나지 않습니다. 차이의 양쪽 값이 모두 마스킹됩니다.

```text
- SECRET_KEY = [REDACTED]
+ SECRET_KEY = [REDACTED]
exit: 0
```

### 스토리 3: CI 상태

```text
/bmad-build _bmad-output/specs/spec-diffsettings-audit/stories.yaml의
스토리 3인 CI 상태를 구현해 줘.
```

필터링 후에도 남은 차이를 확인합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --include=DEBUG --fail-on-difference
printf 'exit: %s\n' "$?"
```

`DEBUG`의 차이가 계속 표시되고 명령은 `exit: 1`로 끝납니다.

## 10. 전체 변경 사항 함께 실행하기

이제 하나의 명령에서 세 스토리를 함께 확인합니다.

```bash
uv run python ../bmad-django-app/manage.py diffsettings \
  --output=json --include=DEBUG --include=SECRET_KEY --exclude=DEBUG \
  --redact='SECRET*' --fail-on-difference
printf 'exit: %s\n' "$?"
```

JSON에는 `SECRET_KEY`만 포함됩니다. 앞에서 선택한 JSON 구조가 노출하는 현재 값과 기본값은 모두 `[REDACTED]`입니다. 원래 값은 어느 쪽도 나타나지 않습니다. 실제 값은 여전히 다르므로 마지막 줄은 `exit: 1`입니다.

첫 실습에서는 범위가 분명한 변경 하나를 Build에 직접 요청했습니다. 이번 실습에서는 세 번의 Build 실행에 사양 하나를 공유했습니다. 마지막에도 필터링, 마스킹, CI 상태가 함께 작동합니다. 성숙한 Django 명령을 확장했으며 최종 결과는 처음 요청한 동작을 그대로 수행합니다.

결과를 여러 관점에서 살펴보고 싶다면 마지막에 `/bmad-party-mode`를 실행할 수 있습니다. 이 튜토리얼을 마치는 데 꼭 필요하지는 않습니다.

## 11. 에픽 검토하기

사양 폴더를 지정해 Retrospective를 실행하세요.

```text
/bmad-retrospective _bmad-output/specs/spec-diffsettings-audit/
```

Retrospective는 `stories.yaml`을 에픽의 스토리 목록으로 사용하고 각 스토리의 구현 기록을 읽습니다. 그런 다음 통합된 결과를 `SPEC.md`와 대조해 같은 사양 폴더에 `RETROSPECTIVE.md`를 작성합니다. 근거, 인수 판정, 제안된 후속 작업을 검토하세요.

## 12. 계속 만들기

이제 [내 저장소에 BMad를 설치](../start/install-bmad.md)하고 `bmad-build` 스킬로 원하는 변경 사항을 만들어 보세요. 사람이 참여하는 경로는 [변경 사항 구현하기](../build/build-a-change.md)를 참고하세요. 변경에 사양, 자동화 또는 전체 프로젝트 흐름이 필요한지 판단하려면 [개발 경로 선택하기](../how-to/choose-a-development-path.md)를 사용하세요.
