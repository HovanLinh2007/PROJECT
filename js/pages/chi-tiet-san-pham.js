// js/pages/chi-tiet-san-pham.js - Xử lý Popup Modal Chi Tiết Sản Phẩm
let sanPhamHienTai = null;

// Mảng 3 loại Topping cố định áp dụng cho TẤT CẢ sản phẩm
const DANH_SACH_TOPPING_CO_DINH = [
    { tenTopping: "Trân châu đen dẻo", gia: 5000 },
    { tenTopping: "Trân châu trắng giòn", gia: 5000 },
    { tenTopping: "Thạch trái cây", gia: 5000 }
];

// Hàm chính hiển thị Popup Modal khi người dùng click vào nút "Tùy chọn & Đặt món"
function hienThiChiTietModal(maSP) {
    const danhSach = typeof layDanhSachSanPham === 'function' ? layDanhSachSanPham() : [];
    if (!danhSach || danhSach.length === 0) return;

    // Tìm sản phẩm theo mã
    sanPhamHienTai = danhSach.find(sp => (sp.maSanPham === maSP || sp.id === maSP));
    if (!sanPhamHienTai) return;

    const khung = document.getElementById("khung-chi-tiet-san-pham");
    if (!khung) return;

    const anhMacDinh = "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80";
    const phuPhiL = sanPhamHienTai.phuPhiSizeL || 5000;

    // Render HTML Popup Modal (Đã xóa bỏ thẻ <span class="tag-danh-muc">)
    khung.innerHTML = `
        <div class="lop-nen-mo" onclick="batTatLopNen(event)">
            <div class="khung-chi-tiet">
                <button class="nut-dong-popup" onclick="dongModal()">&times;</button>
                
                <div class="anh-chi-tiet">
                    <img src="${sanPhamHienTai.hinhAnh || anhMacDinh}" alt="${sanPhamHienTai.tenSanPham}" onerror="this.onerror=null; this.src='${anhMacDinh}';">
                </div>

                <div class="noi-dung-chi-tiet">
                    <h2 class="ten-sp-modal">${sanPhamHienTai.tenSanPham}</h2>
                    <p class="mo-ta-sp-modal">${sanPhamHienTai.moTa || "Hương vị trà tươi thơm ngon đậm đà, chuẩn gu tự nhiên."}</p>
                    <div class="gia-goc-modal">${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(sanPhamHienTai.giaSizeM) : sanPhamHienTai.giaSizeM + 'đ'}</div>

                    <!-- 1. CHỌN SIZE -->
                    <div class="nhom-tuy-chon">
                        <div class="tieu-de-nhom">1. Chọn Size *</div>
                        <div class="danh-sach-lua-chon" style="flex-direction: row; gap: 12px;">
                            <label class="the-size active" style="flex:1;" onclick="chonOption(this, 'nhom-size')">
                                <span><input type="radio" name="nhom-size" value="M" data-phi="0" checked onchange="tinhTongTien()"> Size M</span>
                                <span style="color:#aaa; font-size:12px;">Gốc</span>
                            </label>
                            <label class="the-size" style="flex:1;" onclick="chonOption(this, 'nhom-size')">
                                <span><input type="radio" name="nhom-size" value="L" data-phi="${phuPhiL}" onchange="tinhTongTien()"> Size L</span>
                                <span style="color:#8B5E3C; font-size:12px; font-weight:600;">+${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(phuPhiL) : phuPhiL + 'đ'}</span>
                            </label>
                        </div>
                    </div>

                    <!-- 2. MỨC ĐƯỜNG -->
                    <div class="nhom-tuy-chon">
                        <div class="tieu-de-nhom">2. Mức Đường</div>
                        <div class="luoi-nut-bam">
                            <label class="the-button-option active" onclick="chonOptionButton(this, 'nhom-duong')">
                                <input type="radio" name="nhom-duong" value="100% Đường" checked style="display:none;"> 100%
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-duong')">
                                <input type="radio" name="nhom-duong" value="70% Đường" style="display:none;"> 70%
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-duong')">
                                <input type="radio" name="nhom-duong" value="50% Đường" style="display:none;"> 50%
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-duong')">
                                <input type="radio" name="nhom-duong" value="30% Đường" style="display:none;"> 30%
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-duong')">
                                <input type="radio" name="nhom-duong" value="0% Đường" style="display:none;"> 0%
                            </label>
                        </div>
                    </div>

                    <!-- 3. MỨC ĐÁ -->
                    <div class="nhom-tuy-chon">
                        <div class="tieu-de-nhom">3. Mức Đá</div>
                        <div class="luoi-nut-bam nhom-da-luoi">
                            <label class="the-button-option active" onclick="chonOptionButton(this, 'nhom-da')">
                                <input type="radio" name="nhom-da" value="Bình thường" checked style="display:none;"> Bình thường
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-da')">
                                <input type="radio" name="nhom-da" value="Ít đá" style="display:none;"> Ít đá
                            </label>
                            <label class="the-button-option" onclick="chonOptionButton(this, 'nhom-da')">
                                <input type="radio" name="nhom-da" value="Không đá" style="display:none;"> Không đá
                            </label>
                        </div>
                    </div>

                    <!-- 4. THÊM TOPPING (CỐ ĐỊNH 3 LOẠI CHO MỌI SẢN PHẨM) -->
                    <div class="nhom-tuy-chon">
                        <div class="tieu-de-nhom">4. Thêm Topping (+5.000đ/loại)</div>
                        <div class="danh-sach-lua-chon">
                            ${DANH_SACH_TOPPING_CO_DINH.map(t => `
                                <label class="the-topping" onclick="doiTrangThaiCheckbox(this)">
                                    <span style="display:flex; align-items:center;">
                                        <input type="checkbox" class="chon-topping" value="${t.gia}" data-ten="${t.tenTopping}" onchange="tinhTongTien()">
                                        ${t.tenTopping}
                                    </span>
                                    <span class="gia-cong-them">+${typeof dinhDangTienTe === 'function' ? dinhDangTienTe(t.gia) : t.gia + 'đ'}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <!-- SỐ LƯỢNG MÓN -->
                    <div class="hang-so-luong">
                        <span style="font-weight: bold; font-size: 14px;">Số lượng:</span>
                        <div class="bo-tang-giam-sl">
                            <button class="nut-sl" onclick="thayDoiSoLuong(-1)">-</button>
                            <input type="number" id="so-luong-mon" value="1" min="1" readonly class="o-so-luong">
                            <button class="nut-sl" onclick="thayDoiSoLuong(1)">+</button>
                        </div>
                    </div>

                    <!-- THANH TỔNG TIỀN VÀ NÚT ĐẶT MÓN -->
                    <div class="thanh-dat-mon-bottom">
                        <div class="nhom-tong-tien">
                            <span>TỔNG TIỀN MÓN NÀY:</span>
                            <div class="tong-tien-hang" id="hien-thi-tong-tien">0đ</div>
                        </div>
                        <button class="nut-bam" onclick="themMonVaoGioHang()">+ Thêm Vào Giỏ Hàng</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    tinhTongTien();
}

// Xử lý active nút Radio Size
function chonOption(theLabel, tenNhom) {
    document.querySelectorAll(`input[name="${tenNhom}"]`).forEach(input => {
        const p = input.closest('.the-size');
        if (p) p.classList.remove('active');
    });
    theLabel.classList.add('active');
    const rad = theLabel.querySelector('input[type="radio"]');
    if (rad) { rad.checked = true; tinhTongTien(); }
}

// Xử lý active các nút Mức Đường & Đá
function chonOptionButton(theLabel, tenNhom) {
    document.querySelectorAll(`input[name="${tenNhom}"]`).forEach(input => {
        const p = input.closest('.the-button-option');
        if (p) p.classList.remove('active');
    });
    theLabel.classList.add('active');
    const rad = theLabel.querySelector('input[type="radio"]');
    if (rad) { rad.checked = true; tinhTongTien(); }
}

// Xử lý active Checkbox Topping (Bật/tắt class active và đồng bộ ô tích)
function doiTrangThaiCheckbox(theLabel) {
    const cb = theLabel.querySelector('input[type="checkbox"]');
    if (cb) {
        cb.checked = !cb.checked;
        if (cb.checked) {
            theLabel.classList.add('active');
        } else {
            theLabel.classList.remove('active');
        }
        tinhTongTien();
    }
}

// Tăng / Giảm số lượng món
function thayDoiSoLuong(delta) {
    const ôSL = document.getElementById("so-luong-mon");
    let giaTri = Number(ôSL.value) + delta;
    if (giaTri < 1) giaTri = 1;
    ôSL.value = giaTri;
    tinhTongTien();
}

// Tính toán tổng tiền theo lựa chọn
function tinhTongTien() {
    if (!sanPhamHienTai) return 0;

    const giaGoc = sanPhamHienTai.giaSizeM || 30000;
    const sizeDuocChon = document.querySelector('input[name="nhom-size"]:checked');
    const phiSize = sizeDuocChon ? Number(sizeDuocChon.getAttribute("data-phi")) : 0;

    let tongTopping = 0;
    document.querySelectorAll(".chon-topping:checked").forEach(cb => {
        tongTopping += Number(cb.value);
    });

    const ôSL = document.getElementById("so-luong-mon");
    const soLuong = ôSL ? Math.max(1, Number(ôSL.value)) : 1;

    const tongTien = (giaGoc + phiSize + tongTopping) * soLuong;

    const theTongTien = document.getElementById("hien-thi-tong-tien");
    if (theTongTien) {
        theTongTien.innerText = typeof dinhDangTienTe === 'function' ? dinhDangTienTe(tongTien) : tongTien.toLocaleString('vi-VN') + "đ";
    }

    return tongTien;
}

// Thêm sản phẩm vào giỏ hàng
function themMonVaoGioHang() {
    const sizeElem = document.querySelector('input[name="nhom-size"]:checked');
    const duongElem = document.querySelector('input[name="nhom-duong"]:checked');
    const daElem = document.querySelector('input[name="nhom-da"]:checked');

    const size = sizeElem ? sizeElem.value : "M";
    const duong = duongElem ? duongElem.value : "100% Đường";
    const da = daElem ? daElem.value : "Bình thường";
    const soLuong = Number(document.getElementById("so-luong-mon").value);

    let danhSachToppingChon = [];
    document.querySelectorAll(".chon-topping:checked").forEach(cb => {
        danhSachToppingChon.push(cb.getAttribute("data-ten"));
    });

    const phiSize = sizeElem ? Number(sizeElem.getAttribute("data-phi")) : 0;
    let tongTopping = 0;
    document.querySelectorAll(".chon-topping:checked").forEach(cb => tongTopping += Number(cb.value));

    const donGia = sanPhamHienTai.giaSizeM + phiSize + tongTopping;

    const monMoi = {
        idMon: Date.now(),
        maSanPham: sanPhamHienTai.maSanPham || sanPhamHienTai.id,
        tenSanPham: sanPhamHienTai.tenSanPham,
        hinhAnh: sanPhamHienTai.hinhAnh,
        size: size,
        duong: duong,
        da: da,
        topping: danhSachToppingChon,
        donGia: donGia,
        soLuong: soLuong,
        thanhTien: donGia * soLuong
    };

    let gioHang = typeof layGioHang === 'function' ? layGioHang() : [];
    gioHang.push(monMoi);
    
    if (typeof luuGioHang === 'function') {
        luuGioHang(gioHang);
    } else {
        localStorage.setItem("milo_gio_hang", JSON.stringify(gioHang));
    }

    if (typeof capNhatSoLuongGioHangHeader === 'function') {
        capNhatSoLuongGioHangHeader();
    }
    
    if (typeof hienThongBao === 'function') {
        hienThongBao("Đã thêm sản phẩm vào giỏ hàng!");
    } else {
        alert("Đã thêm sản phẩm vào giỏ hàng!");
    }

    dongModal();
}

// Hàm đóng Modal Popup
function dongModal() {
    const khung = document.getElementById("khung-chi-tiet-san-pham");
    if (khung) khung.innerHTML = "";
}

function batTatLopNen(event) {
    if (event.target.classList.contains("lop-nen-mo")) {
        dongModal();
    }
}