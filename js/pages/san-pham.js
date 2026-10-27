// thuc-don.js
document.addEventListener("DOMContentLoaded", function() {
    hienThiThucDon(layDanhSachSanPham());
});

function hienThiThucDon(danhSach) {
    const khung = document.getElementById("danh-sach-san-pham-thuc-don");
    if (!khung) return;

    if (danhSach.length === 0) {
        khung.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Không tìm thấy sản phẩm nào.</p>";
        return;
    }

    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    let html = "";
    
    danhSach.forEach(function(sp) {
        html += `
            <div class="the-san-pham-td">
                <img src="${sp.hinhAnh}" alt="${sp.tenSanPham}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                <h3>${sp.tenSanPham}</h3>
                <p class="gia">${dinhDangTienTe(sp.giaSizeM)}</p>
                <a href="chi-tiet-san-pham.html?ma=${sp.maSanPham}" class="nut-bam">Tùy chọn & Đặt món</a>
            </div>
        `;
    });
    khung.innerHTML = html;
}

function xuLyBoLoc() {
    let danhSach = layDanhSachSanPham();
    const tuKhoa = document.getElementById("o-tim-kiem").value.toLowerCase().trim();
    const danhMuc = document.getElementById("loc-danh-muc").value;
    const sapXep = document.getElementById("sap-xep-gia").value;

    // Loc theo tu khoa
    if (tuKhoa !== "") {
        danhSach = danhSach.filter(sp => sp.tenSanPham.toLowerCase().includes(tuKhoa));
    }

    // Loc theo danh muc
    if (danhMuc !== "tat-ca") {
        danhSach = danhSach.filter(sp => sp.danhMuc === danhMuc);
    }

    // Sap xep gia
    if (sapXep === "tang-dan") {
        danhSach.sort((a, b) => a.giaSizeM - b.giaSizeM);
    } else if (sapXep === "giam-dan") {
        danhSach.sort((a, b) => b.giaSizeM - a.giaSizeM);
    }

    hienThiThucDon(danhSach);
}