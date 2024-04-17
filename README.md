# Booking-Reservation-system
## Rules:
- Mỗi commit 1 mục đích / chức năng / thay đổi / fix bug
- Trước khi commit phải format code
- Trước khi commit phải test xem code có hoạt động đúng ko
- Trước khi commit phải pull code về (tránh conflix) (nên pull code ngay khi bắt đầu mở project để code tiếp)

## Các lệnh cơ bản:
- `git clone <link>`: clone project về máy
- `git status`: kiểm tra trạng thái của project
- `git add <file>`: thêm file vào stage
- `git add .`: thêm tất cả các file vào stage
- `git commit -m "<message>"`: commit code
- `git push`: đẩy code lên server (github)
- `git pull`: kéo code về máy local
- `git checkout <branch>`: chuyển branch
- `git branch <branch>`: tạo branch
- `git checkout -b <branch>`: tạo branch mới và chuyển sang branch đó

## Dùng Branch:
1. Tạo nhánh: `git checkout -b feature/ten_feature` (Có rồi thì bỏ qua)
2. Khi muốn push code lên nhánh main, cập nhật nhánh main về nhánh feature (Nhánh main khi pull về bị confict thì sửa đã đừng cập nhật về nhánh mình vội)
    - `git checkout main` 
    - `git pull`
    - `git checkout feature/ten_feature`
    - `git rebase main` hoặc `git merge main` 
3. Cập nhật thay đổi staging: `git add .`
4. Commit thay đổi: `git commit -m "message"`
5. `git push`
6. Lên github tạo pull request để cập nhật main giống với nhánh của mình hiện tại
