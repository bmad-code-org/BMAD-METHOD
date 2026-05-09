---
title: 'Cách tùy chỉnh BMad'
description: Tùy chỉnh agent và workflow trong khi vẫn giữ khả năng tương thích khi cập nhật
sidebar:
  order: 8
---

Điều chỉnh persona của agent, chèn ngữ cảnh theo domain, thêm khả năng mới và cấu hình hành vi workflow mà không cần sửa các file đã cài. Các tùy chỉnh của bạn sẽ được giữ nguyên qua mọi lần cập nhật.

:::tip[Không muốn tự viết TOML? Hãy dùng `bmad-customize`]
Skill `bmad-customize` là trợ lý tạo cấu hình có hướng dẫn cho **bề mặt override agent/workflow theo từng skill** được mô tả trong tài liệu này. Nó quét những gì có thể tùy chỉnh trong bản cài đặt của bạn, giúp bạn chọn đúng bề mặt (agent hay workflow), ghi file override và xác minh merge đã áp dụng. Override ở mức cấu hình trung tâm (`_bmad/custom/config.toml`) chưa nằm trong phạm vi v1, nên phần đó vẫn cần viết tay theo mục Cấu hình trung tâm bên dưới. Hãy chạy skill này khi bạn muốn thay đổi theo từng skill; tài liệu này là phần tham chiếu cho *có thể tùy chỉnh gì* và merge hoạt động ra sao.
:::

## Khi nào nên dùng

- Bạn muốn thay đổi tính cách hoặc phong cách giao tiếp của agent
- Bạn cần cung cấp cho agent các "persistent facts" để luôn nhớ, ví dụ "tổ chức của chúng tôi chỉ dùng AWS"
- Bạn muốn thêm các bước khởi động có tính thủ tục mà agent phải chạy mỗi phiên
- Bạn muốn thêm menu item tùy chỉnh để gọi skill hoặc prompt riêng
- Team của bạn cần các tùy chỉnh dùng chung được commit vào git, đồng thời vẫn cho phép mỗi cá nhân chồng thêm sở thích riêng

:::note[Điều kiện tiên quyết]

- BMad đã được cài trong dự án của bạn (xem [Cách cài đặt BMad](./install-bmad.md))
- Python 3.11+ có trên PATH của bạn (để chạy resolver; dùng stdlib `tomllib`, không cần `pip install`, `uv` hay virtualenv)
- Một trình soạn thảo văn bản cho file TOML
:::

## Cách hoạt động

Mỗi skill có thể tùy chỉnh đều đi kèm một file `customize.toml` chứa cấu hình mặc định. File này định nghĩa toàn bộ bề mặt tùy chỉnh của skill, nên hãy đọc nó để biết có thể chỉnh gì. Bạn **không bao giờ** sửa trực tiếp file này. Thay vào đó, bạn tạo các file override dạng thưa, chỉ chứa những trường bạn muốn đổi.

### Mô hình override ba lớp

```text
Ưu tiên 1 (thắng): _bmad/custom/{skill-name}.user.toml  (cá nhân, bị gitignore)
Ưu tiên 2:         _bmad/custom/{skill-name}.toml       (team/tổ chức, được commit)
Ưu tiên 3 (gốc):   customize.toml của chính skill       (mặc định)
```

Thư mục `_bmad/custom/` ban đầu là rỗng. File chỉ xuất hiện khi ai đó thực sự bắt đầu tùy chỉnh.

### Quy tắc merge theo hình dạng, không theo tên trường

Resolver áp dụng bốn quy tắc cấu trúc. Tên trường không được hardcode riêng; hành vi hoàn toàn được quyết định bởi dạng dữ liệu:

| Dạng | Quy tắc |
|---|---|
| Scalar (string, int, bool, float) | Giá trị override sẽ thắng |
| Table | Deep merge, tức merge đệ quy theo các quy tắc này |
| Mảng các table mà mọi phần tử đều dùng cùng **một** trường định danh (`code` ở tất cả phần tử, hoặc `id` ở tất cả phần tử) | Merge theo khóa đó, phần tử trùng khóa sẽ **thay tại chỗ**, phần tử mới sẽ **append** |
| Mọi mảng khác (mảng scalar, table không có định danh, hoặc trộn `code` và `id`) | **Append**: phần tử gốc trước, rồi team, rồi user |

**Không có cơ chế xóa.** Override không thể xóa phần tử mặc định. Nếu bạn cần vô hiệu hóa một menu item mặc định, hãy override nó theo `code` bằng mô tả hoặc prompt no-op. Nếu cần tái cấu trúc mảng sâu hơn, bạn phải fork skill.

**Quy ước `code` / `id`.** BMad dùng `code` (định danh ngắn như `"BP"` hoặc `"R1"`) và `id` (định danh ổn định dài hơn) làm merge key cho mảng các table. Nếu bạn tự tạo một mảng table muốn có khả năng replace-by-key thay vì append-only, hãy chọn **một** quy ước duy nhất và dùng nhất quán cho toàn bộ mảng. Nếu trộn `code` ở phần tử này và `id` ở phần tử khác, resolver sẽ rơi về chế độ append vì nó không đoán merge theo khóa nào.

### Một số trường của agent là chỉ đọc

`agent.name` và `agent.title` vẫn nằm trong `customize.toml` như metadata nguồn gốc, nhưng `SKILL.md` của agent không đọc hai trường này ở runtime, vì danh tính của agent được hardcode. Bạn đặt `name = "Bob"` trong file override cũng sẽ không có tác dụng. Nếu bạn thật sự cần một agent với tên khác, hãy copy thư mục skill, đổi tên và phát hành nó như một custom skill.

## Các bước thực hiện

### 1. Tìm bề mặt tùy chỉnh của skill

Hãy mở file `customize.toml` trong thư mục skill đã được cài. Ví dụ với PM agent:

```text
.claude/skills/bmad-agent-pm/customize.toml
```

(Đường dẫn cụ thể thay đổi theo IDE: Cursor dùng `.cursor/skills/`, Cline dùng `.cline/skills/`, v.v.)

Đây là schema chính thức. Mọi trường bạn nhìn thấy trong file này đều có thể tùy chỉnh, ngoại trừ các trường danh tính chỉ đọc đã nêu ở trên.

### 2. Tạo file override của bạn

Tạo thư mục `_bmad/custom/` ở root dự án nếu nó chưa tồn tại. Sau đó tạo file đặt theo tên skill:

```text
_bmad/custom/
  bmad-agent-pm.toml        # override của team (commit vào git)
  bmad-agent-pm.user.toml   # sở thích cá nhân (gitignore)
```

:::caution[KHÔNG copy nguyên file `customize.toml`]
File override phải **thưa**. Chỉ đưa vào những trường bạn thực sự muốn đổi, không hơn.

Mọi trường bạn bỏ qua sẽ tự động được kế thừa từ lớp bên dưới. Nếu bạn copy toàn bộ `customize.toml` vào file override, những bản cập nhật sau này sẽ không chảy vào các giá trị mặc định mới nữa và bạn sẽ âm thầm bị lệch qua mỗi release.
:::

**Ví dụ: đổi icon và thêm một principle**

```toml
# _bmad/custom/bmad-agent-pm.toml
# Chỉ ghi những trường cần đổi. Phần còn lại vẫn kế thừa.

[agent]
icon = "🏥"
principles = [
  "Không phát hành bất cứ thứ gì không thể vượt qua kiểm toán của FDA.",
]
```

Ví dụ này append thêm principle mới vào danh sách mặc định và thay icon. Mọi trường khác vẫn giữ nguyên như bản gốc.

### 3. Tùy chỉnh đúng phần bạn cần

Mọi ví dụ bên dưới đều giả định schema agent phẳng của BMad. Các trường nằm trực tiếp trong `[agent]`, không có các sub-table như `metadata` hay `persona`.

**Scalar (`icon`, `role`, `identity`, `communication_style`).** Scalar override sẽ thắng, nên bạn chỉ cần đặt những trường đang muốn đổi:

```toml
# _bmad/custom/bmad-agent-pm.toml

[agent]
icon = "🏥"
role = "Dẫn dắt product discovery cho domain healthcare có ràng buộc pháp lý."
communication_style = "Chính xác, nhạy với compliance, đặt các câu hỏi mang hình dạng kiểm soát ngay từ sớm."
```

**Persistent facts, principles, activation hooks (các mảng append).** Bốn mảng dưới đây đều là append-only. Phần tử của team được thêm sau mặc định, phần tử user được thêm cuối cùng.

```toml
[agent]
# Các fact tĩnh mà agent luôn giữ trong đầu trong cả phiên: quy tắc tổ chức,
# hằng số domain, sở thích của người dùng. Khác với runtime memory sidecar.
#
# Mỗi mục có thể là một câu literal, hoặc tham chiếu `file:` để nạp nội dung
# file làm facts (hỗ trợ cả glob).
persistent_facts = [
  "Tổ chức của chúng tôi chỉ dùng AWS, không đề xuất GCP hay Azure.",
  "Mọi PRD đều phải có legal sign-off trước khi engineering kickoff.",
  "Người dùng mục tiêu là bác sĩ lâm sàng, không phải bệnh nhân, nên ví dụ phải bám theo đối tượng đó.",
  "file:{project-root}/docs/compliance/hipaa-overview.md",
  "file:{project-root}/_bmad/custom/company-glossary.md",
]

# Thêm vào hệ giá trị của agent
principles = [
  "Không phát hành bất cứ thứ gì không thể vượt qua kiểm toán của FDA.",
  "Giá trị người dùng là trước hết, compliance là luôn luôn.",
]

# Chạy TRƯỚC activation tiêu chuẩn (persona, persistent_facts, config, greet).
# Dùng cho pre-flight load, compliance checks, hoặc thứ gì cần có sẵn trong
# context trước khi agent tự giới thiệu.
activation_steps_prepend = [
  "Quét {project-root}/docs/compliance/ và nạp mọi tài liệu liên quan HIPAA vào context.",
]

# Chạy SAU khi greet, TRƯỚC menu. Dùng cho thiết lập nặng về context mà bạn
# muốn chạy sau khi người dùng đã được chào.
activation_steps_append = [
  "Đọc {project-root}/_bmad/custom/company-glossary.md nếu file tồn tại.",
]
```

**Hai hook này có vai trò khác nhau.** `prepend` chạy trước lời chào để agent có thể nạp ngữ cảnh cần thiết ngay cả khi cá nhân hóa lời chào. `append` chạy sau lời chào để người dùng không phải nhìn màn hình trống trong lúc agent quét một lượng lớn context.

**Tùy chỉnh menu (merge theo `code`).** Menu là một mảng table. Mỗi item có trường `code`, nên resolver merge theo mã này: item có `code` trùng sẽ thay tại chỗ, item mới sẽ được append.

Với TOML array-of-tables, mỗi item dùng cú pháp `[[agent.menu]]`:

```toml
# Thay item CE hiện có bằng một custom skill
[[agent.menu]]
code = "CE"
description = "Tạo Epic theo framework delivery của tổ chức"
skill = "custom-create-epics"

# Thêm item mới (RC chưa tồn tại trong mặc định)
[[agent.menu]]
code = "RC"
description = "Chạy compliance pre-check"
prompt = """
Đọc {project-root}/_bmad/custom/compliance-checklist.md
và quét toàn bộ tài liệu trong {planning_artifacts} theo checklist đó.
Báo cáo mọi khoảng trống và trích dẫn điều khoản quy định tương ứng.
"""
```

Mỗi menu item chỉ có đúng một trong hai trường `skill` hoặc `prompt`. Những item không xuất hiện trong file override của bạn sẽ giữ nguyên mặc định.

**Tham chiếu file.** Khi một trường văn bản cần trỏ tới file (trong `persistent_facts`, `activation_steps_prepend`, `activation_steps_append`, hoặc `prompt` của menu item), hãy dùng đường dẫn đầy đủ dựa trên `{project-root}`. Dù file nằm cạnh override trong `_bmad/custom/`, bạn vẫn nên viết rõ là `{project-root}/_bmad/custom/info.md`. Agent sẽ resolve `{project-root}` ở runtime.

### 4. Cá nhân và team

**File của team** (`bmad-agent-pm.toml`): commit vào git, áp dụng cho cả tổ chức. Dùng cho compliance rules, company persona, năng lực tùy chỉnh dùng chung.

**File cá nhân** (`bmad-agent-pm.user.toml`): tự động bị gitignore. Dùng cho điều chỉnh giọng điệu, sở thích workflow cá nhân và các fact riêng mà agent cần lưu ý cho riêng bạn.

```toml
# _bmad/custom/bmad-agent-pm.user.toml

[agent]
persistent_facts = [
  "Khi trình bày phương án, luôn kèm ước lượng độ phức tạp ở mức thô (low/medium/high).",
]
```

## Cách quá trình resolve diễn ra

Khi agent được kích hoạt, `SKILL.md` của nó sẽ gọi một shared Python script để merge ba lớp nói trên và trả về block kết quả ở dạng JSON. Script này dùng `tomllib` của Python stdlib, nên `python3` thuần là đủ:

```bash
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill {skill-root} \
  --key agent
```

**Yêu cầu**: Python 3.11+ vì các phiên bản cũ hơn không có `tomllib`. Không cần `pip install`, không cần `uv`, không cần virtualenv. Bạn có thể kiểm tra bằng `python3 --version`. Trên một số nền tảng, `python3` mặc định vẫn là 3.10 hoặc thấp hơn, nên có thể bạn sẽ phải cài 3.11+ riêng.

`--skill` trỏ vào thư mục skill đã cài, nơi có file `customize.toml`. Tên skill được lấy từ basename của thư mục, sau đó script sẽ tự tìm `_bmad/custom/{skill-name}.toml` và `{skill-name}.user.toml`.

Một số lệnh hữu ích:

```bash
# Resolve toàn bộ block agent
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /duong-dan/tuyet-doi/toi/bmad-agent-pm \
  --key agent

# Resolve một trường cụ thể
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /duong-dan/tuyet-doi/toi/bmad-agent-pm \
  --key agent.icon

# Dump toàn bộ
python3 {project-root}/_bmad/scripts/resolve_customization.py \
  --skill /duong-dan/tuyet-doi/toi/bmad-agent-pm
```

Đầu ra luôn là JSON. Nếu script này không khả dụng trên một nền tảng nào đó, `SKILL.md` sẽ hướng dẫn agent đọc trực tiếp ba file TOML và áp dụng cùng các quy tắc merge.

## Tùy chỉnh workflow

Workflow, tức các skill điều phối tiến trình nhiều bước như `bmad-product-brief`, dùng cùng cơ chế override như agent. Khác biệt là bề mặt tùy chỉnh của chúng nằm dưới `[workflow]` thay vì `[agent]`:

```toml
# _bmad/custom/bmad-product-brief.toml

[workflow]
# Giống agent: prepend/append chạy trước và sau activation mặc định của
# workflow. Override sẽ append vào mặc định.
activation_steps_prepend = [
  "Nạp {project-root}/docs/product/north-star-principles.md làm context.",
]

activation_steps_append = []

# Cũng dùng semantics literal-hoặc-file: như phía agent. Những fact này được
# nạp làm context nền tảng trong suốt lần chạy workflow.
persistent_facts = [
  "Mọi brief đều phải có một mục explicit về regulatory risk.",
  "file:{project-root}/docs/compliance/product-brief-checklist.md",
]

# Scalar: chạy đúng một lần khi workflow hoàn tất output chính. Override thắng.
on_complete = "Tóm tắt brief trong ba gạch đầu dòng rồi hỏi người dùng có muốn gửi email qua skill gws-gmail-send không."
```

Cùng một quy ước trường có thể đi xuyên qua ranh giới agent/workflow: `activation_steps_prepend`, `activation_steps_append`, `persistent_facts` với tham chiếu `file:`, và các table kiểu menu `[[...]]` dùng `code` hoặc `id` làm khóa merge. Resolver áp dụng đúng bốn quy tắc cấu trúc đã nêu bất kể top-level key là gì. Tham chiếu từ `SKILL.md` cũng theo namespace tương ứng: `{workflow.activation_steps_prepend}`, `{workflow.persistent_facts}`, `{workflow.on_complete}`. Mọi trường bổ sung mà một workflow tự expose, ví dụ output path, toggle, review setting hay stage flag, cũng sẽ đi theo cùng cơ chế merge dựa trên shape. Muốn biết chính xác workflow đó cho chỉnh gì, hãy đọc `customize.toml` của nó.

### Thứ tự activation

Workflow có thể tùy chỉnh sẽ chạy activation theo thứ tự cố định để bạn biết hook của mình được kích hoạt khi nào:

1. Resolve block `[workflow]` bằng merge base -> team -> user
2. Chạy `activation_steps_prepend` theo đúng thứ tự
3. Nạp `persistent_facts` làm ngữ cảnh nền tảng cho cả lần chạy
4. Nạp config (`_bmad/bmm/config.yaml`) và resolve các biến chuẩn như tên dự án, ngôn ngữ, đường dẫn, ngày tháng
5. Chào người dùng
6. Chạy `activation_steps_append` theo đúng thứ tự

Sau bước 6, phần thân chính của workflow mới bắt đầu. Hãy dùng `activation_steps_prepend` khi bạn cần load context trước cả lúc cá nhân hóa lời chào; dùng `activation_steps_append` khi phần thiết lập khá nặng và bạn muốn người dùng thấy lời chào trước.

### Phạm vi của đợt triển khai đầu tiên này

Khả năng tùy chỉnh đang được mở rộng dần. Những trường đã mô tả ở trên, gồm `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`, là **bề mặt nền tảng** mà mọi workflow có thể tùy chỉnh đều sẽ hỗ trợ, và chúng sẽ ổn định qua các phiên bản. Ngày hôm nay, chỉ với những trường này bạn đã có thể kiểm soát những điểm lớn: thêm bước trước/sau, ghim context nền tảng, kích hoạt hành động tiếp theo sau khi workflow hoàn tất.

Theo thời gian, từng workflow sẽ expose thêm **các điểm tùy chỉnh chuyên biệt hơn** gắn với chính công việc của workflow đó, ví dụ toggle ở từng bước, stage flag, đường dẫn template đầu ra hoặc review gate. Khi những trường đó xuất hiện, chúng sẽ được chồng thêm lên bề mặt nền tảng chứ không thay thế nó, nên những tùy chỉnh bạn viết hôm nay vẫn tiếp tục dùng được.

Nếu bạn đang cần một "núm tinh chỉnh" chi tiết hơn nhưng workflow chưa expose, hãy tạm dùng `activation_steps_*` và `persistent_facts` để điều hướng hành vi, hoặc mở issue mô tả chính xác điểm tùy chỉnh bạn muốn. Chính những nhu cầu đó sẽ quyết định trường nào được bổ sung tiếp theo.

## Cấu hình trung tâm

`customize.toml` theo từng skill bao phủ **hành vi sâu** như hook, menu, `persistent_facts`, override persona cho một agent hay workflow đơn lẻ. Một bề mặt khác sẽ bao phủ **trạng thái cắt ngang** như các câu trả lời lúc cài đặt và roster agent mà những skill bên ngoài như `bmad-party-mode`, `bmad-retrospective` và `bmad-advanced-elicitation` sử dụng. Bề mặt đó nằm trong bốn file TOML ở root dự án:

```text
_bmad/config.toml               (do installer quản lý) team scope:   câu trả lời lúc cài đặt + agent roster
_bmad/config.user.toml          (do installer quản lý) user scope:   user_name, language, skill level
_bmad/custom/config.toml        (do con người viết)    team overrides (commit vào git)
_bmad/custom/config.user.toml   (do con người viết)    personal overrides (gitignore)
```

### Merge bốn lớp

```text
Ưu tiên 1 (thắng): _bmad/custom/config.user.toml
Ưu tiên 2:         _bmad/custom/config.toml
Ưu tiên 3:         _bmad/config.user.toml
Ưu tiên 4 (gốc):   _bmad/config.toml
```

Các quy tắc cấu trúc hoàn toàn giống phần per-skill customize: scalar override, table deep-merge, mảng dùng `code` hoặc `id` sẽ merge theo khóa, các mảng khác thì append.

### Cái gì nằm ở đâu

Installer sẽ phân chia câu trả lời theo `scope:` khai báo trên từng prompt trong `module.yaml`:

- Các section `[core]` và `[modules.<code>]`: chứa câu trả lời khi cài. `scope = team` sẽ được ghi vào `_bmad/config.toml`; `scope = user` sẽ nằm trong `_bmad/config.user.toml`
- Section `[agents.<code>]`: "bản chất" của agent gồm code, name, title, icon, description, team, được chưng cất từ khối `agents:` trong `module.yaml` của từng module. Phần này luôn ở scope team

### Quy tắc chỉnh sửa

- `_bmad/config.toml` và `_bmad/config.user.toml` sẽ **được tạo lại sau mỗi lần cài đặt** từ những câu trả lời mà installer thu thập. Hãy coi chúng là output chỉ đọc; mọi chỉnh sửa trực tiếp sẽ bị ghi đè ở lần cài tiếp theo. Nếu muốn thay đổi bền vững một giá trị cài đặt, hãy chạy lại installer hoặc chồng giá trị đó bằng `_bmad/custom/config.toml`
- `_bmad/custom/config.toml` và `_bmad/custom/config.user.toml` sẽ **không bao giờ** bị installer động vào. Đây mới là bề mặt đúng để thêm custom agent, override descriptor của agent, ép các thiết lập dùng chung cho team và ghim mọi giá trị bạn muốn giữ nguyên bất kể câu trả lời lúc cài là gì

### Ví dụ: đổi thương hiệu cho một agent

```toml
# _bmad/custom/config.toml (commit vào git, áp dụng cho mọi developer)

[agents.bmad-agent-pm]
description = "PM trong domain healthcare, nhạy với compliance, luôn đặt câu hỏi theo hướng FDA ngay từ đầu."
icon = "🏥"
```

Resolver sẽ merge đè lên `[agents.bmad-agent-pm]` do installer sinh ra. `bmad-party-mode` và mọi roster consumer khác sẽ tự động thấy description mới này.

### Ví dụ: thêm một agent hư cấu

```toml
# _bmad/custom/config.user.toml (cá nhân, gitignore)

[agents.kirk]
team = "startrek"
name = "Captain James T. Kirk"
title = "Starship Captain"
icon = "🖖"
description = "Một chỉ huy táo bạo, thích bẻ luật. Nói chuyện có các quãng ngắt đầy kịch tính. Suy nghĩ thành tiếng về gánh nặng của quyền chỉ huy."
```

Không cần tạo thư mục skill. Chỉ riêng "essence" này cũng đủ để party-mode spawn Kirk như một giọng nói trong cuộc bàn tròn. Bạn có thể lọc theo trường `team` để chỉ mời nhóm Enterprise.

### Ví dụ: override thiết lập cài đặt của module

```toml
# _bmad/custom/config.toml

[modules.bmm]
planning_artifacts = "/shared/org-planning-artifacts"
```

Giá trị override này sẽ thắng mọi câu trả lời mà từng developer đã nhập khi cài trên máy của họ. Rất hữu ích khi bạn muốn ghim convention của cả team.

### Khi nào dùng bề mặt nào

| Nhu cầu | Bề mặt nên dùng |
|---|---|
| Thêm lời nhắc gọi MCP tool vào mọi dev workflow | Theo từng skill: `_bmad/custom/bmad-agent-dev.toml` trong `persistent_facts` |
| Thêm menu item cho một agent | Theo từng skill: `_bmad/custom/bmad-agent-{role}.toml` với `[[agent.menu]]` |
| Đổi template đầu ra của một workflow | Theo từng skill: `_bmad/custom/{workflow}.toml` bằng scalar override |
| Đổi descriptor công khai của một agent | **Cấu hình trung tâm**: `_bmad/custom/config.toml` ở `[agents.<code>]` |
| Thêm custom agent hoặc agent hư cấu vào roster | **Cấu hình trung tâm**: `_bmad/custom/config*.toml` với entry mới `[agents.<code>]` |
| Ghim thiết lập cài đặt dùng chung của team | **Cấu hình trung tâm**: `_bmad/custom/config.toml` trong `[modules.<code>]` hoặc `[core]` |

Trong cùng một dự án, bạn hoàn toàn có thể dùng đồng thời cả hai bề mặt này.

## Ví dụ thực chiến

Để xem các recipe thiên về doanh nghiệp như định hình một agent trên mọi workflow mà nó dispatch, ép workflow tuân thủ convention nội bộ, publish output lên Confluence và Jira, tùy chỉnh agent roster, hoặc thay template đầu ra bằng template riêng của tổ chức, hãy xem [Cách mở rộng BMad cho tổ chức của bạn](./expand-bmad-for-your-org.md).

## Khắc phục sự cố

**Tùy chỉnh không xuất hiện?**

- Kiểm tra file của bạn có nằm đúng trong `_bmad/custom/` và dùng đúng tên skill không
- Kiểm tra cú pháp TOML: string phải có ngoặc kép, table header dùng `[section]`, array-of-tables dùng `[[section]]`, và mọi khóa scalar hay array của một table phải xuất hiện *trước* bất kỳ `[[subtables]]` nào của table đó trong file
- Với agent, phần tùy chỉnh phải nằm dưới `[agent]`, và các trường bên dưới header đó sẽ thuộc `agent` cho tới khi bạn mở table header khác
- Hãy nhớ rằng `agent.name` và `agent.title` là chỉ đọc, override vào đó sẽ không có tác dụng

**Tùy chỉnh bị hỏng sau khi update?**

- Bạn có copy nguyên file `customize.toml` vào file override không? **Đừng làm vậy.** File override chỉ nên chứa phần chênh lệch. Nếu copy nguyên file, bạn sẽ khóa cứng mặc định cũ và dần lệch khỏi các bản phát hành mới.

**Muốn biết có thể tùy chỉnh gì?**

- Chạy skill `bmad-customize`. Nó sẽ liệt kê mọi skill có thể tùy chỉnh trong dự án, cho biết skill nào đã có override, rồi dẫn bạn qua quá trình thêm hoặc sửa một override
- Hoặc đọc trực tiếp `customize.toml` của skill. Mọi trường ở đó đều có thể tùy chỉnh, trừ `name` và `title`

**Muốn reset?**

- Xóa file override của bạn trong `_bmad/custom/`, skill sẽ tự động rơi về cấu hình mặc định tích hợp sẵn
