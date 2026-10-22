# CẤU HÌNH MODEL CHO HỆ SINH THÁI AGENT (`.agents/MODEL_CONFIG.md`)

> **Quy tắc vận hành:** `Lead Agent` bắt buộc đọc file này ngay tại Turn 1 và tuân thủ tuyệt đối.  
> **Cách chỉnh sửa cho User:** Bạn chỉ cần sửa giá trị bên phải dấu `:` ở Mục 1 bên dưới thành `inherit`, `pro`, `flash`, `flash_lite` hoặc `ask`.

---

## 1. BẢNG CẤU HÌNH ĐANG KÍCH HOẠT (ACTIVE CONFIG)

```yaml
# Giá trị hợp lệ: inherit | pro | flash | flash_lite | ask
# (Lưu ý: Lead Agent luôn chạy theo Model bạn chọn trực tiếp trên thanh menu UI của cửa sổ Chat)

INDEXER_MODEL: flash
WORKER_MODEL: inherit
AUDITOR_MODEL: inherit
```

---

## 2. HƯỚNG DẪN CHỌN GIÁ TRỊ (CHEAT-SHEET CHO USER)

Do công cụ `invoke_subagent` của Antigravity nhận 4 định danh tier chuẩn, ý nghĩa thực tế của từng giá trị như sau:

- **`inherit`** *(Khuyên dùng cho Worker & Auditor)*:
  - Subagent sẽ **sao chép 100% Model + Mức Reasoning (`Low / Medium / High`)** mà bạn đang chọn trên thanh menu UI của cuộc trò chuyện chính.
  - *Ví dụ 1:* UI chính bạn chọn `Gemini 4 Argon (High)` $\rightarrow$ `inherit` chạy đúng **`Gemini 4 Argon (High)`**.
  - *Ví dụ 2:* UI chính bạn chọn `Claude Opus 5.5 (High)` hoặc `Claude Sonnet 5.5 (High)` $\rightarrow$ `inherit` chạy đúng **`Claude 5.5 (High)`**.
- **`pro`**:
  - Luôn gọi cố định dòng cao nhất của Google hiện tại là **`Gemini 4 Argon`** (mức reasoning mặc định của hệ thống).
  - *Mẹo phối hợp Claude + Gemini:* Nếu trên thanh UI chính bạn chọn **`Claude Sonnet/Opus 5.5 (High)`**, bạn đặt `WORKER_MODEL: inherit` (chạy Claude 5.5) và đặt `AUDITOR_MODEL: pro` (chạy Gemini 4 Argon) để 2 hãng model khác nhau phản biện chéo!
- **`flash`** *(Khuyên dùng cho Indexer)*:
  - Luôn gọi cố định **`Gemini 3.8 Flash`**. Tốc độ nhanh, tiết kiệm quota tối đa khi quét AST và lập bản đồ `DOC_MAP.md` / `CODEBASE_MAP.md`.
- **`flash_lite`**:
  - Luôn gọi bản Flash siêu nhẹ cho các tác vụ trích xuất đơn giản.
- **`ask`**:
  - Nếu bạn điền `ask` vào bất kỳ Role nào (hoặc xóa file này), ở đầu phiên làm việc `Lead Agent` sẽ hiện bảng hướng dẫn ngắn và bật **ô câu hỏi trắc nghiệm (`ask_question`)** để bạn bấm chọn trực tiếp.

