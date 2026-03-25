---
title: "Quản lý Project Context"
description: Tạo và duy trì project-context.md để định hướng cho các agent AI
sidebar:
  order: 8
---

Sử dụng tệp `project-context.md` để đảm bảo các agent AI tuân theo ưu tiên kỹ thuật và quy tắc triển khai của dự án trong suốt mọi workflow. Để đảm bảo tệp này luôn sẵn có, bạn cũng có thể thêm dòng `Important project context and conventions are located in [path to project context]/project-context.md` vào file context của công cụ hoặc file always rules của bạn (như `AGENTS.md`).

:::note[Điều kiện tiên quyết]
- Đã cài BMad Method
- Hiểu stack công nghệ và các quy ước của dự án
:::

## Khi nào nên dùng

- Bạn có các ưu tiên kỹ thuật rõ ràng trước khi bắt đầu làm kiến trúc
- Bạn đã hoàn thành kiến trúc và muốn ghi lại các quyết định để phục vụ triển khai
- Bạn đang làm việc với một codebase hiện có có những pattern đã ổn định
- Bạn thấy các agent đưa ra quyết định không nhất quán giữa các story

## Bước 1: Chọn cách tiếp cận

**Tự tạo bằng tay** - Phù hợp nhất khi bạn biết rõ cần tài liệu hóa quy tắc nào

**Tạo sau kiến trúc** - Phù hợp để ghi lại các quyết định đã được đưa ra trong giai đoạn solutioning

**Tạo cho dự án hiện có** - Phù hợp để khám phá pattern trong các codebase đã tồn tại

## Bước 2: Tạo tệp

### Lựa chọn A: Tạo thủ công

Tạo tệp tại `_bmad-output/project-context.md`:

```bash
mkdir -p _bmad-output
touch _bmad-output/project-context.md
```

Thêm stack công nghệ và các quy tắc triển khai của bạn:

```markdown
---
project_name: 'MyProject'
user_name: 'YourName'
date: '2026-02-15'
sections_completed: ['technology_stack', 'critical_rules']
---

# Project Context for AI Agents

## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2
- State: Zustand
- Testing: Vitest, Playwright
- Styling: Tailwind CSS

## Critical Implementation Rules

**TypeScript:**
- Strict mode enabled, no `any` types
- Use `interface` for public APIs, `type` for unions

**Code Organization:**
- Components in `/src/components/` with co-located tests
- API calls use `apiClient` singleton — never fetch directly

**Testing:**
- Unit tests focus on business logic
- Integration tests use MSW for API mocking
```

### Lựa chọn B: Tạo sau khi hoàn thành kiến trúc

Chạy workflow trong một phiên chat mới:

```bash
bmad-generate-project-context
```

Workflow sẽ quét tài liệu kiến trúc và tệp dự án để tạo tệp context ghi lại các quyết định đã được đưa ra.

### Lựa chọn C: Tạo cho dự án hiện có

Với các dự án hiện có, chạy:

```bash
bmad-generate-project-context
```

Workflow sẽ phân tích codebase để nhận diện quy ước, sau đó tạo tệp context để bạn xem lại và chỉnh sửa.

## Bước 3: Xác minh nội dung

Xem lại tệp được tạo và đảm bảo nó ghi đúng:

- Các phiên bản công nghệ chính xác
- Đúng các quy ước thực tế của bạn (không phải các best practice chung chung)
- Các quy tắc giúp tránh những lỗi thường gặp
- Các pattern đặc thù framework

Chỉnh sửa thủ công để thêm phần còn thiếu hoặc loại bỏ những chỗ không chính xác.

## Bạn nhận được gì

Một tệp `project-context.md` sẽ:

- Đảm bảo tất cả agent tuân theo cùng một bộ quy ước
- Ngăn các quyết định không nhất quán giữa các story
- Ghi lại các quyết định kiến trúc cho giai đoạn triển khai
- Làm tài liệu tham chiếu cho các pattern và quy tắc của dự án

## Mẹo

:::tip[Thực hành tốt]
- **Tập trung vào điều không hiển nhiên** - Ghi lại những pattern agent dễ bỏ sót (ví dụ: "Dùng JSDoc cho mọi lớp public"), thay vì các quy tắc phổ quát như "đặt tên biến có ý nghĩa".
- **Gọn nhẹ** - Tệp này được nạp trong mọi workflow triển khai. Tệp quá dài sẽ tốn context. Hãy bỏ qua nội dung chỉ áp dụng cho phạm vi hẹp hoặc một vài story cụ thể.
- **Cập nhật khi cần** - Sửa thủ công khi pattern thay đổi, hoặc tạo lại sau các thay đổi kiến trúc lớn.
- Áp dụng được cho cả Quick Flow lẫn quy trình BMad Method đầy đủ.
:::

## Bước tiếp theo

- [**Giải thích về Project Context**](../explanation/project-context.md) - Tìm hiểu sâu hơn cách nó hoạt động
- [**Bản đồ workflow**](../reference/workflow-map.md) - Xem workflow nào sử dụng project context
