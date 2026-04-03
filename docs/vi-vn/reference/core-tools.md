---
title: Core Tools
description: Tài liệu tham chiếu cho mọi task và workflow tích hợp sẵn có trong mọi bản cài BMad mà không cần module bổ sung.
sidebar:
  order: 2
---

Mọi bản cài BMad đều bao gồm một tập core skills có thể dùng cùng với bất cứ việc gì bạn đang làm — các task và workflow độc lập hoạt động xuyên suốt mọi dự án, mọi module và mọi phase. Chúng luôn có sẵn bất kể bạn cài những module tùy chọn nào.

:::tip[Lối đi nhanh]
Chạy bất kỳ core tool nào bằng cách gõ tên skill của nó, ví dụ `bmad-help`, trong IDE của bạn. Không cần mở phiên agent trước.
:::

## Tổng Quan

| Công cụ | Loại | Mục đích |
| --- | --- | --- |
| [`bmad-help`](#bmad-help) | Task | Nhận hướng dẫn có ngữ cảnh về việc nên làm gì tiếp theo |
| [`bmad-brainstorming`](#bmad-brainstorming) | Workflow | Tổ chức các phiên brainstorming có tương tác |
| [`bmad-party-mode`](#bmad-party-mode) | Workflow | Điều phối thảo luận nhóm nhiều agent |
| [`bmad-distillator`](#bmad-distillator) | Task | Nén tài liệu tối ưu cho LLM mà không mất thông tin |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Task | Đẩy đầu ra của LLM qua các vòng tinh luyện lặp |
| [`bmad-review-adversarial-general`](#bmad-review-adversarial-general) | Task | Review hoài nghi để tìm chỗ thiếu và chỗ sai |
| [`bmad-review-edge-case-hunter`](#bmad-review-edge-case-hunter) | Task | Phân tích toàn bộ nhánh rẽ để tìm edge case chưa được xử lý |
| [`bmad-editorial-review-prose`](#bmad-editorial-review-prose) | Task | Biên tập câu chữ nhằm tăng độ rõ ràng khi giao tiếp |
| [`bmad-editorial-review-structure`](#bmad-editorial-review-structure) | Task | Biên tập cấu trúc — cắt, gộp và tổ chức lại |
| [`bmad-shard-doc`](#bmad-shard-doc) | Task | Tách file markdown lớn thành các phần có tổ chức |
| [`bmad-index-docs`](#bmad-index-docs) | Task | Tạo hoặc cập nhật mục lục cho toàn bộ tài liệu trong một thư mục |

## bmad-help

**Người dẫn đường thông minh cho bước tiếp theo của bạn.** Công cụ này kiểm tra trạng thái dự án, phát hiện những gì đã hoàn thành và đề xuất bước bắt buộc hoặc tùy chọn tiếp theo.

**Dùng khi:**

- Bạn vừa hoàn tất một workflow và muốn biết tiếp theo là gì
- Bạn mới làm quen với BMad và cần định hướng
- Bạn đang mắc kẹt và muốn lời khuyên có ngữ cảnh
- Bạn vừa cài module mới và muốn xem có gì khả dụng

**Cách hoạt động:**

1. Quét dự án để tìm các artifact hiện có như PRD, architecture, stories, v.v.
2. Phát hiện các module đã cài và workflow khả dụng của chúng
3. Đề xuất bước tiếp theo theo thứ tự ưu tiên — bước bắt buộc trước, tùy chọn sau
4. Trình bày từng đề xuất cùng lệnh skill và mô tả ngắn

**Đầu vào:** Truy vấn ngôn ngữ tự nhiên tùy chọn, ví dụ `bmad-help I have a SaaS idea, where do I start?`

**Đầu ra:** Danh sách ưu tiên các bước tiếp theo được khuyến nghị kèm lệnh skill

## bmad-brainstorming

**Tạo ra nhiều ý tưởng đa dạng bằng các kỹ thuật sáng tạo có tương tác.** Đây là một phiên brainstorming có điều phối, nạp các phương pháp phát ý tưởng đã được kiểm chứng từ thư viện kỹ thuật và dẫn bạn đến 100+ ý tưởng trước khi bắt đầu sắp xếp.

**Dùng khi:**

- Bạn đang bắt đầu một dự án mới và cần khám phá không gian vấn đề
- Bạn đang bí ý tưởng và cần một quy trình sáng tạo có cấu trúc
- Bạn muốn dùng các framework tạo ý tưởng đã được kiểm chứng như SCAMPER, reverse brainstorming, v.v.

**Cách hoạt động:**

1. Thiết lập phiên brainstorming theo chủ đề của bạn
2. Nạp các kỹ thuật sáng tạo từ thư viện phương pháp
3. Dẫn bạn đi qua từng kỹ thuật để tạo ý tưởng
4. Áp dụng giao thức chống thiên lệch — cứ mỗi 10 ý tưởng lại đổi miền sáng tạo để tránh gom cụm
5. Tạo một tài liệu phiên làm việc chỉ thêm vào, trong đó mọi ý tưởng được tổ chức theo kỹ thuật

**Đầu vào:** Chủ đề brainstorming hoặc phát biểu vấn đề, cùng file context tùy chọn

**Đầu ra:** `brainstorming-session-{date}.md` chứa toàn bộ ý tưởng được tạo ra

:::note[Mục tiêu về số lượng]
Điểm bứt phá thường nằm ở vùng ý tưởng thứ 50-100. Workflow này khuyến khích bạn tạo 100+ ý tưởng trước khi sắp xếp.
:::

## bmad-party-mode

**Điều phối thảo luận nhóm nhiều agent.** Công cụ này nạp toàn bộ agent BMad đã cài và tạo một cuộc trao đổi tự nhiên, nơi mỗi agent đóng góp từ góc nhìn chuyên môn và cá tính riêng.

**Dùng khi:**

- Bạn cần nhiều góc nhìn chuyên gia cho một quyết định
- Bạn muốn các agent phản biện giả định của nhau
- Bạn đang khám phá một chủ đề phức tạp trải qua nhiều miền khác nhau

**Cách hoạt động:**

1. Nạp manifest agent chứa toàn bộ persona đã cài
2. Phân tích chủ đề của bạn để chọn ra 2-3 agent phù hợp nhất
3. Các agent lần lượt tham gia, có tương tác chéo và bất đồng tự nhiên
4. Luân phiên agent để đảm bảo góc nhìn đa dạng theo thời gian
5. Kết thúc bằng `goodbye`, `end party` hoặc `quit`

**Đầu vào:** Chủ đề hoặc câu hỏi thảo luận, cùng thông tin về các persona bạn muốn tham gia nếu có

**Đầu ra:** Cuộc hội thoại nhiều agent theo thời gian thực, vẫn giữ nguyên cá tính từng agent

## bmad-distillator

**Nén tài liệu nguồn tối ưu cho LLM mà không mất thông tin.** Công cụ này tạo ra các bản chưng cất dày đặc, tiết kiệm token nhưng vẫn giữ nguyên toàn bộ thông tin cho LLM dùng về sau. Có thể xác minh bằng tái dựng hai chiều.

**Dùng khi:**

- Một tài liệu quá lớn so với context window của LLM
- Bạn cần phiên bản tiết kiệm token của tài liệu nghiên cứu, đặc tả hoặc artifact lập kế hoạch
- Bạn muốn xác minh rằng không có thông tin nào bị mất trong quá trình nén
- Các agent sẽ cần tham chiếu và tìm thông tin trong đó thường xuyên

**Cách hoạt động:**

1. **Analyze** — Đọc tài liệu nguồn, nhận diện mật độ thông tin và cấu trúc
2. **Compress** — Chuyển văn xuôi thành dạng bullet dày đặc, bỏ trang trí không cần thiết
3. **Verify** — Kiểm tra tính đầy đủ để đảm bảo mọi thông tin gốc còn nguyên
4. **Validate** *(tùy chọn)* — Tái dựng hai chiều để chứng minh nén không mất mát

**Đầu vào:**

- `source_documents` *(bắt buộc)* — Đường dẫn file, thư mục hoặc mẫu glob
- `downstream_consumer` *(tùy chọn)* — Thành phần sẽ dùng đầu ra này, ví dụ "PRD creation"
- `token_budget` *(tùy chọn)* — Kích thước mục tiêu gần đúng
- `--validate` *(cờ)* — Chạy kiểm tra tái dựng hai chiều

**Đầu ra:** Một hoặc nhiều file markdown distillate kèm báo cáo tỷ lệ nén, ví dụ `3.2:1`

## bmad-advanced-elicitation

**Đẩy đầu ra của LLM qua các phương pháp tinh luyện lặp.** Công cụ này chọn từ thư viện kỹ thuật elicitation để cải thiện nội dung một cách có hệ thống qua nhiều lượt.

**Dùng khi:**

- Đầu ra của LLM còn nông hoặc quá chung chung
- Bạn muốn khám phá một chủ đề từ nhiều góc phân tích khác nhau
- Bạn đang tinh chỉnh một tài liệu quan trọng và cần chiều sâu hơn

**Cách hoạt động:**

1. Nạp registry phương pháp với hơn 5 kỹ thuật elicitation
2. Chọn ra 5 phương pháp phù hợp nhất dựa trên loại nội dung và độ phức tạp
3. Hiển thị menu tương tác — chọn một phương pháp, xáo lại, hoặc liệt kê tất cả
4. Áp dụng phương pháp đã chọn để nâng cấp nội dung
5. Tiếp tục đưa ra lựa chọn cho các vòng cải thiện tiếp theo cho đến khi bạn chọn "Proceed"

**Đầu vào:** Phần nội dung cần cải thiện

**Đầu ra:** Phiên bản nội dung đã được nâng cấp

## bmad-review-adversarial-general

**Kiểu review hoài nghi, mặc định cho rằng vấn đề luôn tồn tại và phải đi tìm chúng.** Công cụ này đứng ở góc nhìn của một reviewer khó tính, thiếu kiên nhẫn với sản phẩm cẩu thả. Nó tìm xem còn thiếu gì, không chỉ tìm cái gì sai.

**Dùng khi:**

- Bạn cần bảo đảm chất lượng trước khi chốt một deliverable
- Bạn muốn stress-test một spec, story hoặc tài liệu
- Bạn muốn tìm lỗ hổng bao phủ mà các review lạc quan thường bỏ sót

**Cách hoạt động:**

1. Đọc nội dung với góc nhìn hoài nghi và khắt khe
2. Xác định vấn đề về độ đầy đủ, độ đúng và chất lượng
3. Chủ động tìm phần còn thiếu chứ không chỉ phần hiện diện nhưng sai
4. Phải tìm được tối thiểu 10 vấn đề, nếu không sẽ phân tích sâu hơn

**Đầu vào:**

- `content` *(bắt buộc)* — Diff, spec, story, tài liệu hoặc bất kỳ artifact nào
- `also_consider` *(tùy chọn)* — Các vùng bổ sung cần để ý

**Đầu ra:** Danh sách markdown gồm 10+ phát hiện kèm mô tả

## bmad-review-edge-case-hunter

**Đi qua mọi nhánh rẽ và điều kiện biên, chỉ báo cáo những trường hợp chưa được xử lý.** Đây là phương pháp thuần túy dựa trên truy vết đường đi, suy ra các lớp edge case một cách cơ học. Nó trực giao với adversarial review — khác phương pháp, không khác thái độ.

**Dùng khi:**

- Bạn muốn bao phủ edge case toàn diện cho code hoặc logic
- Bạn cần một phương pháp bổ sung cho adversarial review
- Bạn đang review diff hoặc function để tìm điều kiện biên

**Cách hoạt động:**

1. Liệt kê toàn bộ nhánh rẽ trong nội dung
2. Suy ra cơ học các lớp edge case: thiếu else/default, input không được gác, off-by-one, tràn số học, ép kiểu ngầm, race condition, lỗ hổng timeout
3. Đối chiếu từng đường đi với các guard hiện có
4. Chỉ báo cáo các đường đi chưa được xử lý, âm thầm bỏ qua những trường hợp đã được che chắn

**Đầu vào:**

- `content` *(bắt buộc)* — Diff, toàn file hoặc function
- `also_consider` *(tùy chọn)* — Các vùng bổ sung cần lưu ý

**Đầu ra:** Mảng JSON các phát hiện, mỗi phát hiện có `location`, `trigger_condition`, `guard_snippet` và `potential_consequence`

:::note[Các kiểu review bổ trợ nhau]
Hãy chạy cả `bmad-review-adversarial-general` và `bmad-review-edge-case-hunter` để có độ bao phủ trực giao. Adversarial review bắt lỗi về chất lượng và độ đầy đủ; edge case hunter bắt các đường đi chưa được xử lý.
:::

## bmad-editorial-review-prose

**Biên tập câu chữ kiểu lâm sàng, tập trung vào độ rõ ràng khi truyền đạt.** Công cụ này review văn bản để tìm ra các vấn đề cản trở việc hiểu. Nó dùng Microsoft Writing Style Guide làm nền và vẫn giữ giọng văn của tác giả.

**Dùng khi:**

- Bạn đã có bản nháp tài liệu và muốn trau chuốt câu chữ
- Bạn cần đảm bảo độ rõ ràng cho một nhóm độc giả cụ thể
- Bạn muốn sửa lỗi giao tiếp mà không áp đặt gu phong cách cá nhân

**Cách hoạt động:**

1. Đọc nội dung, bỏ qua code block và frontmatter
2. Xác định các vấn đề cản trở hiểu nghĩa, không phải các sở thích phong cách
3. Khử trùng lặp những lỗi giống nhau xuất hiện nhiều nơi
4. Tạo bảng sửa lỗi ba cột

**Đầu vào:**

- `content` *(bắt buộc)* — Markdown, văn bản thường hoặc XML
- `style_guide` *(tùy chọn)* — Style guide riêng của dự án
- `reader_type` *(tùy chọn)* — `humans` mặc định cho độ rõ và nhịp đọc, hoặc `llm` cho độ chính xác và nhất quán

**Đầu ra:** Bảng markdown ba cột: Original Text | Revised Text | Changes

## bmad-editorial-review-structure

**Biên tập cấu trúc — đề xuất cắt, gộp, di chuyển và cô đọng.** Công cụ này review cách tổ chức tài liệu và đề xuất thay đổi mang tính nội dung để tăng độ rõ ràng và luồng đọc trước khi chỉnh câu chữ.

**Dùng khi:**

- Một tài liệu được ghép từ nhiều nguồn con và cần tính nhất quán về cấu trúc
- Bạn muốn rút gọn độ dài tài liệu nhưng vẫn giữ được khả năng hiểu
- Bạn cần phát hiện chỗ lệch phạm vi hoặc thông tin quan trọng bị chôn vùi

**Cách hoạt động:**

1. Phân tích tài liệu theo 5 mô hình cấu trúc: Tutorial, Reference, Explanation, Prompt, Strategic
2. Xác định phần dư thừa, lệch phạm vi và thông tin bị chìm
3. Tạo danh sách khuyến nghị theo mức ưu tiên: CUT, MERGE, MOVE, CONDENSE, QUESTION, PRESERVE
4. Ước tính số từ và phần trăm có thể giảm

**Đầu vào:**

- `content` *(bắt buộc)* — Tài liệu cần review
- `purpose` *(tùy chọn)* — Mục đích mong muốn, ví dụ "quickstart tutorial"
- `target_audience` *(tùy chọn)* — Ai sẽ đọc tài liệu này
- `reader_type` *(tùy chọn)* — `humans` hoặc `llm`
- `length_target` *(tùy chọn)* — Mục tiêu rút gọn, ví dụ "ngắn hơn 30%"

**Đầu ra:** Tóm tắt tài liệu, danh sách khuyến nghị ưu tiên và ước tính mức giảm

## bmad-shard-doc

**Tách file markdown lớn thành các file phần có tổ chức.** Công cụ này dùng các header cấp 2 làm điểm cắt để tạo ra một thư mục gồm các file phần tự chứa cùng một file chỉ mục.

**Dùng khi:**

- Một file markdown đã quá lớn để quản lý hiệu quả, thường trên 500 dòng
- Bạn muốn chia một tài liệu nguyên khối thành các phần dễ điều hướng
- Bạn cần các file riêng để chỉnh sửa song song hoặc quản lý context cho LLM

**Cách hoạt động:**

1. Xác nhận file nguồn tồn tại và là markdown
2. Tách tại các header cấp 2 `##` thành các file phần được đánh số
3. Tạo `index.md` chứa danh sách phần và liên kết
4. Hỏi bạn có muốn xóa, lưu trữ hay giữ file gốc không

**Đầu vào:** Đường dẫn file markdown nguồn, cùng thư mục đích tùy chọn

**Đầu ra:** Một thư mục gồm `index.md` và các file `01-{section}.md`, `02-{section}.md`, v.v.

## bmad-index-docs

**Tạo hoặc cập nhật mục lục cho toàn bộ tài liệu trong một thư mục.** Công cụ này quét thư mục, đọc từng file để hiểu mục đích của nó, rồi tạo `index.md` có tổ chức với liên kết và mô tả.

**Dùng khi:**

- Bạn cần một chỉ mục nhẹ để LLM quét nhanh các tài liệu hiện có
- Một thư mục tài liệu đã lớn và cần bảng mục lục có tổ chức
- Bạn muốn một cái nhìn tổng quan được tạo tự động và luôn theo kịp hiện trạng

**Cách hoạt động:**

1. Quét thư mục đích để lấy mọi file không ẩn
2. Đọc từng file để hiểu đúng mục đích thực tế của nó
3. Nhóm file theo loại, mục đích hoặc thư mục con
4. Tạo mô tả ngắn gọn, thường từ 3-10 từ cho mỗi file

**Đầu vào:** Đường dẫn thư mục đích

**Đầu ra:** `index.md` chứa danh sách file có tổ chức, liên kết tương đối và mô tả ngắn
