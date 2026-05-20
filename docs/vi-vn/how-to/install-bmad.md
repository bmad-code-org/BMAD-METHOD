---
title: 'Cách cài đặt BMad'
description: Cài đặt, cập nhật và ghim phiên bản BMad cho phát triển local, team và CI
sidebar:
  order: 1
---

Dùng `npx bmad-method install` để thiết lập BMad trong dự án của bạn. Một lệnh xử lý cả cài đặt lần đầu, nâng cấp, đổi channel và chạy bằng script cho CI. Trang này bao quát toàn bộ các trường hợp đó.

## Khi nào nên dùng

- Bắt đầu một dự án mới với BMad
- Thêm hoặc gỡ module trên một bản cài hiện có
- Chuyển một module sang main-HEAD hoặc ghim vào một bản phát hành cụ thể
- Script hóa cài đặt cho pipeline CI, Dockerfile hoặc triển khai doanh nghiệp

:::note[Điều kiện tiên quyết]

- **Node.js** 20.12+ (trình cài đặt yêu cầu phiên bản này)
- **Git** (để clone các module bên ngoài)
- **Một công cụ AI** như Claude Code hoặc Cursor (chạy `npx bmad-method install --list-tools` để xem mọi công cụ được hỗ trợ)

:::

## Cài lần đầu (đường nhanh)

```bash
npx bmad-method install
```

Luồng tương tác sẽ hỏi bạn năm thứ:

1. Thư mục cài đặt (mặc định là thư mục làm việc hiện tại)
2. Module cần cài (checkbox cho core, bmm, bmb, cis, gds, tea)
3. **"Ready to install (all stable)?"** — chọn Yes để nhận tag phát hành mới nhất cho mọi module bên ngoài
4. Công cụ AI/IDE cần tích hợp (claude-code, cursor và các công cụ khác)
5. Cấu hình theo từng module (tên, ngôn ngữ, thư mục output)

Chấp nhận mặc định là bạn sẽ có bản stable mới nhất của mọi module, đã cấu hình cho công cụ bạn chọn.

:::tip[Chỉ muốn bản prerelease mới nhất?]

```bash
npx bmad-method@next install
```

Lệnh này chạy trình cài prerelease, đi kèm snapshot mới hơn của core và bmm. Đổi lại là biến động nhiều hơn, nhưng ít độ trễ hơn giữa phát triển và phát hành.
:::

## Chọn một phiên bản cụ thể

Có hai trục độc lập quyết định thứ gì được ghi xuống đĩa.

### Trục 1: channel của module bên ngoài

Mọi module bên ngoài như bmb, cis, gds, tea và các module cộng đồng đều được cài trên một trong ba channel:

| Channel | Nội dung được cài | Ai nên chọn |
| ------------------ | ---------------------------------------------------------------------------- | --------------------------------------- |
| `stable` (mặc định) | Tag semver đã phát hành cao nhất. Các prerelease như `v2.0.0-alpha.1` bị loại trừ. | Phần lớn người dùng |
| `next` | HEAD của nhánh main tại thời điểm cài | Contributor, người dùng sớm |
| `pinned` | Một tag cụ thể do bạn chỉ định | Cài đặt doanh nghiệp, CI cần tái lập |

Channel được chọn theo từng module. Bạn có thể để bmb chạy `next` trong khi cis vẫn ở `stable`; các cờ bên dưới cho phép trộn tự do.

### Trục 2: phiên bản binary của trình cài đặt

Gói npm `bmad-method` có hai dist-tag:

| Lệnh | Bạn nhận được gì |
| ------------------------------------- | ----------------------------------------------------------------- |
| `npx bmad-method install` (`@latest`) | Bản stable mới nhất của trình cài |
| `npx bmad-method@next install` | Bản prerelease mới nhất của trình cài, tự động publish ở mỗi lần push lên main |

**Binary của trình cài quyết định phiên bản core và bmm.** Hai module này được đóng gói sẵn bên trong package trình cài thay vì clone từ repo riêng.

### Vì sao core và bmm chưa có channel riêng

Chúng gắn liền với binary trình cài bạn chạy:

- `npx bmad-method install` → core và bmm stable mới nhất
- `npx bmad-method@next install` → core và bmm prerelease
- `node /path/to/local-checkout/tools/installer/bmad-cli.js install` → đúng nội dung trong checkout local của bạn

`--pin bmm=v6.3.0` và `--next=bmm` không có hiệu lực với module bundled, và trình cài sẽ cảnh báo khi bạn thử. Một bản phát hành trong tương lai sẽ tách bmm khỏi package trình cài; khi đó bmm sẽ có bộ chọn channel đúng nghĩa giống bmb hiện nay.

## Cập nhật bản cài hiện có

Chạy `npx bmad-method install` trong thư mục đã có `_bmad/` sẽ hiển thị một menu:

| Lựa chọn | Tác dụng |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quick Update** | Chạy lại cài đặt với cấu hình hiện có. Làm mới file, áp dụng patch và nâng cấp minor stable, từ chối nâng cấp major. Nhanh và không tương tác. |
| **Modify Install** | Luồng tương tác đầy đủ. Thêm hoặc gỡ module, cấu hình lại thiết lập, tùy chọn xem và đổi channel cho module hiện có. |

### Prompt nâng cấp

Khi Modify phát hiện tag stable mới hơn cho một module đang ở `stable`, nó phân loại diff và hỏi theo bảng sau:

| Kiểu nâng cấp | Ví dụ | Mặc định |
| ------------ | --------------- | ------- |
| Patch | v1.7.0 → v1.7.1 | Y |
| Minor | v1.7.0 → v1.8.0 | Y |
| Major | v1.7.0 → v2.0.0 | **N** |

Major mặc định là N vì breaking change thường bị cảm nhận như "bất ổn" khi người dùng không chờ đợi nó. Prompt có kèm URL release notes trên GitHub để bạn đọc trước khi chấp nhận.

Khi dùng `--yes`, nâng cấp patch và minor được áp dụng tự động. Major vẫn bị giữ nguyên; truyền `--pin <code>=<new-tag>` để chấp nhận không tương tác.

### Đổi channel của một module

**Tương tác:** chọn Modify → trả lời **Yes** cho "Review channel assignments?" → mỗi module bên ngoài sẽ có lựa chọn Keep, Switch to stable, Switch to next hoặc Pin to a tag.

**Qua cờ:** các recipe ở phần tiếp theo bao phủ những trường hợp thường gặp.

## Headless CI installs

### Bảng cờ

| Cờ | Mục đích |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `--yes`, `-y` | Bỏ qua mọi prompt; nhận giá trị từ cờ và mặc định |
| `--directory <path>` | Cài vào thư mục này (mặc định là thư mục làm việc hiện tại) |
| `--modules <a,b,c>` | Tập module chính xác. Core được tự thêm. Đây không phải delta; hãy liệt kê mọi module bạn muốn giữ. |
| `--tools <a,b>` | Chọn IDE/công cụ. Bắt buộc với bản cài mới dùng `--yes`. Chạy `--list-tools` để xem ID hợp lệ. |
| `--list-tools` | In mọi ID công cụ/IDE được hỗ trợ (kèm thư mục đích) rồi thoát. |
| `--action <type>` | `install`, `update` hoặc `quick-update`. Mặc định dựa trên trạng thái cài đặt hiện có. |
| `--custom-source <urls>` | Cài module tùy chỉnh từ Git URL hoặc đường dẫn local |
| `--channel <stable\|next>` | Áp dụng cho mọi module bên ngoài (alias là `--all-stable` / `--all-next`) |
| `--all-stable` | Alias cho `--channel=stable` |
| `--all-next` | Alias cho `--channel=next` |
| `--next=<code>` | Đặt một module lên next. Có thể lặp lại. |
| `--pin <code>=<tag>` | Ghim một module vào tag cụ thể. Có thể lặp lại. |
| `--set <module>.<key>=<value>` | Đặt bất kỳ tùy chọn cấu hình module nào không tương tác (khuyến nghị; xem [Ghi đè cấu hình module](#ghi-đè-cấu-hình-module)). Có thể lặp lại. |
| `--list-options [module]` | In mọi key `--set` cho module tích hợp và module chính thức đã cache local, rồi thoát. Truyền mã module để chỉ xem module đó. |
| `--user-name`, `--communication-language`, `--document-output-language`, `--output-folder` | Shortcut cũ tương đương `--set core.<key>=<value>` (vẫn được hỗ trợ) |

Độ ưu tiên khi các cờ chồng nhau: `--pin` thắng `--next=`, thắng `--channel` / `--all-*`, thắng mặc định registry (`stable`).

:::note[Ví dụ resolve]
`--all-next --pin cis=v0.2.0` đặt bmb, gds và tea lên next, đồng thời ghim cis vào v0.2.0.
:::

### Recipe

**Cài mặc định — stable mới nhất cho mọi thứ:**

```bash
npx bmad-method install --yes --modules bmm,bmb,cis --tools claude-code
```

**Ghim cho doanh nghiệp — tái lập từng byte:**

```bash
npx bmad-method install --yes \
  --modules bmm,bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.2.0 \
  --tools claude-code
```

**Bleeding edge — module bên ngoài ở main HEAD:**

```bash
npx bmad-method install --yes --modules bmm,bmb --all-next --tools claude-code
```

**Thêm module vào bản cài hiện có** (giữ mọi thứ khác):

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,gds
```

`--tools` được bỏ có chủ ý vì `--action update` dùng lại các công cụ đã cấu hình ở lần cài đầu.

**Trộn channel — bmb ở next, gds ở stable:**

```bash
npx bmad-method install --yes --action update \
  --modules bmm,bmb,cis,gds \
  --next=bmb
```

### Ghi đè cấu hình module

`--set <module>.<key>=<value>` cho phép đặt bất kỳ tùy chọn cấu hình module nào không tương tác. Cờ này có thể lặp lại và mở rộng được cho mọi module hiện tại lẫn tương lai. Nó được áp dụng như một patch sau cài đặt: trình cài chạy luồng bình thường trước, sau đó `--set` upsert từng giá trị vào `_bmad/config.toml` (scope team) hoặc `_bmad/config.user.toml` (scope user), và vào `_bmad/<module>/config.yaml` để các giá trị đã khai báo được giữ cho lần cài sau.

**Ví dụ — cài bmm với project knowledge và skill level rõ ràng:**

```bash
npx bmad-method install --yes \
  --modules bmm \
  --tools claude-code \
  --set bmm.project_knowledge=research \
  --set bmm.user_skill_level=expert
```

**Khám phá các key có sẵn cho một module:**

```bash
npx bmad-method install --list-options bmm
```

`--list-options` không có tham số sẽ liệt kê mọi key mà trình cài tìm thấy local: module tích hợp (`core`, `bmm`) cộng với các module chính thức đang được cache. Cache là theo từng máy và có thể bị xóa, nên các module chính thức từng cài sẽ không xuất hiện trên checkout mới hoặc CI worker tạm thời cho đến khi chúng được cài lại. Module cộng đồng và tùy chỉnh không được liệt kê ở đây; hãy đọc trực tiếp `module.yaml` của module để xem các key nó khai báo.

**Cách hoạt động:**

- **Routing.** Bước patch tìm `[modules.<module>] <key>` (hoặc `[core] <key>`) trong `config.user.toml` trước; nếu đã có ở đó, nó cập nhật file đó. Nếu không, nó ghi vào `config.toml` scope team. Vì vậy các key scope user như `core.user_name`, `bmm.user_skill_level` đi vào `config.user.toml`, còn key scope team đi vào `config.toml`, khớp với cách trình cài phân vùng cấu hình.
- **Giá trị nguyên văn.** Giá trị được ghi đúng như bạn truyền vào, không render template `result:`. Nếu muốn dạng đã render như `{project-root}/research`, hãy truyền chính xác giá trị đó: `--set bmm.project_knowledge='{project-root}/research'`.
- **Giữ lại, key đã khai báo.** Giá trị cho key được khai báo trong `module.yaml` sống sót qua các lần cài sau vì cũng được ghi vào `_bmad/<module>/config.yaml`, nơi trình cài đọc làm mặc định cho prompt tiếp theo.
- **Giữ lại, key chưa khai báo.** Giá trị cho key mà schema module không khai báo sẽ nằm trong `config.toml` cho lần cài hiện tại nhưng không được phát lại ở lần cài sau (manifest writer phân vùng nghiêm theo schema và bỏ key lạ). Hãy truyền lại `--set` nếu bạn cần nó bền, hoặc sửa trực tiếp `_bmad/config.toml`.
- **Không validate.** Giá trị `single-select` không được kiểm tra với danh sách cho phép, và key lạ không bị từ chối; bạn khẳng định gì thì giá trị đó được ghi.
- **Module không nằm trong `--modules`.** Đặt giá trị cho module bạn không cài sẽ in cảnh báo và bỏ giá trị đó, không tạo file cho module chưa cài.

Các shortcut core cũ như `--user-name`, `--output-folder` vẫn hoạt động và vẫn được ghi lại để tương thích ngược, nhưng `--set core.user_name=...` là tương đương.

:::note[Hoạt động với quick-update]
`--set` là patch sau cài đặt, nên nó áp dụng giống nhau bất kể action type. Khi chạy `bmad install --action quick-update` (hoặc `--yes` trên bản cài hiện có, nơi quick-update là mặc định), `--set` patch các file cấu hình trung tâm ở cuối giống một lần cài thường.
:::

:::caution[Rate limit trên IP dùng chung]
Các API call GitHub ẩn danh bị giới hạn 60/giờ cho mỗi IP. Một lần cài gọi API một lần cho mỗi module bên ngoài để resolve tag stable. Văn phòng sau NAT, pool CI runner và VPN có thể cùng nhau dùng hết hạn mức này.

Đặt `GITHUB_TOKEN=<personal access token>` trong môi trường để nâng hạn mức lên 5000/giờ cho mỗi tài khoản. PAT đọc public repo là đủ, không cần scope.
:::

## Những gì đã được cài

Sau mọi lần cài, `_bmad/_config/manifest.yaml` ghi lại chính xác nội dung trên đĩa:

```yaml
modules:
  - name: bmb
    version: v1.7.0 # tag, hoặc "main" nếu là next
    channel: stable # stable | next | pinned
    sha: 86033fc9aeae2ca6d52c7cdb675c1f4bf17fc1c1
    source: external
    repoUrl: https://github.com/bmad-code-org/bmad-builder
```

Trường `sha` được ghi cho các module dựa trên git (external, community và custom bằng URL). Module bundled (core, bmm) và module custom từ đường dẫn local không có trường này; code của chúng đi cùng binary trình cài hoặc filesystem của bạn, không phải một ref có thể clone.

Để tái lập giữa nhiều máy, đừng dựa vào việc chạy lại cùng lệnh `--modules`. Cài trên stable channel resolve sang tag đã phát hành cao nhất **tại thời điểm cài**, nên lần chạy sau có thể nhận bản mới hơn. Hãy chuyển các tag đã ghi trong `manifest.yaml` thành cờ `--pin` rõ ràng trên máy đích, ví dụ:

```bash
npx bmad-method install --yes --modules bmb,cis \
  --pin bmb=v1.7.0 --pin cis=v0.4.2 --tools claude-code
```

## Khắc phục sự cố

### "Could not resolve stable tag" hoặc "API rate limit exceeded"

Bạn đã chạm giới hạn 60/giờ của GitHub khi gọi ẩn danh. Đặt `GITHUB_TOKEN` rồi thử lại. Nếu đã có token, token đó có thể đã hết hạn hoặc hết budget rate limit; hãy thử token khác hoặc chờ reset theo giờ.

### "Tag 'vX.Y.Z' not found"

Tag bạn truyền cho `--pin` không tồn tại trong repo module. Kiểm tra trang releases của repo trên GitHub để xem tag hợp lệ.

### Bản cài đã ghim vẫn cứ nâng cấp

Bản cài pinned không nâng cấp. Quick-update chỉ áp dụng patch và minor trên stable channel; nó không đụng tới `pinned` hoặc `next`. Nếu bản cài pinned thay đổi, mở `_bmad/_config/manifest.yaml`: `channel: pinned` cùng `version` và `sha` cố định phải giữ nguyên qua các lần chạy, trừ khi bạn override rõ bằng cờ.

### `--pin bmm=X` không làm gì

bmm là module bundled, nên `--pin` và `--next=` không áp dụng. Dùng `npx bmad-method@next install` để lấy prerelease core/bmm, hoặc checkout repo bmad-bmm và chạy trình cài local để lấy thay đổi chưa phát hành.
