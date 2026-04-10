---
title: "Giai đoạn phân tích: từ ý tưởng đến nền tảng"
description: Động não, nghiên cứu, product brief và PRFAQ là gì, và nên dùng từng công cụ khi nào
sidebar:
  order: 1
---

Giai đoạn phân tích (giai đoạn 1) giúp bạn suy nghĩ rõ ràng về sản phẩm trước khi cam kết bắt tay vào xây dựng. Mọi công cụ trong giai đoạn này đều là tùy chọn, nhưng nếu bỏ qua toàn bộ phần phân tích thì PRD của bạn sẽ được dựng trên giả định thay vì hiểu biết thực chất.

## Vì sao cần phân tích trước khi lập kế hoạch?

PRD trả lời câu hỏi "chúng ta nên xây gì và vì sao?". Nếu đầu vào của nó là những suy nghĩ mơ hồ, bạn sẽ nhận lại một PRD mơ hồ, và mọi tài liệu phía sau đều kế thừa chính sự mơ hồ đó. Kiến trúc dựng trên một PRD yếu sẽ đặt cược sai về mặt kỹ thuật. Các story sinh ra từ một kiến trúc yếu sẽ bỏ sót trường hợp biên. Chi phí sẽ dồn lên theo từng tầng.

Các công cụ phân tích tồn tại để làm PRD của bạn sắc bén hơn. Chúng tiếp cận vấn đề từ nhiều góc độ khác nhau: khám phá sáng tạo, thực tế thị trường, độ rõ ràng về khách hàng, tính khả thi. Nhờ vậy, đến khi bạn ngồi xuống làm việc với agent PM, bạn đã biết mình đang xây cái gì và cho ai.

## Các công cụ

### Động não

**Nó là gì.** Một phiên sáng tạo có điều phối, sử dụng các kỹ thuật phát ý tưởng đã được kiểm chứng. AI đóng vai trò như người huấn luyện, kéo ý tưởng ra từ bạn thông qua các bài tập có cấu trúc, chứ không nghĩ thay cho bạn.

**Vì sao nó có mặt ở đây.** Ý tưởng thô cần không gian để phát triển trước khi bị khóa cứng thành yêu cầu. Động não tạo ra khoảng không đó. Nó đặc biệt có giá trị khi bạn có một miền vấn đề nhưng chưa có lời giải rõ ràng, hoặc khi bạn muốn khám phá nhiều hướng trước khi cam kết.

**Khi nào nên dùng.** Bạn có một hình dung mơ hồ về thứ mình muốn xây nhưng chưa kết tinh được thành khái niệm rõ ràng. Hoặc bạn đã có ý tưởng ban đầu nhưng muốn kiểm chứng độ vững của nó bằng các phương án thay thế.

Xem [Brainstorming](./brainstorming.md) để hiểu sâu hơn về cách một phiên làm việc diễn ra.

### Nghiên cứu (thị trường, miền nghiệp vụ, kỹ thuật)

**Nó là gì.** Ba quy trình nghiên cứu tập trung vào các chiều khác nhau của ý tưởng. Nghiên cứu thị trường xem xét đối thủ, xu hướng và cảm nhận của người dùng. Nghiên cứu miền nghiệp vụ xây dựng hiểu biết về lĩnh vực và thuật ngữ. Nghiên cứu kỹ thuật đánh giá tính khả thi, các lựa chọn kiến trúc và hướng triển khai.

**Vì sao nó có mặt ở đây.** Xây dựng dựa trên giả định là con đường nhanh nhất để tạo ra thứ chẳng ai cần. Nghiên cứu đặt ý tưởng của bạn xuống mặt đất: đối thủ nào đã tồn tại, người dùng thực sự đang vật lộn với điều gì, điều gì khả thi về kỹ thuật, và bạn sẽ phải đối mặt với những ràng buộc đặc thù ngành nào.

**Khi nào nên dùng.** Bạn đang bước vào một miền mới, nghi ngờ có đối thủ nhưng chưa lập bản đồ được, hoặc ý tưởng của bạn phụ thuộc vào những năng lực kỹ thuật mà bạn chưa kiểm chứng. Có thể chạy một, hai, hoặc cả ba; mỗi quy trình đều đứng độc lập.

### Product Brief

**Nó là gì.** Một phiên discovery có hướng dẫn, tạo ra bản tóm tắt điều hành 1-2 trang cho concept sản phẩm của bạn. AI đóng vai trò Business Analyst cộng tác, giúp bạn diễn đạt tầm nhìn, đối tượng mục tiêu, giá trị cốt lõi và phạm vi.

**Vì sao nó có mặt ở đây.** Product brief là con đường nhẹ nhàng hơn để đi vào giai đoạn lập kế hoạch. Nó ghi lại tầm nhìn chiến lược của bạn theo định dạng có cấu trúc và đưa thẳng vào quá trình tạo PRD. Nó hoạt động tốt nhất khi bạn đã có niềm tin tương đối chắc vào ý tưởng của mình: bạn biết khách hàng là ai, vấn đề là gì, và đại khái muốn xây gì. Brief sẽ tổ chức lại và làm sắc nét lối suy nghĩ đó.

**Khi nào nên dùng.** Ý tưởng của bạn đã tương đối rõ và bạn muốn ghi lại nó một cách hiệu quả trước khi tạo PRD. Bạn tin vào hướng đi hiện tại và không cần bị thách thức giả định một cách quá quyết liệt.

### PRFAQ (Working Backwards)

**Nó là gì.** Phương pháp Working Backwards của Amazon được chuyển thành một thử thách tương tác. Bạn viết thông cáo báo chí công bố sản phẩm hoàn thiện trước khi tồn tại dù chỉ một dòng code, rồi trả lời những câu hỏi khó nhất mà khách hàng và stakeholder sẽ đặt ra. AI đóng vai trò product coach dai dẳng nhưng mang tính xây dựng.

**Vì sao nó có mặt ở đây.** PRFAQ là con đường nghiêm ngặt hơn để đi vào giai đoạn lập kế hoạch. Nó buộc bạn đạt đến sự rõ ràng theo hướng lấy khách hàng làm trung tâm bằng cách bắt bạn bảo vệ từng phát biểu. Nếu bạn không viết nổi một thông cáo báo chí đủ thuyết phục, sản phẩm đó chưa sẵn sàng. Nếu phần FAQ lộ ra những khoảng trống, đó chính là những khoảng trống mà bạn sẽ phát hiện muộn hơn rất nhiều, và với chi phí lớn hơn nhiều, trong lúc triển khai. Bài kiểm tra này bóc tách lối suy nghĩ yếu ngay từ sớm, khi chi phí sửa còn rẻ nhất.

**Khi nào nên dùng.** Bạn muốn kiểm tra độ vững của ý tưởng trước khi cam kết tài nguyên. Bạn chưa chắc người dùng có thực sự quan tâm hay không. Bạn muốn xác nhận rằng mình có thể diễn đạt một giá trị cốt lõi rõ ràng và có thể bảo vệ được. Hoặc đơn giản là bạn muốn dùng sự kỷ luật của Working Backwards để làm suy nghĩ của mình sắc bén hơn.

## Tôi nên dùng cái nào?

| Tình huống | Công cụ được khuyến nghị |
| --------- | ------------------------ |
| "Tôi có một ý tưởng mơ hồ, chưa biết bắt đầu từ đâu" | Brainstorming |
| "Tôi cần hiểu thị trường trước khi quyết định" | Research |
| "Tôi biết mình muốn xây gì rồi, chỉ cần ghi lại" | Product Brief |
| "Tôi muốn chắc rằng ý tưởng này thực sự đáng để xây" | PRFAQ |
| "Tôi muốn khám phá, rồi kiểm chứng, rồi ghi lại" | Brainstorming → Research → PRFAQ hoặc Brief |

Product Brief và PRFAQ đều tạo ra đầu vào cho PRD. Hãy chọn một trong hai tùy vào mức độ thách thức bạn muốn. Brief là discovery mang tính cộng tác. PRFAQ là một bài kiểm tra khắc nghiệt. Cả hai đều đưa bạn tới cùng một đích; PRFAQ chỉ kiểm tra xem concept của bạn có thật sự xứng đáng để đến đó hay không.

:::tip[Chưa chắc nên bắt đầu ở đâu?]
Hãy chạy `bmad-help` và mô tả tình huống của bạn. Nó sẽ gợi ý điểm bắt đầu phù hợp dựa trên những gì bạn đã làm và điều bạn đang muốn đạt được.
:::

## Sau giai đoạn phân tích thì chuyện gì xảy ra?

Đầu ra từ giai đoạn phân tích đi thẳng vào giai đoạn 2, lập kế hoạch. Quy trình tạo PRD chấp nhận product brief, tài liệu PRFAQ, kết quả nghiên cứu và báo cáo động não làm đầu vào. Nó sẽ tổng hợp bất cứ thứ gì bạn đã tạo thành các yêu cầu có cấu trúc. Bạn làm phân tích càng kỹ, PRD của bạn càng sắc.