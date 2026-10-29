// js/pages/gio-hang.js - Sửa lỗi không hiển thị bảng giỏ hàng

document.addEventListener("DOMContentLoaded", function () {
    hienThiGioHang();
});

// Hàm hỗ trợ định dạng tiền an toàn nếu thiếu file dinh-dang.js
function fmTien(so) {
    let giatri = Number(so) || 0;
    if (typeof dinhDangTienTe === "function") {
        return dinhDangTienTe(giatri);
    }
    return giatri.toLocaleString("vi-VN") + " đ";
}

function hienThiGioHang() {
    let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
    const khungDanhSach = document.getElementById("danh-sach-gio-hang");
    const khungTongKet = document.getElementById("tong-ket-gio-hang");

    if (!khungDanhSach || !khungTongKet) return;

    // Ép kiểu mảng an toàn
    if (typeof gioHang === "string") {
        try { gioHang = JSON.parse(gioHang); } catch (e) { gioHang = []; }
    }
    if (!Array.isArray(gioHang)) gioHang = [];
    gioHang = gioHang.filter(item => item !== null && typeof item === "object");

    // Nếu giỏ hàng trống -> Render đúng giao diện khung bo góc
    if (gioHang.length === 0) {
        khungDanhSach.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px 20px; 
                background: #ffffff; 
                border: 1.5px solid #d89c67; 
                border-radius: 12px; 
                max-width: 700px; 
                margin: 20px auto;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            ">
                <div style="margin-bottom: 12px;">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 26px; color: #4a2c11;"></i>
                </div>
                <h2 style="font-size: 22px; color: #111111; margin-bottom: 15px; font-weight: bold;">Giỏ hàng đang trống!</h2>
                <p style="font-size: 15px; color: #555555; margin-bottom: 25px;">Bạn hãy chọn cho mình đồ uống mà mình yêu thích nhé</p>
                <a href="trang-chu.html" style="
                    display: inline-block; 
                    padding: 10px 32px; 
                    background-color: #d89c67; 
                    color: #ffffff; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600;
                    font-size: 15px;
                ">Trang chủ</a>
            </div>
        `;
        khungTongKet.innerHTML = "";
        return;
    }

    // Tiêu đề bảng giỏ hàng
    let html = `
        <table class="bang-gio-hang">
            <thead>
                <tr>
                    <th style="width: 40px;"></th>
                    <th>Hình ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Tùy chọn</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
    `;

    gioHang.forEach(function (item, index) {
        let tenSp = item.tenSanPham || item.ten || "Sản phẩm trà sữa";
        let donGiaSp = Number(item.donGia || item.gia || 0);
        let soLuongSp = Number(item.soLuong || 1);
        let thanhTienMon = Number(item.thanhTien) || (donGiaSp * soLuongSp);

        let anhHienThi = item.hinhAnh || item.hinhanh || item.img || "";
        if (!anhHienThi && typeof DANH_SACH_SAN_PHAM !== "undefined") {
            const spGoc = DANH_SACH_SAN_PHAM.find(p => p.id === item.id || p.ten === tenSp);
            if (spGoc) anhHienThi = spGoc.hinhAnh || spGoc.hinhanh;
        }
        if (!anhHienThi) anhHienThi = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=200&q=80";

        let toppingText = "Không";
        if (Array.isArray(item.topping) && item.topping.length > 0) {
            toppingText = item.topping.join(", ");
        } else if (typeof item.topping === "string" && item.topping.trim() !== "") {
            toppingText = item.topping;
        }

        const isChecked = item.daChon !== false ? "checked" : "";

        html += `
            <tr>
                <td>
                    <input type="checkbox" class="cb-chon-mon" onchange="thayDoiChonMon(${index}, this.checked)" ${isChecked}>
                </td>
                <td>
                    <img src="${anhHienThi}" alt="${tenSp}" style="width:65px; height:65px; object-fit:cover; border-radius:8px;">
                </td>
                <td>
                    <strong>${tenSp}</strong>
                </td>
                <td>
                    Size ${item.size || 'M'}, ${item.duong || '100% đường'}, ${item.da || '100% đá'}
                    <div style="font-size:12px; color:#666; margin-top:4px;"><i class="fa-solid fa-cookie-bite"></i> Topping: ${toppingText}</div>
                </td>
                <td>${fmTien(donGiaSp)}</td>
                <td>
                    <div class="nhom-tang-giam">
                        <button class="nut-tang-giam" onclick="doiSoLuong(${index}, -1)">-</button>
                        <span style="margin:0 8px; font-weight:bold;">${soLuongSp}</span>
                        <button class="nut-tang-giam" onclick="doiSoLuong(${index}, 1)">+</button>
                    </div>
                </td>
                <td><strong style="color: var(--mau-nau-dam, #4a2c11);">${fmTien(thanhTienMon)}</strong></td>
                <td>
                    <button onclick="xoaMon(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-size:16px;" title="Xóa món">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    khungDanhSach.innerHTML = html;

    tinhToanTongTien();
}

function tinhToanTongTien() {
    let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
    const khungTongKet = document.getElementById("tong-ket-gio-hang");
    if (!khungTongKet) return;

    if (typeof gioHang === "string") {
        try { gioHang = JSON.parse(gioHang); } catch (e) { gioHang = []; }
    }
    if (!Array.isArray(gioHang)) gioHang = [];

    let tamTinh = 0;
    let soMonDuocChon = 0;

    gioHang.forEach(item => {
        if (item && item.daChon !== false) {
            let donGiaSp = Number(item.donGia || item.gia || 0);
            let soLuongSp = Number(item.soLuong || 1);
            let thanhTienMon = Number(item.thanhTien) || (donGiaSp * soLuongSp);

            tamTinh += thanhTienMon;
            soMonDuocChon += soLuongSp;
        }
    });

    const phiGiaoHang = soMonDuocChon > 0 ? 15000 : 0;
    const tongThanhToan = tamTinh + phiGiaoHang;

    khungTongKet.innerHTML = `
        <div style="margin-bottom:8px; font-size:15px;">Đã chọn: <strong>${soMonDuocChon} sản phẩm</strong></div>
        <div style="margin-bottom:8px; font-size:15px;">Tạm tính: <strong>${fmTien(tamTinh)}</strong></div>
        <div style="margin-bottom:8px; font-size:15px;">Phí giao hàng: <strong>${fmTien(phiGiaoHang)}</strong></div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
        <div style="font-size:18px; margin-bottom:15px;">Tổng thanh toán: <span style="color:var(--mau-nau-dam, #4a2c11); font-size:22px; font-weight:bold;">${fmTien(tongThanhToan)}</span></div>
        
        <div style="display:flex; justify-content:flex-end; gap:15px;">
            <a href="san-pham.html" style="padding:12px 20px; background:#f0e9df; color:var(--mau-nau-dam, #4a2c11); text-decoration:none; border-radius:8px; font-weight:600;">
                <i class="fa-solid fa-arrow-left"></i> Tiếp tục chọn món
            </a>
            <button onclick="tiensHanhThanhToan()" style="padding:12px 24px; background:var(--mau-nau-dam, #4a2c11); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600;" ${soMonDuocChon === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                Tiến hành thanh toán <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;
}

function thayDoiChonMon(index, isChecked) {
    let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
    if (gioHang[index]) {
        gioHang[index].daChon = isChecked;
        if (typeof luuGioHang === "function") luuGioHang(gioHang);
        else localStorage.setItem("gioHangMILO", JSON.stringify(gioHang));
        tinhToanTongTien();
    }
}

function tiensHanhThanhToan() {
    let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
    if (typeof gioHang === "string") {
        try { gioHang = JSON.parse(gioHang); } catch (e) { gioHang = []; }
    }
    const coMonDuocChon = Array.isArray(gioHang) && gioHang.some(item => item && item.daChon !== false);

    if (!coMonDuocChon) {
        alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
        return;
    }
    window.location.href = "thanh-toan.html";
}

function doiSoLuong(index, thayDoi) {
    let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
    if (!gioHang[index]) return;

    gioHang[index].soLuong = Number(gioHang[index].soLuong || 1) + thayDoi;

    if (gioHang[index].soLuong <= 0) {
        gioHang.splice(index, 1);
    } else {
        let donGiaSp = Number(gioHang[index].donGia || gioHang[index].gia || 0);
        gioHang[index].thanhTien = gioHang[index].soLuong * donGiaSp;
    }

    if (typeof luuGioHang === "function") luuGioHang(gioHang);
    else localStorage.setItem("gioHangMILO", JSON.stringify(gioHang));

    hienThiGioHang();

    if (typeof capNhatSoLuongGioHangHeader === "function") {
        capNhatSoLuongGioHangHeader();
    } else if (typeof capNhatGioHangHeader === "function") {
        capNhatGioHangHeader();
    }
}

function xoaMon(index) {
    if (confirm("Bạn có chắc chắn muốn xóa món này khỏi giỏ hàng?")) {
        let gioHang = typeof layGioHang === "function" ? layGioHang() : JSON.parse(localStorage.getItem("gioHangMILO")) || [];
        gioHang.splice(index, 1);

        if (typeof luuGioHang === "function") luuGioHang(gioHang);
        else localStorage.setItem("gioHangMILO", JSON.stringify(gioHang));

        hienThiGioHang();

        if (typeof capNhatSoLuongGioHangHeader === "function") {
            capNhatSoLuongGioHangHeader();
        } else if (typeof capNhatGioHangHeader === "function") {
            capNhatGioHangHeader();
        }
    }
}