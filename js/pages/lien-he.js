document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-lien-he");
    const ketQua = document.getElementById("thong-bao-ket-qua");

    if (!form || !ketQua) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const hoTen = document.getElementById("ho-ten").value.trim();
        const soDienThoai = document.getElementById("so-dien-thoai").value.trim();
        const noiDung = document.getElementById("noi-dung").value.trim();

        if (!hoTen || !soDienThoai || !noiDung) {
            ketQua.textContent = "Vui lòng điền đầy đủ thông tin.";
            ketQua.classList.remove("lien-he__ket-qua--thanh-cong");
            ketQua.classList.add("lien-he__ket-qua--loi");
            ketQua.setAttribute("role", "alert");
            return;
        }

        try {
            const danhSachGopY = layDanhSachGopY();
            danhSachGopY.push({
                hoTen: hoTen,
                soDienThoai: soDienThoai,
                noiDung: noiDung,
                ngayGui: new Date().toLocaleString("vi-VN"),
                trangThai: "Chưa xử lý"
            });
            luuDanhSachGopY(danhSachGopY);
        } catch (error) {
            console.error("Không thể lưu góp ý của khách hàng.", error);
            ketQua.textContent = "Không thể gửi thông tin lúc này. Vui lòng thử lại.";
            ketQua.classList.remove("lien-he__ket-qua--thanh-cong");
            ketQua.classList.add("lien-he__ket-qua--loi");
            ketQua.setAttribute("role", "alert");
            return;
        }

        ketQua.textContent = `Cảm ơn ${hoTen}! Chúng tôi đã nhận được thông tin liên hệ của bạn.`;
        ketQua.classList.remove("lien-he__ket-qua--loi");
        ketQua.classList.add("lien-he__ket-qua--thanh-cong");
        ketQua.setAttribute("role", "status");
        form.reset();
    });
});
