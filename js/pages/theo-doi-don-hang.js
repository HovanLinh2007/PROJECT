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
        document.getElementById("orderCode").value = maDonTuUrl;
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

    const maDonInput = document.getElementById("orderCode").value.trim().toUpperCase();
    const sdtInput = document.getElementById("phone").value.trim();

    if (!maDonInput && !sdtInput) {
        hienThiThongBao("Vui lòng nhập Mã đơn hàng hoặc Số điện thoại để tra cứu!", "orange");
        return;
    }

    timKiemDonHang(maDonInput, sdtInput);
}

function timKiemDonHang(maDon, sdt) {
    const danhSach = TrangThaiDon.docTatCa();
    const maChuanHoa = maDon.toUpperCase();
    const donHang = danhSach.find(function (don) {
        const thongTin = TrangThaiDon.thongTin(don);
        const hopLeMa = maDon ? thongTin.ma.toUpperCase() === maChuanHoa : true;
        const hopLeSdt = sdt ? thongTin.sdt.includes(sdt) : true;
        return maDon && sdt ? hopLeMa || hopLeSdt : hopLeMa && hopLeSdt;
    });

    if (!donHang) {
        maDonDangTheoDoi = "";
        hienThiThongBao(
            danhSach.length
                ? "❌ Không tìm thấy đơn hàng trùng khớp! Vui lòng kiểm tra lại thông tin."
                : "Chưa có dữ liệu đơn hàng nào trên hệ thống!",
            "#e74c3c"
        );
        document.getElementById("orderResult").hidden = true;
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
    } else {
        maDonDangTheoDoi = "";
        document.getElementById("orderResult").hidden = true;
        hienThiThongBao("Không tìm thấy đơn hàng này trong dữ liệu hiện tại.", "#e74c3c");
    }
}

function hienThiDonHang(donHang) {
    const thongTin = TrangThaiDon.thongTin(donHang);
    const trangThai = TrangThaiDon.hienThiKhach(donHang);

    document.getElementById("trackingResult").innerHTML = "";
    document.getElementById("orderResult").hidden = false;
    document.getElementById("resultOrderCode").innerText = thongTin.ma || "MILO_TEA";
    document.getElementById("resultOrderDate").innerText = "Ngày đặt: " + (thongTin.ngay || "Vừa xong");

    const oTrangThai = document.getElementById("resultStatus");
    oTrangThai.innerText = trangThai.nhan;
    oTrangThai.style.backgroundColor = trangThai.mau.nen;
    oTrangThai.style.color = trangThai.mau.chu;

    document.getElementById("resultName").innerText = thongTin.ten || "Khách hàng";
    document.getElementById("resultPhone").innerText = thongTin.sdt;
    document.getElementById("resultAddress").innerText = thongTin.diaChi;
    document.getElementById("resultPayment").innerText = thongTin.thanhToan || "COD";
    document.getElementById("resultNote").innerText = thongTin.ghiChu || "Không có";

    document.getElementById("resultItems").innerHTML = thongTin.mon.map(function (mon) {
        const ten = TrangThaiDon.thoat(mon.ten || "Trà sữa");
        return `
            <div class="dong-mon-tc">
                <span><strong>${ten}</strong> (x${mon.soLuong})</span>
                <span>${fmTien(mon.gia * mon.soLuong)}</span>
            </div>
        `;
    }).join("");
    document.getElementById("resultTotal").innerText = fmTien(thongTin.tong);

    capNhatTienTrinh(trangThai.buoc);
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
    khungThongBao.innerHTML = `<p style="color:${mau}; font-weight:bold; padding:10px; background:#fff; border-radius:8px; display:inline-block; border:1px solid ${mau};">${msg}</p>`;
}
