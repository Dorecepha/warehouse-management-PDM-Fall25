# 📦 Warehouse Management System — Frontend Team Guide

Hi 1000 anh em nha, đây sẽ là guide chính thức cho team Frontend. Cả nhà làm theo hướng dẫn ở dưới để hiểu rõ về project của mình nha!

---

# 1. Sơ lược

Warehouse Management System (WMS) sẽ bao gồm hai phần chính ở dưới:

- **Backend (Spring Boot)** - đây là "đầu não" để giao tiếp với Database. 
- **Frontend (React + Tailwind)** - đây là nơi người dùng sẽ thao tác, giống như "gương mặt" của WMS này.

Team Frontend của mình sẽ thêm các chức năng sau: **pages, buttons, tables, forms, navigation**, và đảm bảo các chức năng này có thể liên lạc với Backend.

Mục tiêu chính của team mình:

- Đăng nhập
- Xem báo cáo của kho
- Thêm, xóa, sửa dữ liệu trong kho

---

# 2. QUAN TRỌNG: Để chạy được cái Project này, hãy làm theo các bước sau!

Tải về:

- **Node.js LTS** 
- **Git**  
- **VS Code** 

Nếu không rõ phần này, hãy nhờ Tín nhé!

---

# 3. Cài đặt chung

## 3.1. Clone repository

Chạy câu lệnh sau trong git bash tích hợp trong VSCode:

```bash
git clone https://github.com/Dorecepha/warehouse-management-PDM-Fall25
cd warehouse-management-PDM-Fall25/frontend
```

## 3.2. Chạy script ghi sẵn

Nếu Windows (nhớ chỉnh sang powershell):
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

Nếu Mac/Linux: 
```bash
bash setup.sh
```

## 3.3. Khởi chạy
Chạy câu lệnh sau trong git bash:
```bash
npm start
```

Nếu thành công, bạn sẽ thấy một dòng chữ lớn: Warehouse Management System.
