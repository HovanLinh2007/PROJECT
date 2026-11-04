document.addEventListener("DOMContentLoaded", function () {
    if (!window.miloAdminDaXacThuc) return;

    const tenAdmin = document.getElementById("ten-admin-hien-tai");
    const nguoiDung = layNguoiDungHienTai();
    if (tenAdmin && nguoiDung) {
        tenAdmin.textContent = "Xin chào, " + nguoiDung.hoTen;
    }

    khoiTaoTongQuan();
});

window.addEventListener("storage", function (event) {
    if (window.miloAdminDaXacThuc && (event.key === KHOA_SAN_PHAM || event.key === KHOA_DON_HANG)) {
        khoiTaoTongQuan();
    }
});

async function khoiTaoTongQuan() {
    let danhSachSanPham = [];
    let danhSachDonHang = [];
    let loiSanPham = false;
    let loiDonHang = false;

    try {
        danhSachSanPham = await khoiTaoDanhSachSanPham();
        if (!Array.isArray(danhSachSanPham)) {
            throw new Error("Dữ liệu sản phẩm không phải là một danh sách.");
        }
        danhSachSanPham = danhSachSanPham.filter(function (sanPham) {
            return sanPham && typeof sanPham === "object";
        });
    } catch (error) {
        loiSanPham = true;
        console.error("Không thể tải dữ liệu sản phẩm cho trang tổng quan.", error);
    }

    try {
        const duLieuDonHang = localStorage.getItem(KHOA_DON_HANG);
        danhSachDonHang = duLieuDonHang ? JSON.parse(duLieuDonHang) : [];
        if (!Array.isArray(danhSachDonHang)) {
            throw new Error("Dữ liệu đơn hàng không phải là một danh sách.");
        }
        danhSachDonHang = danhSachDonHang.filter(function (donHang) {
            return donHang && typeof donHang === "object";
        });
    } catch (error) {
        loiDonHang = true;
        console.error("Không thể đọc dữ liệu đơn hàng cho trang tổng quan.", error);
    }

    hienThiThongKeTongQuan(danhSachSanPham, danhSachDonHang, loiSanPham, loiDonHang);
    hienThiDonHangMoi(danhSachDonHang, loiDonHang);
}

function hienThiThongKeTongQuan(danhSachSanPham, danhSachDonHang, loiSanPham, loiDonHang) {
    const khung = document.getElementById("luoi-thong-ke-tong-quan");
    if (!khung) return;

    const soSanPhamConHang = danhSachSanPham.filter(function (sanPham) {
        return sanPham && sanPham.conHang !== false;
    }).length;
    const doanhThu = danhSachDonHang.reduce(function (tong, donHang) {
        return tong + (Number(donHang && donHang.tongTien) || 0);
    }, 0);

    const thongKe = [
        {
            nhan: "Tổng sản phẩm",
            giaTri: loiSanPham ? "Không tải được" : danhSachSanPham.length,
            moTa: "Sản phẩm trong danh mục",
            bieuTuong: "🥤"
        },
        {
            nhan: "Sản phẩm còn hàng",
            giaTri: loiSanPham ? "Không tải được" : soSanPhamConHang,
            moTa: "Đang sẵn sàng phục vụ",
            bieuTuong: "✅"
        },
        {
            nhan: "Tổng đơn hàng",
            giaTri: loiDonHang ? "Không tải được" : danhSachDonHang.length,
            moTa: "Đơn hàng đã ghi nhận",
            bieuTuong: "📦"
        },
        {
            nhan: "Doanh thu ghi nhận",
            giaTri: loiDonHang ? "Không tải được" : dinhDangTienTe(doanhThu),
            moTa: "Tổng giá trị các đơn hàng",
            bieuTuong: "💰"
        }
    ];

    khung.replaceChildren();
    thongKe.forEach(function (muc) {
        const the = document.createElement("article");
        the.className = "the-thong-ke";

        const bieuTuong = document.createElement("span");
        bieuTuong.className = "bieu-tuong-thong-ke";
        bieuTuong.setAttribute("aria-hidden", "true");
        bieuTuong.textContent = muc.bieuTuong;

        const nhan = document.createElement("p");
        nhan.className = "nhan-thong-ke";
        nhan.textContent = muc.nhan;

        const giaTri = document.createElement("strong");
        giaTri.className = "gia-tri-thong-ke";
        giaTri.textContent = muc.giaTri;

        const moTa = document.createElement("p");
        moTa.className = "mo-ta-thong-ke";
        moTa.textContent = muc.moTa;

        the.append(bieuTuong, nhan, giaTri, moTa);
        khung.appendChild(the);
    });
}

function hienThiDonHangMoi(danhSachDonHang, loiDonHang) {
    const khung = document.getElementById("danh-sach-don-moi");
    if (!khung) return;

    khung.replaceChildren();
    if (loiDonHang) {
        hienThiThongBaoDonHang(khung, "Không thể đọc dữ liệu đơn hàng. Kiểm tra dữ liệu đã lưu trong trình duyệt.");
        return;
    }

    if (danhSachDonHang.length === 0) {
        hienThiThongBaoDonHang(khung, "Chưa có đơn hàng nào được ghi nhận.");
        return;
    }

    const bang = document.createElement("table");
    bang.className = "bang-don-hang";

    const tieuDe = document.createElement("thead");
    const hangTieuDe = document.createElement("tr");
    ["Mã đơn", "Ngày đặt", "Khách hàng", "Trạng thái", "Tổng tiền", ""].forEach(function (noiDung) {
        const o = document.createElement("th");
        o.scope = "col";
        o.textContent = noiDung;
        hangTieuDe.appendChild(o);
    });
    tieuDe.appendChild(hangTieuDe);

    const thanBang = document.createElement("tbody");
    danhSachDonHang.slice(0, 5).forEach(function (donHang) {
        const hang = document.createElement("tr");
        themO(hang, donHang.maDon || "Chưa có mã");
        themO(hang, donHang.ngayDat || "Chưa có ngày");
        themO(hang, donHang.hoTen || "Khách hàng");
        themO(hang, donHang.trangThai || "Chưa cập nhật");
        themO(hang, dinhDangTienTe(Number(donHang.tongTien) || 0));

        const oThaoTac = document.createElement("td");
        if (donHang.maDon) {
            const lienKet = document.createElement("a");
            lienKet.className = "lien-ket-don-hang";
            lienKet.href = "./theo-don-don-hang1.html?madon=" + encodeURIComponent(donHang.maDon);
            lienKet.textContent = "Xem đơn";
            oThaoTac.appendChild(lienKet);
        } else {
            oThaoTac.textContent = "—";
        }
        hang.appendChild(oThaoTac);
        thanBang.appendChild(hang);
    });

    bang.append(tieuDe, thanBang);
    khung.appendChild(bang);
}

function themO(hang, noiDung) {
    const o = document.createElement("td");
    o.textContent = noiDung;
    hang.appendChild(o);
}

function hienThiThongBaoDonHang(khung, noiDung) {
    const thongBao = document.createElement("p");
    thongBao.className = "thong-bao-don-hang";
    thongBao.textContent = noiDung;
    khung.appendChild(thongBao);
}
