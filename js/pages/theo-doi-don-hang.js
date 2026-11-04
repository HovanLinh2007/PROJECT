// js/pages/theo-doi-don-hang.js - Tra cứu trạng thái đơn hàng realtime

let maDonDangTheoDoi = "";

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const sdtTuUrl = urlParams.get("sdt");
    const maDonTuUrl = urlParams.get("madon");

    if (sdtTuUrl) {
        document.getElementById("phone").value = sdtTuUrl;
        timKiemDonHang("", sdtTuUrl);
    } else if (maDonTuUrl) {
        timKiemDonHang(maDonTuUrl, "");
    }

    window.addEventListener("storage", function (event) {
        if (event.key === KHOA_DON_HANG && maDonDangTheoDoi) {
            capNhatDonDangTheoDoi();
        }
    });
});

function fmTien(so) {
    const n = Number(so) || 0;
    if (typeof dinhDangTienTe === "function") {
        return dinhDangTienTe(n);
    }
    return n.toLocaleString("vi-VN") + " đ";
}

function xuLyTraCuu(event) {
    event.preventDefault();

    const sdtInput = document.getElementById("phone").value.trim();
    if (!sdtInput) {
        hienThiThongBao("Vui lòng nhập số điện thoại đặt hàng để tra cứu!", "orange");
        return;
    }

    timKiemDonHang("", sdtInput);
}

function timKiemDonHang(maDon, sdt) {
    const danhSach = TrangThaiDon.docTatCa();
    const maChuanHoa = String(maDon || "").trim().toUpperCase();
    const donHang = danhSach.find(function (don) {
        const thongTin = TrangThaiDon.thongTin(don);
        const hopLeMa = maChuanHoa
            ? thongTin.ma.toUpperCase() === maChuanHoa
            : true;
        const hopLeSdt = sdt
            ? thongTin.sdt.includes(sdt.trim())
            : true;

        return maChuanHoa && sdt
            ? hopLeMa || hopLeSdt
            : hopLeMa && hopLeSdt;
    });

    if (!donHang) {
        maDonDangTheoDoi = "";
        document.getElementById("orderResult").hidden = true;
        hienThiThongBao(
            danhSach.length
                ? "❌ Không tìm thấy đơn hàng trùng khớp! Vui lòng kiểm tra lại thông tin."
                : "Chưa có dữ liệu đơn hàng nào trên hệ thống!",
            "#e74c3c"
        );
        return;
    }

    maDonDangTheoDoi = TrangThaiDon.thongTin(donHang).ma;
    hienThiDonHang(donHang);
}

function capNhatDonDangTheoDoi() {
    const donHang = TrangThaiDon.docTatCa().find(function (don) {
        return TrangThaiDon.thongTin(don).ma === maDonDangTheoDoi;
    });

    if (donHang) {
        hienThiDonHang(donHang);
        return;
    }

    maDonDangTheoDoi = "";
    document.getElementById("orderResult").hidden = true;
    hienThiThongBao("Không tìm thấy đơn hàng này trong dữ liệu hiện tại.", "#e74c3c");
}

function hienThiDonHang(donHang) {
    const thongTin = TrangThaiDon.thongTin(donHang);
    const trangThai = TrangThaiDon.hienThiKhach(donHang);

    document.getElementById("trackingResult").innerHTML = "";
    document.getElementById("orderResult").hidden = false;
    document.getElementById("resultOrderCode").innerText = thongTin.ma || "MILO_TEA";
    document.getElementById("resultOrderDate").innerText =
        "Ngày đặt: " + (thongTin.ngay || "Vừa xong");

    const oTrangThai = document.getElementById("resultStatus");
    oTrangThai.innerText = trangThai.nhan;
    oTrangThai.style.backgroundColor = trangThai.mau.nen;
    oTrangThai.style.color = trangThai.mau.chu;

    document.getElementById("resultName").innerText = thongTin.ten || "Khách hàng";
    document.getElementById("resultPhone").innerText = thongTin.sdt;
    document.getElementById("resultAddress").innerText = thongTin.diaChi;
    document.getElementById("resultPayment").innerText = thongTin.thanhToan || "COD";
    document.getElementById("resultNote").innerText = thongTin.ghiChu || "Không có";
    document.getElementById("resultItems").innerHTML = taoDanhSachMonHtml(donHang, thongTin.mon);
    document.getElementById("resultTotal").innerText = fmTien(thongTin.tong);

    capNhatTienTrinh(trangThai.buoc);
}

function taoDanhSachMonHtml(donHang, cacMon) {
    const danhSachMonGoc = layDanhSachMonGoc(donHang);
    let html = cacMon.map(function (mon, viTri) {
        const duLieuMon = danhSachMonGoc[viTri] || {};
        const soLuong = Number(duLieuMon.soLuong || duLieuMon.sl || mon.soLuong) || 1;
        const thanhTien = Number(duLieuMon.thanhTien)
            || mon.gia * soLuong;
        const thanhTienGoc = Number(duLieuMon.thanhTienGoc) || thanhTien;
        const ten = TrangThaiDon.thoat(mon.ten || "Trà sữa");

        return `
            <div class="dong-mon-tc">
                <span><strong>${ten}</strong> (x${soLuong})</span>
                <span>${thanhTienGoc > thanhTien ? `<del>${fmTien(thanhTienGoc)}</del> ` : ""}${fmTien(thanhTien)}</span>
            </div>
        `;
    }).join("");

    const giamGia = Number(donHang.giamGia) || 0;
    if (giamGia > 0) {
        html += `
            <div class="dong-mon-tc">
                <span>Bạn đã tiết kiệm</span>
                <span>${fmTien(giamGia)}</span>
            </div>
        `;
    }

    return html;
}

function layDanhSachMonGoc(donHang) {
    const cacTruong = ["monAn", "danhSachMon", "danhSachSanPham", "sanPham", "gioHang", "items"];
    const tenTruong = cacTruong.find(function (ten) {
        return Array.isArray(donHang[ten]);
    });
    return tenTruong ? donHang[tenTruong] : [];
}

function capNhatTienTrinh(buocHienTai) {
    [1, 2, 3, 4].forEach(function (soBuoc, viTri) {
        document.getElementById("step" + soBuoc).classList.toggle(
            "active",
            viTri === buocHienTai
        );
    });
}

function hienThiThongBao(msg, mau) {
    const khungThongBao = document.getElementById("trackingResult");
    khungThongBao.innerHTML =
        `<p style="color:${mau}; font-weight:bold; padding:10px; background:#fff; border-radius:8px; display:inline-block; border:1px solid ${mau};">${msg}</p>`;
}
