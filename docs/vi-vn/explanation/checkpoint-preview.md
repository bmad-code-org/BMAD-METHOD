---
title: "Xem trước Checkpoint"
description: Review có người trong vòng lặp với hỗ trợ của LLM, dẫn bạn đi qua thay đổi từ mục đích đến chi tiết
sidebar:
  order: 3
---

`bmad-checkpoint-preview` là một workflow review tương tác có người trong vòng lặp với hỗ trợ của LLM. Nó dẫn bạn đi qua một thay đổi mã nguồn, từ mục đích và bối cảnh đến các chi tiết quan trọng, để bạn có thể quyết định có nên phát hành, làm lại, hay đào sâu thêm.

![Sơ đồ workflow Checkpoint Preview](/diagrams/checkpoint-preview-diagram.png)

## Luồng điển hình

Bạn chạy `bmad-quick-dev`. Nó làm rõ ý định của bạn, dựng spec, triển khai thay đổi, rồi khi xong sẽ nối thêm một review trail vào file spec và mở file đó trong editor. Bạn nhìn vào spec và thấy thay đổi này chạm tới 20 file, trải trên nhiều module.

Bạn có thể tự liếc diff. Nhưng khoảng 20 file là lúc cách đó bắt đầu kém hiệu quả: bạn mất mạch, bỏ sót liên hệ giữa hai thay đổi ở xa nhau, hoặc duyệt một thứ mà bạn chưa thực sự hiểu. Thay vì vậy, bạn nói "checkpoint" và LLM sẽ dẫn bạn đi qua thay đổi.

Điểm bàn giao đó, từ triển khai tự động quay lại phán đoán của con người, chính là tình huống sử dụng chính. Quick-dev có thể chạy khá lâu với rất ít giám sát. Checkpoint Preview là nơi bạn cầm lại tay lái.

## Vì sao nó tồn tại

Code review có hai kiểu thất bại. Kiểu đầu là người review lướt qua diff, không thấy gì nổi bật và bấm duyệt. Kiểu thứ hai là họ đọc rất kỹ từng file nhưng lại mất mạch tổng thể, thấy từng cái cây mà bỏ lỡ cả khu rừng. Cả hai đều dẫn tới cùng một kết quả: lần review đã không bắt được điều thực sự quan trọng.

Vấn đề cốt lõi nằm ở thứ tự tiếp nhận. Một raw diff trình bày thay đổi theo thứ tự file, gần như không bao giờ là thứ tự giúp xây dựng hiểu biết. Bạn thấy một helper function trước khi biết vì sao nó tồn tại. Bạn thấy một schema change trước khi hiểu tính năng nào đang dùng nó. Người review phải tự dựng lại ý đồ của tác giả từ những manh mối rời rạc, và chính ở bước dựng lại đó sự tập trung thường bị đứt.

Checkpoint Preview giải quyết việc này bằng cách để LLM làm phần dựng lại. Nó đọc diff, spec nếu có, và codebase xung quanh, rồi trình bày thay đổi theo một thứ tự phục vụ việc hiểu, chứ không theo `git diff`.

## Nó hoạt động như thế nào

Workflow này có năm bước. Mỗi bước xây trên bước trước, dần dần chuyển từ "đây là gì?" sang "chúng ta có nên phát hành nó không?"

### 1. Định hướng

Workflow xác định thay đổi đó là gì, từ PR, commit, branch, file spec, hoặc trạng thái git hiện tại, rồi tạo một câu tóm tắt ý định và vài số liệu bề mặt: số file thay đổi, số module bị chạm tới, số dòng logic, số lần băng qua ranh giới, và các public interface mới.

Đây là khoảnh khắc "đúng là thứ tôi đang nghĩ tới chứ?". Trước khi đọc mã, người review xác nhận mình đang nhìn đúng thay đổi và cân chỉnh kỳ vọng về phạm vi.

### 2. Dẫn giải thay đổi (Walkthrough)

Thay đổi được tổ chức theo **mối quan tâm** như validation đầu vào hay API contract, thay vì theo file. Mỗi mối quan tâm có một giải thích ngắn về *vì sao* cách tiếp cận này được chọn, kèm theo các điểm dừng `path:line` có thể bấm để người review đi theo xuyên suốt code.

Đây là bước dùng phán đoán về thiết kế. Người review đánh giá xem hướng tiếp cận có đúng với hệ thống hay không, chứ chưa phải xem code có chính xác tuyệt đối hay không. Các mối quan tâm được sắp từ trên xuống: ý định cấp cao trước, phần triển khai hỗ trợ sau. Người review sẽ không gặp tham chiếu tới thứ mà họ chưa thấy.

### 3. Soi chi tiết

Sau khi người review đã hiểu thiết kế, workflow sẽ đưa ra 2 đến 5 điểm mà nếu sai thì hậu quả lan rộng nhất. Chúng được gắn nhãn theo loại rủi ro như `[auth]`, `[schema]`, `[billing]`, `[public API]`, `[security]` và các nhãn khác, đồng thời được sắp theo mức độ thiệt hại nếu sai.

Đây không phải là một cuộc săn bug. Tính đúng đắn được CI và test tự động lo phần lớn. Bước soi chi tiết nhằm kích hoạt ý thức về rủi ro: "đây là những chỗ mà nếu sai thì cái giá phải trả cao nhất". Nếu muốn đào sâu một khu vực cụ thể, bạn có thể nói "đào sâu vào [khu vực]" để chạy một lần review lại tập trung vào tính đúng đắn.

Nếu spec trước đó đã đi qua các vòng adversarial review, các phát hiện liên quan cũng được đưa ra ở đây. Không phải các bug đã được sửa, mà là những quyết định mà vòng review đó từng gắn cờ để người review hiện tại biết.

### 4. Kiểm thử

Workflow gợi ý 2 đến 5 cách quan sát thủ công để thấy thay đổi thực sự hoạt động. Không phải lệnh test tự động, mà là các quan sát tay giúp tăng niềm tin theo cách test suite không cho bạn được. Một tương tác UI để thử, một lệnh CLI để chạy, một request API để gửi, kèm kết quả kỳ vọng cho từng mục.

Nếu thay đổi không có hành vi nào nhìn thấy được từ phía người dùng, workflow sẽ nói thẳng như vậy. Không bịa thêm việc cho có.

### 5. Kết thúc

Người review đưa ra quyết định: duyệt, làm lại, hay tiếp tục thảo luận. Nếu đang duyệt PR, workflow có thể hỗ trợ với `gh pr review --approve`. Nếu cần làm lại, nó sẽ giúp chẩn đoán vấn đề nằm ở cách tiếp cận, spec, hay phần triển khai, đồng thời hỗ trợ soạn phản hồi có thể hành động được và gắn với vị trí code cụ thể.

## Đây là một cuộc hội thoại, không phải bản báo cáo

Workflow trình bày từng bước như một điểm khởi đầu, không phải lời kết luận cuối cùng. Giữa các bước, hoặc ngay giữa một bước, bạn có thể trao đổi với LLM, hỏi thêm, phản biện cách nó đóng khung vấn đề, hoặc kéo thêm skill khác để lấy một góc nhìn khác:

- **"run advanced elicitation on the error handling"** - ép LLM xem xét lại và tinh chỉnh phân tích cho một khu vực cụ thể
- **"party mode on whether this schema migration is safe"** - kéo nhiều góc nhìn agent vào một cuộc tranh luận tập trung
- **"run code review"** - tạo ra các phát hiện có cấu trúc với phân tích đối kháng và edge case

Workflow checkpoint không khóa bạn vào một đường đi tuyến tính. Nó cho bạn cấu trúc khi bạn cần, và tránh cản đường khi bạn muốn tự khám phá. Năm bước ở đây để bảo đảm bạn nhìn được toàn cảnh, còn việc đi sâu đến mức nào ở mỗi bước và gọi thêm công cụ nào hoàn toàn là do bạn quyết định.

## Lộ trình review (Review Trail)

Bước dẫn giải thay đổi hoạt động tốt nhất khi nó có một **thứ tự review gợi ý (Suggested Review Order)**, tức một danh sách các điểm dừng do tác giả spec viết ra để dẫn người review đi qua thay đổi. Nếu spec có phần này, workflow sẽ dùng trực tiếp.

Nếu không có review trail do tác giả tạo, workflow sẽ tự sinh một trail từ diff và bối cảnh codebase. Trail do máy sinh ra vẫn kém hơn trail do tác giả viết, nhưng vẫn tốt hơn rất nhiều so với việc đọc thay đổi theo thứ tự file.

## Khi nào nên dùng

Tình huống chính là bước bàn giao sau `bmad-quick-dev`: phần triển khai đã xong, file spec đang mở trong editor với review trail đã được nối thêm, và bạn cần quyết định có nên phát hành hay không. Lúc đó chỉ cần nói "checkpoint" là bắt đầu.

Nó cũng hoạt động độc lập:

- **Review một PR** - đặc biệt hữu ích khi PR có nhiều hơn vài file hoặc có thay đổi cắt ngang nhiều khu vực
- **Làm quen với một thay đổi (onboard to a change)** - khi bạn cần hiểu chuyện gì đã xảy ra trên một branch mà bạn không phải người viết
- **Review sprint (sprint review)** - workflow có thể nhặt các story được đánh dấu `review` trong file trạng thái sprint của bạn

Bạn có thể gọi nó bằng cách nói "checkpoint" hoặc "dẫn tôi đi qua thay đổi này". Nó chạy được trong mọi terminal, nhưng sẽ phát huy tốt nhất trong IDE như VS Code, Cursor hoặc công cụ tương tự, vì workflow tạo tham chiếu `path:line` ở mọi bước. Trong terminal tích hợp của IDE, các tham chiếu đó có thể bấm được, nên bạn có thể nhảy qua lại giữa các file khi đi theo review trail.

## Nó không phải là gì

Checkpoint Preview không thay thế review tự động. Nó không chạy linter, type checker, hay test suite. Nó không chấm mức độ nghiêm trọng hay đưa ra kết luận pass/fail. Nó là một bản hướng dẫn đọc để giúp con người áp dụng phán đoán của mình vào đúng những chỗ đáng chú ý nhất.
