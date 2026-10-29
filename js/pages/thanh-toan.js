// js/pages/thanh-toan.js - Xử lý thanh toán đơn hàng MILO TEA an toàn 100%

document.addEventListener("DOMContentLoaded", function() {
    hienThiTomTatDonHang();
});

// Hàm lấy giỏ hàng an toàn tự thân
function layGioHangAnToan() {
    try {
        if (typeof layGioHang === "function") {
            let gh = layGioHang();
            if (gh) return gh;
        }
        let data = localStorage.getItem("gioHangMILO") || localStorage.getItem("gioHang") || "[]";
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Hàm lưu giỏ hàng an toàn
function luuGioHangAnToan(data) {
    if (typeof luuGioHang === "function") {
        luuGioHang(data);
    } else {
        localStorage.setItem("gioHangMILO", JSON.stringify(data));
        localStorage.setItem("gioHang", JSON.stringify(data));
    }
}

// 1. Hiển thị tóm tắt danh sách các món ĐƯỢC CHỌN thanh toán
function hienThiTomTatDonHang() {
    const gioHang = layGioHangAnToan();
    
    // Lọc ra danh sách các món được chọn (daChon !== false)
    const danhSachThanhToan = gioHang.filter(item => item && item.daChon !== false);
    const khungTomTat = document.getElementById("tom-tat-don-hang");

    if (!khungTomTat) return;

    // Nếu không có món nào được chọn, cảnh báo và quay về giỏ hàng
    if (danhSachThanhToan.length === 0) {
        alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
        window.location.href = "gio-hang.html";
        return;
    }

    let tamTinh = 0;
    let html = `<h3>Tóm Tắt Đơn Hàng (${danhSachThanhToan.length} món)</h3><ul class="danh-sach-mon-tt" style="list-style:none; padding:0;">`;

    danhSachThanhToan.forEach(item => {
        const donGia = Number(item.donGia || item.gia || item.price || 0);
        const soLuong = Number(item.soLuong || item.quantity || 1);
        const thanhTienMon = Number(item.thanhTien) || (donGia * soLuong);
        tamTinh += thanhTienMon;

        html += `
            <li style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                <span><strong>${item.tenSanPham || item.ten || item.name}</strong> (x${soLuong})</span>
                <span>${typeof dinhDangTienTe === "function" ? dinhDangTienTe(thanhTienMon) : thanhTienMon.toLocaleString('vi-VN') + " đ"}</span>
            </li>
        `;
    });

    const phiGiaoHang = 15000;
    const tongThanhToan = tamTinh + phiGiaoHang;

    html += `
        </ul>
        <hr style="border:none; border-top:1px solid #eee; margin:15px 0;">
        <p>Tạm tính: <strong>${typeof dinhDangTienTe === "function" ? dinhDangTienTe(tamTinh) : tamTinh.toLocaleString('vi-VN') + " đ"}</strong></p>
        <p>Phí giao hàng: <strong>${typeof dinhDangTienTe === "function" ? dinhDangTienTe(phiGiaoHang) : phiGiaoHang.toLocaleString('vi-VN') + " đ"}</strong></p>
        <h4>Tổng cộng: <span style="color:var(--mau-nau-dam, #4a2c11); font-size:20px;">${typeof dinhDangTienTe === "function" ? dinhDangTienTe(tongThanhToan) : tongThanhToan.toLocaleString('vi-VN') + " đ"}</span></h4>
    `;

    khungTomTat.innerHTML = html;
}

// 2. Xử lý khi nhấn nút "Đặt hàng ngay"
function xuLyDatHang(event) {
    event.preventDefault(); // Chống reload trang mặc định

    const hoTen = document.getElementById("ho-ten")?.value.trim();
    const soDienThoai = document.getElementById("so-dien-thoai")?.value.trim();
    const diaChi = document.getElementById("dia-chi")?.value.trim();
    const ghiChu = document.getElementById("ghi-chu")?.value.trim() || "";
    const phuongThucTT = document.getElementById("phuong-thuc-tt")?.value || "COD";

    if (!hoTen || !soDienThoai || !diaChi) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    let gioHang = layGioHangAnToan();

    // Phân loại món mua và món giữ lại
    const danhSachMua = gioHang.filter(item => item && item.daChon !== false);
    const gioHangConLai = gioHang.filter(item => item && item.daChon === false);

    if (danhSachMua.length === 0) {
        alert("Không có sản phẩm nào được chọn để thanh toán!");
        return;
    }

    // Tính tổng tiền đơn hàng
    let tamTinh = 0;
    danhSachMua.forEach(item => {
        const donGia = Number(item.donGia || item.gia || item.price || 0);
        const soLuong = Number(item.soLuong || item.quantity || 1);
        tamTinh += (Number(item.thanhTien) || (donGia * soLuong));
    });
    const tongTien = tamTinh + 15000;

    // A. Lưu thông tin đơn hàng vào Lịch sử đơn hàng
    const donHangMoi = {
        maDon: "MILO" + Math.floor(100000 + Math.random() * 900000),
        hoTen: hoTen,
        soDienThoai: soDienThoai,
        diaChi: diaChi,
        ghiChu: ghiChu,
        phuongThucTT: phuongThucTT,
        danhSachMon: danhSachMua,
        tongTien: tongTien,
        trangThai: "Đang chuẩn bị hàng",
        ngayDat: new Date().toLocaleString("vi-VN")
    };

    let dsDonHang = JSON.parse(localStorage.getItem("danhSachDonHangMILO")) || [];
    dsDonHang.unshift(donHangMoi);
    localStorage.setItem("danhSachDonHangMILO", JSON.stringify(dsDonHang));

    // B. Cập nhật lại Giỏ hàng (chỉ giữ món chưa chọn)
    luuGioHangAnToan(gioHangConLai);

    // C. Cập nhật Badge trên Header
    if (typeof capNhatSoLuongGioHangHeader === "function") {
        capNhatSoLuongGioHangHeader();
    } else if (typeof capNhatGioHangHeader === "function") {
        capNhatGioHangHeader();
    }

    // D. Thông báo và chuyển hướng
    if (gioHangConLai.length > 0) {
        alert(`🎉 Đặt hàng thành công! Giỏ hàng của bạn còn lại ${gioHangConLai.length} sản phẩm chưa thanh toán.`);
        window.location.href = "gio-hang.html";
    } else {
        alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đã được ghi nhận.");
        // Chuyển hướng thẳng về Trang chủ để tránh lỗi Cannot GET trang theo dõi đơn nếu chưa tạo
        window.location.href = "trang-chu.html";
    }
}