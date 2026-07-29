---
title: "FAQ cho dự án đã tồn tại"
description: Các câu hỏi phổ biến khi dùng BMad Method trên dự án đã tồn tại
sidebar:
  order: 12
---

Các câu trả lời nhanh cho những câu hỏi thường gặp khi làm việc với dự án đã tồn tại bằng BMad Method (BMM).

## Các câu hỏi

- [Tôi có phải chạy document-project trước không?](#toi-co-phai-chay-document-project-truoc-khong)
- [Nếu tôi quên chạy document-project thì sao?](#neu-toi-quen-chay-document-project-thi-sao)
- [Implementation hoạt động thế nào trong dự án đã tồn tại?](#implementation-hoat-dong-the-nao-trong-du-an-da-ton-tai)
- [Nếu code hiện tại của tôi không theo best practices thì sao?](#neu-code-hien-tai-cua-toi-khong-theo-best-practices-thi-sao)

### Tôi có phải chạy document-project trước không?

Rất nên chạy, nhất là khi:

- Không có tài liệu sẵn có
- Tài liệu đã lỗi thời
- Agent AI cần context về code hiện có

Bạn có thể bỏ qua nếu đã có tài liệu đầy đủ, mới, bao gồm `docs/index.md`, hoặc bạn sẽ dùng công cụ/kỹ thuật khác để giúp agent khám phá hệ thống hiện có.

### Nếu tôi quên chạy document-project thì sao?

Không sao - bạn có thể chạy nó bất cứ lúc nào. Bạn thậm chí có thể chạy trong khi dự án đang diễn ra hoặc sau đó để giữ tài liệu luôn mới.

### Implementation hoạt động thế nào trong dự án đã tồn tại?

Chạy `bmad-quick-dev`, giống như với dự án mới. Workflow sẽ:

- Tự động nhận diện stack hiện có
- Phân tích pattern code hiện có
- Phát hiện quy ước và hỏi bạn để xác nhận
- Tạo spec giàu ngữ cảnh, tôn trọng code hiện có

Bạn có thể vào trực tiếp với thay đổi rõ ràng, hoặc cung cấp story đã lập kế hoạch cùng các artifact upstream cho công việc lớn hơn.

### Nếu code hiện tại của tôi không theo best practices thì sao?

Quick Dev sẽ nhận diện quy ước hiện có và hỏi: "Tôi có nên tuân theo những quy ước hiện tại này không?" Bạn là người quyết định:

- **Có** → Giữ tính nhất quán với codebase hiện tại
- **Không** → Đặt ra chuẩn mới, đồng thời ghi rõ lý do trong spec

BMM tôn trọng lựa chọn của bạn - nó không ép buộc hiện đại hóa, nhưng sẽ đưa ra lựa chọn đó.

**Có câu hỏi chưa được trả lời ở đây?** Hãy [mở issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) hoặc hỏi trên [Discord](https://discord.gg/gk8jAdXWmj) để chúng tôi bổ sung!
