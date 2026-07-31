---
title: Công cụ cốt lõi
description: Tài liệu tham chiếu cho các skill tích hợp sẵn của module lõi.
sidebar:
  order: 3
---

Mọi bản cài BMad đều bao gồm **module lõi** — một tập nhỏ các skill hoạt động xuyên suốt mọi dự án, mọi module và mọi giai đoạn. Trang này bao quát 7 skill lõi đó: 4 công cụ nhân lõi cùng 3 **skill tư duy** (brainstorming, forge idea, party mode).

:::tip[Lối đi nhanh]
Chạy bất kỳ công cụ nào bằng cách gõ tên skill của nó, ví dụ `bmad-help`, trong IDE của bạn. Không cần mở phiên agent trước.
:::

## Tổng Quan

**Module lõi (luôn được cài):**

| Công cụ                                                   | Mục đích                                                                                                |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [`bmad-help`](#bmad-help)                                 | Nhận hướng dẫn có ngữ cảnh về việc nên làm gì tiếp theo                                                 |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Đẩy đầu ra của LLM qua các vòng tinh luyện lặp                                                          |
| [`bmad-review`](#bmad-review)                             | Review đa lăng kính — hoài nghi, ca biên, lỗ hổng kiểm chứng cho code; cấu trúc và câu chữ cho tài liệu |
| [`bmad-customize`](#bmad-customize)                       | Tạo và kiểm tra các tùy biến BMad                                                                       |

**Skill tư duy:**

| Công cụ                                     | Mục đích                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`bmad-brainstorming`](#bmad-brainstorming) | Tổ chức các phiên brainstorming có tương tác                                            |
| [`bmad-forge-idea`](#bmad-forge-idea)       | Thử lửa một ý tưởng cho đến khi nó cứng cáp, được chứng thực hoặc chết với chi phí thấp |
| [`bmad-party-mode`](#bmad-party-mode)       | Điều phối thảo luận nhóm nhiều agent                                                    |

:::note[Đã chuyển và đã gỡ]
`bmad-spec` giờ đi kèm module BMM như một workflow lập kế hoạch Giai đoạn 2 — xem [Bản đồ Workflow](./workflow-map.md). Các tiện ích `bmad-shard-doc` và `bmad-index-docs` đã bị gỡ bỏ. Các skill cũ `bmad-editorial-review`, `bmad-editorial-review-prose`, `bmad-editorial-review-structure`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter` và `bmad-review-verification-gap` đều đã được gộp vào `bmad-review`, với các lăng kính biên tập thay thế skill biên tập riêng lẻ; các ID cũ vẫn hoạt động qua cơ chế chuyển tiếp để giữ tương thích.
:::

## bmad-help

**Người dẫn đường thông minh cho bước tiếp theo của bạn.** Công cụ này kiểm tra trạng thái dự án, phát hiện những gì đã hoàn thành và đề xuất bước bắt buộc hoặc tùy chọn tiếp theo.

**Dùng khi:**

- Bạn vừa hoàn tất một quy trình và muốn biết tiếp theo là gì
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

## bmad-advanced-elicitation

**Đẩy LLM xem xét lại, tinh luyện và cải thiện đầu ra gần nhất của nó.** Đây là điểm dừng tinh luyện dùng chung của BMad: các skill khác gọi nó tại các điểm nghỉ tự nhiên, và bạn có thể gọi trực tiếp lên bất kỳ nội dung nào gần đây trong cuộc hội thoại.

**Dùng khi:**

- Đầu ra của LLM còn nông hoặc quá chung chung
- Bạn muốn khám phá một chủ đề từ nhiều góc phân tích khác nhau
- Bạn đang tinh chỉnh một tài liệu quan trọng và cần chiều sâu hơn
- Bạn muốn gọi đích danh một phương pháp — Socratic, first principles, pre-mortem, red team

**Cách hoạt động:**

1. Mặc định nhắm vào đầu ra gần nhất trong hội thoại, trừ khi bạn chỉ định nội dung khác
2. Đưa ra một menu ngắn các phương pháp elicitation phù hợp nhất với nội dung
3. Áp dụng các phương pháp đã chọn lên mục tiêu
4. Trả lại phiên bản đã cải thiện để luồng gọi tiếp tục từ chỗ tạm dừng

**Đầu vào:** Đầu ra gần nhất cần tinh luyện (mặc định), hoặc bất kỳ nội dung nào bạn chỉ định; tùy chọn kèm tên phương pháp

**Đầu ra:** Phiên bản nội dung đã được nâng cấp

## bmad-review

**Review đa lăng kính trên bất kỳ diff, tài liệu hay artifact nào.** Chạy các lăng kính review — mỗi lăng kính một phương pháp và lập trường riêng — và báo cáo mọi phát hiện theo một định dạng chuẩn duy nhất. Không phát hiện gì cũng là kết quả hợp lệ; nó không bao giờ độn thêm cho có vẻ kỹ lưỡng. Mỗi lăng kính khai báo phạm vi áp dụng: diff kéo theo các lăng kính code, tài liệu kéo theo các lăng kính biên tập.

**Các lăng kính đi kèm:**

| Lăng kính                                 | Áp dụng cho             | Phương pháp                                                                                  |
| ----------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| **Hoài nghi (Adversarial)**               | Mọi nội dung            | Review hoài nghi mặc định vấn đề luôn tồn tại — săn phần còn thiếu, không chỉ phần sai       |
| **Ca biên (Edge case)**                   | Mọi nội dung            | Đi qua mọi nhánh rẽ và điều kiện biên trong nội dung có định nghĩa hành vi                   |
| **Lỗ hổng kiểm chứng (Verification gap)** | Code                    | Tìm hành vi đã thay đổi có thể hồi quy mà không có kiểm chứng đáng tin cậy nào bắt được      |
| **Cấu trúc (Structure)**                  | Tài liệu                | Đề xuất cắt, gộp, di chuyển và cô đọng — hình hài tài liệu có phục vụ mục đích của nó không? |
| **Câu chữ (Prose)**                       | Tài liệu                | Biên tập các vấn đề diễn đạt gây cản trở việc hiểu                                           |

Hai lăng kính biên tập coi nội dung là bất khả xâm phạm: không bao giờ chất vấn ý tưởng của bạn, chỉ xét cách tổ chức và diễn đạt, và chỉ đề xuất chứ không tự sửa. Khi chọn cả hai, lăng kính câu chữ chạy trên các phát hiện của lăng kính cấu trúc.

Tập lăng kính không cố định: một override trong `customize.toml` có thể thêm lăng kính hoặc thay thế lăng kính có sẵn, và mỗi lần rà soát sẽ chạy những gì thực sự được phân giải.

**Dùng khi:**

- Bạn cần bảo đảm chất lượng trước khi chốt một deliverable
- Bạn muốn phủ kín các ca biên của code hoặc logic
- Bạn muốn biết một thay đổi đã được kiểm chứng đầy đủ chưa
- Bạn đã viết xong một tài liệu và muốn siết lại cho gọn và mượt
- Bạn muốn rút ngắn độ dài mà vẫn giữ được khả năng hiểu

**Cách hoạt động:**

1. Nạp nội dung, nhận diện loại — diff, file, hàm hoặc tài liệu — và thuộc về code hay tài liệu
2. Chọn lăng kính: những cái bạn nêu tên, hoặc mọi lăng kính đang bật có phạm vi áp dụng và điều kiện khớp với nội dung
3. Công bố kế hoạch — những lăng kính nào sẽ chạy, và lăng kính nào chạy trên phát hiện của lăng kính khác
4. Chạy các lăng kính độc lập — song song qua subagent khi nền tảng hỗ trợ — rồi tới các lăng kính phụ thuộc
5. Gom về một danh sách phát hiện duy nhất; trùng lặp giữa các lăng kính là tín hiệu, không phải lặp thừa

**Đầu vào:**

- `content` _(bắt buộc)_ — Diff, branch, thay đổi chưa commit, file, spec, story hoặc bất kỳ tài liệu nào
- `lenses` _(tùy chọn)_ — một hoặc nhiều mã/tên lăng kính; mặc định là review đầy đủ
- `also_consider` _(tùy chọn)_ — Các vùng bổ sung cần để ý
- `style_guide` / `reader_type` _(tùy chọn, cho lăng kính biên tập)_ — style guide của dự án, và `humans` (mặc định) hoặc `llm`

**Đầu ra:** Mảng phát hiện JSON và/hoặc báo cáo markdown nhóm theo lăng kính. Có thể thêm lăng kính tùy biến — và tinh chỉnh hoặc tắt các lăng kính đi kèm — qua `customize.toml` của skill

## bmad-customize

**Tạo và kiểm tra các tùy biến.** Giúp bạn thay đổi hành vi của một agent hoặc workflow BMad đã cài mà không phải tự viết TOML.

**Dùng khi:**

- Bạn muốn thay đổi hành vi của một agent hoặc workflow
- Bạn cần thêm các dữ kiện bền vững, hook kích hoạt hoặc mục menu tùy biến
- Bạn muốn phạm vi override đúng được chọn và kiểm tra tự động

**Cách hoạt động:**

1. Quét các skill BMad đã cài để tìm các bề mặt có thể tùy biến
2. Chọn phạm vi phù hợp cho thay đổi bạn yêu cầu
3. Ghi các file override dưới `_bmad/custom/`
4. Kiểm tra cấu hình sau khi hợp nhất

**Đầu vào:** Mô tả bằng ngôn ngữ tự nhiên về tùy biến bạn muốn

**Đầu ra:** Các file override TOML dưới `_bmad/custom/`. Xem hướng dẫn chi tiết tại [Cách tùy biến BMad](../how-to/customize-bmad.md)

## Các skill tư duy

Ba skill dưới đây hoàn thiện module lõi — những công cụ tư duy đa dụng mà bất kỳ giai đoạn hay module nào cũng có thể dựa vào.

### bmad-brainstorming

**Tạo ra nhiều ý tưởng đa dạng bằng các kỹ thuật sáng tạo có tương tác.** Đây là một phiên động não có điều phối, nạp các phương pháp phát ý tưởng đã được kiểm chứng từ thư viện kỹ thuật và dẫn bạn đến 100+ ý tưởng trước khi bắt đầu sắp xếp.

**Dùng khi:**

- Bạn đang bắt đầu một dự án mới và cần khám phá không gian vấn đề
- Bạn đang bí ý tưởng và cần một quy trình sáng tạo có cấu trúc
- Bạn muốn dùng các framework tạo ý tưởng đã được kiểm chứng như SCAMPER, reverse brainstorming, v.v.

**Cách hoạt động:**

1. Thiết lập phiên brainstorming theo chủ đề của bạn
2. Nạp các kỹ thuật sáng tạo từ thư viện phương pháp
3. Dẫn bạn đi qua từng kỹ thuật để tạo ý tưởng
4. Áp dụng giao thức chống thiên lệch — cứ mỗi 10 ý tưởng lại đổi miền sáng tạo để tránh gom cụm

**Đầu vào:** Chủ đề brainstorming hoặc phát biểu vấn đề, cùng file context tùy chọn

**Đầu ra:** một trang `brainstorm.html` độc lập làm kỷ vật của phiên, file `brainstorm-intent.md` tùy chọn cho các skill hạ nguồn, và bản ghi phiên `.memlog.md`

:::note[Mục tiêu về số lượng]
Điểm bứt phá thường nằm ở vùng ý tưởng thứ 50-100. Workflow này khuyến khích bạn tạo 100+ ý tưởng trước khi sắp xếp.
:::

### bmad-forge-idea

**Thử lửa một ý tưởng cho đến khi nó cứng cáp, được chứng thực hoặc chết với chi phí thấp.** Một người chất vấn phản biện dồn một ý tưởng còn dang dở đi từng câu hỏi một, đưa hai nhân vật vào mỗi nhánh rẽ, cho đến khi thứ sống sót là điều bạn có thể hành động với niềm tin chắc chắn.

**Dùng khi:**

- Bạn có một ý tưởng và muốn stress-test nó trước khi đầu tư
- Bạn muốn một đánh giá thẳng thắn về việc có nên bỏ nó không
- Bạn cần một người đồng hành tư duy biết phản bác thay vì gật đầu

**Cách hoạt động:**

1. Xác lập mục tiêu ngay từ đầu và lái việc chất vấn theo mục tiêu đó
2. Làm việc từng câu hỏi một theo thứ tự phụ thuộc, đặt sẵn một câu trả lời khuyến nghị để bạn phản bác
3. Đưa hai giọng nói vào mỗi nhánh — một từ đội hình đã cài của bạn, một do chủ đề gợi lên
4. Chất vấn các thuật ngữ mơ hồ và kiểm tra các luận điểm dựa trên tư liệu của dự án hiện có
5. Kết thúc ở trạng thái Hardened (cứng cáp), Killed (bị loại) hoặc Clearer (rõ hơn), kèm báo cáo độc lập bạn có thể giữ lại

**Đầu vào:** Ý tưởng thuộc bất kỳ lĩnh vực nào — một tính năng, mô hình kinh doanh, giả thuyết nghiên cứu, quyết định cuộc sống

**Đầu ra:** Bản chưng cất `forged-idea.md` khi ý tưởng cứng cáp (tùy chọn), cộng một `forge-report.html` làm kỷ vật cho mỗi lần chạy

### bmad-party-mode

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
