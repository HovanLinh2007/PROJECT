// products.js - Khai bao danh sach san pham mau ban dau cho MILO TEA (su dung link anh online)
const danhSachSanPhamBanDau = [
    {
        maSanPham: "SP001",
        tenSanPham: "Trà sữa trân châu truyền thống",
        danhMuc: "tra-sua",
        moTa: "Trà sữa thơm đậm vị trà kết hợp cùng trân châu đen dai giòn sần sật.",
        hinhAnh: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREndYwtkYahFTLjALxy5er-te6Aob0xSbG1zskC6ZM4w&s=10",
        giaSizeM: 35000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Trân châu đen", gia: 5000 },
            { tenTopping: "Thạch phô mai", gia: 8000 },
            { tenTopping: "Pudding trứng", gia: 7000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP002",
        tenSanPham: "Trà sữa ô long nướng",
        danhMuc: "tra-sua",
        moTa: "Ô long rang thơm nức mũi hòa quyện cùng sữa tươi béo ngậy.",
        hinhAnh: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 40000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Trân châu trắng", gia: 5000 },
            { tenTopping: "Sương sáo", gia: 5000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP003",
        tenSanPham: "Trà sữa khoai môn",
        danhMuc: "tra-sua",
        moTa: "Sự kết hợp hoàn hảo giữa trà sữa béo mịn và vị khoai môn ngọt bùi tự nhiên.",
        hinhAnh: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 42000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Trân châu hoàng kim", gia: 6000 },
            { tenTopping: "Kem sữa", gia: 10000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP004",
        tenSanPham: "Trà sữa matcha đậu đỏ",
        danhMuc: "tra-sua",
        moTa: "Matcha Nhật Bản thanh mát kết hợp cùng topping đậu đỏ ngọt dịu.",
        hinhAnh: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 45000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Đậu đỏ", gia: 6000 },
            { tenTopping: "Trân châu đen", gia: 5000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP005",
        tenSanPham: "Trà đào cam sả",
        danhMuc: "tra-trai-cay",
        moTa: "Thức uống giải khát thanh mát với trà đen, đào miếng giòn ngọt và hương sả.",
        hinhAnh: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 38000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Đào miếng", gia: 8000 },
            { tenTopping: "Thạch đào", gia: 6000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP006",
        tenSanPham: "Trà vải hồng hoa",
        danhMuc: "tra-trai-cay",
        moTa: "Trà thơm hương vải ngọt ngào kèm theo những trái vải mọng nước.",
        hinhAnh: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 38000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Vải quả", gia: 8000 },
            { tenTopping: "Trân châu trắng", gia: 5000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP007",
        tenSanPham: "Trà xoài kem cheese",
        danhMuc: "tra-trai-cay",
        moTa: "Xoài tươi xay nhuyễn kết hợp trà hoa lài và lớp kem cheese mặn béo.",
        hinhAnh: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 48000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Kem cheese", gia: 10000 },
            { tenTopping: "Thạch dừa", gia: 5000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP008",
        tenSanPham: "Trà chanh nha đam",
        danhMuc: "tra-trai-cay",
        moTa: "Trà chanh tươi mát lạnh kết hợp topping nha đam giòn sần sật.",
        hinhAnh: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 32000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Nha đam", gia: 6000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP009",
        tenSanPham: "Trà lài nguyên chất",
        danhMuc: "tra-nguyen-chat",
        moTa: "Trà lài ủ lạnh giữ trọn hương vị thanh tao, dịu nhẹ tự nhiên.",
        hinhAnh: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 28000,
        phuPhiSizeL: 4000,
        danhSachTopping: [
            { tenTopping: "Trân châu trắng", gia: 5000 },
            { tenTopping: "Sương sáo", gia: 5000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP010",
        tenSanPham: "Trà đen macchiato",
        danhMuc: "tra-nguyen-chat",
        moTa: "Trà đen đậm đà phủ lớp bọt sữa macchiato sánh mịn thơm béo.",
        hinhAnh: "https://images.unsplash.com/photo-1571934811356-5cc561b6ebc1?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 35000,
        phuPhiSizeL: 5000,
        danhSachTopping: [
            { tenTopping: "Macchiato", gia: 10000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP011",
        tenSanPham: "Đá xay socola chip",
        danhMuc: "da-xay",
        moTa: "Thức uống đá xay mát lạnh vị socola đậm đà cùng những mẩu chocolate chip giòn.",
        hinhAnh: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 50000,
        phuPhiSizeL: 6000,
        danhSachTopping: [
            { tenTopping: "Kem tươi", gia: 8000 },
            { tenTopping: "Chocolate chip", gia: 6000 }
        ],
        conHang: true
    },
    {
        maSanPham: "SP012",
        tenSanPham: "Đá xay matchacookies",
        danhMuc: "da-xay",
        moTa: "Matcha thơm mát xay cùng bánh quy oreo và kem tươi béo ngậy.",
        hinhAnh: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
        giaSizeM: 52000,
        phuPhiSizeL: 6000,
        danhSachTopping: [
            { tenTopping: "Kem tươi", gia: 8000 },
            { tenTopping: "Bánh quy vụn", gia: 6000 }
        ],
        conHang: true
    }
];