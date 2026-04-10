---
title: Các skill
description: Tài liệu tham chiếu cho skill của BMad — skill là gì, hoạt động ra sao và tìm ở đâu.
sidebar:
  order: 3
---

Skills là các prompt dựng sẵn để nạp agent, chạy workflow hoặc thực thi task bên trong IDE của bạn. Trình cài đặt BMad sinh chúng từ các module bạn đã chọn tại thời điểm cài đặt. Nếu sau này bạn thêm, xóa hoặc thay đổi module, hãy chạy lại trình cài đặt để đồng bộ skills (xem [Khắc phục sự cố](#khắc-phục-sự-cố)).

## Skill So Với Trigger Trong Menu Agent

BMad cung cấp hai cách để bắt đầu công việc, và chúng phục vụ những mục đích khác nhau.

| Cơ chế | Cách gọi | Điều xảy ra |
| --- | --- | --- |
| **Skill** | Gõ tên skill, ví dụ `bmad-help`, trong IDE | Nạp trực tiếp agent, chạy workflow hoặc thực thi task |
| **Trigger menu agent** | Nạp agent trước, sau đó gõ mã ngắn như `DS` | Agent diễn giải mã đó và bắt đầu workflow tương ứng trong khi vẫn giữ đúng persona |

Trigger trong menu agent yêu cầu bạn đang ở trong một phiên agent đang hoạt động. Dùng skill khi bạn đã biết mình muốn workflow nào. Dùng trigger khi bạn đang làm việc với một agent và muốn đổi tác vụ mà không rời khỏi cuộc hội thoại.

## Skills Được Tạo Ra Như Thế Nào

Khi bạn chạy `npx bmad-method install`, trình cài đặt sẽ đọc manifest của mọi module được chọn rồi tạo một skill cho mỗi agent, workflow, task và tool. Mỗi skill là một thư mục chứa file `SKILL.md`, hướng dẫn AI nạp file nguồn tương ứng và làm theo chỉ dẫn trong đó.

Trình cài đặt dùng template cho từng loại skill:

| Loại skill | File được tạo sẽ làm gì |
| --- | --- |
| **Agent launcher** | Nạp file persona của agent, kích hoạt menu của nó và giữ nguyên vai trò |
| **Workflow skill** | Nạp cấu hình workflow và làm theo các bước |
| **Task skill** | Nạp một file task độc lập và làm theo hướng dẫn |
| **Tool skill** | Nạp một file tool độc lập và làm theo hướng dẫn |

:::note[Chạy lại trình cài đặt]
Nếu bạn thêm hoặc bớt module, hãy chạy lại trình cài đặt. Nó sẽ tạo lại toàn bộ file skill khớp với tập module hiện tại.
:::

## File Skill Nằm Ở Đâu

Trình cài đặt sẽ ghi file skill vào một thư mục dành riêng cho IDE bên trong dự án. Đường dẫn chính xác phụ thuộc vào IDE bạn chọn khi cài.

| IDE / CLI | Thư mục skill |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| IDE khác | Xem output của trình cài đặt để biết đường dẫn đích |

Mỗi skill là một thư mục chứa file `SKILL.md`. Ví dụ với Claude Code, cấu trúc sẽ như sau:

```text
.claude/skills/
├── bmad-help/
│   └── SKILL.md
├── bmad-create-prd/
│   └── SKILL.md
├── bmad-agent-dev/
│   └── SKILL.md
└── ...
```

Tên thư mục quyết định tên skill trong IDE. Ví dụ thư mục `bmad-agent-dev/` sẽ đăng ký skill `bmad-agent-dev`.

## Cách Tìm Danh Sách Skill Của Bạn

Gõ tên skill trong IDE để gọi nó. Một số nền tảng yêu cầu bạn bật skills trong phần cài đặt trước khi chúng xuất hiện.

Chạy `bmad-help` để nhận hướng dẫn có ngữ cảnh về bước tiếp theo.

:::tip[Khám phá nhanh]
Các thư mục skill được tạo trong dự án chính là danh sách chuẩn nhất. Mở chúng trong trình quản lý file để xem toàn bộ skill cùng mô tả.
:::

## Các Nhóm Skill

### Agent Skills

Agent skills nạp một persona AI chuyên biệt với vai trò, phong cách giao tiếp và menu workflow xác định sẵn. Sau khi được nạp, agent sẽ giữ đúng vai trò và phản hồi qua các trigger trong menu.

| Ví dụ skill | Agent | Vai trò |
| --- | --- | --- |
| `bmad-agent-dev` | Amelia (Developer) | Triển khai story với mức tuân thủ đặc tả nghiêm ngặt |
| `bmad-pm` | John (Product Manager) | Tạo và kiểm tra PRD |
| `bmad-architect` | Winston (Architect) | Thiết kế kiến trúc hệ thống |

Xem [Agents](./agents.md) để biết danh sách đầy đủ các agent mặc định và trigger của chúng.

### Workflow Skills

Workflow skills chạy một quy trình có cấu trúc, nhiều bước mà không cần nạp persona agent trước. Chúng nạp cấu hình workflow rồi thực hiện theo từng bước.

| Ví dụ skill | Mục đích |
| --- | --- |
| `bmad-product-brief` | Tạo product brief — phiên discovery có hướng dẫn khi concept của bạn đã rõ |
| `bmad-prfaq` | Bài kiểm tra [Working Backwards PRFAQ](../explanation/analysis-phase.md#prfaq-working-backwards) để stress-test concept sản phẩm |
| `bmad-create-prd` | Tạo Product Requirements Document |
| `bmad-create-architecture` | Thiết kế kiến trúc hệ thống |
| `bmad-create-epics-and-stories` | Tạo epics và stories |
| `bmad-dev-story` | Triển khai một story |
| `bmad-code-review` | Chạy code review |
| `bmad-quick-dev` | Luồng nhanh hợp nhất — làm rõ yêu cầu, lập kế hoạch, triển khai, review và trình bày |

Xem [Workflow Map](./workflow-map.md) để có tài liệu workflow đầy đủ theo từng phase.

### Task Skills Và Tool Skills

Tasks và tools là các thao tác độc lập, không yêu cầu ngữ cảnh agent hay workflow.

**BMad-Help: người dẫn đường thông minh của bạn**

`bmad-help` là giao diện chính để bạn khám phá nên làm gì tiếp theo. Nó kiểm tra dự án, hiểu truy vấn ngôn ngữ tự nhiên và đề xuất bước bắt buộc hoặc tùy chọn tiếp theo dựa trên các module đã cài.

:::note[Ví dụ]
```text
bmad-help
bmad-help I have a SaaS idea and know all the features. Where do I start?
bmad-help What are my options for UX design?
```
:::

**Các task và tool lõi khác**

Module lõi có 11 công cụ tích hợp sẵn — review, nén tài liệu, brainstorming, quản lý tài liệu và nhiều hơn nữa. Xem [Core Tools](./core-tools.md) để có tài liệu tham chiếu đầy đủ.

## Quy Ước Đặt Tên

Mọi skill đều dùng tiền tố `bmad-` theo sau là tên mô tả, ví dụ `bmad-agent-dev`, `bmad-create-prd`, `bmad-help`. Xem [Modules](./modules.md) để biết các module hiện có.

## Khắc Phục Sự Cố

**Skills không xuất hiện sau khi cài đặt.** Một số nền tảng yêu cầu bật skills thủ công trong phần cài đặt. Hãy kiểm tra tài liệu IDE của bạn hoặc hỏi trợ lý AI cách bật skills. Bạn cũng có thể cần khởi động lại IDE hoặc reload cửa sổ.

**Thiếu skill mà bạn mong đợi.** Trình cài đặt chỉ tạo skill cho những module bạn đã chọn. Hãy chạy lại `npx bmad-method install` và kiểm tra lại phần chọn module. Đồng thời xác nhận rằng file skill thực sự tồn tại trong thư mục dự kiến.

**Skill từ module đã bỏ vẫn còn xuất hiện.** Trình cài đặt không tự xóa các file skill cũ. Hãy xóa các thư mục lỗi thời trong thư mục skills của IDE, hoặc xóa toàn bộ thư mục skills rồi chạy lại trình cài đặt để có tập skill sạch.
