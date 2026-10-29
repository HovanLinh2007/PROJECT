// js/dich-vu/luu-tru.js - Quản lý đọc và ghi dữ liệu vào localStorage
const KHOA_SAN_PHAM = "milo_danh_sach_san_pham";
const KHOA_GIO_HANG = "milo_gio_hang";
const KHOA_DON_HANG = "milo_danh_sach_don_hang";
const KHOA_NGUOI_DUNG = "milo_danh_sach_nguoi_dung";
const KHOA_NGUOI_DUNG_HIEN_TAI = "milo_nguoi_dung_hien_tai";

// 1. LẤY DANH SÁCH SẢN PHẨM
function layDanhSachSanPham() {
    const duLieu = localStorage.getItem(KHOA_SAN_PHAM);
    if (!duLieu) {
        if (typeof danhSachSanPhamBanDau !== 'undefined') {
            localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSachSanPhamBanDau));
            return danhSachSanPhamBanDau;
        }
        return [];
    }
    return JSON.parse(duLieu);
}

// 2. LẤY GIỎ HÀNG
function layGioHang() {
    const duLieu = localStorage.getItem(KHOA_GIO_HANG);
    return duLieu ? JSON.parse(duLieu) : [];
}

// 3. LƯU GIỎ HÀNG
function luuGioHang(gioHang) {
    localStorage.setItem(KHOA_GIO_HANG, JSON.stringify(gioHang));
}

// 4. LÀM SẠCH GIỎ HÀNG (KHI ĐẶT HÀNG XONG)
function xoaGioHang() {
    localStorage.removeItem(KHOA_GIO_HANG);
}

// 5. CẬP NHẬT LẠI DANH SÁCH SẢN PHẨM MẶC ĐỊNH
function capNhatLaiDanhSachMacDinh() {
    if (typeof danhSachSanPhamBanDau !== 'undefined') {
        localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSachSanPhamBanDau));
        location.reload();
    }
}
// 6. LẤY DANH SÁCH NGƯỜI DÙNG ĐÃ ĐĂNG KÝ
function layDanhSachNguoiDung() {
    const duLieu = localStorage.getItem(KHOA_NGUOI_DUNG);
    return duLieu ? JSON.parse(duLieu) : [];
}

// 7. LƯU DANH SÁCH NGƯỜI DÙNG
function luuDanhSachNguoiDung(dsNguoiDung) {
    localStorage.setItem(KHOA_NGUOI_DUNG, JSON.stringify(dsNguoiDung));
}

// 8. LẤY NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
function layNguoiDungHienTai() {
    const duLieu = localStorage.getItem(KHOA_NGUOI_DUNG_HIEN_TAI);
    return duLieu ? JSON.parse(duLieu) : null;
}

// 9. LƯU NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
function luuNguoiDungHienTai(nguoiDung) {
    localStorage.setItem(KHOA_NGUOI_DUNG_HIEN_TAI, JSON.stringify(nguoiDung));
}

// 10. ĐĂNG XUẤT NGƯỜI DÙNG
function dangXuatNguoiDung() {
    localStorage.removeItem(KHOA_NGUOI_DUNG_HIEN_TAI);
}
