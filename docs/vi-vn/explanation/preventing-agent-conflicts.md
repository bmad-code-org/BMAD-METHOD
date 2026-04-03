---
title: "Ngăn xung đột giữa các agent"
description: Cách kiến trúc ngăn xung đột khi nhiều agent cùng triển khai một hệ thống
sidebar:
     order: 4
---

Khi nhiều agent AI cùng triển khai các phần khác nhau của hệ thống, chúng có thể đưa ra các quyết định kỹ thuật mâu thuẫn nhau. Tài liệu kiến trúc ngăn điều đó bằng cách thiết lập các tiêu chuẩn dùng chung.

## Các kiểu xung đột phổ biến

### Xung đột về phong cách API

Không có kiến trúc:
- Agent A dùng REST với `/users/{id}`
- Agent B dùng GraphQL mutations
- Kết quả: pattern API không nhất quán, người dùng API bị rối

Có kiến trúc:
- ADR quy định: "Dùng GraphQL cho mọi giao tiếp client-server"
- Tất cả agent theo cùng một mẫu

### Xung đột về thiết kế cơ sở dữ liệu

Không có kiến trúc:
- Agent A dùng tên cột theo snake_case
- Agent B dùng camelCase
- Kết quả: schema không nhất quán, truy vấn khó hiểu

Có kiến trúc:
- Tài liệu standards quy định quy ước đặt tên
- Tất cả agent theo cùng một pattern

### Xung đột về quản lý state

Không có kiến trúc:
- Agent A dùng Redux cho global state
- Agent B dùng React Context
- Kết quả: nhiều cách quản lý state song song, độ phức tạp tăng cao

Có kiến trúc:
- ADR quy định cách quản lý state
- Tất cả agent triển khai thống nhất

## Kiến trúc ngăn xung đột bằng cách nào

### 1. Quyết định rõ ràng thông qua ADR

Mỗi lựa chọn công nghệ quan trọng đều được ghi lại với:
- Context (vì sao quyết định này quan trọng)
- Các lựa chọn đã cân nhắc (có những phương án nào)
- Quyết định (ta đã chọn gì)
- Lý do (tại sao lại chọn như vậy)
- Hệ quả (các đánh đổi được chấp nhận)

### 2. Hướng dẫn riêng cho FR/NFR

Kiến trúc ánh xạ mỗi functional requirement sang cách tiếp cận kỹ thuật:
- FR-001: User Management → GraphQL mutations
- FR-002: Mobile App → Truy vấn tối ưu

### 3. Tiêu chuẩn và quy ước

Tài liệu hóa rõ ràng về:
- Cấu trúc thư mục
- Quy ước đặt tên
- Cách tổ chức code
- Pattern kiểm thử

## Kiến trúc như một bối cảnh dùng chung

Hãy xem kiến trúc là bối cảnh dùng chung mà tất cả agent đều đọc trước khi triển khai:

```text
PRD: "Cần xây gì"
     ↓
Kiến trúc: "Xây như thế nào"
     ↓
Agent A đọc kiến trúc → triển khai Epic 1
Agent B đọc kiến trúc → triển khai Epic 2
Agent C đọc kiến trúc → triển khai Epic 3
     ↓
Kết quả: Triển khai nhất quán
```

## Các chủ đề ADR quan trọng

Những quyết định phổ biến giúp tránh xung đột:

| Chủ đề | Ví dụ quyết định |
| ---------------- | -------------------------------------------- |
| API Style | GraphQL hay REST hay gRPC |
| Database | PostgreSQL hay MongoDB |
| Auth | JWT hay Session |
| State Management | Redux hay Context hay Zustand |
| Styling | CSS Modules hay Tailwind hay Styled Components |
| Testing | Jest + Playwright hay Vitest + Cypress |

## Anti-pattern cần tránh

:::caution[Những lỗi thường gặp]
- **Quyết định ngầm** - "Cứ để đó rồi tính phong cách API sau" sẽ dẫn đến không nhất quán
- **Tài liệu hóa quá mức** - Ghi lại mọi lựa chọn nhỏ gây tê liệt phân tích
- **Kiến trúc lỗi thời** - Tài liệu viết một lần rồi không cập nhật khiến agent đi theo pattern cũ
:::

:::tip[Cách tiếp cận đúng]
- Tài liệu hóa những quyết định cắt ngang nhiều epic
- Tập trung vào những khu vực dễ phát sinh xung đột
- Cập nhật kiến trúc khi bạn học thêm
- Dùng `bmad-correct-course` cho các thay đổi đáng kể
:::
