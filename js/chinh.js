// chinh.js - Xu ly chung cho toan bo website (nhu cap nhat so luong gio hang tren header)
// document.addEventListener("DOMContentLoaded", function() {
//     capNhatSoLuongGioHangHeader();
// });

// Bước 1: Tạo một hàm xử lý khi trang web tải xong
// js/chinh.js - Xử lý chung cho toàn bộ website MILO TEA

function khiTrangWebTaiXong() {
    capNhatSoLuongGioHangHeader();
}

// Gọi hàm khi trang web tải xong DOM
document.addEventListener("DOMContentLoaded", khiTrangWebTaiXong);

function capNhatSoLuongGioHangHeader() {
    // Lấy dữ liệu từ luu-tru.js (nếu chưa có hàm layGioHang thì dùng mảng rỗng)
    const gioHang = typeof layGioHang === 'function' ? layGioHang() : [];
    
    // Tính tổng số lượng tất cả món trong giỏ
    const tongSoLuong = gioHang.reduce(function(tong, sanPham) {
        return tong + Number(sanPham.soLuong || 1);
    }, 0);
    
    const phanTuSoLuong = document.getElementById("so-luong-gio-hang");
    if (phanTuSoLuong) {
        phanTuSoLuong.innerText = tongSoLuong;
    }
}

// Hàm hiển thị thông báo Popup Toast
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