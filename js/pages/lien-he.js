

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-lien-he");
    const ketQua = document.getElementById("thong-bao-ket-qua");

    if (!form || !ketQua) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const hoTen = document.getElementById("ho-ten").value.trim();
        const soDienThoai = document
            .getElementById("so-dien-thoai")
            .value.trim();
        const noiDung = document.getElementById("noi-dung").value.trim();

        if (!hoTen || !soDienThoai || !noiDung) {
            ketQua.textContent = "Vui lòng điền đầy đủ thông tin.";
            ketQua.style.color = 


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-lien-he");
    const ketQua = document.getElementById("thong-bao-ket-qua");

    if (!form || !ketQua) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const hoTen = document.getElementById("ho-ten").value.trim();
        const soDienThoai = document
            .getElementById("so-dien-thoai")
            .value.trim();
        const noiDung = document.getElementById("noi-dung").value.trim();

        if (!hoTen || !soDienThoai || !noiDung) {
            ketQua.textContent = "Vui lòng điền đầy đủ thông tin.";
            ketQua.style.color = "#dc2626";
            return;
        }

        ketQua.textContent =
            "Cảm ơn bạn, " + hoTen +
            "! Thông tin liên hệ đã được kiểm tra (mô phỏng).";

        ketQua.style.color = "#287a3d";

        form.reset();
    });
});
;
            return;
        }

        ketQua.textContent =
            "Cảm ơn bạn, " + hoTen +
            "! Thông tin liên hệ đã được kiểm tra (mô phỏng).";

        ketQua.style.color = "#287a3d";

        form.reset();
    });
});
