// document.addEventListener('DOMContentLoaded', function () {
//     const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
//     const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
//     const formDangNhap = document.getElementById('form-dang-nhap');
//     const formDangKy = document.getElementById('form-dang-ky');

//     // Chuyển sang Tab Đăng Ký
//     if (btnTabDangKy) {
//         btnTabDangKy.addEventListener('click', function () {
//             btnTabDangKy.classList.add('active');
//             btnTabDangNhap.classList.remove('active');
            
//             formDangKy.classList.remove('an-form');
//             formDangNhap.classList.add('an-form');
//         });
//     }

//     // Chuyển sang Tab Đăng Nhập
//     if (btnTabDangNhap) {
//         btnTabDangNhap.addEventListener('click', function () {
//             btnTabDangNhap.classList.add('active');
//             btnTabDangKy.classList.remove('active');
            
//             formDangNhap.classList.remove('an-form');
//             formDangKy.classList.add('an-form');
//         });
//     }
// });

document.addEventListener('DOMContentLoaded', function () {
    const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
    const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');

    // 1. Chuyển sang Tab Đăng Ký 
    if (btnTabDangKy) {
        btnTabDangKy.addEventListener('click', function () {
            btnTabDangKy.classList.add('active');
            btnTabDangNhap.classList.remove('active');
            formDangKy.classList.remove('an-form');
            formDangNhap.classList.add('an-form');
        });
    }

    // 2. Chuyển sang Tab Đăng Nhập 
    if (btnTabDangNhap) {
        btnTabDangNhap.addEventListener('click', function () {
            btnTabDangNhap.classList.add('active');
            btnTabDangKy.classList.remove('active');
            formDangNhap.classList.remove('an-form');
            formDangKy.classList.add('an-form');
        });
    }

    const theDangNhap = document.getElementById('the-dang-nhap');
    const theUserInfo = document.getElementById('the-user-info');
    const tenNguoiDung = document.getElementById('ten-nguoi-dung');
    const nutDangXuat = document.getElementById('nut-dang-xuat');

    // Hàm kiểm tra và cập nhật giao diện tên người dùng
    function hienThiTenUser() {
        const tenDaLuu = localStorage.getItem('tenUser');
        if (tenDaLuu) {
            if (theDangNhap) theDangNhap.classList.add('an-form');
            if (theUserInfo) theUserInfo.classList.remove('an-form');
            if (tenNguoiDung) tenNguoiDung.textContent = 'Xin chào, ' + tenDaLuu;
        } else {
            if (theDangNhap) theDangNhap.classList.remove('an-form');
            if (theUserInfo) theUserInfo.classList.add('an-form');
        }
    }

    hienThiTenUser();

    // Xử lý khi bấm nút ĐĂNG NHẬP
    if (formDangNhap) {
        formDangNhap.addEventListener('submit', function (e) {
            e.preventDefault(); // Chặn tải lại trang
            const taiKhoan = document.getElementById('dn-tai-khoan').value;
            
            // Lấy tên từ tài khoản (hoặc gán tên mặc định)
            localStorage.setItem('tenUser', taiKhoan);
            alert('Đăng nhập thành công!');
            hienThiTenUser();
        });
    }

    //  ĐĂNG KÝ
    if (formDangKy) {
        formDangKy.addEventListener('submit', function (e) {
            e.preventDefault(); // Chặn tải lại trang
            const hoTen = document.getElementById('dk-ho-ten').value;
            
            localStorage.setItem('tenUser', hoTen);
            alert('Đăng ký tài khoản thành công!');
            hienThiTenUser();
        });
    }

    // ĐĂNG XUẤT
    if (nutDangXuat) {
        nutDangXuat.addEventListener('click', function () {
            localStorage.removeItem('tenUser'); // Xóa tên đã lưu
            alert('Đã đăng xuất!');
            hienThiTenUser();
        });
    }
});