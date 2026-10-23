---
name: codebase-indexing
description: >-
  Quy trình trinh sát AST/Graph (GitNexus + ripgrep) và khung mẫu chuẩn để khởi tạo
  hoặc cập nhật DOC_MAP.md và CODEBASE_MAP.md. Kích hoạt khi tiếp cận repository đã có
  mã nguồn nhưng chưa có Map (Brownfield Cold-Start) hoặc khi cấu trúc module thay đổi lớn.
---

# SKILL: LẬP BẢN ĐỒ HỆ THỐNG (`DOC_MAP.md` & `CODEBASE_MAP.md`)

> **Mục tiêu:** Sinh `DOC_MAP.md` và `CODEBASE_MAP.md` cực gọn; cấm ghi số dòng; neo theo Heading (`##`) và Định danh (`Class`/`Function`) kèm nhãn `[CORE]`, `[SHARED]`, `[LEAF]`. Nạp kèm skill `high-signal-writing`.

---

## 1. Quy Trình Trinh Sát 3 Bước (Cấm Đọc Tuần Tự Cả File Code)

1. **Quét Cây Thư Mục & Phân Loại Doc (`.md`):**
   - Liệt kê file toàn dự án (bỏ qua `.git`, `node_modules`, `dist`, `build`, `venv`, `__pycache__`, `.session`, logs).
   - Chạy `rg "^#{1,3} "` trích xuất tiêu đề và đọc 20 dòng đầu mỗi file `.md`:
     - **File ngắn (< 150 dòng, đơn chủ đề):** Mô tả 1 dòng + gắn link file; cấm tách mục con.
     - **File dài ($\ge 150$ dòng, đa mục):** Lập chỉ mục cấp `##`/`###` kèm mô tả ngắn và từ khóa `grep`.
2. **Phân Tích Đồ Thị Mã Nguồn Tất Định (Cấm Fallback Ngầm):**
   - **Công cụ bắt buộc:** Chạy `npx gitnexus analyze` để trích xuất cụm chức năng (`Clusters`), danh sách `Class`/`Function`/`Method` và độ đo phụ thuộc (`Callers`/`Callees`).
   - **Xử lý khi thiếu `GitNexus` (Zero Silent Fallback):**
     - Nếu `npx gitnexus` chưa cài hoặc báo lỗi, `Indexer` **dừng ngay lập tức** và báo cáo lên `Lead Agent`.
     - `Lead Agent` bắt buộc dùng `ask_question` trình bày cho User:
       1. **Hướng dẫn cài nhanh `GitNexus`:** Chạy `npm install -g gitnexus` hoặc dùng `npx gitnexus analyze` (yêu cầu Node.js $\ge 18$) để có đồ thị AST & Blast Radius chính xác 100%.
       2. **Phân tích Quy trình Đọc Tĩnh Dự phòng (Static Fallback):** Nếu User từ chối cài `GitNexus`, Agent sẽ chạy 3 bước tĩnh:
          - *(a)* Quét khai báo symbol bằng `ast-grep`, `ctags --output-format=json` hoặc `rg`.
          - *(b)* Quét câu lệnh `import`/`export`/`require` để dựng bảng phụ thuộc cấp file.
          - *(c)* Đếm số lần xuất hiện tên hàm bằng `rg "\b<symbol>\b"` để ước lượng nhãn `[SHARED]` ($\ge 3$ nơi gọi).
          - *Nhược điểm cần nêu rõ cho User:* Không bắt được lời gọi đa hình (`polymorphism`), alias đổi tên hoặc kế thừa nhiều tầng.
     - **Chỉ khi User bấm đồng ý cho phép Fallback tĩnh**, `Indexer` mới được thực thi quy trình tĩnh trên.
   - **Giới hạn đọc code:** Chỉ mở `read_file` đọc 30–50 dòng đầu file hoặc docstring khi tên hàm chưa rõ nghĩa.
3. **Gắn Nhãn Bán Kính Tác Động (`Blast Radius`):**
   - `[CORE]`: Hàm điều phối trung tâm, entrypoint hoặc quản lý state toàn cục.
   - `[SHARED]`: Hàm/utility dùng chung được gọi từ $\ge 3$ vị trí/files khác nhau.
   - `[LEAF]`: Hàm xử lý nhánh cuối, ít hoặc không có phụ thuộc ngược.

---

## 2. Khung Mẫu Chuẩn `DOC_MAP.md`

```markdown
# BẢN ĐỒ HỆ THỐNG TÀI LIỆU (DOCUMENTATION MAP)

> Tra cứu tại **Bảng điều hướng nhanh (Mục 1)** hoặc **Chỉ mục phân tầng (Mục 2)**. Chỉ mở duy nhất file liên quan đến task; cấm đọc lan man.

## 1. Bảng Điều Hướng Nhanh

| Bạn đang cần làm gì?                           | File duy nhất cần mở                 | Mô tả ngắn gọn                                                     |
| :--------------------------------------------- | :----------------------------------- | :----------------------------------------------------------------- |
| **Kiểm tra quyết định kiến trúc & Invariants** | [`docs/decisions/`](docs/decisions/) | Các thiết kế đã chốt, lý do "The Why" và phương án cấm mở lại.     |
| **Định vị file & hàm trong mã nguồn**          | [`CODEBASE_MAP.md`](CODEBASE_MAP.md) | Ánh xạ Tính năng → File → Hàm/Class kèm nhãn `[CORE]`, `[SHARED]`. |
| `<Nhu cầu cụ thể khác>`                        | `[<Tên file>](<Đường dẫn>)`          | `<Mô tả cô đọng < 20 từ>`                                          |

## 2. Chỉ Mục Phân Tầng

### A. File Dài (Chia theo Heading lớn — Cấm ghi số dòng)

#### [`<Tên file>`](<Đường dẫn>)

- **Phạm vi:** <Trách nhiệm cốt lõi>. | **Mở khi:** <Điều kiện kích hoạt rõ ràng>.
- `## <Tên Heading 1>`: <Mô tả cô đọng nội dung kỹ thuật>.
- **Từ khóa:** `keyword1`, `keyword2`, `symbol3`.

### B. File Ngắn / Micro-specs (< 150 dòng)

- **[`<Tên file>`](<Đường dẫn>)**: <Phạm vi chính>. | **Mở khi:** <Điều kiện mở; đọc trọn vẹn>. | **Từ khóa:** `key1`, `key2`.

## 3. Bảng Đăng Ký & Đồng Bộ Tài Liệu (Doc Registry)

| File Tài liệu         | Phạm vi ánh xạ           | Khi nào bắt buộc cập nhật?                                        |
| :-------------------- | :----------------------- | :---------------------------------------------------------------- |
| `CODEBASE_MAP.md`     | Toàn bộ mã nguồn         | Khi thêm/xóa file, đổi tên hàm lớn hoặc đổi phụ thuộc `[SHARED]`. |
| `docs/decisions/*.md` | Kiến trúc & Hợp đồng lõi | Khi chốt công nghệ mới hoặc hủy thiết kế cũ (cần User duyệt).     |
```

---

## 3. Khung Mẫu Chuẩn `CODEBASE_MAP.md`

> **Lọc nhiễu:** Cấm liệt kê getter/setter nhỏ hoặc helper 2–3 dòng. Chỉ chọn hàm lớn mang tải trọng nghiệp vụ hoặc gom theo cụm hàm.

```markdown
# BẢN ĐỒ MÃ NGUỒN (CODEBASE & FEATURE MAP)

> Neo theo định danh hàm/class và trách nhiệm nghiệp vụ; cấm ghi số dòng. Dùng `rg` tìm tên hàm trong backtick để lấy số dòng trước khi mở `read_file`.

## 1. Danh Mục Tập Tin Mã Nguồn Chính

| File                       | Trách nhiệm duy nhất (Single Responsibility)    | Phụ thuộc chính (Imports/Calls) |
| :------------------------- | :---------------------------------------------- | :------------------------------ |
| [`<path/file>`](path/file) | <Mô tả trực diện trách nhiệm trong 1 câu ngắn>. | `moduleA`, `moduleB`            |

## 2. Bản Đồ Tính Năng & Bán Kính Tác Động

### A. <Tên Cụm Tính Năng / Subsystem 1>

- **<Chức năng nghiệp vụ cụ thể>**:
  - **File:** [`<path/file>`](path/file) — Hàm/Class: `functionName(args)` | `ClassName.method`
  - **Tác động:** `[SHARED]` (hoặc `[CORE]` / `[LEAF]`) | **Callers trực tiếp (Bắt buộc nếu `[SHARED]`/`[CORE]`):** [`<caller_file_1>`](caller_file_1) (`callerA`), [`<caller_file_2>`](caller_file_2) (`callerB`).
```
