// chinh.js - Xu ly chung cho toan bo website (nhu cap nhat so luong gio hang tren header)
document.addEventListener("DOMContentLoaded", function() {
    capNhatSoLuongGioHangHeader();
});

function capNhatSoLuongGioHangHeader() {
    const gioHang = layGioHang();
    const tongSoLuong = gioHang.reduce(function(tong, sanPham) {
        return tong + sanPham.soLuong;
    }, 0);
    
    const phanTuSoLuong = document.getElementById("so-luong-gio-hang");
    if (phanTuSoLuong) {
        phanTuSoLuong.innerText = tongSoLuong;
    }
}

function hienThongBao(noiDung) {
    let popup = document.getElementById("thong-bao-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "thong-bao-popup";
        popup.className = "thong-bao-popup";
        document.body.appendChild(popup);
    }
    popup.innerText = noiDung;
    popup.style.display = "block";
    
    setTimeout(function() {
        popup.style.display = "none";
    }, 2500);
}