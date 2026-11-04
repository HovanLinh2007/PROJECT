const TT = TrangThaiDon;

const DS_THE_THONG_KE = ["cho_giao", "dang_giao", "da_giao", "giao_that_bai"];
const DS_DA_XONG = ["da_giao", "da_huy"];

const bang = document.getElementById("bang-giao-hang");
const oTim = document.getElementById("o-tim");
const locTrangThai = document.getElementById("loc-trang-thai");
const hopChiTiet = document.getElementById("hop-chi-tiet");

document.addEventListener("DOMContentLoaded", function () {
  // Hàm bảo vệ trang của Tâm. Chưa có thì bỏ qua để bạn vẫn test được; có rồi thì đổi đúng tên.
  if (typeof batBuocDangNhapQuanTri === "function" && !batBuocDangNhapQuanTri()) return;

  ve();

  oTim.addEventListener("input", ve);
  locTrangThai.addEventListener("change", ve);
  document.getElementById("nut-lam-moi").addEventListener("click", ve);

  document.querySelectorAll(".the-tk").forEach(function (the) {
    the.addEventListener("click", function () {
      locTrangThai.value = the.dataset.loc;
      ve();
    });
  });

  document.getElementById("nut-dang-xuat").addEventListener("click", function (e) {
    e.preventDefault();
    if (typeof dangXuatQuanTri === "function") dangXuatQuanTri();     // hàm của Tâm
    else window.location.href = "dang-nhap-quan-tri.html";
  });

  bang.addEventListener("click", xuLyNutTrongBang);
  window.addEventListener("storage", ve);   // khách đặt đơn mới hoặc tab khác đổi dữ liệu thì tự cập nhật
});

/* ===== DỮ LIỆU ===== */
// Mỗi đơn được gói thành { don, t (thông tin chuẩn), tt (mã trạng thái) }, mới nhất lên đầu
function layTatCaDon() {
  return TT.docTatCa()
    .map((don, vt) => ({ don: don, vt: vt, t: TT.thongTin(don), tt: TT.layMa(don) }))
    .sort((a, b) => (TT.thoiGian(b.t.ngay) - TT.thoiGian(a.t.ngay)) || (b.vt - a.vt));
}

/* ===== VẼ GIAO DIỆN ===== */
function ve() {
  const tatCa = layTatCaDon();
  capNhatThongKe(tatCa);

  let ds = tatCa;
  const loc = locTrangThai.value;
  if (loc === "can-xu-ly") {
    ds = ds.filter(x => !DS_DA_XONG.includes(x.tt));
  } else if (loc !== "tat-ca") {
    ds = ds.filter(x => x.tt === loc);
  }

  const tuKhoa = TT.boDau(oTim.value);
  if (tuKhoa) {
    ds = ds.filter(x => TT.boDau([x.t.ma, x.t.ten, x.t.sdt, x.t.diaChi].join(" ")).includes(tuKhoa));
  }

  bang.innerHTML = ds.map(taoHang).join("");
  document.getElementById("bang-trong").hidden = ds.length > 0;
}

function capNhatThongKe(tatCa) {
  DS_THE_THONG_KE.forEach(function (ma) {
    document.getElementById("tk-" + ma).textContent = tatCa.filter(x => x.tt === ma).length;
  });

  // Số đơn cần xử lý hiện trên menu
  const canXuLy = tatCa.filter(x => !DS_DA_XONG.includes(x.tt)).length;
  const badge = document.getElementById("badge-menu-don");
  badge.textContent = canXuLy;
  badge.hidden = canXuLy === 0;
}

function nhanNut(tu, den) {
  if (tu === "giao_that_bai" && den === "cho_giao") return "Giao lại";
  return {
    dang_pha_che: "Nhận đơn",
    cho_giao: "Pha chế xong",
    dang_giao: "Bắt đầu giao",
    da_giao: "Đã giao",
    giao_that_bai: "Giao thất bại",
    da_huy: "Hủy đơn"
  }[den];
}

function taoHang(x) {
  const mau = TT.MAU[x.tt];
  const tomTatMon = x.t.mon.map(m => `${TT.thoat(m.ten)} x${m.soLuong}`).join(", ");

  const nutChuyen = (TT.CHUYEN[x.tt] || []).map(function (sang) {
    const kieu = (sang === "giao_that_bai" || sang === "da_huy") ? "nut-nguy-hiem" : "nut-chinh-nho";
    return `<button type="button" class="${kieu}" data-hanh-dong="chuyen" data-sang="${sang}">${nhanNut(x.tt, sang)}</button>`;
  }).join("");

  return `
    <tr data-ma="${TT.thoat(x.t.ma)}">
      <td><b>${TT.thoat(x.t.ma)}</b><small>${TT.ngay(x.t.ngay)}</small></td>
      <td>${TT.thoat(x.t.ten)}<small>${TT.thoat(x.t.sdt)}</small></td>
      <td>${TT.thoat(x.t.diaChi)}</td>
      <td class="o-mon">${tomTatMon}</td>
      <td>${TT.tien(x.t.tong)}</td>
      <td><span class="nhan-tt" style="background:${mau.nen};color:${mau.chu}">${TT.NHAN[x.tt]}</span></td>
      <td>${TT.ngay(x.don.capNhatLuc || x.t.ngay)}</td>
      <td class="o-hanh-dong">
        ${nutChuyen}
        <button type="button" class="nut-phu" data-hanh-dong="xem">Chi tiết</button>
      </td>
    </tr>`;
}

/* ===== BẤM NÚT TRONG BẢNG ===== */
function xuLyNutTrongBang(e) {
  const nut = e.target.closest("[data-hanh-dong]");
  if (!nut) return;
  const maDon = nut.closest("tr").dataset.ma;

  if (nut.dataset.hanhDong === "xem") moChiTiet(maDon);
  if (nut.dataset.hanhDong === "chuyen") chuyenTrangThai(maDon, nut.dataset.sang);
}

function chuyenTrangThai(maDon, sang) {
  const x = layTatCaDon().find(d => d.t.ma === maDon);
  if (!x) return;

  // Đọc lại trạng thái MỚI NHẤT: có thể người khác vừa đổi cùng đơn này
  if (!(TT.CHUYEN[x.tt] || []).includes(sang)) {
    alert("Trạng thái đơn này vừa thay đổi. Danh sách sẽ được làm mới.");
    ve();
    return;
  }
  if (!confirm(`Chuyển đơn ${maDon} sang "${TT.NHAN[sang]}"?`)) return;

  TT.capNhat(maDon, sang, "Quản trị đơn hàng");   // ghi vào localStorage + lịch sử
  ve();
}

/* ===== HỘP CHI TIẾT + LỊCH SỬ ===== */
function moChiTiet(maDon) {
  const x = layTatCaDon().find(d => d.t.ma === maDon);
  if (!x) return;
  const t = x.t;

  document.getElementById("ct-noi-dung").innerHTML = `
    <h2>Đơn ${TT.thoat(t.ma)}</h2>
    <p><b>Người nhận:</b> ${TT.thoat(t.ten)}</p>
    <p><b>Số điện thoại:</b> ${TT.thoat(t.sdt)}</p>
    <p><b>Địa chỉ:</b> ${TT.thoat(t.diaChi)}</p>
    <p><b>Ghi chú:</b> ${TT.thoat(t.ghiChu || "Không có")}</p>
    <p><b>Thanh toán:</b> ${TT.thoat(t.thanhToan)}</p>
    <ul class="ds-mon">
      ${t.mon.map(m => `
        <li><span>• ${TT.thoat(m.ten)}${m.size ? " (" + TT.thoat(m.size) + ")" : ""} x${m.soLuong}</span>
        <b>${TT.tien(m.gia * m.soLuong)}</b></li>`).join("")}
    </ul>
    <p><b>Tổng tiền:</b> ${TT.tien(t.tong)}</p>
    <h3 class="tieu-de-nho">Lịch sử theo dõi</h3>
    <ol class="dong-thoi-gian">${TT.htmlLichSu(x.don, true)}</ol>`;

  hopChiTiet.showModal();
}