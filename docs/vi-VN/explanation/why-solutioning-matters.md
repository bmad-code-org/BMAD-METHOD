---
title: "Vì sao solutioning quan trọng"
description: Hiểu vì sao giai đoạn solutioning là tối quan trọng đối với dự án nhiều epic
sidebar:
  order: 3
---

Giai đoạn 3 (Solutioning) biến **xây gì** (từ giai đoạn Planning) thành **xây như thế nào** (thiết kế kỹ thuật). Giai đoạn này ngăn xung đột giữa các agent trong dự án nhiều epic bằng cách ghi lại các quyết định kiến trúc trước khi bắt đầu triển khai.

## Vấn đề nếu bỏ qua solutioning

```text
Agent 1 triển khai Epic 1 bằng REST API
Agent 2 triển khai Epic 2 bằng GraphQL
Kết quả: Thiết kế API không nhất quán, tích hợp trở thành ác mộng
```

Khi nhiều agent triển khai các phần khác nhau của hệ thống mà không có hướng dẫn kiến trúc chung, chúng sẽ tự đưa ra quyết định kỹ thuật độc lập và dễ xung đột với nhau.

## Lợi ích khi có solutioning

```text
workflow kiến trúc quyết định: "Dùng GraphQL cho mọi API"
Tất cả agent đều theo quyết định kiến trúc
Kết quả: Triển khai nhất quán, không xung đột
```

Bằng cách tài liệu hóa rõ ràng các quyết định kỹ thuật, tất cả agent triển khai đồng bộ và việc tích hợp trở nên đơn giản hơn nhiều.

## Solutioning và Planning khác nhau ở đâu

| Khía cạnh | Planning (Giai đoạn 2) | Solutioning (Giai đoạn 3) |
| -------- | ----------------------- | --------------------------------- |
| Câu hỏi | Xây gì và vì sao? | Xây như thế nào? Rồi chia thành đơn vị công việc gì? |
| Đầu ra | FR/NFR (Yêu cầu) | Kiến trúc + Epics/Stories |
| Agent | PM | Architect → PM |
| Đối tượng đọc | Stakeholder | Developer |
| Tài liệu | PRD (FRs/NFRs) | Kiến trúc + Tệp Epic |
| Mức độ | Logic nghiệp vụ | Thiết kế kỹ thuật + Phân rã công việc |

## Nguyên lý cốt lõi

**Biến các quyết định kỹ thuật thành tường minh và được tài liệu hóa** để tất cả agent triển khai nhất quán.

Điều này ngăn chặn:
- Xung đột phong cách API (REST vs GraphQL)
- Không nhất quán trong thiết kế cơ sở dữ liệu
- Bất đồng về quản lý state
- Lệch quy ước đặt tên
- Biến thể trong cách tiếp cận bảo mật

## Khi nào solutioning là bắt buộc

| Track | Có cần solutioning không? |
|-------|----------------------|
| Quick Flow | Không - bỏ qua hoàn toàn |
| BMad Method đơn giản | Tùy chọn |
| BMad Method phức tạp | Có |
| Enterprise | Có |

:::tip[Quy tắc ngón tay cái]
Nếu bạn có nhiều epic có thể được các agent khác nhau triển khai, bạn cần solutioning.
:::

## Cái giá của việc bỏ qua

Bỏ qua solutioning trong dự án phức tạp sẽ dẫn đến:

- **Vấn đề tích hợp** chỉ được phát hiện giữa sprint
- **Làm lại** vì các phần triển khai xung đột nhau
- **Tổng thời gian phát triển dài hơn**
- **Nợ kỹ thuật** do pattern không đồng nhất

:::caution[Hệ số chi phí]
Bắt được vấn đề canh hàng trong giai đoạn solutioning nhanh hơn gấp 10 lần so với để đến lúc triển khai mới phát hiện.
:::
