---
title: "Đánh giá đối kháng"
description: Kỹ thuật lập luận ép buộc giúp tránh các bản review lười kiểu "nhìn ổn"
sidebar:
  order: 5
---

Buộc quá trình phân tích đi sâu hơn bằng cách ép phải tìm ra vấn đề.

## Đánh giá đối kháng là gì?

Đây là một kỹ thuật review mà người review *bắt buộc* phải tìm thấy vấn đề. Không có chuyện "nhìn ổn". Người review chọn lập trường hoài nghi - giả sử vấn đề có tồn tại và đi tìm chúng.

Đây không phải là việc cố tình tiêu cực. Đây là cách ép buộc phân tích thật sự, thay vì chỉ liếc qua và đóng dấu chấp nhận những gì vừa được nộp lên.

**Quy tắc cốt lõi:** Bạn phải tìm ra vấn đề. Nếu không có phát hiện nào, quy trình sẽ dừng lại - cần phân tích lại hoặc giải thích tại sao.

## Vì sao nó hiệu quả

Những lần review thông thường dễ bị confirmation bias. Bạn lướt qua công việc, không có gì đập vào mắt, rồi phê duyệt. Yêu cầu "tìm vấn đề" phá vỡ mẫu này:

- **Ép buộc sự kỹ lưỡng** - Không thể phê duyệt cho đến khi bạn đã đào đủ sâu để tìm thấy vấn đề
- **Bắt được những thứ đang thiếu** - "Còn gì chưa có ở đây?" trở thành câu hỏi tự nhiên
- **Tăng chất lượng tín hiệu** - Các phát hiện cụ thể và có thể hành động được, không phải các lo ngại mơ hồ
- **Bất đối xứng thông tin** - Chạy review với bối cảnh mới (không có lý do gốc) để đánh giá artifact, không phải ý định

## Nó được dùng ở đâu

Đánh giá đối kháng xuất hiện xuyên suốt các workflow của BMad - code review, kiểm tra sẵn sàng triển khai, xác thực spec, và nhiều nơi khác. Đôi khi là bước bắt buộc, đôi khi là tùy chọn (như khai thác nâng cao hoặc party mode). Mẫu này được điều chỉnh theo artifact cần bị soi kỹ.

## Vẫn cần bộ lọc của con người

Vì AI *được lệnh* phải tìm vấn đề, nó sẽ tìm vấn đề - ngay cả khi chúng không tồn tại. Hãy kỳ vọng false positive: bắt bẻ những lỗi vặt, hiểu sai ý định, hoặc thậm chí tưởng tượng ra vấn đề.

**Bạn là người quyết định cái nào là thật.** Xem từng phát hiện, bỏ qua nhiễu, sửa những gì quan trọng.

## Ví dụ

Thay vì:

> "Phần triển khai xác thực có vẻ hợp lý. Đã duyệt."

Một lần đánh giá đối kháng sẽ cho ra:

> 1. **HIGH** - `login.ts:47` - Không có giới hạn tốc độ cho các lần đăng nhập thất bại
> 2. **HIGH** - Session token được lưu trong localStorage (dễ bị XSS)
> 3. **MEDIUM** - Kiểm tra mật khẩu chỉ diễn ra ở client
> 4. **MEDIUM** - Không có audit log cho các lần đăng nhập thất bại
> 5. **LOW** - Số magic `3600` nên được đổi thành `SESSION_TIMEOUT_SECONDS`

Bản review thứ nhất có thể bỏ sót một lỗi bảo mật. Bản review thứ hai đã bắt được bốn vấn đề.

## Lặp lại và lợi ích giảm dần

Sau khi đã xử lý các phát hiện, hãy cân nhắc chạy lại. Lần thứ hai thường sẽ bắt thêm được vấn đề. Lần thứ ba cũng không phải lúc nào cũng vô ích. Nhưng mỗi lần đều tốn thời gian, và đến một mức nào đó bạn sẽ gặp lợi ích giảm dần - chỉ còn các bắt bẻ nhỏ và false positive.

:::tip[Review tốt hơn]
Giả sử vấn đề có tồn tại. Tìm những gì còn thiếu, không chỉ những gì sai.
:::
