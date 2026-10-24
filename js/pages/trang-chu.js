// trang-chu.js - Hien thi san pham noi bat tren trang chu
document.addEventListener("DOMContentLoaded", function() {
    hienThiSanPhamNoiBat();
});

function hienThiSanPhamNoiBat() {
    const danhSach = layDanhSachSanPham();
    // Lay 4 san pham dau tien lam noi bat
    const sanPhamNoiBat = danhSach.slice(0, 4);
    const khungHienThi = document.getElementById("luoi-san-pham-noi-bat");
    
    if (!khungHienThi) return;
    
    let html = "";
    sanPhamNoiBat.forEach(function(sp) {
        html += `
            <div class="the-san-pham-trang-chu">
                <img src="${sp.hinhAnh}" alt="${sp.tenSanPham}">
                <h3>${sp.tenSanPham}</h3>
                <p class="gia-san-pham">${dinhDangTienTe(sp.giaSizeM)}</p>
                <a href="chi-tiet-san-pham.html?ma=${sp.maSanPham}" class="nut-bam">Xem chi tiết</a>
            </div>
        `;
    });
    khungHienThi.innerHTML = html;
}
// trang-chu.js - Hien thi san pham noi bat tren trang chu
document.addEventListener("DOMContentLoaded", function() {
    hienThiSanPhamNoiBat();
});

function hienThiSanPhamNoiBat() {
    const danhSach = layDanhSachSanPham();
    const sanPhamNoiBat = danhSach.slice(0, 4);
    const khungHienThi = document.getElementById("luoi-san-pham-noi-bat");
    
    if (!khungHienThi) return;
    
    // Anh mac dinh phong truong hop link anh bi loi
    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    
    let html = "";
    sanPhamNoiBat.forEach(function(sp) {
        html += `
            <div class="the-san-pham-trang-chu">
                <img src="${sp.hinhAnh}" alt="${sp.tenSanPham}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                <h3>${sp.tenSanPham}</h3>
                <p class="gia-san-pham">${dinhDangTienTe(sp.giaSizeM)}</p>
                <a href="chi-tiet-san-pham.html?ma=${sp.maSanPham}" class="nut-bam">Xem chi tiết</a>
            </div>
        `;
    });
    khungHienThi.innerHTML = html;
}