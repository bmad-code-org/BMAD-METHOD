---
title: "Quick Dev"
description: Giảm ma sát human-in-the-loop mà vẫn giữ các checkpoint bảo vệ chất lượng output
sidebar:
  order: 2
---

Đưa ý định vào, nhận thay đổi mã nguồn ra, với số lần cần con người nhảy vào giữa quy trình ít nhất có thể - nhưng không đánh đổi chất lượng.

Nó cho phép model tự vận hành lâu hơn giữa các checkpoint, rồi chỉ đưa con người quay lại khi tác vụ không thể tiếp tục an toàn nếu thiếu phán đoán của con người, hoặc khi đã đến lúc review kết quả cuối.

![Quick Dev workflow diagram](/diagrams/quick-dev-diagram.png)

## Vì sao nó tồn tại

Các lượt human-in-the-loop vừa cần thiết vừa tốn kém.

LLM hiện tại vẫn thất bại theo những cách dễ đoán: hiểu sai ý định, tự điền vào khoảng trống bằng những phán đoán tự tin, lệch sang công việc không liên quan, và tạo ra các bản review nhiễu. Đồng thời, việc cần con người nhảy vào liên tục làm giảm tốc độ phát triển. Sự chú ý của con người là nút thắt.

`bmad-quick-dev` cân bằng lại đánh đổi đó. Nó tin model có thể chạy tự chủ lâu hơn, nhưng chỉ sau khi workflow đã tạo được một ranh giới đủ mạnh để làm điều đó an toàn.

## Thiết kế cốt lõi

### 1. Nén ý định trước

Workflow bắt đầu bằng việc để con người và model nén yêu cầu thành một mục tiêu thống nhất. Đầu vào có thể bắt đầu như một ý định thô, nhưng trước khi workflow tự vận hành thì nó phải đủ nhỏ, đủ rõ ràng, và đủ ít mâu thuẫn để có thể thực thi.

Ý định có thể đến từ nhiều dạng: vài cụm từ, liên kết bug tracker, output từ plan mode, đoạn văn bản copy từ phiên chat, hoặc thậm chí một số story trong `epics.md` của chính BMAD. Ở trường hợp cuối, workflow không hiểu được ngữ nghĩa theo dõi story của BMAD, nhưng vẫn có thể lấy chính story đó và tiếp tục.

Workflow này không loại bỏ quyền kiểm soát của con người. Nó chuyển nó về một số thời điểm có giá trị cao:

- **Làm rõ ý định** - biến một yêu cầu lộn xộn thành một mục tiêu thống nhất, không mâu thuẫn ngầm
- **Phê duyệt spec** - xác nhận rằng cách hiểu đã đóng băng là đúng thứ cần xây
- **Review sản phẩm cuối** - checkpoint chính, nơi con người quyết định kết quả cuối có chấp nhận được hay không

### 2. Định tuyến theo con đường an toàn nhỏ nhất

Khi mục tiêu đã rõ, workflow sẽ quyết định đây có phải thay đổi one-shot thật sự hay cần đi theo đường đầy đủ hơn. Những thay đổi nhỏ, blast radius gần như bằng 0 có thể đi thẳng vào triển khai. Còn lại sẽ đi qua lập kế hoạch để model có được một ranh giới mạnh hơn trước khi tự chạy lâu hơn.

### 3. Chạy lâu hơn với ít giám sát hơn

Sau quyết định định tuyến đó, model có thể tự gánh thêm công việc. Trên con đường đầy đủ, spec đã được phê duyệt trở thành ranh giới mà model sẽ thực thi với ít giám sát hơn, và đó chính là mục tiêu của thiết kế này.

### 4. Chẩn đoán lỗi ở đúng tầng

Nếu triển khai sai vì ý định sai, vậy sửa code không phải cách fix đúng. Nếu code sai vì spec yếu, thì vá diff cũng không phải cách fix đúng. Workflow được thiết kế để chẩn đoán lỗi đã đi vào hệ thống từ tầng nào, quay lại đúng tầng đó, rồi sinh lại từ đấy.

Các phát hiện từ review được dùng để xác định vấn đề đến từ ý định, quá trình tạo spec, hay triển khai cục bộ. Chỉ những lỗi thật sự cục bộ mới được sửa tại chỗ.

### 5. Chỉ đưa con người quay lại khi cần

Bước interview ý định có human-in-the-loop, nhưng nó không giống một checkpoint lặp đi lặp lại. Workflow cố gắng giảm thiểu những checkpoint lặp lại đó. Sau bước định hình ý định ban đầu, con người chủ yếu quay lại khi workflow không thể tiếp tục an toàn nếu thiếu phán đoán, và ở cuối quy trình để review kết quả.

- **Xử lý khoảng trống của ý định** - quay lại khi review cho thấy workflow không thể suy ra an toàn điều được hàm ý

Mọi thứ còn lại đều là ứng viên cho việc thực thi tự chủ lâu hơn. Đánh đổi này là có chủ đích. Các pattern cũ tốn nhiều sự chú ý của con người cho việc giám sát liên tục. Quick Dev đặt nhiều niềm tin hơn vào model, nhưng để dành sự chú ý của con người cho những thời điểm mà lý trí con người có đòn bẩy lớn nhất.

## Vì sao hệ thống review quan trọng

Giai đoạn review không chỉ để tìm bug. Nó còn để định tuyến cách sửa mà không phá hỏng động lượng.

Workflow này hoạt động tốt nhất trên nền tảng có thể spawn subagent, hoặc ít nhất gọi được một LLM khác qua dòng lệnh và đợi kết quả. Nếu nền tảng của bạn không hỗ trợ sẵn, bạn có thể thêm skill để làm việc đó. Các subagent không mang context là một trụ cột trong thiết kế review.

Review agentic thường sai theo hai cách:

- Tạo quá nhiều phát hiện, buộc con người lọc quá nhiều nhiễu.
- Làm lệch thay đổi hiện tại bằng cách kéo vào các vấn đề không liên quan, biến mỗi lần chạy thành một dự án dọn dẹp ad-hoc.

Quick Dev xử lý cả hai bằng cách coi review là triage.

Có những phát hiện thuộc về thay đổi hiện tại. Có những phát hiện không thuộc về nó. Nếu một phát hiện chỉ là ngẫu nhiên xuất hiện, không gắn nhân quả với thay đổi đang làm, workflow có thể trì hoãn nó thay vì ép con người xử lý ngay. Điều đó giữ cho mỗi lần chạy tập trung và ngăn các ngả rẽ ngẫu nhiên ăn hết ngân sách chú ý.

Quá trình triage này đôi khi sẽ không hoàn hảo. Điều đó chấp nhận được. Thường tốt hơn khi đánh giá sai một số phát hiện còn hơn là nhận về hàng ngàn bình luận review giá trị thấp. Hệ thống tối ưu cho chất lượng tín hiệu, không phải độ phủ tuyệt đối.
