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
| Developer (Amelia) | `bmad-agent-dev` | `DS`, `QD`, `QA`, `CR`, `SP`, `CS`, `ER` | Dev Story, Quick Dev, QA Test Generation, Code Review, Sprint Planning, Create Story, Epic Retrospective |
| UX Designer (Sally) | `bmad-ux-designer` | `CU` | Create UX Design |
| Technical Writer (Paige) | `bmad-tech-writer` | `DP`, `WD`, `US`, `MG`, `VD`, `EC` | Document Project, Write Document, Update Standards, Mermaid Generate, Validate Doc, Explain Concept |

## Các Loại Trigger

Trigger trong menu agent dùng hai kiểu gọi khác nhau. Biết trigger thuộc kiểu nào sẽ giúp bạn cung cấp đúng đầu vào.

### Trigger workflow (không cần tham số)

Phần lớn trigger sẽ nạp một file workflow có cấu trúc. Bạn gõ mã trigger, agent sẽ bắt đầu workflow và nhắc bạn nhập thông tin ở từng bước.

Ví dụ: `CP` (Create PRD), `DS` (Dev Story), `CA` (Create Architecture), `QD` (Quick Dev)

### Trigger hội thoại (cần tham số)

Một số trigger sẽ mở cuộc hội thoại tự do thay vì chạy workflow có cấu trúc. Khi đó bạn cần mô tả yêu cầu của mình cùng với mã trigger.

| Agent | Trigger | Nội dung cần cung cấp |
| --- | --- | --- |
| Technical Writer (Paige) | `WD` | Mô tả tài liệu cần viết |
| Technical Writer (Paige) | `US` | Sở thích hoặc quy ước muốn thêm vào standards |
| Technical Writer (Paige) | `MG` | Mô tả sơ đồ và loại sơ đồ (sequence, flowchart, v.v.) |
| Technical Writer (Paige) | `VD` | Tài liệu cần kiểm tra và các vùng trọng tâm |
| Technical Writer (Paige) | `EC` | Tên khái niệm cần giải thích |

**Ví dụ:**

```text
WD Write a deployment guide for our Docker setup
MG Create a sequence diagram showing the auth flow
EC Explain how the module system works
```
