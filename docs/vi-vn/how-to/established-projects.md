---
title: "Dự án đã tồn tại"
description: Cách sử dụng BMad Method trên các codebase hiện có
sidebar:
  order: 6
---

Sử dụng BMad Method hiệu quả khi làm việc với các dự án hiện có và codebase legacy.

Tài liệu này mô tả workflow cốt lõi để on-board vào các dự án đã tồn tại bằng BMad Method.

:::note[Điều kiện tiên quyết]
- Đã cài BMad Method (`npx bmad-method install`)
- Một codebase hiện có mà bạn muốn làm việc cùng
- Quyền truy cập vào một IDE tích hợp AI (Claude Code hoặc Cursor)
:::

## Bước 1: Dọn dẹp các tài liệu lập kế hoạch đã hoàn tất

Nếu bạn đã hoàn thành toàn bộ epic và story trong PRD theo quy trình BMad, hãy dọn dẹp những tệp đó. Bạn có thể lưu trữ, xóa đi, hoặc dựa vào lịch sử phiên bản nếu cần. Không nên giữ các tệp này trong:

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## Bước 2: Tạo Project Context

:::tip[Khuyến dùng cho dự án hiện có]
Hãy tạo `project-context.md` để ghi lại các pattern và quy ước trong codebase hiện tại. Điều này giúp các agent AI tuân theo các thực hành sẵn có khi thực hiện thay đổi.
:::

Chạy workflow tạo project context:

```bash
bmad-generate-project-context
```

Workflow này sẽ quét codebase để nhận diện:
- Stack công nghệ và các phiên bản
- Các pattern tổ chức code
- Quy ước đặt tên
- Cách tiếp cận kiểm thử
- Các pattern đặc thù framework

Bạn có thể xem lại và chỉnh sửa tệp được tạo, hoặc tự tạo tệp tại `_bmad-output/project-context.md` nếu muốn.

[Tìm hiểu thêm về project context](../explanation/project-context.md)

## Bước 3: Duy trì tài liệu dự án chất lượng

Thư mục `docs/` của bạn nên chứa tài liệu ngắn gọn, có tổ chức tốt, và phản ánh chính xác dự án:

- Mục tiêu và lý do kinh doanh
- Quy tắc nghiệp vụ
- Kiến trúc
- Bất kỳ thông tin dự án nào khác có liên quan

Với các dự án phức tạp, hãy cân nhắc dùng workflow `bmad-document-project`. Nó có các biến thể lúc chạy có thể quét toàn bộ dự án và tài liệu hóa trạng thái thực tế hiện tại của hệ thống.

## Bước 4: Nhờ trợ giúp

### BMad-Help: Điểm bắt đầu của bạn

**Hãy chạy `bmad-help` bất cứ lúc nào bạn không chắc cần làm gì tiếp theo.** Công cụ hướng dẫn thông minh này:

- Kiểm tra dự án để xem những gì đã được hoàn thành
- Đưa ra tùy chọn dựa trên các module bạn đã cài
- Hiểu các câu hỏi bằng ngôn ngữ tự nhiên

```text
bmad-help Tôi có một ứng dụng Rails đã tồn tại, tôi nên bắt đầu từ đâu?
bmad-help Điểm khác nhau giữa quick-flow và full method là gì?
bmad-help Cho tôi xem những workflow đang có
```

BMad-Help cũng **tự động chạy ở cuối mỗi workflow**, đưa ra hướng dẫn rõ ràng về việc cần làm tiếp theo.

### Chọn cách tiếp cận

Bạn có hai lựa chọn chính, tùy thuộc vào phạm vi thay đổi:

| Phạm vi | Cách tiếp cận được khuyến nghị |
| --- | --- |
| **Cập nhật hoặc bổ sung nhỏ** | Chạy `bmad-quick-dev` để làm rõ ý định, lập kế hoạch, triển khai và review trong một workflow duy nhất. Quy trình BMad Method đầy đủ có thể là quá mức cần thiết. |
| **Thay đổi hoặc bổ sung lớn** | Bắt đầu với BMad Method, áp dụng mức độ chặt chẽ phù hợp với nhu cầu của bạn. |

### Khi tạo PRD

Khi tạo brief hoặc đi thẳng vào PRD, đảm bảo agent:

- Tìm và phân tích tài liệu dự án hiện có
- Đọc đúng bối cảnh về hệ thống hiện tại của bạn

Bạn có thể chủ động hướng dẫn agent, nhưng mục tiêu là đảm bảo tính năng mới tích hợp tốt với hệ thống đã có.

### Cân nhắc về UX

Công việc UX là tùy chọn. Quyết định này không phụ thuộc vào việc dự án có UX hay không, mà phụ thuộc vào:

- Bạn có định thay đổi UX hay không
- Bạn có cần thiết kế hay pattern UX mới đáng kể hay không

Nếu thay đổi của bạn chỉ là những cập nhật nhỏ trên các màn hình hiện có mà bạn đã hài lòng, thì không cần một quy trình UX đầy đủ.

### Cân nhắc về kiến trúc

Khi làm kiến trúc, đảm bảo kiến trúc sư:

- Sử dụng đúng các tệp tài liệu cần thiết
- Quét codebase hiện có

Cần đặc biệt chú ý để tránh tái phát minh bánh xe hoặc đưa ra quyết định không phù hợp với kiến trúc hiện tại.

## Thông tin thêm

- **[Quick Fixes](./quick-fixes.md)** - Sửa lỗi và thay đổi ad-hoc
- **[Câu hỏi thường gặp cho dự án đã tồn tại](../explanation/established-projects-faq.md)** - Những câu hỏi phổ biến khi làm việc với dự án đã tồn tại
