CREATE DATABASE IF NOT EXISTS quan_ly_du_lich
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE quan_ly_du_lich;

CREATE TABLE nguoi_dung (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(200) NOT NULL,
    so_dien_thoai VARCHAR(20) NULL,
    dia_chi VARCHAR(300) NULL,
    anh_dai_dien VARCHAR(500) NULL,
    vai_tro ENUM('admin', 'khach_hang') NOT NULL DEFAULT 'khach_hang',
    trang_thai ENUM('hoat_dong', 'bi_khoa') NOT NULL DEFAULT 'hoat_dong',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_nguoi_dung_vai_tro_trang_thai
ON nguoi_dung(vai_tro, trang_thai);

-- =========================================================
-- 2. LOAI TOUR
-- =========================================================
CREATE TABLE loai_tour (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_loai VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT NULL,
    trang_thai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- 3. DIA DIEM
-- =========================================================
CREATE TABLE dia_diem (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ten_dia_diem VARCHAR(200) NOT NULL,
    tinh_thanh VARCHAR(100) NULL,
    quoc_gia VARCHAR(100) NOT NULL DEFAULT 'Viet Nam',
    mo_ta TEXT NULL,
    trang_thai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_dia_diem_tinh_thanh_quoc_gia
ON dia_diem(tinh_thanh, quoc_gia);

-- =========================================================
-- 4. TOUR
-- =========================================================
CREATE TABLE tour (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_tour VARCHAR(50) NOT NULL UNIQUE,
    ten_tour VARCHAR(300) NOT NULL,
    loai_tour_id BIGINT UNSIGNED NOT NULL,
    diem_xuat_phat_id BIGINT UNSIGNED NOT NULL,
    so_ngay TINYINT UNSIGNED NOT NULL,
    so_dem TINYINT UNSIGNED NOT NULL,
    phuong_tien VARCHAR(100) NULL,
    gia_tu_tham_khao DECIMAL(15,2) NOT NULL DEFAULT 0,
    mo_ta_ngan VARCHAR(500) NULL,
    mo_ta_chi_tiet LONGTEXT NULL,
    dieu_kien_tour LONGTEXT NULL,
    is_noi_bat BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai ENUM('nhap', 'dang_mo_ban', 'tam_ngung', 'an', 'ngung_kinh_doanh') NOT NULL DEFAULT 'nhap',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_tour_so_dem CHECK (so_dem <= so_ngay),
    CONSTRAINT fk_tour_loai_tour FOREIGN KEY (loai_tour_id) REFERENCES loai_tour(id),
    CONSTRAINT fk_tour_diem_xuat_phat FOREIGN KEY (diem_xuat_phat_id) REFERENCES dia_diem(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tour_tim_kiem
ON tour(trang_thai, loai_tour_id, diem_xuat_phat_id, is_noi_bat, gia_tu_tham_khao);

-- =========================================================
-- 5. TOUR - DIEM DEN
-- =========================================================
CREATE TABLE tour_diem_den (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    dia_diem_id BIGINT UNSIGNED NOT NULL,
    thu_tu SMALLINT UNSIGNED NOT NULL,
    ghi_chu VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tour_diem_den_thu_tu (tour_id, thu_tu),
    CONSTRAINT fk_tour_diem_den_tour FOREIGN KEY (tour_id) REFERENCES tour(id),
    CONSTRAINT fk_tour_diem_den_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tour_diem_den_dia_diem
ON tour_diem_den(dia_diem_id, tour_id);

-- =========================================================
-- 6. ANH TOUR
-- =========================================================
CREATE TABLE anh_tour (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    link_anh VARCHAR(500) NOT NULL,
    mo_ta VARCHAR(300) NULL,
    is_avatar BOOLEAN NOT NULL DEFAULT FALSE,
    thu_tu SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    avatar_tour_id BIGINT UNSIGNED GENERATED ALWAYS AS (
        CASE WHEN is_avatar = 1 THEN tour_id ELSE NULL END
    ) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_anh_tour_mot_avatar (avatar_tour_id),
    CONSTRAINT fk_anh_tour_tour FOREIGN KEY (tour_id) REFERENCES tour(id)
) ENGINE=InnoDB;

CREATE INDEX idx_anh_tour_tour
ON anh_tour(tour_id, thu_tu);

-- =========================================================
-- 7. LICH TRINH TOUR
-- Phan biet ro:
-- - so_ngay / so_dem la thoi gian tong the
-- - gio_bat_dau / gio_ket_thuc la thoi diem chi tiet trong tour
-- =========================================================
CREATE TABLE lich_trinh (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    ngay_thu TINYINT UNSIGNED NOT NULL,
    thu_tu_trong_ngay SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    gio_bat_dau TIME NULL,
    gio_ket_thuc TIME NULL,
    tieu_de VARCHAR(300) NULL,
    noi_dung TEXT NULL,
    dia_diem_id BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_lich_trinh (tour_id, ngay_thu, thu_tu_trong_ngay),
    CONSTRAINT chk_lich_trinh_gio CHECK (
        gio_ket_thuc IS NULL OR gio_bat_dau IS NULL OR gio_ket_thuc >= gio_bat_dau
    ),
    CONSTRAINT fk_lich_trinh_tour FOREIGN KEY (tour_id) REFERENCES tour(id),
    CONSTRAINT fk_lich_trinh_dia_diem FOREIGN KEY (dia_diem_id) REFERENCES dia_diem(id)
) ENGINE=InnoDB;

CREATE INDEX idx_lich_trinh_tour_ngay
ON lich_trinh(tour_id, ngay_thu, thu_tu_trong_ngay);

-- =========================================================
-- 8. LICH KHOI HANH
-- Bo cot so_cho_da_dat de tranh du thua.
-- So cho da dat se tinh tu booking hop le.
-- =========================================================
CREATE TABLE lich_khoi_hanh (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT UNSIGNED NOT NULL,
    ma_dot_tour VARCHAR(50) NOT NULL UNIQUE,
    ngay_khoi_hanh DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    noi_tap_trung VARCHAR(300) NULL,
    so_cho_toi_da SMALLINT UNSIGNED NOT NULL,
    ghi_chu VARCHAR(500) NULL,
    ly_do_huy VARCHAR(500) NULL,
    trang_thai ENUM('mo_ban', 'het_cho', 'da_khoi_hanh', 'da_ket_thuc', 'da_huy') NOT NULL DEFAULT 'mo_ban',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_lich_khoi_hanh_ngay CHECK (ngay_ket_thuc >= ngay_khoi_hanh),
    CONSTRAINT fk_lich_khoi_hanh_tour FOREIGN KEY (tour_id) REFERENCES tour(id)
) ENGINE=InnoDB;

CREATE INDEX idx_lich_khoi_hanh_tim_kiem
ON lich_khoi_hanh(tour_id, ngay_khoi_hanh, trang_thai);

-- =========================================================
-- 9. BANG GIA LICH KHOI HANH
-- Ho tro gia ngay thuong / cuoi tuan + nhieu loai khach
-- =========================================================
CREATE TABLE bang_gia_lich_khoi_hanh (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lich_khoi_hanh_id BIGINT UNSIGNED NOT NULL,
    loai_khach ENUM('nguoi_lon', 'tre_em', 'em_be') NOT NULL,
    loai_gia ENUM('ngay_thuong', 'cuoi_tuan') NOT NULL,
    don_gia DECIMAL(15,2) NOT NULL,
    mo_ta VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_bang_gia_lich_khoi_hanh (lich_khoi_hanh_id, loai_khach, loai_gia),
    CONSTRAINT chk_bang_gia_duong CHECK (don_gia >= 0),
    CONSTRAINT fk_bang_gia_lich_khoi_hanh FOREIGN KEY (lich_khoi_hanh_id) REFERENCES lich_khoi_hanh(id)
) ENGINE=InnoDB;

CREATE INDEX idx_bang_gia_lich_khoi_hanh
ON bang_gia_lich_khoi_hanh(lich_khoi_hanh_id, loai_khach, loai_gia);

-- =========================================================
-- 10. VOUCHER
-- Bo sung giam_toi_da de ho tro voucher phan tram thuc te hon
-- tour_id = NULL => ap dung toan he thong
-- =========================================================
CREATE TABLE voucher (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_voucher VARCHAR(50) NOT NULL UNIQUE,
    ten_voucher VARCHAR(200) NOT NULL,
    tour_id BIGINT UNSIGNED NULL,
    kieu_giam ENUM('phan_tram', 'so_tien') NOT NULL,
    gia_tri_giam DECIMAL(15,2) NOT NULL,
    giam_toi_da DECIMAL(15,2) NULL,
    don_hang_toi_thieu DECIMAL(15,2) NOT NULL DEFAULT 0,
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    so_luong_toi_da INT UNSIGNED NOT NULL DEFAULT 0,
    so_luong_da_dung INT UNSIGNED NOT NULL DEFAULT 0,
    mo_ta VARCHAR(500) NULL,
    trang_thai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_voucher_ngay CHECK (ngay_ket_thuc >= ngay_bat_dau),
    CONSTRAINT chk_voucher_so_luong CHECK (so_luong_da_dung <= so_luong_toi_da),
    CONSTRAINT chk_voucher_gia_tri CHECK (
        (kieu_giam = 'phan_tram' AND gia_tri_giam > 0 AND gia_tri_giam <= 100)
        OR
        (kieu_giam = 'so_tien' AND gia_tri_giam > 0)
    ),
    CONSTRAINT fk_voucher_tour FOREIGN KEY (tour_id) REFERENCES tour(id)
) ENGINE=InnoDB;

-- =========================================================
-- 11. BOOKING
-- =========================================================
CREATE TABLE booking (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_booking VARCHAR(50) NOT NULL UNIQUE,
    lich_khoi_hanh_id BIGINT UNSIGNED NOT NULL,
    nguoi_dung_id BIGINT UNSIGNED NOT NULL,
    voucher_id BIGINT UNSIGNED NULL,

    ho_ten_lien_he VARCHAR(200) NOT NULL,
    email_lien_he VARCHAR(255) NOT NULL,
    so_dien_thoai_lien_he VARCHAR(20) NOT NULL,
    dia_chi_lien_he VARCHAR(300) NULL,

    ngay_dat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    so_nguoi_lon SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    so_tre_em SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    so_em_be SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    tong_hanh_khach SMALLINT UNSIGNED GENERATED ALWAYS AS (
        so_nguoi_lon + so_tre_em + so_em_be
    ) STORED,

    loai_gia_ap_dung ENUM('ngay_thuong', 'cuoi_tuan') NOT NULL DEFAULT 'ngay_thuong',

    don_gia_nguoi_lon DECIMAL(15,2) NOT NULL DEFAULT 0,
    don_gia_tre_em DECIMAL(15,2) NOT NULL DEFAULT 0,
    don_gia_em_be DECIMAL(15,2) NOT NULL DEFAULT 0,

    tam_tinh DECIMAL(15,2) NOT NULL DEFAULT 0,
    giam_gia DECIMAL(15,2) NOT NULL DEFAULT 0,
    tong_tien DECIMAL(15,2) NOT NULL DEFAULT 0,
    so_tien_da_thanh_toan DECIMAL(15,2) NOT NULL DEFAULT 0,
    tien_coc_yeu_cau DECIMAL(15,2) NOT NULL DEFAULT 0,

    phuong_thuc_thanh_toan_du_kien ENUM('tien_mat', 'chuyen_khoan', 'the', 'vi_dien_tu', 'cong_thanh_toan') NULL,

    trang_thai_booking ENUM('moi_tao', 'cho_thanh_toan', 'da_coc', 'da_xac_nhan', 'da_huy', 'hoan_tat') NOT NULL DEFAULT 'cho_thanh_toan',
    trang_thai_thanh_toan ENUM('chua_thanh_toan', 'thanh_toan_mot_phan', 'da_thanh_toan_du', 'that_bai', 'da_hoan_tien') NOT NULL DEFAULT 'chua_thanh_toan',

    han_thanh_toan DATETIME NULL,
    ghi_chu TEXT NULL,

    nguoi_xac_nhan_id BIGINT UNSIGNED NULL,
    thoi_gian_xac_nhan DATETIME NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_booking_khach CHECK (so_nguoi_lon >= 1),
    CONSTRAINT chk_booking_giam_gia CHECK (giam_gia <= tam_tinh),
    CONSTRAINT chk_booking_tien_da_tt CHECK (so_tien_da_thanh_toan <= tong_tien),
    CONSTRAINT chk_booking_tien_coc CHECK (tien_coc_yeu_cau <= tong_tien),

    CONSTRAINT fk_booking_lich_khoi_hanh FOREIGN KEY (lich_khoi_hanh_id) REFERENCES lich_khoi_hanh(id),
    CONSTRAINT fk_booking_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    CONSTRAINT fk_booking_voucher FOREIGN KEY (voucher_id) REFERENCES voucher(id),
    CONSTRAINT fk_booking_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_booking_nguoi_dung
ON booking(nguoi_dung_id, ngay_dat);

CREATE INDEX idx_booking_trang_thai
ON booking(trang_thai_booking, trang_thai_thanh_toan, ngay_dat);

CREATE INDEX idx_booking_lich_khoi_hanh
ON booking(lich_khoi_hanh_id);

-- =========================================================
-- 12. HANH KHACH
-- =========================================================
CREATE TABLE hanh_khach (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    ho_ten VARCHAR(200) NOT NULL,
    loai_khach ENUM('nguoi_lon', 'tre_em', 'em_be') NOT NULL,
    ngay_sinh DATE NULL,
    gioi_tinh ENUM('nam', 'nu', 'khac') NULL,
    so_giay_to VARCHAR(50) NULL,
    quoc_tich VARCHAR(100) NULL,
    ghi_chu VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hanh_khach_booking FOREIGN KEY (booking_id) REFERENCES booking(id)
) ENGINE=InnoDB;

CREATE INDEX idx_hanh_khach_booking
ON hanh_khach(booking_id, loai_khach);

-- =========================================================
-- 13. THANH TOAN

-- =========================================================
CREATE TABLE thanh_toan (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,

    loai_giao_dich ENUM('dat_coc', 'thanh_toan_con_lai', 'thanh_toan_toan_bo', 'hoan_tien') NOT NULL DEFAULT 'thanh_toan_toan_bo',
    kenh_thanh_toan ENUM('noi_bo', 'ben_thu_ba') NOT NULL DEFAULT 'noi_bo',
    phuong_thuc_thanh_toan ENUM('tien_mat', 'chuyen_khoan', 'the', 'vi_dien_tu', 'cong_thanh_toan') NOT NULL,

    nha_cung_cap VARCHAR(100) NULL,
    so_tien DECIMAL(15,2) NOT NULL,
    ma_giao_dich_noi_bo VARCHAR(100) NULL,
    ma_giao_dich_ben_thu_ba VARCHAR(150) NULL,
    ma_tham_chieu_ben_thu_ba VARCHAR(150) NULL,

    trang_thai ENUM('khoi_tao', 'cho_xu_ly', 'thanh_cong', 'that_bai', 'da_hoan_tien') NOT NULL DEFAULT 'cho_xu_ly',

    du_lieu_phan_hoi JSON NULL,
    ghi_chu VARCHAR(500) NULL,

    nguoi_xac_nhan_id BIGINT UNSIGNED NULL,
    thoi_gian_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thoi_gian_xac_nhan DATETIME NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_thanh_toan_so_tien CHECK (so_tien > 0),
    CONSTRAINT fk_thanh_toan_booking FOREIGN KEY (booking_id) REFERENCES booking(id),
    CONSTRAINT fk_thanh_toan_nguoi_xac_nhan FOREIGN KEY (nguoi_xac_nhan_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_thanh_toan_booking
ON thanh_toan(booking_id, trang_thai, thoi_gian_tao);

CREATE INDEX idx_thanh_toan_ma_giao_dich_ben_thu_ba
ON thanh_toan(ma_giao_dich_ben_thu_ba);

-- =========================================================
-- 14. HOA DON
-- =========================================================
CREATE TABLE hoa_don (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL UNIQUE,
    so_hoa_don VARCHAR(50) NOT NULL UNIQUE,
    ngay_lap DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tong_tien_truoc_thue DECIMAL(15,2) NOT NULL DEFAULT 0,
    thue_vat DECIMAL(15,2) NOT NULL DEFAULT 0,
    tong_thanh_toan DECIMAL(15,2) NOT NULL DEFAULT 0,
    email_nhan_hoa_don VARCHAR(255) NULL,
    file_pdf VARCHAR(500) NULL,
    ghi_chu VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_hoa_don_tien CHECK (
        tong_tien_truoc_thue >= 0 AND thue_vat >= 0 AND tong_thanh_toan >= 0
    ),
    CONSTRAINT fk_hoa_don_booking FOREIGN KEY (booking_id) REFERENCES booking(id)
) ENGINE=InnoDB;

-- =========================================================
-- 15. PHIEU XAC NHAN TOUR
-- =========================================================
CREATE TABLE phieu_xac_nhan_tour (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL UNIQUE,
    ma_phieu VARCHAR(50) NOT NULL UNIQUE,
    ngay_phat_hanh DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    file_pdf VARCHAR(500) NULL,
    ghi_chu VARCHAR(300) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_phieu_xac_nhan_booking FOREIGN KEY (booking_id) REFERENCES booking(id)
) ENGINE=InnoDB;

-- =========================================================
-- 16. HUY BOOKING
-- =========================================================
CREATE TABLE huy_booking (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL UNIQUE,
    ngay_yeu_cau DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ly_do VARCHAR(500) NOT NULL,
    phi_huy DECIMAL(15,2) NOT NULL DEFAULT 0,
    so_tien_hoan DECIMAL(15,2) NOT NULL DEFAULT 0,
    trang_thai_xu_ly ENUM('cho_xu_ly', 'da_duyet', 'tu_choi', 'da_hoan_tien') NOT NULL DEFAULT 'cho_xu_ly',
    nguoi_xu_ly_id BIGINT UNSIGNED NULL,
    ngay_xu_ly DATETIME NULL,
    ghi_chu TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_huy_booking_tien CHECK (phi_huy >= 0 AND so_tien_hoan >= 0),
    CONSTRAINT fk_huy_booking_booking FOREIGN KEY (booking_id) REFERENCES booking(id),
    CONSTRAINT fk_huy_booking_nguoi_xu_ly FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_huy_booking_trang_thai
ON huy_booking(trang_thai_xu_ly, ngay_yeu_cau);

-- =========================================================
-- 17. DANH GIA TOUR

-- =========================================================
CREATE TABLE danh_gia_tour (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL UNIQUE,
    tour_id BIGINT UNSIGNED NOT NULL,
    nguoi_dung_id BIGINT UNSIGNED NOT NULL,
    so_sao TINYINT UNSIGNED NOT NULL,
    noi_dung_comment TEXT NULL,
    phan_hoi_admin TEXT NULL,
    trang_thai ENUM('cho_duyet', 'hien_thi', 'an') NOT NULL DEFAULT 'hien_thi',
    nguoi_duyet_id BIGINT UNSIGNED NULL,
    ngay_duyet DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_danh_gia_so_sao CHECK (so_sao BETWEEN 1 AND 5),
    CONSTRAINT fk_danh_gia_booking FOREIGN KEY (booking_id) REFERENCES booking(id),
    CONSTRAINT fk_danh_gia_tour FOREIGN KEY (tour_id) REFERENCES tour(id),
    CONSTRAINT fk_danh_gia_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    CONSTRAINT fk_danh_gia_nguoi_duyet FOREIGN KEY (nguoi_duyet_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_danh_gia_tour
ON danh_gia_tour(tour_id, trang_thai, created_at);

-- =========================================================
-- 18. TIN TUC
-- =========================================================
CREATE TABLE tin_tuc (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(300) NOT NULL,
    slug VARCHAR(320) NULL UNIQUE,
    tom_tat VARCHAR(500) NULL,
    noi_dung LONGTEXT NULL,
    anh_dai_dien VARCHAR(500) NULL,
    trang_thai ENUM('nhap', 'hien_thi', 'an') NOT NULL DEFAULT 'nhap',
    nguoi_dang_id BIGINT UNSIGNED NOT NULL,
    ngay_dang DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tin_tuc_nguoi_dang FOREIGN KEY (nguoi_dang_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tin_tuc_trang_thai_ngay
ON tin_tuc(trang_thai, ngay_dang);

-- =========================================================
-- 19. HO TRO KHACH HANG
-- =========================================================
CREATE TABLE ho_tro_khach_hang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ma_ho_tro VARCHAR(50) NOT NULL UNIQUE,
    nguoi_dung_id BIGINT UNSIGNED NULL,
    booking_id BIGINT UNSIGNED NULL,
    ho_ten VARCHAR(200) NULL,
    email VARCHAR(255) NULL,
    so_dien_thoai VARCHAR(20) NULL,
    loai_yeu_cau ENUM('tu_van_tour', 'ho_tro_booking', 'thanh_toan', 'khieu_nai', 'gop_y', 'khac') NOT NULL DEFAULT 'khac',
    tieu_de VARCHAR(300) NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai ENUM('moi', 'dang_xu_ly', 'da_phan_hoi', 'da_dong') NOT NULL DEFAULT 'moi',
    muc_do_uu_tien ENUM('thap', 'trung_binh', 'cao') NOT NULL DEFAULT 'trung_binh',
    nguoi_xu_ly_id BIGINT UNSIGNED NULL,
    phan_hoi_admin TEXT NULL,
    ngay_xu_ly DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ho_tro_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    CONSTRAINT fk_ho_tro_booking FOREIGN KEY (booking_id) REFERENCES booking(id),
    CONSTRAINT fk_ho_tro_nguoi_xu_ly FOREIGN KEY (nguoi_xu_ly_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_ho_tro_trang_thai
ON ho_tro_khach_hang(trang_thai, loai_yeu_cau, created_at);

-- =========================================================
-- 20. TOUR YEU THICH
-- =========================================================
CREATE TABLE yeu_thich_tour (
    nguoi_dung_id BIGINT UNSIGNED NOT NULL,
    tour_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (nguoi_dung_id, tour_id),
    CONSTRAINT fk_yeu_thich_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id),
    CONSTRAINT fk_yeu_thich_tour FOREIGN KEY (tour_id) REFERENCES tour(id)
) ENGINE=InnoDB;

CREATE INDEX idx_yeu_thich_tour_tour
ON yeu_thich_tour(tour_id);

-- =========================================================
-- 21. LICH SU TRANG THAI BOOKING
-- =========================================================
CREATE TABLE lich_su_trang_thai_booking (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    trang_thai_booking_cu VARCHAR(50) NULL,
    trang_thai_booking_moi VARCHAR(50) NOT NULL,
    trang_thai_thanh_toan_cu VARCHAR(50) NULL,
    trang_thai_thanh_toan_moi VARCHAR(50) NULL,
    thoi_gian DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nguoi_thuc_hien_id BIGINT UNSIGNED NULL,
    ghi_chu VARCHAR(300) NULL,
    CONSTRAINT fk_ls_booking FOREIGN KEY (booking_id) REFERENCES booking(id),
    CONSTRAINT fk_ls_nguoi_thuc_hien FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_lich_su_trang_thai_booking
ON lich_su_trang_thai_booking(booking_id, thoi_gian);

-- =========================================================
-- 22. THONG BAO
-- =========================================================
CREATE TABLE thong_bao (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id BIGINT UNSIGNED NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    noi_dung VARCHAR(500) NOT NULL,
    loai_thong_bao ENUM('booking', 'payment', 'support', 'news', 'system') NOT NULL DEFAULT 'system',
    link_dieu_huong VARCHAR(500) NULL,
    da_doc BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_thong_bao_nguoi_dung FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
) ENGINE=InnoDB;

CREATE INDEX idx_thong_bao_nguoi_dung
ON thong_bao(nguoi_dung_id, da_doc, created_at);