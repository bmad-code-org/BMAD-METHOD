---
title: '시작하기'
description: BMad를 설치하고 작은 Python 프로그램 만들기
---

BMad는 작은 버그 수정부터 코드가 수백만 줄에 이르는 프로젝트까지 계획하고 구현할 수 있도록 돕습니다. 먼저 작은 작업부터 시작해 보겠습니다.

이미 저장소가 있고 간단한 변경 사항을 구현하려면 [해당 저장소에 BMad를 설치](./install-bmad.md)하세요. 저장소에서 코딩 도구를 열고 설치된 `bmad-build` 스킬을 실행한 뒤 원하는 변경 사항을 설명하면 됩니다.

그렇지 않다면 여기서 시작하세요. 빈 프로젝트에 작동하는 Python 프로그램을 만들어 봅니다. 이 튜토리얼은 하나의 명확한 요청을 `bmad-build` 스킬에 바로 전달하는 [단일 세션 개발 경로](../how-to/choose-a-development-path.md)를 따릅니다.

:::note[시작하기 전에]
Node.js 20.12 이상, Python 3, BMad가 지원하는 코딩 도구가 설치된 macOS 또는 Linux 셸을 사용하세요. 아래 설치 및 실행 명령은 Claude Code를 기준으로 합니다. 다른 지원 도구를 사용한다면 BMad를 설치할 때 해당 도구를 선택하고 그곳에서 `bmad-build` 스킬을 실행하세요.
:::

## 빈 프로젝트 만들기

```bash
mkdir bmad-first-project
cd bmad-first-project
```

현재 안정 버전의 BMad Method를 설치합니다. 다음 명령은 Claude Code용으로 설정합니다.

```bash
npx bmad-method install --directory . --modules bmm --tools claude-code --yes
```

이 디렉터리에서 코딩 도구를 엽니다. Claude Code에서는 다음 명령을 실행하세요.

```bash
claude
```

## Mars Rover 만들기

`bmad-build` 스킬에 별도의 설계 선택 사항을 덧붙이지 말고 프로그래밍 연습에 쓰이는 작은 예제인 [Mars Rover 프로그래밍 카타](https://codingdojo.org/kata/mars-rover/)를 만들어 달라고 요청합니다.

```text
/bmad-build Mars Rover 카타를 구현해 줘
```

이렇게 요청하면 `bmad-build` 스킬이 원하는 결과를 물어볼 여지가 생깁니다. 다음과 같은 질문으로 시작할 수 있습니다.

```text
`bmad-build`: Before implementation, I need one choice: which language should I use?
사용자: Python 3으로 만들어 줘. 로컬에서 실행할 수 있는 작은 고전식 터미널 프로그램으로 만들고,
Python 표준 라이브러리 외의 의존성은 사용하지 마.
```

실제로 주고받는 질문과 답변, 계획, 완성된 프로그램은 예시와 다를 수 있습니다. 예시 답변을 그대로 복사하기보다 원하는 동작을 선택하세요.

질문에 답한 뒤 계획을 읽어 보세요. 그대로 승인하거나 변경을 요청하세요. 그러면 스킬이 프로그램을 작성하고 작업 내용을 점검합니다. 문제가 있으면 수정한 뒤 변경 사항을 보여줍니다.

## Mars Rover 실행하기

요청에 따라 결과는 달라집니다. 예를 들면 다음과 같습니다.

```bash
python3 mars_rover.py --size 5x5 --obstacle 2,2
```

`FFRFF`, `MAP`, `QUIT`를 차례로 입력하세요. 터미널에서 로버가 장애물 앞에 멈춘 모습을 확인합니다.

```text
MARS ROVER CONTROL
Commands: F/M forward, B backward, L/R turn, MAP, STATUS, HELP, QUIT
Position: (0, 0)  Heading: N
rover> Position: (1, 2)  Heading: E
OBSTACLE: movement blocked at (2, 2)
rover>  4  . . . . .
 3  . . . . .
 2  . > # . .
 1  . . . . .
 0  . . . . .
    0 1 2 3 4
rover> Mission control signing off.
```

최종 메시지에 나열된 파일을 열어 완성된 프로그램을 확인하세요.

## BMad Help에 물어보기

`bmad-help` 스킬은 BMad에 관한 질문에 답합니다. 어떤 작업이 이루어졌는지 이해하거나 다음 작업을 정하거나 문제를 해결할 때 사용하세요. 지금 바로 실행해 보세요.

```text
/bmad-help bmad-build가 방금 무엇을 했는지 설명해 줘.
```

## 완성했습니다

Mars Rover 예제에서 `bmad-build` 스킬이 짧은 요청을 실행 가능한 소프트웨어로 구현하는 과정을 살펴봤습니다. 스킬은 요청을 명확히 하고 사용자가 승인할 계획을 제시한 뒤 프로그램을 작성하고 점검해 결과를 보여줬습니다.

## 계속 만들기

1. [내 저장소에 BMad를 설치](./install-bmad.md)한 다음, `bmad-build` 스킬을 실행하고 작은 변경 사항을 짧게 설명해 보세요. 사람이 참여하는 경로는 [변경 사항 구현하기](../build/build-a-change.md)를 참고하세요.
2. 성숙한 코드베이스에서 작은 변경을 구현한 뒤 작성된 사양으로 더 큰 변경까지 진행하려면 [더 깊이 알아보기](../tutorials/getting-deeper.md)를 계속 읽으세요.
3. 다음 변경에 여러 구현 세션이나 에픽이 필요할 수 있다면 [개발 경로 선택하기](../how-to/choose-a-development-path.md)를 참고하세요.
