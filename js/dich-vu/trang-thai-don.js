// js/dich-vu/trang-thai-don.js
// Dùng chung cho trang admin (đổi trạng thái) và trang tra cứu của khách (hiển thị).
// Nạp SAU luu-tru.js. Chỉ tạo 1 tên toàn cục: TrangThaiDon.

const TrangThaiDon = (function () {
  // Khóa lưu đơn: lấy của nhóm trong luu-tru.js
  const KHOA = typeof KHOA_DON_HANG !== "undefined" ? KHOA_DON_HANG : "danhSachDonHangMILO";

  /* ========== QUY ƯỚC TRẠNG THÁI (cả nhóm dùng chung) ========== */
  const NHAN = {
    cho_xac_nhan: "Chờ xác nhận",
    dang_pha_che: "Đang pha chế",
    cho_giao: "Chờ giao",
    dang_giao: "Đang giao",
    da_giao: "Đã giao",
    giao_that_bai: "Giao thất bại",
    da_huy: "Đã hủy"
  };

  const MAU = {
    cho_xac_nhan: { nen: "#fff3c4", chu: "#8a6d00" },
    dang_pha_che: { nen: "#ede4ff", chu: "#5b3ea8" },
    cho_giao:     { nen: "#e1efff", chu: "#1a5aa5" },
    dang_giao:    { nen: "#ffe9d6", chu: "#a4500b" },
    da_giao:      { nen: "#e3f4e1", chu: "#2e7d32" },
    giao_that_bai:{ nen: "#fdecea", chu: "#c0392b" },
    da_huy:       { nen: "#eceff1", chu: "#546e7a" }
  };

  // Từ trạng thái nào được chuyển sang trạng thái nào
  const CHUYEN = {
    cho_xac_nhan: ["dang_pha_che", "da_huy"],
    dang_pha_che: ["cho_giao", "da_huy"],
    cho_giao: ["dang_giao", "da_huy"],
    dang_giao: ["da_giao", "giao_that_bai"],
    giao_that_bai: ["cho_giao", "da_huy"],
    da_giao: [],
    da_huy: []
  };

  // Thanh 4 bước của KHÁCH
  const BUOC_KHACH = ["Xác Nhận", "Pha Chế", "Đang Giao", "Hoàn Thành"];
  const BUOC_THEO_MA = { cho_xac_nhan: 0, dang_pha_che: 1, cho_giao: 1, dang_giao: 2, da_giao: 3 };
  const LOI_NHAN_KHACH = {
    giao_that_bai: "Giao hàng chưa thành công. Cửa hàng sẽ liên hệ với bạn để giao lại.",
    da_huy: "Đơn hàng này đã được hủy."
  };

  /* ========== TIỆN ÍCH NHỎ (đặt tên riêng, không đụng file khác) ========== */
  function boDau(chuoi) {
    return String(chuoi || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/Đ/g, "D")
      .toLowerCase().replace(/\s+/g, " ").trim();
  }
  function thoat(chuoi) {
    return String(chuoi == null ? "" : chuoi)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function tien(so) {
    return Number(so || 0).toLocaleString("vi-VN") + "đ";
  }
  function ngay(giaTri) {
    const d = new Date(giaTri);
    if (!giaTri || isNaN(d)) return String(giaTri || "");   // ngày lưu dạng chữ thì hiện nguyên
    return d.toLocaleTimeString("vi-VN") + " " + d.toLocaleDateString("vi-VN");
  }
  function thoiGian(giaTri) {
    const t = new Date(giaTri).getTime();
    return isNaN(t) ? 0 : t;
  }

  /* ========== ĐỌC ĐƠN: SỬA TÊN TRƯỜNG Ở ĐÂY NẾU CỦA NHÓM KHÁC ========== */
  // Lấy giá trị của trường đầu tiên có trong danh sách tên
  function lay(doiTuong, cacTen, macDinh) {
    for (const ten of cacTen) {
      if (doiTuong && doiTuong[ten] !== undefined && doiTuong[ten] !== null && doiTuong[ten] !== "") {
        return doiTuong[ten];
      }
    }
    return macDinh;
  }

  function thongTin(don) {
    const dsMon = lay(don, ["monAn", "danhSachMon", "danhSachSanPham", "sanPham", "gioHang", "items"], []);
    const mon = (Array.isArray(dsMon) ? dsMon : []).map(function (m) {
      return {
        ten: lay(m, ["tenSanPham", "ten", "tenMon"], ""),
        size: lay(m, ["size", "kichCo"], ""),
        soLuong: Number(lay(m, ["soLuong", "sl"], 1)),
        // "gia" = giá MỘT LY. Nếu dữ liệu của nhóm lưu thành tiền cả dòng thì sửa chỗ này.
        gia: Number(lay(m, ["donGia", "gia", "giaMotLy", "giaTien"], 0))
      };
    });
    let tong = Number(lay(don, ["tongTien", "tongThanhToan", "tong", "tongCong"], 0));
    if (!tong) tong = mon.reduce((t, m) => t + m.gia * m.soLuong, 0);

    return {
      ma: String(lay(don, ["maDon", "maDonHang", "id", "ma"], "")),
      ngay: lay(don, ["ngayDat", "thoiGianDat", "ngayTao", "thoiGian"], ""),
      ten: lay(don, ["tenNguoiNhan", "hoTen", "tenKhachHang", "tenKhach", "ten"], ""),
      sdt: String(lay(don, ["soDienThoai", "sdt", "dienThoai"], "")),
      diaChi: lay(don, ["diaChi", "diaChiGiaoHang"], ""),
      ghiChu: lay(don, ["ghiChu"], ""),
      thanhToan: lay(don, ["phuongThucTT", "phuongThucThanhToan", "thanhToan"], ""),
      tong: tong,
      mon: mon
    };
  }

  /* ========== ĐỌC / GHI TRẠNG THÁI ========== */
  const TRUONG_TRANG_THAI = ["trangThai", "tinhTrang", "trangThaiDon", "status"];

  // Một số cách viết khác mà nhóm có thể đã dùng (so sánh sau khi bỏ dấu)
  const DONG_NGHIA = {
    "moi": "cho_xac_nhan", "da dat": "cho_xac_nhan", "cho xu ly": "cho_xac_nhan", "dang cho": "cho_xac_nhan",
    "da xac nhan": "dang_pha_che", "dang xu ly": "dang_pha_che", "dang chuan bi": "dang_pha_che",
    "dang chuan bi hang": "dang_pha_che",
    "dang van chuyen": "dang_giao", "dang giao hang": "dang_giao",
    "hoan thanh": "da_giao", "thanh cong": "da_giao", "da giao hang": "da_giao",
    "huy": "da_huy"
  };

  function tenTruongTrangThai(don) {
    for (const t of TRUONG_TRANG_THAI) if (t in don) return t;
    return "trangThai";
  }

  // Trả về mã trạng thái chuẩn. Đọc được: số 0-3, mã chữ, hoặc chữ tiếng Việt.
  function layMa(don) {
    const t = don[tenTruongTrangThai(don)];
    if (typeof t === "number") {
      return ["cho_xac_nhan", "dang_pha_che", "dang_giao", "da_giao"][t] || "cho_xac_nhan";
    }
    if (NHAN[t]) return t;
    const chuan = boDau(t);
    for (const ma in NHAN) if (boDau(NHAN[ma]) === chuan) return ma;
    return DONG_NGHIA[chuan] || "cho_xac_nhan";    // chưa có trạng thái = mới đặt
  }

  function docTatCa() {
    try {
      const du = JSON.parse(localStorage.getItem(KHOA));
      if (Array.isArray(du)) return du;
    } catch (loi) { /* dữ liệu hỏng thì coi như chưa có đơn */ }
    return [];
  }

  // Đổi trạng thái 1 đơn rồi lưu, đồng thời ghi lịch sử. Mọi người đổi trạng thái đều dùng hàm này.
  function capNhat(maDon, trangThaiMoi, nguoi) {
    let danhSach;
    try { danhSach = JSON.parse(localStorage.getItem(KHOA)); } catch (loi) { return false; }
    if (!Array.isArray(danhSach)) return false;

    const don = danhSach.find(d => thongTin(d).ma === maDon);
    if (!don) return false;

    const bayGio = new Date().toISOString();
    if (!Array.isArray(don.lichSu)) {
      don.lichSu = [{ trangThai: layMa(don), luc: thongTin(don).ngay || bayGio, boi: "Hệ thống" }];
    }
    don[tenTruongTrangThai(don)] = trangThaiMoi;
    don.capNhatLuc = bayGio;
    don.lichSu.push({ trangThai: trangThaiMoi, luc: bayGio, boi: nguoi || "Quản trị" });

    localStorage.setItem(KHOA, JSON.stringify(danhSach));
    return true;
  }

  /* ========== HIỂN THỊ ========== */
  // Dòng thời gian lịch sử. hienNguoi = true cho admin, false cho khách.
  function htmlLichSu(don, hienNguoi) {
    const ls = Array.isArray(don.lichSu) && don.lichSu.length
      ? don.lichSu
      : [{ trangThai: layMa(don), luc: don.capNhatLuc || thongTin(don).ngay, boi: "" }];
    return ls.slice().reverse().map(function (m) {
      const nguoi = hienNguoi && m.boi ? " · " + thoat(m.boi) : "";
      return `<li><b>${thoat(NHAN[m.trangThai] || m.trangThai)}</b><small>${ngay(m.luc)}${nguoi}</small></li>`;
    }).join("");
  }

  // Dữ liệu sẵn để trang tra cứu của khách vẽ giao diện
  function hienThiKhach(don) {
    const ma = layMa(don);
    const buoc = BUOC_THEO_MA[ma];
    return {
      ma: ma,
      nhan: NHAN[ma],
      mau: MAU[ma],
      buoc: buoc === undefined ? -1 : buoc,      // -1: giao thất bại / đã hủy, không bước nào sáng
      loiNhan: LOI_NHAN_KHACH[ma] || ""
    };
  }

  return {
    NHAN, MAU, CHUYEN, BUOC_KHACH,
    boDau, thoat, tien, ngay, thoiGian,
    thongTin, layMa, docTatCa, capNhat, htmlLichSu, hienThiKhach
  };
})();