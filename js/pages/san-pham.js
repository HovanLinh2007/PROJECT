// thuc-don.js
// document.addEventListener("DOMContentLoaded", function() {
//     hienThiThucDon(layDanhSachSanPham());
// });

// }
function hienThiThucDon(danhSach) {
    const khung = document.getElementById("danh-sach-san-pham-thuc-don");
    if (!khung) return;

    if (!danhSach || danhSach.length === 0) {
        khung.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Không tìm thấy sản phẩm nào.</p>";
        return;
    }

    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    let html = "";
    
    danhSach.forEach(function(sp) {
        // Lấy mã sản phẩm an toàn (thử maSanPham trước, nếu không có thì lấy id)
        const ma = sp.maSanPham || sp.id;
        const anh = sp.hinhAnh || sp.hinh || anhMacDinh;

        html += `
            <div class="the-san-pham-td">
                <img src="${anh}" alt="${sp.tenSanPham}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                <h3>${sp.tenSanPham}</h3>
                <p class="gia">${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(sp.giaSizeM || sp.gia) : sp.giaSizeM}</p>
                <button onclick="moModalChiTiet('${sp.maSanPham || sp.id}')" class="nut-bam">Tùy chọn & Đặt món</button>
            </div>
        `;
    });
    khung.innerHTML = html;
}

// thuc-don.js

// Từ khóa ĐÃ ĐƯỢC ÁP DỤNG (chỉ đổi khi người dùng nhấn Enter)
let tuKhoaDaApDung = "";

document.addEventListener("DOMContentLoaded", function () {
    hienThiThucDon(layDanhSachSanPham());

    const oTimKiem = document.getElementById("o-tim-kiem");

    // Nhấn Enter mới tìm
    oTimKiem.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();                 // không để trình duyệt tải lại trang
            tuKhoaDaApDung = oTimKiem.value;    // chốt từ khóa
            xuLyBoLoc();
        }
    });

    // Xóa sạch chữ trong ô thì trả lại danh sách đầy đủ (có thể bỏ khối này nếu không muốn)
    oTimKiem.addEventListener("input", function () {
        if (oTimKiem.value === "" && tuKhoaDaApDung !== "") {
            tuKhoaDaApDung = "";
            xuLyBoLoc();
        }
    });
});

/* ===== Bỏ dấu tiếng Việt: "Trà Sữa Đào" -> "tra sua dao" ===== */
function boDauTiengViet(chuoi) {
    return String(chuoi || "")
        .normalize("NFD")                    // tách "à" thành "a" + dấu huyền
        .replace(/[\u0300-\u036f]/g, "")     // xóa các dấu vừa tách
        .replace(/đ/g, "d").replace(/Đ/g, "D")   // "đ" không tách được nên xử lý riêng
        .toLowerCase()
        .replace(/\s+/g, " ")                // nhiều dấu cách -> 1 dấu cách
        .trim();
}

function xuLyBoLoc() {
    let danhSach = [...layDanhSachSanPham()];   // sao chép mảng để sort không làm đổi dữ liệu gốc
    const danhMuc = document.getElementById("loc-danh-muc").value;
    const sapXep = document.getElementById("sap-xep-gia").value;

    // Lọc theo từ khóa đã chốt (KHÔNG đọc trực tiếp từ ô đang gõ)
    const tuKhoa = boDauTiengViet(tuKhoaDaApDung);
    if (tuKhoa !== "") {
        const cacTu = tuKhoa.split(" ");     // "tra dao" -> ["tra", "dao"]
        danhSach = danhSach.filter(function (sp) {
            const ten = boDauTiengViet(sp.tenSanPham);
            return cacTu.every(function (tu) { return ten.includes(tu); });
        });
    }

    // Lọc theo danh mục
    if (danhMuc !== "tat-ca") {
        danhSach = danhSach.filter(sp => sp.danhMuc === danhMuc);
    }

    // Sắp xếp giá
    if (sapXep === "tang-dan") {
        danhSach.sort((a, b) => a.giaSizeM - b.giaSizeM);
    } else if (sapXep === "giam-dan") {
        danhSach.sort((a, b) => b.giaSizeM - a.giaSizeM);
    }

    hienThiThucDon(danhSach);
}

// function xuLyBoLoc() {
//     let danhSach = layDanhSachSanPham();
//     const tuKhoa = document.getElementById("o-tim-kiem").value.toLowerCase().trim();
//     const danhMuc = document.getElementById("loc-danh-muc").value;
//     const sapXep = document.getElementById("sap-xep-gia").value;

//     // Loc theo tu khoa
//     if (tuKhoa !== "") {
//         danhSach = danhSach.filter(sp => sp.tenSanPham.toLowerCase().includes(tuKhoa));
//     }

//     // Loc theo danh muc
//     if (danhMuc !== "tat-ca") {
//         danhSach = danhSach.filter(sp => sp.danhMuc === danhMuc);
//     }

//     // Sap xep gia
//     if (sapXep === "tang-dan") {
//         danhSach.sort((a, b) => a.giaSizeM - b.giaSizeM);
//     } else if (sapXep === "giam-dan") {
//         danhSach.sort((a, b) => b.giaSizeM - a.giaSizeM);
//     }

//     hienThiThucDon(danhSach);
// }


// Code chi tiet san pham --Linh

// Hàm đóng Popup (chỉ cần xóa nội dung HTML chứ không chuyển trang)
function dongModal() {
    const khung = document.getElementById("khung-chi-tiet-san-pham");
    if (khung) khung.innerHTML = "";
}
function hienThiThucDon(danhSach) {
    const khung = document.getElementById("danh-sach-san-pham-thuc-don");
    if (!khung) return;

    if (!danhSach || danhSach.length === 0) {
        khung.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Không tìm thấy sản phẩm nào.</p>";
        return;
    }

    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    let html = "";
    
    danhSach.forEach(function(sp) {
        const ma = sp.maSanPham || sp.id;
        const anh = sp.hinhAnh || sp.hinh || anhMacDinh;

        html += `
            <div class="the-san-pham-td">
                <img src="${anh}" alt="${sp.tenSanPham}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                <h3>${sp.tenSanPham}</h3>
                <p class="gia">${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(sp.giaSizeM || sp.gia) : sp.giaSizeM}</p>
                
                <!-- SỬA NÚT BẤM: GỌI HÀM hienThiChiTietModal KHI BẤM KÍCH NÚT -->
                <button type="button" class="nut-bam" onclick="hienThiChiTietModal('${ma}')">Tùy chọn & Đặt món</button>
            </div>
        `;
    });
    khung.innerHTML = html;
}