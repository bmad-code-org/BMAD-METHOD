---
title: Các agent
description: Các agent mặc định của BMM cùng skill ID, trigger menu và workflow chính
sidebar:
  order: 2
---

## Các Agent Mặc Định

Trang này liệt kê các agent mặc định của BMM (bộ Agile suite) được cài cùng với BMad Method, bao gồm skill ID, trigger menu và workflow chính của chúng. Mỗi agent được gọi dưới dạng một skill.

## Ghi Chú

- Mỗi agent đều có sẵn dưới dạng một skill do trình cài đặt tạo ra. Skill ID, ví dụ `bmad-dev`, được dùng để gọi agent.
- Trigger là các mã menu ngắn, ví dụ `CP`, cùng với các fuzzy match hiển thị trong menu của từng agent.
- Việc tạo test QA do workflow skill `bmad-qa-generate-e2e-tests` đảm nhận, khả dụng thông qua Developer agent. Module Test Architect (TEA) đầy đủ nằm trong một module riêng.

| Agent | Skill ID | Trigger | Workflow chính |
| --------------------------- | -------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Analyst (Mary) | `bmad-analyst` | `BP`, `MR`, `DR`, `TR`, `CB`, `WB`, `DP` | Brainstorm, Market Research, Domain Research, Technical Research, Create Brief, PRFAQ Challenge, Document Project |
| Product Manager (John) | `bmad-pm` | `CP`, `VP`, `EP`, `CE`, `IR`, `CC` | Create/Validate/Edit PRD, Create Epics and Stories, Implementation Readiness, Correct Course |
| Architect (Winston) | `bmad-architect` | `CA`, `IR` | Create Architecture, Implementation Readiness |
| Developer (Amelia) | `bmad-agent-dev` | `BD`, `QA`, `CR`, `SP`, `ER` | Build, QA Test Generation, Code Review, Sprint Planning, Epic Retrospective |
| UX Designer (Sally) | `bmad-ux-designer` | `CU` | Create UX Design |

:::note[Paige đâu rồi?]
Technical Writer (Paige) đang tạm nghỉ — cô ấy sẽ trở lại trong tương lai với năng lực mạnh hơn nhiều. Tài liệu dự án vẫn được hỗ trợ: trigger `DP` (Document Project) khả dụng qua Analyst agent, hoặc gọi trực tiếp skill `bmad-document-project`.
:::

## Các Loại Trigger

Trigger trong menu agent sẽ nạp một file workflow có cấu trúc. Bạn gõ mã trigger, agent sẽ bắt đầu workflow và nhắc bạn nhập thông tin ở từng bước.

Ví dụ: `CP` (Create PRD), `CA` (Create Architecture), `BD` (Build)
