
const KHOA_SAN_PHAM = "milo_danh_sach_san_pham";

const DUONG_DAN_DU_LIEU = "./js/data/products.json";

const ANH_MAC_DINH =
    "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";

let danhSachSanPham = [];
let boLocHienTai = "all";
let maDangSua = null;

const danhSachEl = document.getElementById("danh-sach-san-pham-admin");
const timKiemEl = document.getElementById("tim-kiem-san-pham");
const demEl = document.getElementById("so-luong-san-pham");
const modalEl = document.getElementById("modal-san-pham");
const formEl = document.getElementById("form-san-pham");

// Định dạng tiền Việt Nam
function dinhDangTienTe(gia) {
    return new Intl.NumberFormat("vi-VN").format(gia || 0) + " đ";
}

// Lưu sản phẩm vào LocalStorage
function luuDanhSachSanPham() {
    localStorage.setItem(
        KHOA_SAN_PHAM,
        JSON.stringify(danhSachSanPham)
    );
}

// Đọc dữ liệu sản phẩm
async function napDanhSachSanPham() {
    const duLieuCu = localStorage.getItem(KHOA_SAN_PHAM);

    if (duLieuCu !== null) {
        danhSachSanPham = JSON.parse(duLieuCu);
    } else {
        try {
            const response = await fetch(DUONG_DAN_DU_LIEU);

            if (!response.ok) {
                throw new Error("Không tải được dữ liệu sản phẩm");
            }

            danhSachSanPham = await response.json();

            luuDanhSachSanPham();

        } catch (error) {
            console.error(error);
            danhSachSanPham = [];
        }
    }

    hienThiSanPham();
}

// Tên danh mục
function tenDanhMuc(danhMuc) {
    const danhSach = {
        "tra-sua": "Trà sữa",
        "tra-trai-cay": "Trà trái cây",
        "tra-nguyen-chat": "Trà nguyên chất",
        "da-xay": "Đá xay"
    };

    return danhSach[danhMuc] || "Khác";
}

// Kiểm tra bộ lọc
function kiemTraBoLoc(sp) {
    if (boLocHienTai === "all") return true;

    if (boLocHienTai === "other") {
        return ["tra-nguyen-chat", "da-xay"].includes(sp.danhMuc);
    }

    return sp.danhMuc === boLocHienTai;
}

// Tạo thẻ sản phẩm
function taoTheSanPham(sp) {

    const the = document.createElement("article");
    the.className = "the-san-pham-admin";

    const thongTin = document.createElement("div");
    thongTin.className = "thong-tin-the";

    const anh = document.createElement("img");
    anh.className = "anh-san-pham-admin";
    anh.src = sp.hinhAnh || sp.hinh || ANH_MAC_DINH;
    anh.alt = sp.tenSanPham || "Ảnh sản phẩm";

    anh.onerror = function () {
        this.onerror = null;
        this.src = ANH_MAC_DINH;
    };

    const noiDung = document.createElement("div");
    noiDung.className = "noi-dung-san-pham-admin";

    const danhMuc = document.createElement("p");
    danhMuc.className = "danh-muc-admin";
    danhMuc.textContent = tenDanhMuc(sp.danhMuc);

    const ten = document.createElement("h3");
    ten.className = "ten-san-pham-admin";
    ten.textContent = sp.tenSanPham;

    const gia = document.createElement("p");
    gia.className = "gia-san-pham-admin";
    gia.textContent = dinhDangTienTe(sp.giaSizeM);

    const trangThai = document.createElement("p");
    trangThai.className = "trang-thai-san-pham";
    trangThai.textContent = sp.conHang ? "Đang bán" : "Hết hàng";

    if (!sp.conHang) {
        trangThai.classList.add("het-hang");
    }

    noiDung.append(danhMuc, ten, gia, trangThai);
    thongTin.append(anh, noiDung);

    // Nút sửa và xóa
    const hanhDong = document.createElement("div");
    hanhDong.className = "hanh-dong-san-pham";

    const nutSua = document.createElement("button");
    nutSua.textContent = "Sửa";
    nutSua.type = "button";
    nutSua.className = "btn-sua-san-pham";
    nutSua.onclick = () => moFormSua(sp.maSanPham);

    const nutXoa = document.createElement("button");
    nutXoa.textContent = "Xóa";
    nutXoa.type = "button";
    nutXoa.className = "btn-xoa-san-pham";
    nutXoa.onclick = () => xoaSanPham(sp.maSanPham);

    hanhDong.append(nutSua, nutXoa);

    the.append(thongTin, hanhDong);

    return the;
}

// Hiển thị sản phẩm
function hienThiSanPham() {

    const tuKhoa = timKiemEl.value.toLowerCase().trim();

    const ketQua = danhSachSanPham.filter(sp => {

        const noiDung =
            `${sp.maSanPham} ${sp.tenSanPham}`.toLowerCase();

        return noiDung.includes(tuKhoa) && kiemTraBoLoc(sp);
    });

    demEl.textContent = danhSachSanPham.length + " sản phẩm";

    danhSachEl.innerHTML = "";

    if (ketQua.length === 0) {
        danhSachEl.innerHTML =
            '<div class="khong-co-san-pham">Không tìm thấy sản phẩm.</div>';
        return;
    }

    ketQua.forEach(sp => {
        danhSachEl.appendChild(taoTheSanPham(sp));
    });
}

// Mở modal
function moModal() {
    modalEl.classList.add("dang-mo");
    document.body.style.overflow = "hidden";
}

// Đóng modal
function dongModal() {
    modalEl.classList.remove("dang-mo");
    document.body.style.overflow = "";

    formEl.reset();

    document.getElementById("ma-san-pham").disabled = false;

    maDangSua = null;
}

// Thêm sản phẩm
function moFormThem() {

    formEl.reset();

    maDangSua = null;

    document.getElementById("tieu-de-modal").textContent =
        "Thêm sản phẩm";

    document.getElementById("phu-phi-size-l").value = 5000;

    document.getElementById("con-hang-san-pham").checked = true;

    document.getElementById("loi-form").textContent = "";

    moModal();
}

// Sửa sản phẩm
function moFormSua(ma) {

    const sp = danhSachSanPham.find(
        item => item.maSanPham === ma
    );

    if (!sp) return;

    maDangSua = ma;

    document.getElementById("tieu-de-modal").textContent =
        "Sửa sản phẩm";

    document.getElementById("ma-san-pham").value = sp.maSanPham;
    document.getElementById("ma-san-pham").disabled = true;

    document.getElementById("ten-san-pham").value = sp.tenSanPham;
    document.getElementById("danh-muc-san-pham").value = sp.danhMuc;
    document.getElementById("gia-san-pham").value = sp.giaSizeM;
    document.getElementById("phu-phi-size-l").value = sp.phuPhiSizeL || 0;
    document.getElementById("hinh-anh-san-pham").value = sp.hinhAnh || "";
    document.getElementById("mo-ta-san-pham").value = sp.moTa || "";
    document.getElementById("con-hang-san-pham").checked = Boolean(sp.conHang);

    const toppings = sp.danhSachTopping || sp.toppings || [];

    document.getElementById("topping-san-pham").value =
        toppings.map(t => `${t.tenTopping || t.ten} | ${t.gia}`).join("\n");

    document.getElementById("loi-form").textContent = "";

    moModal();
}

// Đọc danh sách topping
function docTopping() {

    const noiDung = document.getElementById("topping-san-pham").value;

    return noiDung
        .split("\n")
        .filter(dong => dong.trim() !== "")
        .map(dong => {

            const [tenTopping, gia] = dong.split("|");

            return {
                tenTopping: tenTopping.trim(),
                gia: Number(gia) || 0
            };
        });
}

// Lưu sản phẩm
function luuSanPham(event) {

    event.preventDefault();

    const ma = document.getElementById("ma-san-pham").value.trim();

    const sanPham = {

        maSanPham: ma,

        tenSanPham:
            document.getElementById("ten-san-pham").value.trim(),

        danhMuc:
            document.getElementById("danh-muc-san-pham").value,

        giaSizeM:
            Number(document.getElementById("gia-san-pham").value),

        phuPhiSizeL:
            Number(document.getElementById("phu-phi-size-l").value) || 0,

        hinhAnh:
            document.getElementById("hinh-anh-san-pham").value.trim() || ANH_MAC_DINH,

        moTa:
            document.getElementById("mo-ta-san-pham").value.trim(),

        danhSachTopping: docTopping(),

        conHang:
            document.getElementById("con-hang-san-pham").checked
    };

    const loi = document.getElementById("loi-form");

    if (!sanPham.tenSanPham || sanPham.giaSizeM < 0 || !Number.isFinite(sanPham.giaSizeM)) {
        loi.textContent = "Vui lòng nhập tên và giá hợp lệ.";
        return;
    }

    if (
        !maDangSua &&
        danhSachSanPham.some(sp => sp.maSanPham === ma)
    ) {
        loi.textContent = "Mã sản phẩm đã tồn tại.";
        return;
    }

    if (maDangSua) {

        const viTri = danhSachSanPham.findIndex(
            sp => sp.maSanPham === maDangSua
        );

        danhSachSanPham[viTri] = sanPham;

    } else {

        danhSachSanPham.push(sanPham);
    }

    luuDanhSachSanPham();

    hienThiSanPham();

    dongModal();
}

// Xóa sản phẩm
function xoaSanPham(ma) {

    const xacNhan = confirm("Bạn có chắc muốn xóa sản phẩm này không?");

    if (!xacNhan) return;

    danhSachSanPham = danhSachSanPham.filter(
        sp => sp.maSanPham !== ma
    );

    luuDanhSachSanPham();

    hienThiSanPham();
}

// Sự kiện
document.getElementById("btn-them-san-pham")
    .addEventListener("click", moFormThem);

document.getElementById("btn-dong-modal")
    .addEventListener("click", dongModal);

document.getElementById("btn-huy-modal")
    .addEventListener("click", dongModal);

formEl.addEventListener("submit", luuSanPham);

timKiemEl.addEventListener("input", hienThiSanPham);

// Lọc danh mục
document.querySelectorAll(".nut-loc").forEach(nut => {

    nut.addEventListener("click", function () {

        document.querySelectorAll(".nut-loc").forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        boLocHienTai = this.dataset.filter;

        hienThiSanPham();
    });
});

// Đóng modal khi bấm ra ngoài
modalEl.addEventListener("click", function (event) {
    if (event.target === modalEl) {
        dongModal();
    }
});

// Khởi chạy
napDanhSachSanPham();
