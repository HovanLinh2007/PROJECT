// js/pages/san-pham.js - Xử lý Thực đơn, Tìm kiếm & Lọc sản phẩm

// 1. TẢI VÀ HIỂN THỊ DỮ LIỆU BAN ĐẦU
document.addEventListener("DOMContentLoaded", async function () {
    try {
        if (typeof khoiTaoDanhSachSanPham === 'function') {
            await khoiTaoDanhSachSanPham();
        }
        const dsBanDau = typeof layDanhSachSanPham === 'function' ? layDanhSachSanPham() : [];
        hienThiThucDon(dsBanDau);
    } catch (error) {
        console.error("Không thể tải dữ liệu sản phẩm:", error);
        const khung = document.getElementById("danh-sach-san-pham-thuc-don");
        if (khung) khung.textContent = "Không thể tải danh sách sản phẩm.";
    }
});

// Lắng nghe sự thay đổi của localStorage nếu có chỉnh sửa từ trang khác
window.addEventListener("storage", function (event) {
    const khoaSPham = typeof KHOA_SAN_PHAM !== 'undefined' ? KHOA_SAN_PHAM : "KHOA_SAN_PHAM";
    if (event.key === khoaSPham) {
        try {
            const dsCapNhat = typeof layDanhSachSanPham === 'function' ? layDanhSachSanPham() : [];
            hienThiThucDon(dsCapNhat);
        } catch (error) {
            console.error("Không thể cập nhật danh mục:", error);
        }
    }
});

// 2. HÀM CHUYỂN ĐỔI CHỮ CÓ DẤU THÀNH KHÔNG DẤU (Dùng cho Tìm kiếm)
function xoaDauTiengViet(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d");
}

// 3. HÀM HIỂN THỊ DANH SÁCH SẢN PHẨM RA MÀN HÌNH
function hienThiThucDon(danhSach) {
    const khung = document.getElementById("danh-sach-san-pham-thuc-don");
    if (!khung) return;

    if (!danhSach || danhSach.length === 0) {
        khung.innerHTML = "<p style='grid-column: 1/-1; text-align:center; font-size: 16px; padding: 40px 0; color: #777;'>Không tìm thấy sản phẩm nào phù hợp.</p>";
        return;
    }

    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    let html = "";

    danhSach.forEach(function (sp) {
        const ma = sp.maSanPham || sp.id;
        const ten = sp.tenSanPham || sp.ten || "Trà sữa MILO";
        const anh = sp.hinhAnh || sp.hinh || anhMacDinh;
        const gia = sp.giaSizeM || sp.gia || 30000;

        html += `
            <div class="the-san-pham-td">
                <img src="${anh}" alt="${ten}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                <h3>${ten}</h3>
                <p class="gia">${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(gia) : gia.toLocaleString('vi-VN') + 'đ'}</p>
                <button type="button" class="nut-bam" onclick="hienThiChiTietModal('${ma}')">Tùy chọn & Đặt món</button>
            </div>
        `;
    });
    khung.innerHTML = html;
}

// 4. HÀM LỌC VÀ TÌM KIẾM SẢN PHẨM (Kích hoạt khi gõ vào ô tìm kiếm hoặc đổi select)
function xuLyBoLoc() {
    let danhSach = typeof layDanhSachSanPham === 'function' ? layDanhSachSanPham() : [];

    const oTimKiem = document.getElementById("o-tim-kiem");
    const oLocDanhMuc = document.getElementById("loc-danh-muc");
    const oSapXepGia = document.getElementById("sap-xep-gia");

    const tuKhoaRaw = oTimKiem ? oTimKiem.value.trim() : "";
    const tuKhoaKhongDau = xoaDauTiengViet(tuKhoaRaw);

    const danhMuc = oLocDanhMuc ? oLocDanhMuc.value : "tat-ca";
    const sapXep = oSapXepGia ? oSapXepGia.value : "mac-dinh";

    // Bước 1: Lọc theo từ khóa tìm kiếm (so sánh cả có dấu lẫn không dấu)
    if (tuKhoaKhongDau !== "") {
        danhSach = danhSach.filter(function (sp) {
            const tenGoc = sp.tenSanPham || sp.ten || sp.tenSP || "";
            const tenKhongDau = xoaDauTiengViet(tenGoc);
            return tenKhongDau.includes(tuKhoaKhongDau);
        });
    }

    // Bước 2: Lọc theo danh mục
    if (danhMuc !== "tat-ca") {
        danhSach = danhSach.filter(function (sp) {
            return sp.danhMuc === danhMuc || sp.category === danhMuc;
        });
    }
    // Bước 3: Sắp xếp theo giá
    if (sapXep === "tang-dan") {
        danhSach.sort((a, b) => (a.giaSizeM || a.gia) - (b.giaSizeM || b.gia));
    } else if (sapXep === "giam-dan") {
        danhSach.sort((a, b) => (b.giaSizeM || b.gia) - (a.giaSizeM || a.gia));
    }

    // Render lại giao diện danh sách sau khi lọc
    hienThiThucDon(danhSach);
}

// 5. HÀM ĐÓNG POPUP MODAL
function dongModal() {
    const khung = document.getElementById("khung-chi-tiet-san-pham");
    if (khung) khung.innerHTML = "";
}