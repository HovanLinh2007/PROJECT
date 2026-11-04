document.addEventListener("DOMContentLoaded", function () {
    if (window.miloAdminDaXacThuc) {
        hienThiDanhSachGopY();
    }
});

function hienThiDanhSachGopY() {
    const khung = document.getElementById("khung-bang-gop-y");
    if (!khung) return;

    let danhSachGopY;
    try {
        danhSachGopY = layDanhSachGopY();
    } catch (error) {
        console.error("Không thể đọc danh sách góp ý.", error);
        khung.textContent = "Không thể đọc dữ liệu góp ý. Kiểm tra dữ liệu đã lưu trong trình duyệt.";
        return;
    }

    khung.replaceChildren();
    if (danhSachGopY.length === 0) {
        const thongBao = document.createElement("p");
        thongBao.className = "thong-bao-gop-y";
        thongBao.textContent = "Chưa có nhận xét hoặc góp ý nào từ khách hàng.";
        khung.appendChild(thongBao);
        return;
    }

    const bang = document.createElement("table");
    bang.className = "bang-du-lieu bang-gop-y";
    const tieuDe = document.createElement("thead");
    const hangTieuDe = document.createElement("tr");
    ["Ngày gửi", "Họ và tên", "Số điện thoại", "Nội dung góp ý", "Trạng thái", "Thao tác"].forEach(function (nhan) {
        const o = document.createElement("th");
        o.scope = "col";
        o.textContent = nhan;
        hangTieuDe.appendChild(o);
    });
    tieuDe.appendChild(hangTieuDe);

    const thanBang = document.createElement("tbody");
    danhSachGopY.slice().reverse().forEach(function (item, index) {
        const viTriGoc = danhSachGopY.length - 1 - index;
        const hang = document.createElement("tr");
        themO(hang, item.ngayGui || "—");

        const oTen = document.createElement("td");
        const ten = document.createElement("strong");
        ten.textContent = item.hoTen || "Khách hàng";
        oTen.appendChild(ten);
        hang.appendChild(oTen);

        themO(hang, item.soDienThoai || "—");
        const oNoiDung = themO(hang, item.noiDung || "");
        oNoiDung.className = "noi-dung-gop-y";

        const daXuLy = item.trangThai === "Đã xử lý";
        const oTrangThai = document.createElement("td");
        const trangThai = document.createElement("span");
        trangThai.className = daXuLy ? "trang-thai-gop-y da-xu-ly" : "trang-thai-gop-y";
        trangThai.textContent = daXuLy ? "Đã xử lý" : "Chưa xử lý";
        oTrangThai.appendChild(trangThai);
        hang.appendChild(oTrangThai);

        const oThaoTac = document.createElement("td");
        const nutTrangThai = document.createElement("button");
        nutTrangThai.type = "button";
        nutTrangThai.className = "nut-bam nut-gop-y";
        nutTrangThai.textContent = daXuLy ? "Đánh dấu chưa xử lý" : "Đánh dấu đã xử lý";
        nutTrangThai.addEventListener("click", function () {
            doiTrangThaiGopY(viTriGoc);
        });

        const nutXoa = document.createElement("button");
        nutXoa.type = "button";
        nutXoa.className = "nut-bam nut-gop-y nut-xoa-gop-y";
        nutXoa.textContent = "Xóa";
        nutXoa.addEventListener("click", function () {
            xoaGopY(viTriGoc);
        });
        oThaoTac.append(nutTrangThai, nutXoa);
        hang.appendChild(oThaoTac);
        thanBang.appendChild(hang);
    });

    bang.append(tieuDe, thanBang);
    khung.appendChild(bang);
}

function doiTrangThaiGopY(index) {
    const danhSachGopY = layDanhSachGopY();
    if (!danhSachGopY[index]) return;

    danhSachGopY[index].trangThai = danhSachGopY[index].trangThai === "Đã xử lý" ? "Chưa xử lý" : "Đã xử lý";
    luuDanhSachGopY(danhSachGopY);
    hienThiDanhSachGopY();
}

function xoaGopY(index) {
    if (confirm("Bạn có chắc chắn muốn xóa góp ý này không?")) {
        const danhSachGopY = layDanhSachGopY();
        danhSachGopY.splice(index, 1);
        luuDanhSachGopY(danhSachGopY);
        hienThiDanhSachGopY();
    }
}

function themO(hang, noiDung) {
    const o = document.createElement("td");
    o.textContent = noiDung;
    hang.appendChild(o);
    return o;
}
