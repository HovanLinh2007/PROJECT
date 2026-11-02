document.addEventListener("DOMContentLoaded", async function () {
    try {
        await khoiTaoDanhSachSanPham();
        hienThiSanPhamNoiBat();
    } catch (error) {
        console.error("Không thể tải dữ liệu sản phẩm:", error);
        const khung = document.getElementById("luoi-san-pham-noi-bat");
        if (khung) khung.textContent = "Không thể tải danh sách sản phẩm.";
    }
});

window.addEventListener("storage", function (event) {
    if (event.key === KHOA_SAN_PHAM) {
        try {
            hienThiSanPhamNoiBat();
        } catch (error) {
            console.error("Không thể cập nhật sản phẩm nổi bật sau khi dữ liệu thay đổi.", error);
            const khung = document.getElementById("luoi-san-pham-noi-bat");
            if (khung) khung.textContent = "Không thể tải danh sách sản phẩm.";
        }
    }
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