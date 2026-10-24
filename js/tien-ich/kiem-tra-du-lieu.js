// kiem-tra-du-lieu.js - Kiem tra du lieu dau vao
function kiemTraSoDienThoai(sdt) {
    const bieuThucChinhChu = /^(03|05|07|08|09)[0-9]{8}$/;
    return bieuThucChinhChu.test(sdt);
}

function kiemTraBoTrong(giaTri) {
    return giaTri.trim() !== "";
}