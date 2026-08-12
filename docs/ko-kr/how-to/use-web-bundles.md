---
title: '웹 번들 사용하기'
description: BMad 웹 번들을 Google Gemini Gem 또는 ChatGPT Custom GPT로 설치하기
---

웹 번들은 **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**에서 설치합니다.

## 한 곳에서 설치하는 이유

이 사이트는 번들 카탈로그의 유일한 지원 설치 경로입니다. Gemini와 ChatGPT가 바뀌어도 설치 절차를 최신 상태로 유지하고, 항상 가장 최근 태그 릴리스를 안내합니다. 한 번 가입하면 새 번들이 출시될 때마다 알림도 받을 수 있습니다.

## 사이트에서 할 일

1. 카드 그리드에서 번들을 고릅니다.
2. 설치 모달을 엽니다. **Gemini Gem** 탭과 **ChatGPT GPT** 탭을 전환해 플랫폼별 단계를 확인합니다.
3. 번들 ZIP을 한 번의 클릭으로 다운로드합니다. 이메일 알림만 받는 무료 멤버십에는 처음 한 번만 가입하면 됩니다.
4. 페이지 안의 단계를 따릅니다. Gem 또는 Custom GPT를 만들고, 지식 파일을 업로드하고, 지침 블록을 붙여 넣은 뒤 저장합니다.

## 사전 조건

- **Gemini Gems**: Gemini Advanced 구독.
- **ChatGPT Custom GPTs**: Plus, Pro, Business 또는 Enterprise 플랜.
- **Deep Research**를 사용하는 번들(현재 Market & Industry Research)은 프롬프트 바에서 활성화합니다(Tools → Deep Research). Deep Research에는 별도의 플랜 제한이 있습니다.

## 페르소나 커스터마이징

각 번들의 `INSTRUCTIONS.md`(ZIP 안에 있음)에는 붙여 넣기 경계 위에 **Persona Swap Example**이 포함됩니다. 설치한 지침의 `[persona]` 블록을 교체 예시로 바꾸면 프로토콜을 바꾸지 않고도 목소리를 바꿀 수 있습니다. 직접 새 페르소나를 작성해도 됩니다. 프로토콜은 그대로 유지됩니다.

## 얻는 것

- BMad의 계획 기능 하나에 특화된 재사용 가능한 Gem 또는 Custom GPT.
- 구현을 위해 IDE에 바로 넣을 수 있는 다듬어진 산출물(제품 개요, PRD, 리서치 보고서, UX 사양).
- 계획 대화가 토큰 사용량에 따라 과금되는 IDE가 아니라 기존 웹 LLM 구독에서 실행됩니다.

:::caution[페르소나 이탈]
웹 LLM은 세션이 길어지면 가끔 페르소나 설정에서 벗어날 수 있습니다. 모델이 설정한 캐릭터와 다른 방식으로 답하기 시작하면 페르소나를 다시 알려 주거나 새 세션을 시작하세요.
:::

## 직접 만들기

기존 BMad 스킬을 웹 번들로 바꾸려면 [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills)의 `bmad-os-skill-to-bundle` 유틸리티 스킬을 사용하세요. 이 스킬은 담당 에이전트의 페르소나를 상속하고 목소리가 확연히 다른 페르소나 교체 예시를 포함한 번들 파일을 만듭니다. 번들을 카탈로그에 제출하려면 `web-bundles/bundles.json` 항목과 번들 디렉터리를 추가하는 PR을 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)에 여세요.
