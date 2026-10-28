document.addEventListener('DOMContentLoaded', function () {
    const btnTabDangNhap = document.getElementById('btn-tab-dang-nhap');
    const btnTabDangKy = document.getElementById('btn-tab-dang-ky');
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');

    // Chuyển sang Tab Đăng Ký
    if (btnTabDangKy) {
        btnTabDangKy.addEventListener('click', function () {
            btnTabDangKy.classList.add('active');
            btnTabDangNhap.classList.remove('active');
            
            formDangKy.classList.remove('an-form');
            formDangNhap.classList.add('an-form');
        });
    }

    // Chuyển sang Tab Đăng Nhập
    if (btnTabDangNhap) {
        btnTabDangNhap.addEventListener('click', function () {
            btnTabDangNhap.classList.add('active');
            btnTabDangKy.classList.remove('active');
            
            formDangNhap.classList.remove('an-form');
            formDangKy.classList.add('an-form');
        });
    }
});