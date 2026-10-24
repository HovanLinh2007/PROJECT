// luu-tru.js - Quan ly doc va ghi du lieu vao localStorage
const KHOA_SAN_PHAM = "milo_danh_sach_san_pham";
const KHOA_GIO_HANG = "milo_gio_hang";
const KHOA_DON_HANG = "milo_danh_sach_don_hang";
const KHOA_NGUOI_DUNG = "milo_danh_sach_nguoi_dung";

function layDanhSachSanPham() {
    const duLieu = localStorage.getItem(KHOA_SAN_PHAM);
    if (!duLieu) {
        // Neu chua co trong localStorage, luu danh sach ban dau tu products.js
        localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSachSanPhamBanDau));
        return danhSachSanPhamBanDau;
    }
    return JSON.parse(duLieu);
}

function layGioHang() {
    const duLieu = localStorage.getItem(KHOA_GIO_HANG);
    return duLieu ? JSON.parse(duLieu) : [];
}

function luuGioHang(gioHang) {
    localStorage.setItem(KHOA_GIO_HANG, JSON.stringify(gioHang));
}
// luu-tru.js
function layDanhSachSanPham() {
    // Neu muon xoa du lieu cu va dung du lieu moi trong products.js:
    const duLieu = localStorage.getItem(KHOA_SAN_PHAM);
    if (!duLieu) {
        localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSachSanPhamBanDau));
        return danhSachSanPhamBanDau;
    }
    return JSON.parse(duLieu);
}

// Hàm bổ sung giúp làm sạch bộ nhớ sản phẩm khi cần
function capNhatLaiDanhSachMacDinh() {
    localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSachSanPhamBanDau));
    location.reload();
}