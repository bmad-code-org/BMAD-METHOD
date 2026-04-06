---
title: "Sửa nhanh"
description: Cách thực hiện các sửa nhanh và thay đổi ad-hoc
sidebar:
  order: 5
---

Sử dụng **Quick Dev** cho sửa lỗi, refactor, hoặc các thay đổi nhỏ có mục tiêu rõ ràng mà không cần quy trình BMad Method đầy đủ.

## Khi nào nên dùng

- Sửa lỗi khi nguyên nhân đã rõ ràng
- Refactor nhỏ (đổi tên, tách hàm, tái cấu trúc) nằm trong một vài tệp
- Điều chỉnh tính năng nhỏ hoặc thay đổi cấu hình
- Cập nhật dependency

:::note[Điều kiện tiên quyết]
- Đã cài BMad Method (`npx bmad-method install`)
- Một IDE tích hợp AI (Claude Code, Cursor, hoặc tương tự)
:::

## Các bước thực hiện

### 1. Bắt đầu một phiên chat mới

Mở **một phiên chat mới** trong AI IDE của bạn. Tái sử dụng một phiên từ workflow trước dễ gây xung đột context.

### 2. Mô tả ý định của bạn

Quick Dev nhận ý định dạng tự do - trước, cùng lúc, hoặc sau khi gọi workflow. Ví dụ:

```text
run quick-dev — Sửa lỗi validate đăng nhập cho phép mật khẩu rỗng.
```

```text
run quick-dev — fix https://github.com/org/repo/issues/42
```

```text
run quick-dev — thực hiện ý định trong _bmad-output/implementation-artifacts/my-intent.md
```

```text
Tôi nghĩ vấn đề nằm ở auth middleware, nó không kiểm tra hạn của token.
Để tôi xem... đúng rồi, src/auth/middleware.ts dòng 47 bỏ qua
hoàn toàn phần kiểm tra exp. run quick-dev
```

```text
run quick-dev
> Bạn muốn làm gì?
Refactor UserService sang dùng async/await thay vì callbacks.
```

Văn bản thường, đường dẫn tệp, URL issue GitHub, liên kết bug tracker - bất kỳ thứ gì LLM có thể suy ra thành một ý định cụ thể.

### 3. Trả lời câu hỏi và phê duyệt

Quick Dev có thể đặt câu hỏi làm rõ hoặc đưa ra một bản spec ngắn để bạn phê duyệt trước khi triển khai. Hãy trả lời và phê duyệt khi bạn thấy kế hoạch đã ổn.

### 4. Review và push

Quick Dev sẽ triển khai thay đổi, tự review công việc của mình, sửa các vấn đề phát hiện được và commit vào local. Khi hoàn thành, nó sẽ mở các tệp bị ảnh hưởng trong editor.

- Xem nhanh diff để xác nhận thay đổi đúng với ý định của bạn
- Nếu có gì không ổn, nói cho agent biết cần sửa gì - nó có thể lặp lại ngay trong cùng phiên

Khi đã hài lòng, push commit. Quick Dev sẽ đề xuất push và tạo PR cho bạn.

:::caution[Nếu có thứ bị vỡ]
Nếu thay đổi đã push gây sự cố ngoài ý muốn, dùng `git revert HEAD` để hoàn tác commit cuối một cách sạch sẽ. Sau đó bắt đầu một phiên chat mới và chạy lại Quick Dev để thử hướng khác.
:::

## Bạn nhận được gì

- Các tệp nguồn đã được sửa với bản fix hoặc refactor
- Test đã pass (nếu dự án có bộ test)
- Một commit sẵn sàng để push, dùng conventional commit message

## Công việc trì hoãn

Quick Dev giữ mỗi lần chạy tập trung vào một mục tiêu duy nhất. Nếu yêu cầu của bạn có nhiều mục tiêu độc lập, hoặc review phát hiện các vấn đề tồn tại sẵn không liên quan đến thay đổi hiện tại, Quick Dev sẽ đưa chúng vào tệp `deferred-work.md` trong thư mục implementation artifacts thay vì cố gắng xử lý tất cả một lúc.

Hãy kiểm tra tệp này sau mỗi lần chạy - đó là backlog các việc bạn cần quay lại sau. Mỗi mục trì hoãn có thể được đưa vào một lần chạy Quick Dev mới.

## Khi nào nên nâng cấp lên quy trình lập kế hoạch đầy đủ

Cân nhắc dùng toàn bộ BMad Method khi:

- Thay đổi ảnh hưởng nhiều hệ thống hoặc cần cập nhật đồng bộ trên nhiều tệp
- Bạn chưa chắc phạm vi và cần làm rõ yêu cầu trước
- Bạn cần ghi lại tài liệu hoặc quyết định kiến trúc cho cả nhóm

Xem [Quick Dev](../explanation/quick-dev.md) để hiểu rõ hơn Quick Dev nằm ở đâu trong BMad Method.
