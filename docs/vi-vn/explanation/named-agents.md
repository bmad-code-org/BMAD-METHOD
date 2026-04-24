---
title: "Agent có tên riêng (Named Agents)"
description: Vì sao các agent của BMad có tên, persona và bề mặt tùy chỉnh riêng, và điều đó mở khóa điều gì so với cách tiếp cận dựa trên menu hoặc prompt trống
sidebar:
  order: 1
---

Bạn nói: "Hey Mary, brainstorm với tôi nhé", và Mary được kích hoạt. Cô ấy chào bạn theo tên, bằng ngôn ngữ bạn đã cấu hình, với persona đặc trưng của riêng mình. Cô ấy nhắc rằng `bmad-help` luôn sẵn sàng. Rồi cô ấy bỏ qua menu và đi thẳng vào brainstorming vì ý định của bạn đã đủ rõ.

Trang này giải thích điều gì thực sự đang diễn ra và vì sao BMad được thiết kế theo cách đó.

## Chiếc ghế ba chân

Mô hình agent của BMad đứng trên ba primitive kết hợp với nhau:

| Thành phần nền (primitive) | Nó cung cấp gì | Nó nằm ở đâu |
|---|---|---|
| **Skill** | Năng lực, tức một việc rời rạc mà assistant có thể làm như brainstorming, viết PRD hay triển khai story | `.claude/skills/{skill-name}/SKILL.md` hoặc vị trí tương đương theo IDE |
| **Named agent** | Tính liên tục của persona, tức một danh tính dễ nhận ra bọc quanh một nhóm skill có cùng giọng điệu, nguyên tắc và dấu hiệu nhận biết | Các skill có thư mục bắt đầu bằng `bmad-agent-*` |
| **Customization** | Khả năng biến nó thành của riêng bạn: override để đổi hành vi của agent, thêm tích hợp MCP, thay template, chồng convention của tổ chức | `_bmad/custom/{skill-name}.toml` cho team và `.user.toml` cho cá nhân |

Chỉ cần bỏ đi một chân là trải nghiệm sẽ sụp:

- Skill mà không có agent sẽ thành danh sách khả năng mà người dùng phải tự nhớ tên hoặc mã
- Agent mà không có skill sẽ chỉ là persona không có gì để làm
- Không có customization thì mọi người đều nhận cùng một hành vi mặc định, và muốn thêm convention nội bộ là phải fork

## Named agents mang lại điều gì

BMad hiện có sáu named agent, mỗi agent gắn với một phase trong BMad Method:

| Agent | Phase | Module |
|---|---|---|
| 📊 **Mary**, Chuyên viên phân tích nghiệp vụ (Business Analyst) | Analysis | market research, brainstorming, product briefs, PRFAQs |
| 📚 **Paige**, Technical Writer | Analysis | project documentation, diagrams, doc validation |
| 📋 **John**, Quản lý sản phẩm (Product Manager) | Planning | PRD creation, epic/story breakdown, implementation readiness |
| 🎨 **Sally**, Nhà thiết kế UX (UX Designer) | Planning | UX design specifications |
| 🏗️ **Winston**, Kiến trúc sư hệ thống (System Architect) | Solutioning | technical architecture, alignment checks |
| 💻 **Amelia**, Kỹ sư cấp cao (Senior Engineer) | Implementation | story execution, quick-dev, code review, sprint planning |

Mỗi agent có một danh tính hardcode gồm tên, chức danh, domain, và một lớp có thể tùy chỉnh gồm vai trò, nguyên tắc, phong cách giao tiếp, icon và menu. Bạn có thể viết lại nguyên tắc của Mary hoặc thêm menu item cho cô ấy, nhưng bạn không thể đổi tên cô ấy. Đó là chủ ý thiết kế. Nhận diện thương hiệu của agent phải sống sót qua lớp tùy chỉnh để câu "hey Mary" luôn kích hoạt đúng analyst, bất kể team đã nắn hành vi của cô ấy theo cách nào.

## Luồng kích hoạt

Khi bạn gọi một named agent, tám bước sau sẽ chạy theo thứ tự:

1. **Resolve cấu hình agent**: merge `customize.toml` gốc với override của team và cá nhân qua một Python resolver dùng `tomllib`
2. **Chạy các bước tiền xử lý (prepend steps)**: mọi hành vi pre-flight mà team đã cấu hình
3. **Nhập persona**: danh tính hardcode cộng với vai trò, phong cách giao tiếp và nguyên tắc đã tùy chỉnh
4. **Nạp persistent facts**: quy tắc tổ chức, ghi chú compliance, hoặc cả file được nạp qua tiền tố `file:`
5. **Nạp config**: tên người dùng, ngôn ngữ giao tiếp, ngôn ngữ đầu ra, đường dẫn artifact
6. **Chào người dùng**: lời chào cá nhân hóa, đúng ngôn ngữ cấu hình và có emoji prefix của agent để bạn nhìn là biết ai đang nói
7. **Chạy các bước hậu xử lý (append steps)**: mọi bước thiết lập sau lời chào mà team đã cấu hình
8. **Dispatch hoặc hiện menu**: nếu tin nhắn mở đầu của bạn khớp một menu item thì agent đi thẳng vào đó, nếu không thì hiện menu và chờ input

Bước 8 là nơi ý định gặp năng lực. Câu "Hey Mary, brainstorm với tôi nhé" bỏ qua phần render menu vì `bmad-brainstorming` là một mapping quá rõ với mục `BP` trong menu của Mary. Nếu bạn nói mơ hồ, cô ấy chỉ hỏi lại một lần, ngắn gọn, chứ không biến xác nhận thành nghi thức. Nếu chẳng có mục nào phù hợp, cô ấy tiếp tục cuộc hội thoại như bình thường.

## Vì sao không chỉ dùng menu

Menu buộc người dùng phải chủ động học công cụ. Bạn phải nhớ brainstorming nằm dưới mã `BP` của analyst chứ không phải PM, và phải nhớ persona nào sở hữu nhóm khả năng nào. Toàn bộ gánh nặng nhận thức đó do công cụ đẩy sang cho người dùng.

Named agents đảo ngược điều đó. Bạn chỉ cần nói điều mình muốn, với đúng người mình nghĩ tới, bằng ngôn từ tự nhiên. Agent biết họ là ai và họ làm gì. Khi ý định của bạn đủ rõ, họ chỉ việc bắt đầu.

Menu vẫn còn đó như một phương án dự phòng, hiện ra khi bạn đang khám phá, và biến mất khi bạn không cần nó.

## Vì sao không chỉ dùng prompt trống

Prompt trống giả định rằng bạn biết "câu thần chú". "Giúp tôi brainstorm" có thể hiệu quả, nhưng "hãy ideate giúp tôi một ý tưởng SaaS" có thể cho kết quả khác, và đầu ra phụ thuộc khá nhiều vào cách bạn diễn đạt. Khi đó người dùng gần như phải kiêm luôn vai trò kỹ sư prompt (prompt engineer).

Named agents thêm cấu trúc mà không đóng mất sự tự do. Persona giữ ổn định, năng lực thì dễ khám phá, và `bmad-help` luôn chỉ cách bạn một lệnh. Bạn không phải đoán agent làm được gì, nhưng cũng không cần học thuộc một cuốn manual để dùng nó.

## Tùy chỉnh là công dân hạng nhất

Chính mô hình customization làm cho cách tiếp cận này mở rộng được ra ngoài phạm vi của một lập trình viên đơn lẻ.

Mỗi agent đi kèm một `customize.toml` với mặc định hợp lý. Team có thể commit override vào `_bmad/custom/bmad-agent-{role}.toml`. Mỗi cá nhân có thể chồng thêm sở thích riêng trong `.user.toml` bị gitignore. Resolver sẽ merge cả ba lớp tại thời điểm kích hoạt theo các quy tắc có tính dự đoán.

Đa số người dùng không cần tự tay viết các file đó. Skill `bmad-customize` sẽ dẫn họ qua việc chọn đúng mục tiêu, quyết định override ở mức agent hay workflow, viết file và xác minh merge. Nhờ vậy bề mặt tùy chỉnh vẫn tiếp cận được với bất cứ ai hiểu ý định của mình, chứ không chỉ người rành TOML.

Ví dụ cụ thể: một team commit một file yêu cầu Amelia luôn dùng Context7 MCP tool khi tra tài liệu thư viện, và fallback sang Linear nếu story không xuất hiện trong danh sách epic cục bộ. Từ đó mọi dev workflow mà Amelia dispatch như `dev-story`, `quick-dev`, `create-story`, `code-review` đều tự động thừa hưởng hành vi này mà không cần sửa source hay lặp lại cấu hình từng workflow.

Ngoài ra còn có một bề mặt tùy chỉnh thứ hai cho các mối quan tâm *xuyên suốt*: `_bmad/config.toml`, `_bmad/config.user.toml`, `_bmad/custom/config.toml` và `_bmad/custom/config.user.toml`. Đây là nơi **agent roster** sống, tức các descriptor gọn nhẹ mà những skill như `bmad-party-mode`, `bmad-retrospective` và `bmad-advanced-elicitation` dùng để biết ai có mặt và phải nhập vai họ thế nào. Bạn có thể rebrand một agent cho cả tổ chức bằng team override, hoặc thêm những giọng hư cấu như Kirk, Spock hay một persona chuyên gia domain qua `.user.toml`, tất cả mà không cần đụng vào thư mục skill. File per-skill quyết định Mary *hành xử* như thế nào khi cô ấy kích hoạt; cấu hình trung tâm quyết định các skill khác *nhìn thấy* cô ấy ra sao khi quan sát toàn bộ đội hình.

Để xem toàn bộ bề mặt tùy chỉnh và ví dụ thực tế:

- [Cách tùy chỉnh BMad](../how-to/customize-bmad.md): tài liệu tham chiếu cho những gì có thể tùy chỉnh và merge diễn ra thế nào
- [Cách mở rộng BMad cho tổ chức của bạn](../how-to/expand-bmad-for-your-org.md): năm recipe hoàn chỉnh trải từ quy tắc ở cấp agent, convention workflow, publish ra hệ thống ngoài, thay template đầu ra đến tùy chỉnh roster agent
- Skill `bmad-customize`: trợ lý soạn cấu hình (authoring helper) có hướng dẫn để biến ý định thành một file override đúng chỗ và đã được kiểm chứng

## Ý tưởng lớn hơn phía sau

Hầu hết các trợ lý AI (AI assistant) ngày nay hoặc là menu, hoặc là prompt, và cả hai đều chuyển phần gánh nặng nhận thức sang người dùng. Agent có tên riêng kết hợp với skill có thể tùy chỉnh cho phép bạn trò chuyện với một đồng đội đã hiểu công việc, đồng thời cho phép tổ chức của bạn nắn đồng đội đó theo nhu cầu mà không cần fork.

Lần tới khi bạn gõ "Hey Mary, brainstorm với tôi nhé" và cô ấy chỉ việc bắt tay vào làm, hãy để ý thứ đã *không* xảy ra. Không có slash command. Không có menu phải điều hướng. Không có lời nhắc gượng gạo về những gì cô ấy có thể làm. Chính sự vắng mặt đó mới là thiết kế.
