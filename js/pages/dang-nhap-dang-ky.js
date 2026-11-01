

document.addEventListener('DOMContentLoaded', function () {
    const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
    const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');

    hienThiTaiKhoanHeader();
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

    // Chỉ đăng nhập thành công khi tài khoản và mật khẩu khớp tài khoản đã đăng ký.
    if (formDangNhap) {
        formDangNhap.addEventListener('submit', function (e) {
            e.preventDefault();
            const taiKhoan = document.getElementById('dn-tai-khoan').value.trim();
            const matKhau = document.getElementById('dn-mat-khau').value;
            const danhSachNguoiDung = layDanhSachNguoiDung();
            const nguoiDung = danhSachNguoiDung.find(function (user) {
                return user.taiKhoan === taiKhoan && user.matKhau === matKhau;
            });

            if (!nguoiDung) {
                alert('Tài khoản hoặc mật khẩu không đúng.');
                return;
            }

            luuNguoiDungHienTai({
                hoTen: nguoiDung.hoTen,
                taiKhoan: nguoiDung.taiKhoan
            });
            alert('Đăng nhập thành công!');
            window.location.href = 'trang-chu.html';
        });
    }
    // Đăng ký chỉ lưu tài khoản; người dùng cần đăng nhập riêng.
    if (formDangKy) {
        formDangKy.addEventListener('submit', function (e) {
            e.preventDefault();
            const hoTen = document.getElementById('dk-ho-ten').value.trim();
            const taiKhoan = document.getElementById('dk-tai-khoan').value.trim();
            const matKhau = document.getElementById('dk-mat-khau').value;
            const danhSachNguoiDung = layDanhSachNguoiDung();

            if (danhSachNguoiDung.some(function (user) {
                return user.taiKhoan === taiKhoan;
            })) {
                alert('Tài khoản này đã được đăng ký.');
                return;
            }

            danhSachNguoiDung.push({ hoTen, taiKhoan, matKhau });
            luuDanhSachNguoiDung(danhSachNguoiDung);
            alert('Đăng ký thành công. Vui lòng đăng nhập.');

            document.getElementById('dn-tai-khoan').value = taiKhoan;
            document.getElementById('dn-mat-khau').value = '';
            if (btnTabDangNhap) btnTabDangNhap.click();
        });
    }
});
document.addEventListener('siteComponentsLoaded', hienThiTaiKhoanHeader);

function hienThiTaiKhoanHeader() {
    const nguoiDung = layNguoiDungHienTai();
    const nutTaiKhoan = document.getElementById('nut-tai-khoan');
    const nutDangXuat = document.getElementById('nut-dang-xuat-header');

    if (nutTaiKhoan) {
        if (nguoiDung) {
            nutTaiKhoan.textContent = `Xin chào, ${nguoiDung.hoTen}`;
            nutTaiKhoan.href = 'theo-don-don-hang1.html';
        } else {
            nutTaiKhoan.textContent = 'Đăng nhập';
            nutTaiKhoan.href = 'dang-nhap.html';
        }
    }

    if (nutDangXuat) {
        nutDangXuat.hidden = !nguoiDung;
        if (nutDangXuat.dataset.listenerAttached !== 'true') {
            nutDangXuat.addEventListener('click', function () {
                dangXuatNguoiDung();
                hienThiTaiKhoanHeader();
            });
            nutDangXuat.dataset.listenerAttached = 'true';
        }
    }
}