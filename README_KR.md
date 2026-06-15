![BMad Method](banner-bmad-method.png)

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue?logo=python&logoColor=white)](https://www.python.org)
[![uv](https://img.shields.io/badge/uv-package%20manager-blueviolet?logo=uv)](https://docs.astral.sh/uv/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

[English](README.md) | [简体中文](README_CN.md) | [Tiếng Việt](README_VN.md) | 한국어

**Build More Architect Dreams** - BMad Method 모듈 생태계를 위한 AI 기반 애자일 개발 모듈입니다. 버그 수정부터 엔터프라이즈 시스템까지, 프로젝트 규모와 도메인에 맞춰 계획 깊이를 조절하는 포괄적인 프레임워크입니다.

**100% 무료 오픈 소스입니다.** 유료 장벽도, 잠긴 콘텐츠도, 폐쇄형 Discord도 없습니다. 우리는 닫힌 커뮤니티나 강좌 비용을 낼 수 있는 사람만이 아니라 모두가 더 나은 도구를 쓸 수 있어야 한다고 믿습니다.

## 왜 BMad Method인가요?

전통적인 AI 도구는 사용자를 대신해 생각하고 평균적인 결과를 내는 데 그치는 경우가 많습니다. BMad의 전문 에이전트와 안내형 워크플로는 AI와 함께 더 나은 사고를 끌어내도록 돕는 전문가 협업자처럼 작동합니다.

- **AI 안내 도움말** - 언제든 `bmad-help` 스킬을 호출해 다음 단계 안내를 받습니다
- **규모와 도메인에 적응** - 프로젝트 복잡도에 맞춰 계획 깊이를 자동으로 조절합니다
- **구조화된 워크플로** - 분석, 계획, 아키텍처, 구현 전반에 애자일 모범 사례를 적용합니다
- **전문 에이전트** - PM, 아키텍트, 개발자, UX 등 12개 이상의 역할별 전문가를 제공합니다
- **파티 모드** - 여러 에이전트 페르소나를 한 세션에 불러와 함께 협업하고 토론합니다
- **전체 수명주기 지원** - 브레인스토밍부터 배포까지 함께합니다

[**docs.bmad-method.org**에서 더 알아보기](https://docs.bmad-method.org/ko-kr/)

## BMad의 다음 단계

**V6가 출시됐고, 이제 시작입니다!** BMad Method는 크로스 플랫폼 에이전트 팀과 서브 에이전트 통합, 스킬 아키텍처, BMad 빌더 v1, 개발 루프 자동화 등 여러 개선과 함께 빠르게 진화하고 있습니다.

**[전체 로드맵 보기](https://docs.bmad-method.org/ko-kr/roadmap/)**

## 빠른 시작

**필수 조건**: [Node.js](https://nodejs.org) v20+ · [Python](https://www.python.org) 3.10+ · [uv](https://docs.astral.sh/uv/)

```bash
npx bmad-method install
```

> 최신 사전 릴리스 빌드를 사용하려면 `npx bmad-method@next install`을 실행하세요. 기본 설치보다 변경이 더 잦을 수 있습니다.

설치 프로그램의 안내를 따른 다음, Claude Code나 Cursor 같은 AI IDE를 프로젝트 폴더에서 엽니다.

**비대화형 설치**(CI/CD용):

```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```

모듈 설정 옵션은 `--set <module>.<key>=<value>`로 재정의할 수 있습니다. 여러 번 사용할 수 있습니다. 로컬에서 알려진 공식 키를 보려면 `--list-options [module]`을 실행하세요.

```bash
npx bmad-method install --yes \
  --modules bmm --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```

[전체 설치 옵션 보기](https://docs.bmad-method.org/ko-kr/how-to/non-interactive-installation/)

> **무엇을 해야 할지 모르겠나요?** `bmad-help`에게 물어보세요. 다음에 해야 할 일과 선택 사항을 정확히 알려줍니다. `bmad-help 아키텍처를 막 끝냈는데 다음에 무엇을 해야 하나요?`처럼 질문할 수도 있습니다.

## 모듈

BMad Method는 전문 도메인을 위한 공식 모듈로 확장됩니다. 설치 중에 선택하거나 나중에 추가할 수 있습니다.

| 모듈                                                                                                            | 목적                                      |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **[BMad Method(BMM)](https://github.com/bmad-code-org/BMAD-METHOD)**                                             | 34개 이상의 워크플로를 제공하는 핵심 프레임워크 |
| **[BMad 빌더(BMB)](https://github.com/bmad-code-org/bmad-builder)**                                             | 커스텀 BMad 에이전트와 워크플로 생성         |
| **[테스트 설계자(TEA)](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)**             | 위험 기반 테스트 전략과 자동화              |
| **[게임 개발 스튜디오(BMGD)](https://github.com/bmad-code-org/bmad-module-game-dev-studio)**                    | Unity, Unreal, Godot 워크플로                |
| **[창의적 지능 제품군(CIS)](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)**         | 혁신, 브레인스토밍, 디자인 사고             |

## 문서

[BMad Method 문서 사이트](https://docs.bmad-method.org/ko-kr/) - 튜토리얼, 가이드, 개념 설명, 참조 문서

**빠른 링크:**

- [시작하기 튜토리얼](https://docs.bmad-method.org/ko-kr/tutorials/getting-started/)
- [이전 버전에서 업그레이드](https://docs.bmad-method.org/ko-kr/how-to/upgrade-to-v6/)
- [테스트 설계자 문서](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)

## 커뮤니티

- [Discord](https://discord.gg/gk8jAdXWmj) - 도움을 받고, 아이디어를 나누고, 협업하세요
- [YouTube](https://youtube.com/@BMadCode) - 튜토리얼, 마스터 클래스 등
- [X / Twitter](https://x.com/BMadCode)
- [웹사이트](https://bmadcode.com)
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) - 버그 제보와 기능 요청
- [토론](https://github.com/bmad-code-org/BMAD-METHOD/discussions) - 커뮤니티 대화

## BMad 후원

BMad는 모두에게 무료이며 앞으로도 그럴 것입니다. 이 저장소에 스타를 눌러 주거나, [커피 한 잔 후원](https://buymeacoffee.com/bmad)을 보내거나, 기업 후원은 <contact@bmadcode.com>으로 문의해 주세요.

## 기여

기여를 환영합니다! 자세한 지침은 [CONTRIBUTING.md](CONTRIBUTING.md)를 확인하세요.

## 라이선스

MIT 라이선스입니다. 자세한 내용은 [LICENSE](LICENSE)를 확인하세요.

**BMad**와 **BMAD-METHOD**는 BMad Code, LLC의 상표입니다. 자세한 내용은 [TRADEMARK.md](TRADEMARK.md)를 확인하세요.

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

기여자 정보는 [CONTRIBUTORS.md](CONTRIBUTORS.md)를 확인하세요.
