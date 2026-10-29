// js/pages/theo-doi-don-hang.js - Xử lý tra cứu đơn hàng realtime

document.addEventListener("DOMContentLoaded", function () {
    // Tự động kiểm tra tham số sdt trên URL (Ví dụ: theo-doi-don-hang.html?sdt=0383496587)
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
});

// Hàm hỗ trợ định dạng tiền tệ
function fmTien(so) {
    let n = Number(so) || 0;
    if (typeof dinhDangTienTe === "function") {
        return dinhDangTienTe(n);
    }
    return n.toLocaleString("vi-VN") + " đ";
}

// Xử lý khi nhấn nút Tra Cứu Đơn
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

// Hàm tìm kiếm và hiển thị đơn hàng từ localStorage
function timKiemDonHang(maDon, sdt) {
    const dsDonHang = JSON.parse(localStorage.getItem("danhSachDonHangMILO")) || [];
    const khungKq = document.getElementById("orderResult");
    const khungThongBao = document.getElementById("trackingResult");

    if (dsDonHang.length === 0) {
        hienThiThongBao("Chưa có dữ liệu đơn hàng nào trên hệ thống!", "#e74c3c");
        khungKq.hidden = true;
        return;
    }

    // Lọc đơn hàng phù hợp
    let donHang = dsDonHang.find(item => {
        let hopLeMa = maDon ? (item.maDon && item.maDon.toUpperCase() === maDon) : true;
        let hopLeSdt = sdt ? (item.soDienThoai && item.soDienThoai.includes(sdt)) : true;
        
        if (maDon && sdt) return (item.maDon && item.maDon.toUpperCase() === maDon) || (item.soDienThoai && item.soDienThoai.includes(sdt));
        return hopLeMa && hopLeSdt;
    });

    if (!donHang) {
        hienThiThongBao("❌ Không tìm thấy đơn hàng trùng khớp! Vui lòng kiểm tra lại thông tin.", "#e74c3c");
        khungKq.hidden = true;
        return;
    }

    // Hiển thị thông tin tìm thấy
    khungThongBao.innerHTML = "";
    khungKq.hidden = false;

    document.getElementById("resultOrderCode").innerText = donHang.maDon || "MILO_TEA";
    document.getElementById("resultOrderDate").innerText = "Ngày đặt: " + (donHang.ngayDat || "Vừa xong");
    document.getElementById("resultStatus").innerText = donHang.trangThai || "Đang chuẩn bị hàng";

    document.getElementById("resultName").innerText = donHang.hoTen || "Khách hàng";
    document.getElementById("resultPhone").innerText = donHang.soDienThoai || "";
    document.getElementById("resultAddress").innerText = donHang.diaChi || "";
    document.getElementById("resultPayment").innerText = donHang.phuongThucTT || "COD";
    document.getElementById("resultNote").innerText = donHang.ghiChu || "Không có";

    // Dựng danh sách món
    let itemsHtml = "";
    if (Array.isArray(donHang.danhSachMon)) {
        donHang.danhSachMon.forEach(mon => {
            let ten = mon.tenSanPham || mon.ten || "Trà sữa";
            let sl = mon.soLuong || 1;
            let gia = Number(mon.thanhTien) || (Number(mon.donGia || mon.gia || 0) * sl);

            itemsHtml += `
                <div class="dong-mon-tc">
                    <span><strong>${ten}</strong> (x${sl})</span>
                    <span>${fmTien(gia)}</span>
                </div>
            `;
        });
    }
    document.getElementById("resultItems").innerHTML = itemsHtml;
    document.getElementById("resultTotal").innerText = fmTien(donHang.tongTien || 0);

    // Cập nhật trạng thái tiến trình
    capNhatTienTrinh(donHang.trangThai);
}

// Cập nhật bước tiến trình
function capNhatTienTrinh(trangThai) {
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");

    // Reset
    [step1, step2, step3, step4].forEach(s => s.classList.remove("active"));

    // Mặc định luôn bật Bước 1
    step1.classList.add("active");

    if (trangThai === "Đang pha chế") {
        step2.classList.add("active");
    } else if (trangThai === "Đang giao hàng") {
        step2.classList.add("active");
        step3.classList.add("active");
    } else if (trangThai === "Hoàn thành") {
        step2.classList.add("active");
        step3.classList.add("active");
        step4.classList.add("active");
    }
}

function hienThiThongBao(msg, mau) {
    const khungThongBao = document.getElementById("trackingResult");
    khungThongBao.innerHTML = `<p style="color:${mau}; font-weight:bold; padding:10px; background:#fff; border-radius:8px; display:inline-block; border:1px solid ${mau};">${msg}</p>`;
}