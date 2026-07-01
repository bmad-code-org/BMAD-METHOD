---
title: 'Web Bundles'
description: Google Gemini Gems와 ChatGPT Custom GPT용으로 패키징된 BMad 스킬
---

BMad의 계획 작업은 웹 LLM 구독 환경에서 실행하고, 만들어진 산출물은 IDE로 가져오세요.

## Web Bundle이란?

Web bundle은 **Google Gemini Gem** 또는 **ChatGPT Custom GPT**로 설치할 수 있게 다시 패키징한 BMad 스킬입니다. 각 번들에는 지식 파일로 업로드하는 `SKILL.md` 프로토콜, Gem 또는 GPT 지침에 붙여 넣는 `INSTRUCTIONS.md` 블록, 그리고 스킬에 필요한 데이터 파일(CSV, 템플릿, 검증 체크리스트, 추가로 점진 공개되는 콘텐츠)이 포함됩니다. 페르소나는 붙여 넣은 지침에 있고, 프로토콜은 지식 파일에 있습니다. 프로토콜을 건드리지 않고도 페르소나를 바꿀 수 있습니다.

설치가 원클릭은 아니지만 단계는 안내됩니다. **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)에서 설치하세요**. 이 사이트는 모든 번들을 카드 그리드로 보여 주고, Gemini와 ChatGPT 설치 단계를 페이지 안에서 안내하며, ZIP 다운로드를 제공합니다. 이것이 지원되는 설치 경로입니다. 전체 카탈로그에서 패턴이 같으므로 하나만 설치해 보면 다음 번들은 기계적으로 진행할 수 있습니다.

BMad V4에도 web bundle이 있었습니다. V6에서는 현재 Gem과 Custom GPT 플랫폼, Canvas, Deep Research, 이미지 생성을 염두에 두고 다시 작성해 되살렸습니다.

## 사용하는 이유

계획 작업과 구현 작업에는 서로 다른 도구가 어울립니다. Web bundle은 각 작업을 가장 잘 맞는 곳에서 하게 해 줍니다.

| 관심사 | Web LLM(Gem 또는 GPT) | IDE(Claude Code, Cursor) |
| --- | --- | --- |
| 비용 모델 | 정액 구독 | 토큰 사용량 과금 |
| 강점 | 대화, Canvas, Deep Research, 이미지 | 파일, 터미널, 코드베이스 컨텍스트 |
| 가장 적합한 작업 | 브레인스토밍, brief, PRD, 리서치 | 구현, 리팩터링, 코드 리뷰 |

전체 PRD나 시장 리서치 대화를 IDE에서 진행하면 토큰을 많이 쓰지만, Gem이나 Custom GPT에서는 이미 가진 구독 비용 안에서 처리할 수 있습니다. 다듬어진 산출물은 저장소에 넣고 Claude Code나 Cursor가 이어받으면 됩니다.

:::tip[웹에서 계획하고 IDE에서 빌드하세요]
작업이 길어질수록 비용 절감 효과가 커집니다. Gem에서 PRFAQ 한 번과 리서치 세 라운드를 돌리는 것은 추가 비용이 없지만, 같은 작업을 IDE에서 하면 실제 지출이 됩니다.
:::

## 카탈로그에 있는 것

현재 번들 세트는 분석과 계획 단계를 다룹니다.

| Bundle | Phase | Persona lineage |
| --- | --- | --- |
| Brainstorming Coach | Analysis | Osborn(기본), Minto(교체) |
| Product Brief Coach | Analysis | Mary(BMad 분석가) |
| PRFAQ Coach | Analysis | Working Backwards(Bezos) |
| PRD Coach | Planning | Cagan |
| UX Coach | Planning | Norman |
| Market & Industry Research | Analysis | Porter와 Christensen |

각 번들은 소유 BMad 에이전트가 있는 경우 그 에이전트에서 물려받은 기본 페르소나와, 목소리 변경 패턴을 보여 주는 대비용 교체 예시를 함께 담고 있습니다.

## 세션 작동 방식

1. **Gem 또는 Custom GPT를 엽니다.** 페르소나가 캐릭터에 맞게 인사하고 대화형 발견을 시작합니다.
2. **범위를 발견합니다.** 페르소나는 무엇을 하려는지, 이미 가진 것이 무엇인지, 어떤 제약이 있는지 묻습니다. 양식 채우기가 아닙니다.
3. **Canvas에서 작업합니다.** 프로토콜은 세션 시작 시 Canvas를 열고 계속 업데이트합니다. Mermaid 다이어그램과 HTML 테이블도 글과 함께 들어갑니다.
4. **인계합니다.** 작업이 끝나면 저장소에 붙여 넣거나, 내보내거나, 다음 단계를 위해 IDE의 BMad 스킬에 전달할 수 있는 Canvas 문서가 생깁니다.

Deep Research를 통합한 번들(현재 Market & Industry Research)은 세션 중간에 Gemini 또는 ChatGPT의 Deep Research 모드에 붙여 넣을 brief를 작성하고, 반환된 보고서를 다시 받아들입니다.

## Web bundle을 사용할 때

- 프로젝트의 앞단 사고를 진행하고 있고, 페르소나, Canvas, Deep Research를 갖춘 집중 도구가 필요합니다.
- IDE 토큰 지출은 실제 코딩에 남겨 두고 싶습니다.
- IDE 설정이 없는 협업자와 계획 산출물을 공유해야 합니다.

## IDE에 머무를 때

- 작업이 저장소의 코드를 읽거나 수정해야 합니다.
- 이미 구현 중이고 컨텍스트를 유지하고 싶습니다.
- Gemini Advanced 또는 ChatGPT Plus 구독이 없습니다.

## 업데이트와 커스터마이징

번들은 계속 발전합니다. 새 버전의 번들을 가져올 때 일반적으로 바뀌는 것은 지식 파일(`SKILL.md` 프로토콜과 첨부 템플릿, CSV, 검증 체크리스트)입니다. 업데이트를 적용하려면 Gem 또는 Custom GPT에 그 파일들을 다시 업로드하세요. 지침 블록은 보통 바뀌지 않습니다.

팀이나 자신의 목소리에 맞게 번들을 커스터마이징하려면 지식 파일이 아니라 Gem 또는 GPT에 붙여 넣은 **지침 블록**에서 하세요. 지침 블록은 페르소나, 선호 사항, 로컬 오버라이드가 있는 곳입니다. 지식 파일은 번들이 제공하는 프로토콜입니다. 커스터마이징을 지침 블록에 두면 이후 업데이트는 첨부 파일을 교체하는 작업이 되고, 수정 사항을 다시 병합하는 일이 되지 않습니다.

:::tip[지침을 커스터마이징하고 지식 파일을 첨부하세요]
페르소나 교체, 기본 사용자 이름, 팀별 가드레일, 선호 표현은 모두 붙여 넣은 지침 블록에 둡니다. 지식 파일은 그대로 두어야 변경 사항을 잃지 않고 새로 고칠 수 있습니다.
:::

## 직접 만들기

Web bundle은 `bmad-os-skill-to-bundle` 유틸리티 스킬을 사용해 BMad 스킬에서 생성합니다. 어떤 BMad 스킬 폴더든 지정하면 소유 에이전트에서 페르소나를 상속한 번들 파일을 만듭니다.

모든 번들은 [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)에서 설치할 수 있습니다.
