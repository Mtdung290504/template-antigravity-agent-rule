---
name: doc-adr-sync
description: >-
  Chính sách đồng bộ tài liệu sau mỗi task, ngưỡng chống lạm phát file doc và khung mẫu chuẩn
  để tạo mới quyết định kiến trúc ADR (docs/decisions/NNN-slug.md). Kích hoạt khi chốt quyết định
  kiến trúc mới hoặc khi hoàn thành task cần đồng bộ Doc-Code.
---

# SKILL: QUẢN TRỊ QUYẾT ĐỊNH KIẾN TRÚC (`ADR`) & ĐỒNG BỘ TÀI LIỆU

> **Mục tiêu:** Đồng bộ 100% giữa `DOC_MAP.md`, `CODEBASE_MAP.md`, `docs/decisions/` và mã nguồn; chặn đứng lạm phát file tài liệu rác. Nạp kèm skill `high-signal-writing`.

---

## 1. Quy Chuẩn `docs/decisions/NNN-<slug>.md` (ADR)

- **Quy tắc phân tách:** Mỗi file `docs/decisions/NNN-<kebab-slug>.md` chỉ chứa **duy nhất 1 quyết định kiến trúc** (< 120 dòng) và được đăng ký 1 dòng vào `DOC_MAP.md`.
- **4 Sự kiện Kích hoạt Sinh File ADR Mới (Trigger Conditions):**
  1. Chọn hoặc thay thế công nghệ / thư viện lõi.
  2. Thay đổi hợp đồng giao tiếp (`API`/`IPC`) hoặc mô hình dữ liệu / lưu trữ.
  3. Thiết lập rào chắn cấm (`Hard Invariants`) sau thử nghiệm thất bại hoặc sự cố bảo mật.
  4. Đảo ngược ADR cũ: Tạo `NNN-new.md` và đổi trạng thái file cũ thành `SUPERSEDED by ADR-NNN` (cấm xóa file cũ để giữ lịch sử _"The Why"_).
     _(Ghi chú: Các uốn nắn hành vi AI hoặc quy ước phiên ngắn hạn ghi vào `.agents/SESSION_STATE.md`, cấm ghi vào ADR)._

```markdown
# ADR-NNN: <Tên Quyết Định Ngắn Gọn, Mang Tải Trọng Kỹ Thuật>

- **Trạng thái:** `ACCEPTED` | `SUPERSEDED by ADR-XXX` | **Ngày:** YYYY-MM-DD | **Phạm vi:** `<modules/files>`

## 1. Bối cảnh & Vấn đề

- <1–2 câu trần thuật trực diện nêu bài toán hoặc giới hạn kỹ thuật buộc phải ra quyết định>.

## 2. Quyết định Chốt

- <Khẳng định dứt khoát giải pháp kỹ thuật được áp dụng>.

## 3. Phương án Đã Bác bỏ (Cấm Đề Xuất Lại)

- **`<Phương án A>`**: Bác bỏ vì `<Lý do kỹ thuật định lượng / thực tế>`.

## 4. Ràng buộc Bất biến (Invariants)

- **Cấm:** `<Hành vi / Thiết kế bị cấm tuyệt đối>`.
- **Bắt buộc:** `<Hợp đồng kỹ thuật phải tuân thủ khi chạm vào phạm vi này>`.
```

---

## 2. Ngưỡng Chống Lạm Phát Tài Liệu & Quy Trình Đồng Bộ 4 Bước

- **Cấm đẻ file `.md` rác (`NOTES.md`, `SUMMARY.md`, `TODO.md`):** Mặc định cập nhật vào tài liệu đã đăng ký trong `DOC_MAP.md`. Chỉ đề xuất tạo file doc mới (ngoài ADR) khi: (1) Module mới hoàn toàn $\ge 3$ files cần `DESIGN.md`, (2) Thuật toán phức tạp cần giải phẫu riêng (`deep-code-wiki`), hoặc (3) Ma trận quản lý sự cố lớn.
- **Quy trình Đồng bộ 4 Bước cuối mỗi Task:**
  1. **Worker đề xuất trong Handoff:** Chỉ rõ cần sửa dòng/mục nào trong `CODEBASE_MAP.md` (khi thêm/xóa file, đổi hàm hoặc caller `[SHARED]`) và `DOC_MAP.md`/Spec.
  2. **Auditor kiểm tra chéo:** Bắt lỗi nếu Worker bỏ sót tài liệu bị lệch pha với code mới.
  3. **Lead xin phép User:** Trình danh sách file Doc/Map cần cập nhật và chờ User duyệt.
  4. **Cập nhật & Đóng Task:** Cập nhật tài liệu theo chuẩn `high-signal-writing` rồi mới đổi trạng thái task sang `XONG` trong `.agents/SESSION_STATE.md`.
