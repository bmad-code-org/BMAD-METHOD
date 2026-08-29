---
title: BMad로 소프트웨어 만들기
description: BMad는 무엇을 만들지 결정하고 실제로 구현하도록 돕습니다. BMad를 설치하거나 첫 변경을 구현하거나 현재 작업에 맞는 경로를 찾으려면 여기서 시작하세요.
hero:
  title: '아이디어를 소프트웨어로.<br>규모에 관계없이.'
  tagline: 충분히 생각한 뒤 구현하세요. 결정은 사용자가 내리므로 무엇을 출시하는지 직접 이해할 수 있습니다.
  actions:
    - text: 첫 변경 사항 구현하기
      link: ./start/build-your-first-change/
      variant: primary
    - text: BMad 설치하기
      link: ./start/install-bmad/
      variant: secondary
---

BMad는 Claude Code, Cursor 같은 AI 코딩 도구에 스킬이라는 이름 있는 명령 모음을 추가합니다. 일부 스킬은 아이디어를 탐색하고 조사하거나 반대 관점에서 검토한 뒤 결정한 내용을 기록하도록 도와줍니다. 다른 스킬은 구현을 담당합니다. 원하는 변경 사항을 `bmad-build`에 전달하면 코드를 작성하고 검토합니다.

두 종류의 스킬은 각각 따로 사용할 수 있습니다. 아이디어를 다루는 스킬만 사용하고 BMad에 코드를 한 줄도 맡기지 않는 사용자도 많습니다. 반대로 작은 수정은 별도 계획 없이 바로 구현해도 됩니다.

## 시작점 찾기

**변경에 어느 정도의 절차가 필요한지 확신하기 어렵습니다.**
[개발 경로 선택하기](./how-to/choose-a-development-path.md)에서 단순한 편집부터 여러 에픽으로 구성된 프로젝트까지, 안전하게 적용할 수 있는 가장 간단한 경로를 찾아보세요.

**BMad가 실제로 작동하는 모습을 보고 싶습니다.**
[첫 변경 사항 구현하기](./start/build-your-first-change.md)에서는 빈 프로젝트에서 Build를 한 번 실행합니다.

**무엇을 바꿀지 정확히 알고 있으며 작은 작업입니다.**
`bmad-build`를 실행하고 변경 내용을 설명하세요. [변경 사항 구현하기](./build/build-a-change.md)를 참고하면 됩니다.

**기존 코드베이스에서 작업하고 있습니다.**
먼저 `bmad-project-context`를 실행하는 방안을 고려하세요. 이후에는 평소처럼 Build를 사용합니다. [기존 프로젝트](./how-to/established-projects.md)와 [프로젝트 컨텍스트 관리하기](./how-to/project-context.md)를 참고하세요.

**더 큰 기능이나 제품 전체를 만들고 있습니다.**
완성된 의도를 `bmad-spec`에 전달할 수 있다면 거기서 시작하세요. 아이디어 구상과 계획을 먼저 진행해야 한다면 [개발 경로 선택하기](./how-to/choose-a-development-path.md)나 [워크플로 맵](./reference/workflow-map.md)에서 경로를 고르세요.

**아이디어가 아직 막연하거나 좋은 아이디어인지 확신하기 어렵습니다.**
[브레인스토밍](./explanation/brainstorming.md)으로 선택지를 만들고 [Deep Recon](./explanation/deep-recon.md)으로 근거를 모으거나 [아이디어를 압박 검증](./how-to/pressure-test-an-idea.md)하세요.

**BMad가 우리 팀의 규칙과 업무 방식을 따르게 하고 싶습니다.**
[BMad 커스터마이징](./how-to/customize-bmad.md)과 [조직에 맞게 BMad 확장하기](./how-to/expand-bmad-for-your-org.md)를 참고하세요.

:::tip[어디서 시작할지 모르겠나요?]
`bmad-help`를 실행하세요.
:::
