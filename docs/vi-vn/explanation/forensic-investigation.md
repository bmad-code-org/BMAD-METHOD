---
title: "Điều tra pháp chứng"
description: Cách bmad-investigate đối xử với mọi vấn đề như một hiện trường, chấm cấp bằng chứng và tạo hồ sơ vụ án có cấu trúc để engineer hành động
sidebar:
  order: 6
---

Bạn đưa cho `bmad-investigate` một crash log, stack trace, hoặc chỉ một câu "trước đây chạy được, giờ thì không". Skill sẽ tiếp quản kỷ luật của điều tra viên trong suốt lần chạy. Nó không lao vào sửa. Nó mở một hồ sơ vụ án.

Mọi phát hiện đều được chấm cấp. Mọi giả thuyết đều có trạng thái. Những hướng đi sai được giữ lại, không bị xóa. Đầu ra là một tài liệu mà một engineer khác có thể mở ra và hiểu ngay dù chưa có bối cảnh trước đó.

Trang này giải thích vì sao điều tra là một kỷ luật riêng, và skill đem lại điều gì mà workflow dev thông thường không có.

## Vấn đề của "cứ debug đi"

Debug thông thường trộn ba việc: nhìn bằng chứng, suy luận nguyên nhân và đổi code để thử lý thuyết. Khi ba việc này bị trộn lẫn, hai kiểu lỗi hay xuất hiện.

Thứ nhất là **khóa chặt vào câu chuyện ban đầu**. Câu chuyện hợp lý đầu tiên trở thành giả thuyết làm việc, rồi mọi quan sát bị uốn theo nó. Bug vẫn không sửa được cho tới khi ai đó bỏ cuộc và bắt đầu lại. Vài giờ sau.

Thứ hai là **mất trí nhớ bằng chứng**. Bạn đã truy vết một hướng, đã loại nó ra, nhưng không ghi lại vì sao. Hai ngày sau, với góc nhìn mới, bạn lại truy vết đúng hướng đó. Hoặc tệ hơn, một đồng nghiệp nhận bug và chạy lại đúng ngõ cụt bạn đã loại bỏ.

Thiết kế của skill là phản ứng trực tiếp với cả hai vấn đề này.

## Chấm cấp bằng chứng

Mọi phát hiện trong một cuộc điều tra thuộc một trong ba loại.

- **Đã xác nhận.** Được quan sát trực tiếp trong log, code hoặc dump; có trích dẫn cụ thể như `path:line`, timestamp log hoặc commit hash. Nếu ai hỏi "làm sao bạn biết?", bạn chỉ vào citation.
- **Được suy ra.** Theo logic từ bằng chứng đã xác nhận; chuỗi suy luận được trình bày. Nếu một bước trong chuỗi sai, kết luận suy ra sai, và bạn thấy chính xác bước nào.
- **Giả thuyết.** Hợp lý nhưng chưa được xác nhận. Nêu rõ bằng chứng nào sẽ xác nhận hoặc bác bỏ, và nói trước điều gì sẽ khép lại giả thuyết. Giả thuyết rõ ràng *không phải sự thật*.

Việc chấm cấp không phải để tỏ ra khiêm tốn. Nó giúp hồ sơ vụ án dễ đọc. Người đọc có thể quét phần Đã xác nhận để biết điều gì là thật, phần Được suy ra để biết điều gì kéo theo từ đó, và phần Giả thuyết để biết điều gì còn mở. Lẫn lộn ba loại này là lý do phổ biến nhất khiến điều tra xoáy vòng.

## Bám vào cứ điểm trước

Điều tra không bắt đầu từ một lý thuyết. Nó bắt đầu từ một mẩu bằng chứng đã xác nhận rồi mở rộng ra. Bằng chứng đó có thể là một thông báo lỗi cụ thể, một stack frame hoặc một dòng log có timestamp.

Điều này ngược với cách điều tra thường diễn ra. Ai đó có linh cảm, dựng lý thuyết, rồi săn bằng chứng ủng hộ. Linh cảm có thể đúng; *phương pháp* thì mong manh vì nó biến thiên kiến xác nhận thành mặc định.

Cứ điểm là một sự thật bạn có thể quay lại khi suy luận trở nên mơ hồ. Nếu một suy luận đưa bạn tới chỗ kỳ lạ, bạn có thể lần ngược về cứ điểm rồi thử một nhánh khác. Không có cứ điểm, bạn không biết phải hoàn tác bước nào.

Khi bằng chứng thưa thớt, skill nói rõ điều đó và chuyển sang khám phá theo giả thuyết: lập giả thuyết từ những gì đang có, xác định cách kiểm tra từng giả thuyết, rồi đưa ra danh sách thu thập dữ liệu theo ưu tiên. Thiếu bằng chứng tự nó cũng là một phát hiện.

## Kỷ luật giả thuyết

Giả thuyết không bao giờ bị xóa khỏi hồ sơ vụ án. Khi bằng chứng xác nhận hoặc bác bỏ một giả thuyết, trường **Status** đổi từ Open sang Confirmed hoặc Refuted, và phần **Resolution** giải thích bằng chứng nào đã kết luận nó.

Quy tắc này có chi phí thật: hồ sơ dài ra. Lợi ích cũng thật. Toàn bộ lịch sử suy luận trở thành một phần của đầu ra. Sáu tháng sau, khi một bug tương tự xuất hiện, người điều tra tiếp theo có thể đọc hồ sơ cũ và thấy hướng nào đã bị loại, vì sao. Không có lịch sử đó, mỗi điều tra viên mới lại chạy lại cùng các ngõ cụt.

Nó cũng rèn kỷ luật cho điều tra viên hiện tại. Nếu không thể xóa một giả thuyết sai, bạn phải bác bỏ nó bằng bằng chứng có citation. Lặng lẽ bỏ nó đi khi nó bất tiện không còn là lựa chọn.

## Thách thức tiền đề

Mô tả vấn đề của người dùng là một giả thuyết, không phải sự thật. "Cache bị hỏng" là điều người dùng *tin*. Trước khi skill xây cuộc điều tra quanh nó, các khẳng định kỹ thuật được xác minh độc lập. Nếu bằng chứng mâu thuẫn với tiền đề, báo cáo nói thẳng.

Đó là bản năng pháp chứng: lời khai của nhân chứng là dữ liệu, không phải chân lý. Đôi khi bug được báo là thật nhưng bị đặt nhãn sai. Đôi khi triệu chứng được mô tả lại là hệ quả downstream của nguyên nhân khác. Những cuộc điều tra coi tiền đề là chân lý sẽ chẩn đoán sai lỗi, và bug quay lại dưới hình thức hơi khác.

## Một bước đi được hiệu chỉnh

Skill là một quy trình duy nhất, không phải hai chế độ. Nó hiệu chỉnh liên tục mức độ cần săn lỗi cụ thể so với mức độ cần khám phá khu vực hệ thống.

Một case có triệu chứng như ticket, crash, thông báo lỗi hoặc "trước đây chạy được" sẽ nghiêng về theo dõi giả thuyết, dựng timeline và hướng sửa. Một case không có triệu chứng như hiểu một module trước khi đụng vào, đánh giá khả năng tái sử dụng hoặc xây mô hình tinh thần sẽ nghiêng về mapping input/output, lọc control flow và lập kế hoạch xác minh. Phần lớn case thật nằm giữa hai đầu, và hồ sơ phản ánh đúng sự cân bằng mà bằng chứng đòi hỏi.

Kỷ luật giữ nguyên dù case nằm ở đâu trên phổ đó: cứ điểm trước, chấm cấp bằng chứng, theo dõi giả thuyết, không xóa. Đầu ra luôn nằm ở `{implementation_artifacts}/investigations/{slug}-investigation.md`, với các phần không áp dụng cho case cụ thể được để trống hoặc bỏ qua.

Khi một bug sâu đòi hỏi hiểu subsystem rộng hơn, quy trình sẽ gộp các kỹ thuật mapping input/output, lọc control flow, lần ngược từ output và truy vết ranh giới giữa component ngay trong cùng hồ sơ. Mô hình khu vực hệ thống cũng nằm trong hồ sơ vụ án đó. Không có chuyển chế độ.

## Phương pháp nằm trong skill

Kỷ luật điều tra là thuộc tính của chính skill. Bất kỳ ai gọi `bmad-investigate` đều nhận lấy phương pháp và phong cách giao tiếp của nó trong lần chạy đó: chính xác lâm sàng, ngôn ngữ đặt bằng chứng trước, không nói lấp lửng, framing như hồ sơ vụ án. Khi skill kết thúc, người gọi quay lại giọng nói trước đó. Không đổi persona, chỉ đổi sắc thái theo nguyên tắc của skill.

Điều này quan trọng vì điều tra và triển khai thưởng cho hai bản năng khác nhau. Điều tra viên chậm và chính xác. Người triển khai nhanh và tự tin. Cùng một bộ não làm cả hai trong một phiên thường làm không trọn cả hai. Skill tạo ra tư thế điều tra ngay trong luồng làm việc, không cần đổi sang một danh tính riêng.

## Bạn nhận được gì

Một hồ sơ điều tra hoàn chỉnh:

- Tách phát hiện Đã xác nhận (có citation) khỏi Suy luận và Giả thuyết
- Giữ mọi giả thuyết từng được lập, cùng Status và Resolution cuối cùng
- Dựng lại timeline sự kiện từ nhiều nguồn bằng chứng
- Xác định lỗ hổng dữ liệu và điều chúng có thể giải quyết
- Đưa ra kết luận có thể hành động, dựa trên bằng chứng
- Bao gồm kế hoạch tái hiện khi đã xác định root cause
- Duy trì backlog điều tra cho các hướng còn cần khám phá

Đưa nó cho một engineer không có mặt trong phiên, họ hiểu chuyện gì đã xảy ra, điều gì đã biết và điều gì vẫn còn bất định. Đó là tiêu chuẩn.

## Ý tưởng lớn hơn

Phần lớn "AI debugging" hiện nay trộn bằng chứng, suy luận và thay đổi code vào một dòng văn bản nghe có vẻ hợp lý. Tín hiệu khó tìm, ngõ cụt lặp lại, và hồ sơ vụ án, nếu có, chỉ là chat log không ai muốn đọc.

`bmad-investigate` coi điều tra là một kỷ luật với đầu ra riêng. Bằng chứng có cấp. Giả thuyết có trạng thái. Hướng đi sai được ghi lại, không bị xóa. Hồ sơ vụ án sống lâu hơn phiên làm việc.

Khi bug tiếp theo xuất hiện và trông giống một bug bạn từng thấy, bạn có chỗ để bắt đầu thay vì một prompt trắng.
