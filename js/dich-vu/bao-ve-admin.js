(function () {
    const KHOA_NGUOI_DUNG_HIEN_TAI = 'milo_nguoi_dung_hien_tai';
    let nguoiDung = null;

    try {
        const duLieu = localStorage.getItem(KHOA_NGUOI_DUNG_HIEN_TAI);
        nguoiDung = duLieu ? JSON.parse(duLieu) : null;
    } catch (error) {
        console.error('Không thể kiểm tra phiên quản trị.', error);
    }

    window.miloAdminDaXacThuc = Boolean(nguoiDung && nguoiDung.vaiTro === 'admin');
    if (!window.miloAdminDaXacThuc) {
        window.location.replace('./dang-nhap.html');
    }
})();

function dangXuatAdmin() {
    localStorage.removeItem('milo_nguoi_dung_hien_tai');
    window.location.replace('./dang-nhap.html');
}
