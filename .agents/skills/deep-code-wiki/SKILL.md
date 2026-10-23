---
name: deep-code-wiki
description: >-
  Quy trình Map-Reduce 2 giai đoạn để duyệt sâu mã nguồn (travel code), giải phẫu thuật toán
  và biên soạn tài liệu kiến trúc chuyên sâu (DESIGN.md / Code Wiki / Khảo sát Repo).
  Kích hoạt khi người dùng yêu cầu viết Wiki, viết tài liệu giải thích sâu cơ chế code
  hoặc khảo sát chi tiết một repository/module.
---

# SKILL: DUYỆT SÂU MÃ NGUỒN & BIÊN SOẠN CODE WIKI (MAP-REDUCE PIPELINE)

> **Điều kiện kích hoạt:** Khi User yêu cầu đọc hiểu sâu mã nguồn (`travel code`) để viết Code Wiki, `DESIGN.md` hoặc giải phẫu kiến trúc repo. Nạp kèm skill `high-signal-writing`.  
> **Nguyên tắc sống còn:** Cấm giao 1 Agent đọc lèo > 10 files trong 1 phiên để viết Wiki (sẽ gây tràn Context Window dẫn đến tóm tắt hời hợt hoặc bịa đặt ở các file cuối). Bắt buộc chia nhỏ theo quy trình Map-Reduce 3 bước dưới đây.

---

## 1. Quy Trình Map-Reduce 3 Bước

### Bước 1: Phân Cụm Bản Đồ (`MAP` — Giao `Indexer Agent`)

- Nếu repo chưa có `CODEBASE_MAP.md`: Chạy skill `codebase-indexing` quét AST/GitNexus để gom các file có liên kết chặt thành từng **Cụm chức năng (`Subsystems`)** và gắn nhãn `[CORE]`, `[SHARED]`.

### Bước 2: Giải Phẫu Sâu Từng Cụm (`REDUCE` — Giao `Worker Agent`)

- `Lead Agent` chia việc viết Wiki thành các task độc lập theo từng cụm. **Giới hạn cứng: Tối đa 3–6 files mã nguồn / 1 task** (ví dụ: `wiki-core-runtime`, `wiki-dom-parser`).
- Trong phạm vi cụm được giao, `Worker Agent` được mở khóa **Chế độ Đọc Sâu (`Deep Traversal`)** thực hiện 3 việc:
  1. **Đọc 100% thân hàm** của các hàm `[CORE]` và `[SHARED]` thuộc cụm đó.
  2. **Lần vết luồng dữ liệu end-to-end:** Đi từ `Entrypoint` $\rightarrow$ qua các bước biến đổi dữ liệu $\rightarrow$ các nhánh điều kiện chắn lỗi (`Guard clauses`) $\rightarrow$ `Output / Side-effects`.
  3. **Bóc tách các quyết định ngầm trong code:** Ghi nhận các đoạn xử lý trường hợp biên đặc biệt, các hằng số giới hạn cứng (`timeouts`, `buffer limits`, `retry counts`) và cơ chế khóa đồng thời (`locks`, `queues`).

### Bước 3: Kiểm Định Thực Chứng (`VERIFY` — Giao `Code Auditor`)

- `Code Auditor` mở bài Wiki vừa viết đối chiếu trực tiếp với file mã nguồn thật của cụm đó:
  - Kiểm tra tên hàm, tham số, mã lỗi và công thức nêu trong Wiki có khớp 100% với code thật không?
  - Luồng thuật toán mô tả trong Wiki có bỏ sót nhánh rẽ hoặc điều kiện chặn lỗi quan trọng nào trong code không?
- Sau khi `Code Auditor` phán quyết `[APPROVED]`, cập nhật đường dẫn file Wiki mới vào `DOC_MAP.md`.

---

## 2. Khung Mẫu Chuẩn Bài Code Wiki / `DESIGN.md`

```markdown
# ĐẶC TẢ KIẾN TRÚC & CƠ CHẾ LÕI: <TÊN MODULE / SUBSYSTEM>

- **Phạm vi file:** `<file1>`, `<file2>`
- **Trách nhiệm cốt lõi:** <1 câu định nghĩa chính xác bài toán module này giải quyết>

## 1. Pipeline Thực Thi & Quản Lý Trạng Thái

- **Luồng thực thi chính:** `EntrypointFunc(input)` $\rightarrow$ `Step1Transform()` $\rightarrow$ `Step2Validate()` $\rightarrow$ `Output / State Change`.
- **Cơ chế State / Persistence:** <Lưu tại RAM / Disk / DB; vòng đời tồn tại; cơ chế khóa đồng bộ / concurrency>.

## 2. Giải Phẫu Thuật Toán & Cơ Chế Trọng Tâm

### 2.1. `<Tên Thuật Toán / Cơ Chế 1>` (Hàm: `coreFuncA`, `helperFuncB`)

- **Cơ chế kỹ thuật:** <Giải thích trực diện từng bước hoạt động, công thức tính toán hoặc điều kiện rẽ nhánh>.
- **Thông số cứng & Độ phức tạp:** <Timeout, giới hạn kích thước tối đa, độ phức tạp thuật toán O(...)>.

## 3. Xử Lý Biên & Phòng Vệ (Edge Cases & Guards)

| Tình huống biên / Lỗi              | Hàm xử lý (`Guard`) | Hành vi hệ thống (Fail-fast / Fallback / Retry) |
| :--------------------------------- | :------------------ | :---------------------------------------------- |
| `<Input rỗng / Quá tải / Timeout>` | `validateInput()`   | `<Trả về mã lỗi X / Hủy tiến trình>`            |

## 4. Giới Hạn Hiện Tại (Known Limitations)

- <Liệt kê trung thực những gì code hiện tại CHƯA xử lý được hoặc đang giả định ngầm>.
```
