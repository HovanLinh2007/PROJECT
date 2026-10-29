// js/pages/theo-doi-don-hang.js

document.addEventListener("DOMContentLoaded", function() {
    // Tự động kiểm tra nếu có tham số sdt trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const sdtUrl = urlParams.get('sdt');
    if (sdtUrl) {
        document.getElementById("nhap-sdt-tra-cuu").value = sdtUrl;
        traCuuDonHang();
    }
});

function traCuuDonHang() {
    const sdtInput = document.getElementById("nhap-sdt-tra-cuu").value.trim();
    const khungKetQua = document.getElementById("ket-qua-tra-cuu");

    if (!sdtInput) {
        alert("Vui lòng nhập Số điện thoại để tra cứu!");
        return;
    }

    // Lấy danh sách lịch sử đơn hàng từ localStorage
    const dsDonHang = JSON.parse(localStorage.getItem("danhSachDonHangMILO")) || [];

    // Lọc theo SĐT
    const donHangTimThay = dsDonHang.filter(don => don.soDienThoai && don.soDienThoai.includes(sdtInput));

    if (donHangTimThay.length === 0) {
        khungKetQua.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <i class="fa-solid fa-box-open" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                <p style="color: #666; font-size: 16px;">Không tìm thấy đơn hàng nào với SĐT: <strong>${sdtInput}</strong></p>
            </div>
        `;
        return;
    }

    let html = `<h3 style="margin-bottom:20px; color:var(--mau-nau-dam);">Tìm thấy ${donHangTimThay.length} đơn hàng:</h3>`;

    donHangTimThay.forEach(don => {
        let danhSachMonHtml = "";
        if (don.danhSachMon && don.danhSachMon.length > 0) {
            don.danhSachMon.forEach(mon => {
                const gia = mon.thanhTien || (mon.donGia * mon.soLuong);
                danhSachMonHtml += `
                    <li>
                        <span><strong>${mon.tenSanPham || mon.ten}</strong> (x${mon.soLuong})</span>
                        <span>${typeof dinhDangTienTe === "function" ? dinhDangTienTe(gia) : gia + "đ"}</span>
                    </li>
                `;
            });
        }

        html += `
            <div class="the-don-hang">
                <div class="dau-don-hang">
                    <div>
                        <span class="ma-don">Mã đơn: #${don.maDon || don.id || 'MILO' + Math.floor(Math.random()*10000)}</span>
                        <div style="font-size:12px; color:#888; margin-top:4px;">Ngày đặt: ${don.ngayDat || 'Vừa xong'}</div>
                    </div>
                    <span class="trang-thai-badge"><i class="fa-solid fa-truck-fast"></i> ${don.trangThai || 'Đang chuẩn bị hàng'}</span>
                </div>
                <ul class="danh-sach-mon-tra-cuu">
                    ${danhSachMonHtml}
                </ul>
                <div class="chan-don-hang">
                    <span>Người nhận: ${don.hoTen} (${don.soDienThoai})</span>
                    <span style="color:var(--mau-nau-dam); font-size:18px;">Tổng: ${typeof dinhDangTienTe === "function" ? dinhDangTienTe(don.tongTien) : don.tongTien + "đ"}</span>
                </div>
            </div>
        `;
    });

    khungKetQua.innerHTML = html;
}