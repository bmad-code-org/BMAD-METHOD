---
title: "Đánh giá đối kháng"
description: Bắt buộc phải có danh sách phát hiện, chặn kiểu review lười “nhìn ổn”
sidebar:
  order: 9
---

Ép phân tích sâu hơn bằng **danh sách vấn đề bắt buộc** — không phải bằng persona cay cú.

## Đánh giá đối kháng là gì?

Kỹ thuật review trong đó người review **phải** đưa ra phát hiện. “Nhìn ổn” với danh sách rỗng không được phép.

Cơ chế là **sàn số phát hiện** (ít nhất mười mục cần sửa hoặc cải thiện) và yêu cầu rõ ràng tìm **phần còn thiếu**, không chỉ phần sai. Nội dung rỗng thì dừng. Danh sách rỗng thì kiểm tra lại — không kết thúc với không có gì.

Không phải để nghe hung hăng. Prompt cũ dùng persona hoài nghi; trên model hiện tại điều đó không đổi bản chất phát hiện. Vẫn quan trọng: nghĩa vụ tiếp tục tìm và ưu tiên thiếu sót hơn lướt qua.

## Vì sao hiệu quả

Review thường bị thiên kiến xác nhận. Lướt qua, không thấy gì, duyệt. Sàn số lượng phá vỡ mẫu đó:

- **Ép kỹ lưỡng** — không xong cho đến khi đủ phát hiện cụ thể
- **Bắt phần thiếu** — “chỗ này thiếu gì?” là một phần việc
- **Nuôi triage, không đập thẳng vào user** — trong build / code-review, session cha lọc nhiễu; hunter lo recall, không phải phán cuối
- **Bất đối xứng thông tin** — hunter thường chạy với ngữ cảnh tươi về thay đổi

## Dùng ở đâu

- **bmad-build / bmad-build-auto / bmad-code-review** — lớp Blind Hunter: prompt ngắn inline, nội dung dưới `CONTENT:`, song song các lớp khác, rồi triage
- **bmad-review** — thấu kính adversarial trong review đa thấu kính (cùng phương pháp; field finding chuẩn để gộp)

## Cần lọc bởi người (hoặc session cha)

Vì model được yêu cầu lấp danh sách, sẽ có mục mỏng, sẵn có, hoặc sai. Dương tính giả là bình thường.

**Triage quyết định cái gì là thật.** Trong luồng agentic là workflow cha. Review đứng một mình thì là bạn.

## Ví dụ

Thay vì:

> “Auth trông hợp lý. Duyệt.”

Một lượt đối kháng cho danh sách kiểu:

> 1. `login.ts:47` — không rate limit khi đăng nhập sai  
> … (ít nhất mười mục cụ thể)

## Lặp và lợi tức giảm dần

Sau khi sửa, lượt nữa vẫn có ích. Mỗi lượt tốn thời gian; cuối cùng chỉ còn nit và false finding. Triage phía sau và ngân sách vòng (trong build) ngăn chạy mãi.

:::tip[Review tốt hơn]
Tìm phần thiếu, không chỉ phần sai. Cứ tìm đến khi danh sách thật — rồi để triage cắt ngắn.
:::
