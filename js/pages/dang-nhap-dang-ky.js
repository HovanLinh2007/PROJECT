// // document.addEventListener('DOMContentLoaded', function () {
// //     const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
// //     const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
// //     const formDangNhap = document.getElementById('form-dang-nhap');
// //     const formDangKy = document.getElementById('form-dang-ky');

// //     // Chuyển sang Tab Đăng Ký
// //     if (btnTabDangKy) {
// //         btnTabDangKy.addEventListener('click', function () {
// //             btnTabDangKy.classList.add('active');
// //             btnTabDangNhap.classList.remove('active');
            
// //             formDangKy.classList.remove('an-form');
// //             formDangNhap.classList.add('an-form');
// //         });
// //     }

// //     // Chuyển sang Tab Đăng Nhập
// //     if (btnTabDangNhap) {
// //         btnTabDangNhap.addEventListener('click', function () {
// //             btnTabDangNhap.classList.add('active');
// //             btnTabDangKy.classList.remove('active');
            
// //             formDangNhap.classList.remove('an-form');
// //             formDangKy.classList.add('an-form');
// //         });
// //     }
// // });

// document.addEventListener('DOMContentLoaded', function () {
//     const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
//     const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
//     const formDangNhap = document.getElementById('form-dang-nhap');
//     const formDangKy = document.getElementById('form-dang-ky');

//     // 1. Chuyển sang Tab Đăng Ký 
//     if (btnTabDangKy) {
//         btnTabDangKy.addEventListener('click', function () {
//             btnTabDangKy.classList.add('active');
//             btnTabDangNhap.classList.remove('active');
//             formDangKy.classList.remove('an-form');
//             formDangNhap.classList.add('an-form');
//         });
//     }

//     // 2. Chuyển sang Tab Đăng Nhập 
//     if (btnTabDangNhap) {
//         btnTabDangNhap.addEventListener('click', function () {
//             btnTabDangNhap.classList.add('active');
//             btnTabDangKy.classList.remove('active');
//             formDangNhap.classList.remove('an-form');
//             formDangKy.classList.add('an-form');
//         });
//     }

//     const theDangNhap = document.getElementById('the-dang-nhap');
//     const theUserInfo = document.getElementById('the-user-info');
//     const tenNguoiDung = document.getElementById('ten-nguoi-dung');
//     const nutDangXuat = document.getElementById('nut-dang-xuat');

//     // Hàm kiểm tra và cập nhật giao diện tên người dùng
//     function hienThiTenUser() {
//         const tenDaLuu = localStorage.getItem('tenUser');
//         if (tenDaLuu) {
//             if (theDangNhap) theDangNhap.classList.add('an-form');
//             if (theUserInfo) theUserInfo.classList.remove('an-form');
//             if (tenNguoiDung) tenNguoiDung.textContent = 'Xin chào, ' + tenDaLuu;
//         } else {
//             if (theDangNhap) theDangNhap.classList.remove('an-form');
//             if (theUserInfo) theUserInfo.classList.add('an-form');
//         }
//     }

//     hienThiTenUser();

//     // Xử lý khi bấm nút ĐĂNG NHẬP
//     if (formDangNhap) {
//         formDangNhap.addEventListener('submit', function (e) {
//             e.preventDefault(); // Chặn tải lại trang
//             const taiKhoan = document.getElementById('dn-tai-khoan').value;
            
//             // Lấy tên từ tài khoản (hoặc gán tên mặc định)
//             localStorage.setItem('tenUser', taiKhoan);
//             alert('Đăng nhập thành công!');
//             hienThiTenUser();
//         });
//     }

//     //  ĐĂNG KÝ
//     if (formDangKy) {
//         formDangKy.addEventListener('submit', function (e) {
//             e.preventDefault(); // Chặn tải lại trang
//             const hoTen = document.getElementById('dk-ho-ten').value;
            
//             localStorage.setItem('tenUser', hoTen);
//             alert('Đăng ký tài khoản thành công!');
//             hienThiTenUser();
//         });
//     }

//     // ĐĂNG XUẤT
//     if (nutDangXuat) {
//         nutDangXuat.addEventListener('click', function () {
//             localStorage.removeItem('tenUser'); // Xóa tên đã lưu
//             alert('Đã đăng xuất!');
//             hienThiTenUser();
//         });
//     }
// });

// js/pages/dang-nhap.js - Xử lý chuyển Tab, Đăng Ký và Đăng Nhập

document.addEventListener('DOMContentLoaded', function () {
    const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
    const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');

    // 1. Chuyển sang Tab Đăng Ký
    if (btnTabDangKy) {
        btnTabDangKy.addEventListener('click', function () {
            btnTabDangKy.classList.add('active');
            if (btnTabDangNhap) btnTabDangNhap.classList.remove('active');
            
            if (formDangKy) formDangKy.classList.remove('an-form');
            if (formDangNhap) formDangNhap.classList.add('an-form');
        });
    }

    // 2. Chuyển sang Tab Đăng Nhập
    if (btnTabDangNhap) {
        btnTabDangNhap.addEventListener('click', function () {
            btnTabDangNhap.classList.add('active');
            if (btnTabDangKy) btnTabDangKy.classList.remove('active');
            
            if (formDangNhap) formDangNhap.classList.remove('an-form');
            if (formDangKy) formDangKy.classList.add('an-form');
        });
    }

    // 3. Xử lý Form Đăng Ký
    if (formDangKy) {
        formDangKy.addEventListener('submit', function (e) {
            e.preventDefault();

            const hoTen = document.getElementById('dk-ho-ten')?.value.trim();
            const taiKhoan = document.getElementById('dk-tai-khoan')?.value.trim();
            const matKhau = document.getElementById('dk-mat-khau')?.value.trim();

            if (!hoTen || !taiKhoan || !matKhau) {
                alert('Vui lòng điền đầy đủ thông tin đăng ký!');
                return;
            }

            // Đọc danh sách người dùng từ luu-tru.js
            let dsNguoiDung = layDanhSachNguoiDung();

            // Kiểm tra trùng SĐT/Email
            const isTonTai = dsNguoiDung.some(u => u.taiKhoan === taiKhoan);
            if (isTonTai) {
                alert('Số điện thoại hoặc Email này đã được đăng ký!');
                return;
            }

            // Tạo đối tượng tài khoản mới
            const nguoiDungMoi = {
                id: 'USER_' + Date.now(),
                hoTen: hoTen,
                taiKhoan: taiKhoan,
                matKhau: matKhau,
                ngayTao: new Date().toLocaleDateString('vi-VN')
            };

            dsNguoiDung.push(nguoiDungMoi);
            luuDanhSachNguoiDung(dsNguoiDung);

            alert('🎉 Đăng ký tài khoản thành công! Hãy đăng nhập ngay.');

            // Reset form và chuyển tab
            formDangKy.reset();
            if (btnTabDangNhap) btnTabDangNhap.click();
            
            const dnTaiKhoan = document.getElementById('dn-tai-khoan');
            if (dnTaiKhoan) dnTaiKhoan.value = taiKhoan;
        });
    }

    // 4. Xử lý Form Đăng Nhập
    if (formDangNhap) {
        formDangNhap.addEventListener('submit', function (e) {
            e.preventDefault();

            const taiKhoan = document.getElementById('dn-tai-khoan')?.value.trim();
            const matKhau = document.getElementById('dn-mat-khau')?.value.trim();

            if (!taiKhoan || !matKhau) {
                alert('Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!');
                return;
            }

            // Đọc danh sách và xác thực thông tin
            const dsNguoiDung = layDanhSachNguoiDung();
            const userKhop = dsNguoiDung.find(u => u.taiKhoan === taiKhoan && u.matKhau === matKhau);

            if (!userKhop) {
                alert('❌ Tài khoản hoặc mật khẩu không chính xác!');
                return;
            }

            // Lưu người dùng đang đăng nhập
            luuNguoiDungHienTai({
                id: userKhop.id,
                hoTen: userKhop.hoTen,
                taiKhoan: userKhop.taiKhoan
            });

            alert(`🎉 Chúc mừng ${userKhop.hoTen} đã đăng nhập thành công!`);
            window.location.href = 'trang-chu.html';
        });
    }
});