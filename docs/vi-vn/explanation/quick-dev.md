---
title: "Phát triển nhanh"
description: Giảm ma sát có người trong vòng lặp mà vẫn giữ các điểm kiểm tra bảo vệ chất lượng đầu ra
sidebar:
  order: 2
---

Đưa ý định vào, nhận thay đổi mã nguồn ra, với số lần cần con người nhảy vào giữa quy trình ít nhất có thể - nhưng không đánh đổi chất lượng.

Nó cho phép mô hình tự vận hành lâu hơn giữa các điểm kiểm tra, rồi chỉ đưa con người quay lại khi tác vụ không thể tiếp tục an toàn nếu thiếu phán đoán của con người, hoặc khi đã đến lúc rà soát kết quả cuối.

![Quick Dev workflow diagram](/diagrams/quick-dev-diagram.png)

## Vì sao nó tồn tại

Các lượt có người trong vòng lặp vừa cần thiết vừa tốn kém.

LLM hiện tại vẫn thất bại theo những cách dễ đoán: hiểu sai ý định, tự điền vào khoảng trống bằng những phán đoán tự tin, lệch sang công việc không liên quan, và tạo ra các bản review nhiễu. Đồng thời, việc cần con người nhảy vào liên tục làm giảm tốc độ phát triển. Sự chú ý của con người là nút thắt.

`bmad-quick-dev` cân bằng lại đánh đổi đó. Nó tin mô hình có thể chạy tự chủ lâu hơn, nhưng chỉ sau khi quy trình đã tạo được một ranh giới đủ mạnh để làm điều đó an toàn.

## Thiết kế cốt lõi

### 1. Nén ý định trước

Quy trình bắt đầu bằng việc để con người và mô hình nén yêu cầu thành một mục tiêu thống nhất. Đầu vào có thể bắt đầu như một ý định thô, nhưng trước khi quy trình tự vận hành thì nó phải đủ nhỏ, đủ rõ ràng, và đủ ít mâu thuẫn để có thể thực thi.

Ý định có thể đến từ nhiều dạng: vài cụm từ, liên kết trình theo dõi lỗi, đầu ra từ chế độ lập kế hoạch, đoạn văn bản sao chép từ phiên chat, hoặc thậm chí một số story trong `epics.md` của chính BMAD. Ở trường hợp cuối, quy trình không hiểu được ngữ nghĩa theo dõi story của BMAD, nhưng vẫn có thể lấy chính story đó và tiếp tục.

Quy trình này không loại bỏ quyền kiểm soát của con người. Nó chuyển nó về một số thời điểm có giá trị cao:

- **Làm rõ ý định** - biến một yêu cầu lộn xộn thành một mục tiêu thống nhất, không mâu thuẫn ngầm
- **Phê duyệt đặc tả** - xác nhận rằng cách hiểu đã được chốt là đúng thứ cần xây
- **Rà soát sản phẩm cuối** - điểm kiểm tra chính, nơi con người quyết định kết quả cuối có chấp nhận được hay không

### 2. Định tuyến theo con đường an toàn nhỏ nhất

Khi mục tiêu đã rõ, quy trình sẽ quyết định đây có phải thay đổi thực hiện một lần là xong hay cần đi theo đường đầy đủ hơn. Những thay đổi nhỏ, phạm vi ảnh hưởng gần như bằng 0 có thể đi thẳng vào triển khai. Còn lại sẽ đi qua lập kế hoạch để mô hình có được một ranh giới mạnh hơn trước khi tự chạy lâu hơn.

### 3. Chạy lâu hơn với ít giám sát hơn

Sau quyết định định tuyến đó, mô hình có thể tự gánh thêm công việc. Trên con đường đầy đủ, đặc tả đã được phê duyệt trở thành ranh giới mà mô hình sẽ thực thi với ít giám sát hơn, và đó chính là mục tiêu của thiết kế này.

### 4. Chẩn đoán lỗi ở đúng tầng

Nếu triển khai sai vì ý định sai, vậy sửa code không phải cách sửa đúng. Nếu code sai vì đặc tả yếu, thì vá diff cũng không phải cách sửa đúng. Quy trình được thiết kế để chẩn đoán lỗi đã đi vào hệ thống từ tầng nào, quay lại đúng tầng đó, rồi sinh lại từ đấy.

Các phát hiện từ bước rà soát được dùng để xác định vấn đề đến từ ý định, quá trình tạo đặc tả, hay triển khai cục bộ. Chỉ những lỗi thật sự cục bộ mới được sửa tại chỗ.

### 5. Chỉ đưa con người quay lại khi cần

Bước phỏng vấn ý định có người trong vòng lặp, nhưng nó không giống một điểm kiểm tra lặp đi lặp lại. Quy trình cố gắng giảm thiểu những điểm kiểm tra lặp lại đó. Sau bước định hình ý định ban đầu, con người chủ yếu quay lại khi quy trình không thể tiếp tục an toàn nếu thiếu phán đoán, và ở cuối quy trình để rà soát kết quả.

- **Xử lý khoảng trống của ý định** - quay lại khi review cho thấy workflow không thể suy ra an toàn điều được hàm ý

Mọi thứ còn lại đều là ứng viên cho việc thực thi tự chủ lâu hơn. Đánh đổi này là có chủ đích. Các mẫu cũ tốn nhiều sự chú ý của con người cho việc giám sát liên tục. Quick Dev đặt nhiều niềm tin hơn vào mô hình, nhưng để dành sự chú ý của con người cho những thời điểm mà lý trí con người có đòn bẩy lớn nhất.

## Vì sao hệ thống review quan trọng

Giai đoạn rà soát không chỉ để tìm lỗi. Nó còn để định tuyến cách sửa mà không phá hỏng động lượng.

Quy trình này hoạt động tốt nhất trên nền tảng có thể tạo subagent, hoặc ít nhất gọi được một LLM khác qua dòng lệnh và đợi kết quả. Nếu nền tảng của bạn không hỗ trợ sẵn, bạn có thể thêm skill để làm việc đó. Các subagent không mang ngữ cảnh là một trụ cột trong thiết kế rà soát.

Rà soát kiểu agent thường sai theo hai cách:

- Tạo quá nhiều phát hiện, buộc con người lọc quá nhiều nhiễu.
- Làm lệch thay đổi hiện tại bằng cách kéo vào các vấn đề không liên quan, biến mỗi lần chạy thành một dự án dọn dẹp chắp vá.

Quick Dev xử lý cả hai bằng cách coi rà soát là bước phân loại.

Có những phát hiện thuộc về thay đổi hiện tại. Có những phát hiện không thuộc về nó. Nếu một phát hiện chỉ là ngẫu nhiên xuất hiện, không gắn nhân quả với thay đổi đang làm, quy trình có thể trì hoãn nó thay vì ép con người xử lý ngay. Điều đó giữ cho mỗi lần chạy tập trung và ngăn các ngả rẽ ngẫu nhiên ăn hết ngân sách chú ý.

Quá trình triage này đôi khi sẽ không hoàn hảo. Điều đó chấp nhận được. Thường tốt hơn khi đánh giá sai một số phát hiện còn hơn là nhận về hàng ngàn bình luận review giá trị thấp. Hệ thống tối ưu cho chất lượng tín hiệu, không phải độ phủ tuyệt đối.
