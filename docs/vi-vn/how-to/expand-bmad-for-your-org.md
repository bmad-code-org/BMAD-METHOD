---
title: 'Cách mở rộng BMad cho tổ chức của bạn'
description: Năm mẫu tùy chỉnh giúp thay đổi BMad mà không cần fork, gồm quy tắc ở cấp agent, quy ước workflow, xuất bản ra hệ thống ngoài, thay template và điều chỉnh danh sách agent
sidebar:
  order: 9
---

Bề mặt tùy chỉnh của BMad cho phép một tổ chức định hình lại hành vi mà không phải sửa file đã cài hay fork skill. Hướng dẫn này trình bày năm công thức mẫu (recipe) bao phủ phần lớn nhu cầu ở môi trường doanh nghiệp.

:::note[Điều kiện tiên quyết]

- BMad đã được cài trong dự án của bạn (xem [Cách cài đặt BMad](./install-bmad.md))
- Đã quen với mô hình tùy chỉnh (xem [Cách tùy chỉnh BMad](./customize-bmad.md))
- Python 3.11+ có trên PATH để chạy resolver, chỉ dùng stdlib, không cần `pip install`
:::

:::tip[Cách áp dụng các công thức mẫu này]
Những **công thức mẫu theo từng skill** bên dưới, tức Recipe 1 đến Recipe 4, có thể được áp dụng bằng cách chạy skill `bmad-customize` rồi mô tả ý định. Skill này sẽ tự chọn đúng bề mặt, viết file override và xác minh kết quả merge. Riêng Recipe 5, tức override cấu hình trung tâm để chỉnh danh sách agent (agent roster), hiện chưa nằm trong phạm vi v1 của skill nên vẫn cần viết tay. Các recipe trong trang này là nguồn sự thật cho phần *nên override cái gì*; `bmad-customize` phụ trách phần *thực hiện ra sao* ở lớp agent/workflow.
:::

## Mô hình ba lớp để suy nghĩ

Trước khi chọn recipe, bạn cần biết override của mình sẽ rơi vào đâu:

| Lớp | Nơi override sống | Phạm vi |
|---|---|---|
| **Agent** như Amelia, Mary, John | section `[agent]` trong `_bmad/custom/bmad-agent-{role}.toml` | Đi cùng persona vào **mọi workflow mà agent đó dispatch** |
| **Workflow** như `product-brief`, `create-prd` | section `[workflow]` trong `_bmad/custom/{workflow-name}.toml` | Chỉ áp dụng cho lần chạy của workflow đó |
| **Cấu hình trung tâm** | `[agents.*]`, `[core]`, `[modules.*]` trong `_bmad/custom/config.toml` | Agent roster và các thiết lập lúc cài đặt cần ghim cho cả tổ chức |

Nguyên tắc ngón tay cái:

- Nếu quy tắc nên áp dụng ở mọi nơi một engineer làm dev work, hãy tùy chỉnh **dev agent**
- Nếu nó chỉ áp dụng khi ai đó viết product brief, hãy tùy chỉnh **workflow product-brief**
- Nếu nó thay đổi *ai đang ngồi trong phòng* như đổi thương hiệu agent, thêm custom voice hoặc ép chung một artifact path, hãy sửa **cấu hình trung tâm**

## Recipe 1: định hình một agent trên mọi workflow mà nó điều phối (dispatch)

**Trường hợp dùng (use case):** Chuẩn hóa việc dùng công cụ và tích hợp với hệ thống bên ngoài để mọi workflow được dispatch qua agent đó tự động thừa hưởng cùng hành vi. Đây là mẫu áp dụng (pattern) có sức ảnh hưởng lớn nhất.

**Ví dụ:** Amelia, tức dev agent, luôn dùng Context7 cho tài liệu thư viện và fallback sang Linear nếu không tìm thấy story trong danh sách epic.

```toml
# _bmad/custom/bmad-agent-dev.toml

[agent]

# Áp dụng ở mọi lần kích hoạt. Theo Amelia đi vào dev-story, quick-dev,
# create-story, code-review, qa-generate và mọi skill cô ấy dispatch.
persistent_facts = [
  "Với mọi truy vấn tài liệu thư viện như React, TypeScript, Zod, Prisma..., hãy gọi Context7 MCP tool (`mcp__context7__resolve_library_id` rồi `mcp__context7__get_library_docs`) trước khi dựa vào kiến thức trong dữ liệu huấn luyện (training data). Tài liệu cập nhật phải thắng API đã ghi nhớ.",
  "Khi không tìm thấy tham chiếu story trong {planning_artifacts}/epics-and-stories.md, hãy tìm trong Linear bằng `mcp__linear__search_issues` theo ID hoặc tiêu đề story trước khi yêu cầu người dùng làm rõ. Nếu Linear trả về kết quả khớp, coi đó là nguồn story có thẩm quyền.",
]
```

**Vì sao cách này hiệu quả:** Chỉ với hai câu, bạn đã thay đổi mọi dev workflow trong tổ chức mà không lặp config từng nơi và không sửa source. Mọi engineer mới kéo repo về đều tự động thừa hưởng convention đó.

**File của team và file cá nhân**

- `bmad-agent-dev.toml`: commit vào git, áp dụng cho cả team
- `bmad-agent-dev.user.toml`: bị gitignore, dùng cho sở thích cá nhân chồng thêm lên trên

## Recipe 2: ép convention của tổ chức bên trong một workflow cụ thể

**Trường hợp dùng (use case):** Định hình *nội dung đầu ra* của một workflow để nó đáp ứng yêu cầu compliance, audit hoặc hệ thống downstream.

**Ví dụ:** mọi product brief đều phải có các trường compliance, và agent biết convention xuất bản của tổ chức.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

persistent_facts = [
  "Mọi brief phải có trường 'Owner', 'Target Release' và 'Security Review Status'.",
  "Các brief không mang tính thương mại như công cụ nội bộ hoặc dự án nghiên cứu vẫn phải có phần user value, nhưng có thể bỏ phân biệt cạnh tranh thị trường.",
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",
]
```

**Điều gì xảy ra:** Những fact này được nạp trong quá trình activation của workflow. Khi agent soạn brief, nó đã biết các trường bắt buộc và tài liệu convention nội bộ. Mặc định có sẵn, ví dụ `file:{project-root}/**/project-context.md`, vẫn tiếp tục được nạp vì phần này chỉ append thêm.

## Recipe 3: xuất bản kết quả hoàn tất sang hệ thống ngoài

**Trường hợp dùng (use case):** Sau khi workflow tạo ra output chính, tự động đẩy nó sang hệ thống nguồn sự thật của doanh nghiệp như Confluence, Notion, SharePoint, rồi mở tiếp công việc follow-up trong Jira, Linear hoặc Asana.

**Ví dụ:** brief được tự động publish lên Confluence và tùy chọn mở Jira epic.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]

# Hook ở giai đoạn cuối. Scalar override sẽ thay hẳn mặc định rỗng.
on_complete = """
Publish và đề nghị bước tiếp theo:

1. Đọc đường dẫn file brief đã hoàn tất từ bước trước.
2. Gọi `mcp__atlassian__confluence_create_page` với:
   - space: "PRODUCT"
   - parent: "Product Briefs"
   - title: tiêu đề của brief
   - body: nội dung markdown của brief
   Lưu lại URL trang được trả về.
3. Thông báo cho người dùng: "Brief đã được publish lên Confluence: <url>".
4. Hỏi: "Bạn có muốn tôi mở Jira epic cho brief này ngay bây giờ không?"
5. Nếu có, gọi `mcp__atlassian__jira_create_issue` với:
   - type: "Epic"
   - project: "PROD"
   - summary: tiêu đề của brief
   - description: tóm tắt ngắn cùng liên kết ngược về trang Confluence.
   Sau đó báo lại epic key và URL.
6. Nếu không, thoát sạch.

Nếu một trong các MCP tool bị lỗi, hãy báo lỗi, in ra đường dẫn brief
và yêu cầu người dùng publish thủ công.
"""
```

**Vì sao dùng `on_complete` thay vì `activation_steps_append`:** `on_complete` chỉ chạy đúng một lần ở cuối, sau khi output chính của workflow đã được ghi ra. Đó là thời điểm đúng để publish artifact. `activation_steps_append` thì chạy mỗi lần kích hoạt, trước khi workflow làm công việc chính của nó.

**Điểm đánh đổi (trade-offs)**

- Publish lên Confluence là hành động không phá hủy, nên có thể luôn chạy khi hoàn tất
- Tạo Jira epic là hành động hiển thị cho cả team và kích hoạt các tín hiệu sprint planning, nên nên chặn bởi một bước xác nhận từ người dùng
- Nếu MCP tool lỗi, workflow phải có phương án dự phòng (fallback) rõ ràng thay vì âm thầm làm mất output

## Recipe 4: thay output template bằng template của riêng bạn

**Trường hợp dùng (use case):** Cấu trúc đầu ra mặc định không khớp định dạng mà tổ chức mong muốn, hoặc trong cùng một repo có nhiều tổ chức cần template riêng.

**Ví dụ:** trỏ workflow product-brief sang template do doanh nghiệp sở hữu.

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**Cách nó hoạt động:** `customize.toml` của workflow đi kèm `brief_template = "resources/brief-template.md"` dưới dạng đường dẫn tương đối tới skill root. Override của bạn lại trỏ tới một file trong `{project-root}`, nên agent sẽ đọc template của bạn trong bước tương ứng thay vì dùng template mặc định đi kèm.

**Mẹo viết template**

- Giữ template trong `{project-root}/docs/` hoặc `{project-root}/_bmad/custom/templates/` để nó được version cùng với file override
- Nên dùng cùng convention cấu trúc với template mặc định, ví dụ heading và frontmatter, để agent có điểm tựa ổn định
- Với repo đa tổ chức, hãy dùng `.user.toml` để từng nhóm nhỏ có thể trỏ sang template riêng mà không cần sửa file dùng chung của team

## Recipe 5: tùy chỉnh danh sách agent (agent roster)

**Trường hợp dùng (use case):** Thay đổi *ai đang ngồi trong phòng* cho những skill dựa trên roster như `bmad-party-mode`, `bmad-retrospective` và `bmad-advanced-elicitation`, mà không cần sửa source hay fork. Dưới đây là ba biến thể thường gặp.

### 5a. Rebrand một agent của BMad trên toàn tổ chức

Mỗi agent thật đều có một descriptor được installer tổng hợp từ `module.yaml`. Bạn có thể override descriptor này để đổi giọng điệu và framing ở mọi roster consumer:

```toml
# _bmad/custom/config.toml (commit vào git, áp dụng cho mọi developer)

[agents.bmad-agent-analyst]
description = "Mary, nhà phân tích nghiệp vụ giàu nhận thức pháp lý, pha trộn Porter với Minto nhưng sống cùng các audit trail của FDA. Cô ấy nói như một điều tra viên pháp chứng đang trình bày hồ sơ vụ án."
```

Party mode sẽ spawn Mary với description mới này. Bản thân activation của analyst vẫn chạy bình thường vì hành vi của Mary sống trong `customize.toml` theo từng skill. Override này chỉ thay đổi cách **các skill bên ngoài nhìn thấy và giới thiệu cô ấy**, chứ không thay đổi cách cô ấy hoạt động bên trong.

### 5b. Thêm một agent hư cấu hoặc agent tự định nghĩa

Chỉ cần một descriptor đầy đủ là đủ cho các tính năng dựa trên roster, không cần thư mục skill. Điều này rất phù hợp nếu bạn muốn tăng màu sắc tính cách cho party mode hay các buổi brainstorming:

```toml
# _bmad/custom/config.user.toml (cá nhân, gitignore)

[agents.spock]
team = "startrek"
name = "Commander Spock"
title = "Science Officer"
icon = "🖖"
description = "Logic là trên hết, cảm xúc bị nén lại. Mở đầu nhận xét bằng 'Fascinating.' Không bao giờ làm tròn lên. Là đối trọng với mọi lập luận chỉ dựa vào linh cảm."

[agents.mccoy]
team = "startrek"
name = "Dr. Leonard McCoy"
title = "Chief Medical Officer"
icon = "⚕️"
description = "Sự ấm áp của một bác sĩ miền quê, đi kèm với tính nóng nảy. 'Dammit Jim, I'm a doctor not a ___.' Là đối trọng đạo đức với Spock."
```

Khi bạn yêu cầu party-mode "mời nhóm Star Trek" hoặc "mời phi hành đoàn Enterprise", nó sẽ lọc theo `team = "startrek"` và spawn Spock cùng McCoy dựa trên các descriptor đó. Các agent thật của BMad như Mary hay Amelia vẫn có thể ngồi cùng bàn nếu bạn muốn.

### 5c. Ghim thiết lập cài đặt dùng chung cho cả team

Installer sẽ hỏi từng developer các giá trị như đường dẫn `planning_artifacts`. Khi tổ chức muốn có một câu trả lời thống nhất, hãy ghim nó trong cấu hình trung tâm. Khi đó, mọi câu trả lời cục bộ của từng người sẽ bị override lúc resolve:

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "{project-root}/shared/planning"
implementation_artifacts = "{project-root}/shared/implementation"

[core]
document_output_language = "English"
```

Những thiết lập cá nhân như `user_name`, `communication_language` hoặc `user_skill_level` nên vẫn nằm trong `_bmad/config.user.toml` riêng của từng developer. File chung của team không nên đụng vào các giá trị đó.

**Vì sao việc này nằm ở cấu hình trung tâm thay vì per-agent customize.toml:** File per-agent chỉ định hình cách *một* agent hành xử khi nó được kích hoạt. Cấu hình trung tâm lại định hình những gì các roster consumer *nhìn thấy khi quan sát cánh đồng chung*: agent nào tồn tại, tên gì, thuộc team nào và các thiết lập cài đặt dùng chung mà toàn repo đã thống nhất. Hai bề mặt khác nhau, hai công việc khác nhau.

## Củng cố các quy tắc toàn cục trong file hướng dẫn phiên của IDE

Tùy chỉnh của BMad chỉ được nạp khi một skill được kích hoạt. Trong khi đó, nhiều công cụ IDE còn nạp một file hướng dẫn toàn cục ở **đầu mọi phiên**, trước cả khi skill nào chạy, như `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/` hay `.github/copilot-instructions.md`. Với những quy tắc phải đúng cả khi bạn đang chat thường, hãy lặp lại phiên bản rút gọn của chúng trong file đó nữa.

**Khi nào nên "đánh đôi"**

- Quy tắc đó đủ quan trọng đến mức một cuộc chat thường, chưa kích hoạt BMad skill nào, cũng vẫn phải tuân theo
- Bạn muốn áp dụng kiểu "gia cố hai lớp" (belt-and-suspenders) vì hành vi mặc định từ dữ liệu huấn luyện (training data) có thể kéo model đi chệch
- Quy tắc đủ ngắn để lặp lại mà không làm file hướng dẫn đầu phiên trở nên phình to

**Ví dụ:** một dòng trong `CLAUDE.md` của repo để củng cố quy tắc ở Recipe 1.

```markdown
<!-- Mọi lần đọc tài liệu thư viện phải đi qua Context7 MCP tool
(`mcp__context7__resolve_library_id` rồi `mcp__context7__get_library_docs`)
trước khi dựa vào kiến thức từ dữ liệu huấn luyện (training data). -->
```

Chỉ một câu, nhưng được nạp ở mọi phiên. Nó kết hợp với cấu hình `bmad-agent-dev.toml` để quy tắc có hiệu lực cả trong workflow của Amelia lẫn trong các cuộc trò chuyện ad-hoc với assistant. Mỗi lớp giữ đúng phạm vi của mình:

| Lớp | Phạm vi | Dùng cho |
|---|---|---|
| File hướng dẫn phiên của IDE như `CLAUDE.md` hoặc `AGENTS.md` | Mọi phiên, trước khi bất kỳ skill nào chạy | Quy tắc ngắn, phổ quát, phải sống cả ngoài BMad |
| Tùy chỉnh agent của BMad | Mọi workflow mà agent đó dispatch | Hành vi riêng theo persona/agent |
| Tùy chỉnh workflow của BMad | Một lần chạy workflow | Dạng đầu ra, hook publish, template và logic riêng của workflow |
| Cấu hình trung tâm của BMad | Agent roster và thiết lập cài đặt dùng chung | Ai đang ngồi trong phòng và đường dẫn nào cả team dùng chung |

Hãy giữ file hướng dẫn của IDE **ngắn gọn**. Một tá dòng được chọn kỹ sẽ hiệu quả hơn một danh sách dài lê thê. Model phải đọc file đó ở mọi lượt, và càng nhiều nhiễu thì càng ít tín hiệu.

## Kết hợp các recipe

Cả năm recipe này có thể kết hợp song song. Một cấu hình doanh nghiệp thực tế cho `bmad-product-brief` hoàn toàn có thể đặt `persistent_facts` theo Recipe 2, `on_complete` theo Recipe 3 và `brief_template` theo Recipe 4 trong cùng một file. Quy tắc ở cấp agent theo Recipe 1 sẽ nằm trong file của agent tương ứng, còn cấu hình trung tâm theo Recipe 5 thì ghim roster và thiết lập chung. Tất cả cùng hoạt động đồng thời.

```toml
# _bmad/custom/bmad-product-brief.toml (cấp workflow)

[workflow]
persistent_facts = ["..."]
brief_template = "{project-root}/docs/enterprise/brief-template.md"
on_complete = """ ... """
```

```toml
# _bmad/custom/bmad-agent-analyst.toml (cấp agent, Mary sẽ dispatch product-brief)

[agent]
persistent_facts = ["Luôn thêm mục 'Regulatory Review' khi domain liên quan tới healthcare, finance hoặc dữ liệu trẻ em."]
```

Kết quả là Mary nạp quy tắc review pháp lý ngay ở lúc kích hoạt persona. Khi người dùng chọn menu item product-brief, workflow sẽ nạp các convention riêng của nó chồng lên, ghi ra template của doanh nghiệp và publish lên Confluence khi hoàn tất. Mỗi lớp đều đóng góp một phần và không lớp nào đòi hỏi sửa source của BMad.

## Khắc phục sự cố

**Override không có tác dụng?** Hãy kiểm tra file có nằm trong `_bmad/custom/` và dùng đúng tên thư mục skill không, ví dụ `bmad-agent-dev.toml`, chứ không phải `bmad-dev.toml`. Nếu cần, xem lại [Cách tùy chỉnh BMad](./customize-bmad.md).

**Không chắc tên MCP tool?** Hãy dùng đúng tên mà MCP server hiện tại expose trong phiên của bạn. Nếu chưa chắc, hãy yêu cầu Claude Code liệt kê các MCP tool đang có. Những tên hardcode trong `persistent_facts` hay `on_complete` sẽ không chạy nếu MCP server chưa được kết nối.

**Mẫu áp dụng (pattern) trong ví dụ không khớp setup của tôi?** Các recipe trên chỉ là ví dụ mẫu. Cơ chế bên dưới, gồm merge ba lớp, quy tắc cấu trúc và mô hình agent-span-workflow, vẫn hỗ trợ nhiều pattern khác. Hãy kết hợp chúng theo nhu cầu thực tế của bạn.
