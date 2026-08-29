![BMad Method](banner-bmad-method.png)

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue?logo=python&logoColor=white)](https://www.python.org)
[![uv](https://img.shields.io/badge/uv-package%20manager-blueviolet?logo=uv)](https://docs.astral.sh/uv/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

[English](README.md) | [简体中文](README_CN.md) | Tiếng Việt

**Agile Ai Driven Development (Phát triển hướng AI theo lối agile)** - Ai Driven Development (AiDD) bao trùm toàn bộ công việc chứ không chỉ phần mã: xây dựng cái gì, các phần gắn kết ra sao, và thay đổi thế nào khi bạn hiểu thêm. BMad Method là cách làm AiDD theo lối agile: quyết định luôn tường minh, ngữ cảnh được giữ lại xuyên suốt, và quy trình tự co giãn theo khối lượng công việc. Cùng một phương pháp dùng được cho nguyên mẫu cuối tuần lẫn hệ thống đã có nhiều năm lịch sử.

**100% miễn phí và mã nguồn mở.** Không có tường phí. Không có nội dung bị khóa. Không có Discord giới hạn quyền truy cập. Chúng tôi tin vào việc trao quyền cho mọi người, không chỉ cho những ai có thể trả tiền để vào một cộng đồng hay khóa học khép kín.

## Vì sao chọn BMad Method?

Các công cụ AI truyền thống thường làm thay phần suy nghĩ của bạn và tạo ra kết quả ở mức trung bình. Các agent chuyên biệt và quy trình làm việc có hướng dẫn của BMad hoạt động như những cộng tác viên chuyên gia, dẫn dắt bạn qua một quy trình có cấu trúc để khai mở tư duy tốt nhất của bạn cùng với AI.

- **Trợ giúp AI thông minh** - Gọi skill `bmad-help` bất kỳ lúc nào để biết bước tiếp theo
- **Thích ứng theo quy mô và miền bài toán** - Tự động điều chỉnh độ sâu lập kế hoạch theo độ phức tạp của dự án
- **Quy trình có cấu trúc** - Dựa trên các thực hành tốt nhất của agile xuyên suốt phân tích, lập kế hoạch, kiến trúc và triển khai
- **Agent chuyên biệt** - Hơn 12 chuyên gia theo vai trò như PM, Architect, Developer, UX, Scrum Master và nhiều vai trò khác
- **Party Mode** - Đưa nhiều persona agent vào cùng một phiên để cộng tác và thảo luận
- **Vòng đời hoàn chỉnh** - Từ động não ý tưởng cho đến triển khai

[Tìm hiểu thêm tại **docs.bmad-method.org**](https://docs.bmad-method.org/vi-vn/)

---

## Bắt đầu nhanh

**Điều kiện tiên quyết**: [Node.js](https://nodejs.org) v20+ · [Python](https://www.python.org) 3.10+ · [uv](https://docs.astral.sh/uv/)

```bash
npx bmad-method install
```

> Muốn dùng bản prerelease mới nhất? Hãy dùng `npx bmad-method@next install`. Hãy kỳ vọng mức độ biến động cao hơn bản cài đặt mặc định.

Làm theo các lời nhắc của trình cài đặt, sau đó mở AI IDE của bạn như Claude Code hoặc Cursor trong thư mục dự án.

**Cài đặt không tương tác** (cho CI/CD):

```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```

> **Chưa chắc nên làm gì?** Hãy hỏi `bmad-help` - nó sẽ cho bạn biết chính xác bước nào tiếp theo và bước nào là tùy chọn. Bạn cũng có thể hỏi kiểu như `bmad-help Tôi vừa hoàn thành phần kiến trúc, tiếp theo tôi cần làm gì?`

## Mô-đun

BMad Method có thể được mở rộng bằng các mô-đun chính thức cho những miền chuyên biệt. Chúng có sẵn trong lúc cài đặt hoặc bất kỳ lúc nào sau đó.

| Module                                                                                                           | Mục đích                                                                                        |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **[BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)**                                                  | Lập kế hoạch và bàn giao phần mềm, từ nguyên mẫu mới đến codebase lâu năm                       |
| **[BMad Builder](https://github.com/bmad-code-org/bmad-builder)**                                                | Trình tạo skill, quy trình và agent                                                             |
| **[BMad Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)** | Đối tác tư duy sáng tạo cho đổi mới, tư duy thiết kế và kể chuyện                               |
| **[BMad Test Architect](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)**             | Mô-đun kiểm thử doanh nghiệp bổ trợ cho BMad Method                                             |
| **[BMad Loop](https://github.com/bmad-code-org/bmad-loop)**                                                      | Tự động xây dựng, kiểm chứng và tổng kết cả một Epic                                            |
| **[BMad Game Dev Studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)**                         | Lên ý tưởng, thiết kế và phát triển game trên mọi framework, gồm Unity, Unreal, Godot và Phaser |

## Tài liệu

[Trang tài liệu BMad Method](https://docs.bmad-method.org/vi-vn/) - bài hướng dẫn, hướng dẫn tác vụ, giải thích khái niệm và tài liệu tham chiếu

**Liên kết nhanh:**

- [Hướng dẫn bắt đầu](https://docs.bmad-method.org/vi-vn/tutorials/getting-started/)
- [Nâng cấp từ các phiên bản trước](https://docs.bmad-method.org/vi-vn/how-to/upgrade-to-v6/)
- [Tài liệu Test Architect](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)

## Cộng đồng

- [Discord](https://discord.gg/gk8jAdXWmj) - Nhận trợ giúp, chia sẻ ý tưởng, cộng tác
- [YouTube](https://youtube.com/@BMadCode) - Video hướng dẫn, master class và nhiều nội dung khác
- [X / Twitter](https://x.com/BMadCode)
- [Website](https://bmadcode.com)
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) - Báo lỗi và yêu cầu tính năng
- [Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions) - Trao đổi cộng đồng

## Hỗ trợ BMad

BMad miễn phí cho tất cả mọi người và sẽ luôn như vậy. Hãy nhấn sao cho repo này, [mời tôi một ly cà phê](https://buymeacoffee.com/bmad), hoặc gửi email tới <contact@bmadcode.com> nếu bạn muốn tài trợ doanh nghiệp.

## Đóng góp

Chúng tôi luôn chào đón đóng góp. Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết hướng dẫn.

## Giấy phép

Giấy phép MIT - xem [LICENSE](LICENSE) để biết chi tiết.

---

**BMad** và **BMAD-METHOD** là các nhãn hiệu của BMad Code, LLC. Xem [TRADEMARK.md](TRADEMARK.md) để biết chi tiết.

Xem [CONTRIBUTORS.md](CONTRIBUTORS.md) để biết thông tin về những người đóng góp.
