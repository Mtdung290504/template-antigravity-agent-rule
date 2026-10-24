# TÍCH HỢP BỘ RULE VÀO DỰ ÁN (`how-to-add-to-your-project.md`)

> **Điều hướng nhanh theo trạng thái dự án của bạn:**
>
> - **Chưa có `AGENTS.md` và thư mục `.agents/`:** Chạy ngay **[Mục 1: Lệnh Cài Đặt](#1-lenh-cai-dat-tai-thu-muc-goc-du-an)** bên dưới.
> - **Đã có sẵn `AGENTS.md` hoặc thư mục `.agents/`:** Đọc **[Mục 3: Xử Lý Trùng Tên & Xung Đột `.agents/`](#3-xu-ly-trung-ten--xung-dot-agents-khi-chay---force)** trước khi chạy lệnh.

---

## 1. Lệnh Cài Đặt Tại Thư Mục Gốc Dự Án

> **Cơ chế `degit`:** Chỉ tải gói tarball mới nhất và giải nén vào thư mục đích (`.`). **Không** kéo theo `.git/` của repo mẫu; giữ nguyên 100% lịch sử Git hiện có của dự án (các file mới ở trạng thái `Untracked`).

### Windows (`PowerShell`)

```powershell
# Áp dụng cho cả cài mới và cập nhật khi repo này có thay đổi
npx.cmd degit Mtdung290504/template-antigravity-agent-rule . --force
# Lần đầu chạy: Nhập 'y' khi được hỏi cài gói degit@<version>
```

### macOS / Linux (`Bash` / `Zsh`)

```bash
npx degit Mtdung290504/template-antigravity-agent-rule . --force
```

---

## 2. Khởi Động Sau Khi Tải Về

1. **Mở Chat Antigravity (Turn 1):** Chỉ cần chat, không cần prompt thêm gì. `Lead Agent` tự động kích hoạt, bật `ask_question` hỏi cấu hình Model cho 4 vai trò và lưu cache vào [`.agents/MODEL_CONFIG.yaml`](.agents/MODEL_CONFIG.yaml). Có thể xóa file `how-to-add-to-your-project.md` sau khi cài xong.
2. **Cài `GitNexus` (tùy chọn, project dự kiến lớn):** Chạy `npm i -g gitnexus` để `Indexer` và `Worker` truy vết AST & Blast Radius.

---

## 3. Xử Lý Trùng Tên & Xung Đột `.agents/` Khi Chạy `--force`

`degit ... . --force` giải nén theo cơ chế **chép trộn (`overlay/merge`)** vào thư mục hiện tại:

| Tình huống trong dự án đích                                                                                                                                                                                                   | Hệ quả kỹ thuật                                                                                                                                                                                                            | Cách xử lý bắt buộc                                                                                                                                                                                                    |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Có file TRÙNG TÊN:**<br>`AGENTS.md`, `.agents/MODEL_CONFIG.yaml`, `.agents/rules/{lead,debate-auditor,indexer,worker,auditor}.md`, `.agents/skills/{codebase-indexing,deep-code-wiki,doc-adr-sync,high-signal-writing}/` | **Bị ghi đè mất sạch nội dung cũ** do cờ `--force`.                                                                                                                                                                        | Backup trước khi chạy lệnh (ví dụ: đổi tên `AGENTS.md` thành `AGENTS.backup.md`).                                                                                                                                      |
| **2. Có `.agents/rules/<khác-tên>.md`:**<br>File rule riêng có sẵn từ trước                                                                                                                                                   | **Không bị xóa**, nhưng nếu có `trigger: always_on`, Antigravity sẽ nạp cùng lúc với `AGENTS.md` mới $\rightarrow$ **Xung đột chỉ thị (Prompt Conflict)** và tốn gấp đôi token. Các Subagent mới cũng phớt lờ file lẻ này. | Di chuyển toàn bộ rule cũ ra khỏi `.agents/rules/`. Chuyển các quy ước kiến trúc/code riêng của dự án vào `docs/decisions/001-project-conventions.md`.                                                                 |
| **3. Có `.agents/skills/<khác-tên>/SKILL.md`:**<br>Thư mục skill riêng có sẵn từ trước                                                                                                                                        | **Không bị xóa**; vẫn được Antigravity nạp vào danh sách `<skills>` đầu phiên.                                                                                                                                             | Rà soát `description` để không trùng chức năng với 4 skill lõi. Nếu muốn giao cho Subagent, thêm tên skill vào mục `[ACTIVE SKILLS]` tại [`.agents/rules/lead.md`](.agents/rules/lead.md) và [`AGENTS.md`](AGENTS.md). |
