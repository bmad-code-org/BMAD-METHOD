---
title: "Party Mode"
description: Cộng tác đa agent - đưa tất cả agent AI vào cùng một cuộc trò chuyện
sidebar:
  order: 7
---

Đưa tất cả agent AI của bạn vào cùng một cuộc trò chuyện.

## Party Mode là gì?

Chạy `bmad-party-mode` và bạn sẽ có cả đội AI trong cùng một phòng - PM, Architect, Dev, UX Designer, bất kỳ ai bạn cần. BMad Master điều phối, chọn các agent liên quan cho từng tin nhắn. Các agent trả lời đúng vai, đồng ý, phản biện, và bổ sung ý tưởng cho nhau.

Cuộc trò chuyện tiếp tục lâu đến mức bạn muốn. Bạn có thể hỏi tiếp, phản biện câu trả lời, đổi hướng thảo luận - đó là một cuộc qua lại thật sự với các agent của bạn cho đến khi xong.

**Phù hợp cho:**

- Các quyết định lớn có đánh đổi
- Các phiên động não ý tưởng
- Post-mortem khi mọi thứ đi sai
- Retrospective và lập kế hoạch sprint

## Ví dụ

### Gọi tên kiến trúc tệ

**Bạn:** "Được rồi cả đội, sprint vừa rồi là một thảm họa. Dịch vụ xác thực sập ba lần. Ai đã làm hỏng chuyện này?"

**Architect:** "Thiết kế vẫn ổn - xác thực phân tán với cơ chế fallback hợp lý. Nếu phần triển khai lệch khỏi spec..."

**Dev:** "Tôi đã làm đúng theo tài liệu kiến trúc. Spec không tính đến race condition khi vô hiệu hóa session đồng thời."

**PM:** "Cả hai người đều bỏ sót vấn đề lớn hơn - chúng ta không xác thực đúng yêu cầu quản lý session trong PRD. **Lỗi này là do tôi** không bắt được sớm hơn."

**TEA:** "Và tôi đáng ra phải bắt được nó trong integration test. Các kịch bản test đã không bao phủ trường hợp vô hiệu hóa đồng thời."

### Động não sáng tạo

**Bạn:** "Làm sao để quá trình onboarding có cảm giác kỳ diệu thay vì nhàm chán?"

**UX Designer:** "Bắt đầu bằng progressive disclosure - hiện tính năng khi người dùng cần, thay vì tung một tutorial dày đặc."

**Storyteller:** "Nếu onboarding là một câu chuyện thì sao? Mỗi bước mở ra hành trình của một nhân vật - người dùng CHÍNH là người hùng."

**Game Designer:** "Nối tiếp ý đó - nếu 'nhiệm vụ' đầu tiên thực chất giải quyết một vấn đề thật của người dùng thì sao? Họ học bằng cách làm ra giá trị ngay."

### Quyết định kỹ thuật

**Bạn:** "MVP nên dùng monolith hay microservices?"

**Architect:** "Bắt đầu bằng monolith. Microservices thêm độ phức tạp mà bạn chưa cần ở mức 1000 người dùng."

**PM:** "Đồng ý. Tốc độ ra thị trường quan trọng hơn khả năng mở rộng lý thuyết."

**Dev:** "Monolith nhưng có ranh giới module rõ ràng. Nếu cần, mình có thể tách service sau."

:::tip[Quyết định tốt hơn]
Quyết định tốt hơn nhờ nhiều góc nhìn đa dạng. Chào mừng đến với party mode.
:::
