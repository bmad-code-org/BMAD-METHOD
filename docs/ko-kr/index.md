---
title: BMad로 소프트웨어 만들기
description: BMad가 짧은 요청과 공유 사양을 검토된 소프트웨어 변경으로 바꾸는 과정과 중요한 결정을 사용자가 직접 통제하는 방식을 알아봅니다.
hero:
  title: 의도를 작동하는 소프트웨어로
  tagline: BMad는 중요한 내용을 명확히 하고 승인할 계획을 제시한 뒤 변경 사항을 구현하고 검토해 결과를 보여줍니다.
  actions:
    - text: 작은 작업으로 시작하기
      link: ./tutorials/getting-started/
      variant: primary
    - text: Django에서 사용해 보기
      link: ./tutorials/getting-deeper/
      variant: secondary
---

BMad는 지원되는 AI 코딩 도구와 함께 소프트웨어 요청을 구체화하고, 승인된 계획에 따라 구현한 뒤 결과를 검토합니다. 결과를 좌우하는 결정은 사용자가 내립니다. Build 결과는 직접 실행하고 살펴볼 수 있는 코드입니다.

## 작동하는 소프트웨어부터 시작하기

[시작하기](./tutorials/getting-started.md)에서는 빈 디렉터리에서 다음과 같은 짧은 요청 하나로 시작합니다.

```text
/bmad-build Mars Rover 카타를 구현해 줘
```

Build는 필요한 선택 사항을 물어본 뒤 승인하거나 수정할 수 있는 계획을 제시합니다. 프로그램을 작성하고 검토한 다음 터미널에서 완성된 Mars Rover를 실행할 수 있습니다. 요청은 작게 유지하세요. 프로그램이 어떤 모습이 될지는 사용자가 결정합니다.

**[BMad로 Mars Rover 만들기](./tutorials/getting-started.md)**

## 성숙한 코드베이스에서 이어가기

[더 깊이 알아보기](./tutorials/getting-deeper.md)에서는 같은 직접 실행 방식을 Django 5.2.4에 적용합니다. Build에 `django-admin diffsettings`의 JSON 출력을 추가해 달라고 요청합니다. 출력 형식을 결정한 뒤 관련 테스트를 실행하고 명령이 만든 JSON을 확인합니다.

두 번째 Django 실습에서는 작업이 여러 스토리에 걸칠 때 무엇이 달라지는지 보여줍니다. BMad Spec은 필터링, 마스킹, CI 상태에 공통으로 적용할 계약을 하나로 기록합니다. 세 번의 Build 실행으로 이를 순서대로 구현합니다. 마지막 명령 하나로 세 기능이 함께 작동하는지 확인합니다. 필터링은 설정을 선택하고, 마스킹은 값을 숨기며, 종료 상태는 아직 차이가 남아 있는지 알려줍니다.

**[Django 실습 시작하기](./tutorials/getting-deeper.md)**

## 원하는 답 바로 찾기

필요한 내용을 이미 알고 있다면 검색창이나 사이드바를 이용하세요. 자주 찾는 작업은 다음 문서에 정리했습니다.

- [BMad 설치 또는 업데이트](./how-to/install-bmad.md)
- [기존 프로젝트에서 BMad 사용](./how-to/established-projects.md)
- [Build의 작동 방식 이해](./explanation/build.md)
- [설치된 스킬 조회](./reference/commands.md)

## 내 저장소에서 만들기

이미 사용 중인 저장소에서 실제 변경 작업 하나를 고르세요. 해당 저장소에 BMad를 설치한 뒤 `bmad-build` 스킬을 실행하고 원하는 결과를 설명하세요. 중요한 선택 사항을 정하고 계획을 승인하거나 수정하세요. 실제 맥락 속에서 완성된 변경 사항을 확인하세요.

**[내 저장소에서 BMad 사용하기](./how-to/install-bmad.md)**
