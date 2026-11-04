// Lưu lại các món còn trong giỏ hàng.
function luuGioHangAnToan(gioHang) {
    if (typeof luuGioHang === "function") {
        luuGioHang(gioHang);
        return;
    }

    localStorage.setItem("gioHangMILO", JSON.stringify(gioHang));
    localStorage.setItem("gioHang", JSON.stringify(gioHang));
}

// Lấy các đơn hàng đã đặt trước đó.
function layDanhSachDonHangAnToan() {
    const duLieu = localStorage.getItem(KHOA_DON_HANG);
    return JSON.parse(duLieu || "[]");
}

// Đơn đầu tiên được tính theo tài khoản hoặc số điện thoại.
function laDonHangDauTienCuaNguoiDung(nguoiDung, soDienThoai) {
    const taiKhoan = nguoiDung && nguoiDung.taiKhoan
        ? String(nguoiDung.taiKhoan).trim()
        : "";
    const soDienThoaiDatHang = String(soDienThoai || "").trim();
    const danhSachDonHang = layDanhSachDonHangAnToan();

    for (let i = 0; i < danhSachDonHang.length; i++) {
        const donHang = danhSachDonHang[i];
        const taiKhoanDonHang = String(donHang.taiKhoan || "").trim();
        const soDienThoaiDonHang = String(donHang.soDienThoai || "").trim();

        if (taiKhoan && taiKhoanDonHang === taiKhoan) {
            return false;
        }
        if (taiKhoan && soDienThoaiDonHang === taiKhoan) {
            return false;
        }
        if (soDienThoaiDatHang && soDienThoaiDonHang === soDienThoaiDatHang) {
            return false;
        }
    }

    return true;
}

// Tạo danh sách món để lưu vào đơn hàng, có áp dụng giảm giá nếu đủ điều kiện.
function taoDanhSachMonDatHang(danhSachMon, apDungGiamGia) {
    const danhSachMonMoi = [];
    const tyLeGiamGia = 0.2;

    for (let i = 0; i < danhSachMon.length; i++) {
        const mon = danhSachMon[i];
        const donGia = Number(mon.donGia || mon.gia || mon.price || 0);
        const soLuong = Number(mon.soLuong || mon.quantity || 1);
        const thanhTienGoc = Number(mon.thanhTien) || donGia * soLuong;
        let thanhTien = thanhTienGoc;

        if (apDungGiamGia) {
            thanhTien = Math.round(thanhTienGoc * (1 - tyLeGiamGia));
        }

        const monMoi = Object.assign({}, mon);
        monMoi.thanhTien = thanhTien;

        if (apDungGiamGia) {
            monMoi.thanhTienGoc = thanhTienGoc;
        }

        danhSachMonMoi.push(monMoi);
    }

    return danhSachMonMoi;
}

// Định dạng số tiền để hiển thị trên trang.
function hienThiTien(soTien) {
    if (typeof dinhDangTienTe === "function") {
        return dinhDangTienTe(soTien);
    }
    return soTien.toLocaleString("vi-VN") + " đ";
}

function layNguoiDungDangNhap() {
    if (typeof layNguoiDungHienTai === "function") {
        return layNguoiDungHienTai();
    }
    return JSON.parse(localStorage.getItem("milo_nguoi_dung_hien_tai") || "null");
}

// Hiển thị các món được chọn và số tiền cần thanh toán.
function hienThiTomTatDonHang() {
    const gioHang = layGioHang();
    const danhSachThanhToan = [];
    const khungTomTat = document.getElementById("tom-tat-don-hang");

    if (!khungTomTat) {
        return;
    }

    for (let i = 0; i < gioHang.length; i++) {
        if (gioHang[i] && gioHang[i].daChon !== false) {
            danhSachThanhToan.push(gioHang[i]);
        }
    }

    if (danhSachThanhToan.length === 0) {
        alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
        window.location.href = "gio-hang.html";
        return;
    }

    const nguoiDung = layNguoiDungDangNhap();
    const oSoDienThoai = document.getElementById("so-dien-thoai");
    let soDienThoai = "";

    if (oSoDienThoai) {
        soDienThoai = oSoDienThoai.value.trim();
    }

    const apDungGiamGia = nguoiDung
        && laDonHangDauTienCuaNguoiDung(nguoiDung, soDienThoai);
    const danhSachMonDatHang = taoDanhSachMonDatHang(danhSachThanhToan, apDungGiamGia);
    let tamTinhGoc = 0;
    let tongGiamGia = 0;
    let html = `<h3>Tóm Tắt Đơn Hàng (${danhSachThanhToan.length} món)</h3>`;
    html += `<ul class="danh-sach-mon-tt" style="list-style:none; padding:0;">`;

    for (let i = 0; i < danhSachMonDatHang.length; i++) {
        const mon = danhSachMonDatHang[i];
        const soLuong = Number(mon.soLuong || mon.quantity || 1);
        const thanhTienMon = Number(mon.thanhTien) || 0;
        const thanhTienGoc = Number(mon.thanhTienGoc) || thanhTienMon;
        const tenMon = mon.tenSanPham || mon.ten || mon.name;

        tamTinhGoc += thanhTienGoc;
        tongGiamGia += thanhTienGoc - thanhTienMon;

        html += `<li style="display:flex; justify-content:space-between; margin-bottom:10px;">`;
        html += `<span><strong>${tenMon}</strong> (x${soLuong})</span><span>`;

        if (mon.thanhTienGoc) {
            html += `<del>${hienThiTien(thanhTienGoc)}</del> `;
        }

        html += `<strong>${hienThiTien(thanhTienMon)}</strong></span></li>`;
    }

    const phiGiaoHang = 15000;
    const tongThanhToan = tamTinhGoc - tongGiamGia + phiGiaoHang;

    html += `</ul><hr style="border:none; border-top:1px solid #eee; margin:15px 0;">`;
    html += `<p>Tạm tính: <strong>${hienThiTien(tamTinhGoc)}</strong></p>`;

    if (tongGiamGia > 0) {
        html += `<p>Ưu đãi đơn đầu tiên (20%): `;
        html += `<strong style="color:#e74c3c;">-${hienThiTien(tongGiamGia)}</strong></p>`;
    }

    html += `<p>Phí giao hàng: <strong>${hienThiTien(phiGiaoHang)}</strong></p>`;
    html += `<h4>Tổng cộng: <span style="color:var(--mau-nau-dam, #4a2c11); font-size:20px;">`;
    html += `${hienThiTien(tongThanhToan)}</span></h4>`;
    khungTomTat.innerHTML = html;
}

// Xử lý khi khách bấm nút "Đặt hàng ngay".
function xuLyDatHang(event) {
    event.preventDefault();

    const oHoTen = document.getElementById("ho-ten");
    const oSoDienThoai = document.getElementById("so-dien-thoai");
    const oDiaChi = document.getElementById("dia-chi");
    const oGhiChu = document.getElementById("ghi-chu");
    const oPhuongThuc = document.getElementById("phuong-thuc-tt");

    const hoTen = oHoTen ? oHoTen.value.trim() : "";
    const soDienThoai = oSoDienThoai ? oSoDienThoai.value.trim() : "";
    const diaChi = oDiaChi ? oDiaChi.value.trim() : "";
    const ghiChu = oGhiChu ? oGhiChu.value.trim() : "";
    const phuongThucTT = oPhuongThuc ? oPhuongThuc.value : "COD";

    if (!hoTen || !soDienThoai || !diaChi) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    const gioHang = layGioHang();
    const danhSachMua = [];
    const gioHangConLai = [];

    for (let i = 0; i < gioHang.length; i++) {
        const mon = gioHang[i];
        if (!mon) {
            continue;
        }

        if (mon.daChon === false) {
            gioHangConLai.push(mon);
        } else {
            danhSachMua.push(mon);
        }
    }

    if (danhSachMua.length === 0) {
        alert("Không có sản phẩm nào được chọn để thanh toán!");
        return;
    }

    const nguoiDung = layNguoiDungDangNhap();
    const apDungGiamGia = nguoiDung
        && laDonHangDauTienCuaNguoiDung(nguoiDung, soDienThoai);
    const danhSachMonDatHang = taoDanhSachMonDatHang(danhSachMua, apDungGiamGia);
    let tamTinh = 0;
    let tongGiamGia = 0;

    for (let i = 0; i < danhSachMonDatHang.length; i++) {
        const mon = danhSachMonDatHang[i];
        const thanhTien = Number(mon.thanhTien) || 0;
        const thanhTienGoc = Number(mon.thanhTienGoc) || thanhTien;
        tamTinh += thanhTienGoc;
        tongGiamGia += thanhTienGoc - thanhTien;
    }

    const tongTien = tamTinh - tongGiamGia + 15000;
    const donHangMoi = {
        maDon: "MILO" + Math.floor(100000 + Math.random() * 900000),
        hoTen: hoTen,
        soDienThoai: soDienThoai,
        diaChi: diaChi,
        ghiChu: ghiChu,
        phuongThucTT: phuongThucTT,
        danhSachMon: danhSachMonDatHang,
        tamTinh: tamTinh,
        giamGia: tongGiamGia,
        apDungGiamGiaLanDau: tongGiamGia > 0,
        tongTien: tongTien,
        trangThai: "cho_xac_nhan",
        ngayDat: new Date().toLocaleString("vi-VN")
    };

    if (nguoiDung && nguoiDung.taiKhoan) {
        donHangMoi.taiKhoan = nguoiDung.taiKhoan;
    }

    const danhSachDonHang = layDanhSachDonHangAnToan();
    danhSachDonHang.unshift(donHangMoi);
    localStorage.setItem(KHOA_DON_HANG, JSON.stringify(danhSachDonHang));

    luuGioHangAnToan(gioHangConLai);

    if (typeof capNhatSoLuongGioHangHeader === "function") {
        capNhatSoLuongGioHangHeader();
    } else if (typeof capNhatGioHangHeader === "function") {
        capNhatGioHangHeader();
    }

    if (gioHangConLai.length > 0) {
        alert(`🎉 Đặt hàng thành công! Giỏ hàng của bạn còn lại ${gioHangConLai.length} sản phẩm chưa thanh toán.`);
        window.location.href = "gio-hang.html";
    } else {
        alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đã được ghi nhận.");
        window.location.href = "trang-chu.html";
    }
}

// Điền tên và số điện thoại từ tài khoản đã đăng nhập.
document.addEventListener("DOMContentLoaded", function () {
    const nguoiDung = layNguoiDungDangNhap();

    if (!nguoiDung) {
        alert("Vui lòng đăng nhập để thực hiện thanh toán!");
        window.location.href = "dang-nhap.html";
        return;
    }

    const oHoTen = document.getElementById("ho-ten");
    const oSoDienThoai = document.getElementById("so-dien-thoai");

    if (oHoTen && nguoiDung.hoTen) {
        oHoTen.value = nguoiDung.hoTen;
    }
    if (oSoDienThoai && nguoiDung.taiKhoan) {
        oSoDienThoai.value = nguoiDung.taiKhoan;
    }

    hienThiTomTatDonHang();
});
