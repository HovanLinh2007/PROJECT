// js/dich-vu/luu-tru.js - Quản lý đọc và ghi dữ liệu vào localStorage
const KHOA_SAN_PHAM = "milo_danh_sach_san_pham";
const KHOA_GIO_HANG = "milo_gio_hang";
const KHOA_DON_HANG = "danhSachDonHangMILO";
const KHOA_NGUOI_DUNG = "milo_danh_sach_nguoi_dung";
const KHOA_NGUOI_DUNG_HIEN_TAI = "milo_nguoi_dung_hien_tai";
const KHOA_GOP_Y = "milo_danh_sach_gop_y";
const URL_DU_LIEU_SAN_PHAM = new URL("../data/products.json", document.currentScript.src);
let danhSachSanPhamMacDinhPromise;

function taiDanhSachSanPhamMacDinh() {
    if (!danhSachSanPhamMacDinhPromise) {
        danhSachSanPhamMacDinhPromise = fetch(URL_DU_LIEU_SAN_PHAM)
            .then(function (phanHoi) {
                if (!phanHoi.ok) {
                    throw new Error(`Không thể tải dữ liệu sản phẩm: HTTP ${phanHoi.status}`);
                }
                return phanHoi.json();
            })
            .then(function (danhSach) {
                if (!Array.isArray(danhSach)) {
                    throw new Error("Dữ liệu sản phẩm phải là một mảng JSON.");
                }
                return danhSach;
            });
    }
    return danhSachSanPhamMacDinhPromise;
}
async function khoiTaoDanhSachSanPham() {
    const danhSachMacDinh = await taiDanhSachSanPhamMacDinh();
    if (!localStorage.getItem(KHOA_SAN_PHAM)) {
        luuDanhSachSanPham(danhSachMacDinh);
    }
    return layDanhSachSanPham();
}

// 1. LẤY DANH SÁCH SẢN PHẨM
function layDanhSachSanPham() {
    const duLieu = localStorage.getItem(KHOA_SAN_PHAM);
    if (!duLieu) return [];

    const danhSach = JSON.parse(duLieu);
    if (!Array.isArray(danhSach)) {
        throw new Error("Dữ liệu sản phẩm đã lưu không phải là một danh sách.");
    }
    return danhSach;
}

function luuDanhSachSanPham(danhSach) {
    if (!Array.isArray(danhSach)) {
        throw new TypeError("Danh sách sản phẩm phải là một mảng.");
    }
    localStorage.setItem(KHOA_SAN_PHAM, JSON.stringify(danhSach));
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
async function capNhatLaiDanhSachMacDinh() {
    const danhSachMacDinh = await taiDanhSachSanPhamMacDinh();
    luuDanhSachSanPham(danhSachMacDinh);
    location.reload();
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

function layDanhSachGopY() {
    const duLieu = localStorage.getItem(KHOA_GOP_Y);
    if (!duLieu) return [];

    const danhSach = JSON.parse(duLieu);
    if (!Array.isArray(danhSach)) {
        throw new Error("Dữ liệu góp ý đã lưu không phải là một danh sách.");
    }
    return danhSach;
}

function luuDanhSachGopY(danhSach) {
    if (!Array.isArray(danhSach)) {
        throw new TypeError("Danh sách góp ý phải là một mảng.");
    }
    localStorage.setItem(KHOA_GOP_Y, JSON.stringify(danhSach));
}
