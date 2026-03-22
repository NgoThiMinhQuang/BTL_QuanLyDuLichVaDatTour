using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.DbContexts;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<NguoiDung> NguoiDungs => Set<NguoiDung>();

    public DbSet<LoaiTour> LoaiTours => Set<LoaiTour>();

    public DbSet<DiaDiem> DiaDiems => Set<DiaDiem>();

    public DbSet<Tour> Tours => Set<Tour>();

    public DbSet<LichTrinh> LichTrinhs => Set<LichTrinh>();

    public DbSet<LichKhoiHanh> LichKhoiHanhs => Set<LichKhoiHanh>();

    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.ToTable("nguoi_dung");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.Email)
                .HasColumnName("email")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.MatKhau)
                .HasColumnName("mat_khau")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.HoTen)
                .HasColumnName("ho_ten")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.SoDienThoai)
                .HasColumnName("so_dien_thoai")
                .HasMaxLength(20);

            entity.Property(x => x.DiaChi)
                .HasColumnName("dia_chi")
                .HasMaxLength(300);

            entity.Property(x => x.AnhDaiDien)
                .HasColumnName("anh_dai_dien")
                .HasMaxLength(500);

            entity.Property(x => x.VaiTro)
                .HasColumnName("vai_tro")
                .HasColumnType("enum('admin','khach_hang')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.TrangThai)
                .HasColumnName("trang_thai")
                .HasColumnType("enum('hoat_dong','bi_khoa')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.Email)
                .IsUnique();
        });

        modelBuilder.Entity<LoaiTour>(entity =>
        {
            entity.ToTable("loai_tour");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.Ten)
                .HasColumnName("ten_loai")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.MoTa)
                .HasColumnName("mo_ta")
                .HasMaxLength(1000);

            entity.Property(x => x.TrangThai)
                .HasColumnName("trang_thai")
                .HasColumnType("enum('hoat_dong','an')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.Ten)
                .IsUnique();
        });

        modelBuilder.Entity<DiaDiem>(entity =>
        {
            entity.ToTable("dia_diem");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TenDiaDiem)
                .HasColumnName("ten_dia_diem")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.TinhThanh)
                .HasColumnName("tinh_thanh")
                .HasMaxLength(100);

            entity.Property(x => x.QuocGia)
                .HasColumnName("quoc_gia")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.MoTa)
                .HasColumnName("mo_ta")
                .HasColumnType("text");

            entity.Property(x => x.TrangThai)
                .HasColumnName("trang_thai")
                .HasColumnType("enum('hoat_dong','an')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.TinhThanh, x.QuocGia })
                .HasDatabaseName("idx_dia_diem_tinh_thanh_quoc_gia");
        });

        modelBuilder.Entity<Tour>(entity =>
        {
            entity.ToTable("tour");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.MaTour)
                .HasColumnName("ma_tour")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.TenTour)
                .HasColumnName("ten_tour")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.LoaiTourId)
                .HasColumnName("loai_tour_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.DiaDiemKhoiHanhId)
                .HasColumnName("dia_diem_khoi_hanh_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.SoNgay)
                .HasColumnName("so_ngay")
                .IsRequired();

            entity.Property(x => x.SoDem)
                .HasColumnName("so_dem")
                .IsRequired();

            entity.Property(x => x.PhuongTien)
                .HasColumnName("phuong_tien")
                .HasMaxLength(100);

            entity.Property(x => x.MoTaNgan)
                .HasColumnName("mo_ta_ngan")
                .HasMaxLength(500);

            entity.Property(x => x.MoTaChiTiet)
                .HasColumnName("mo_ta_chi_tiet")
                .HasColumnType("text");

            entity.Property(x => x.DieuKienTour)
                .HasColumnName("dieu_kien_tour")
                .HasColumnType("text");

            entity.Property(x => x.GiaNguoiLonMacDinh)
                .HasColumnName("gia_nguoi_lon_mac_dinh")
                .HasColumnType("decimal(18,2)");

            entity.Property(x => x.GiaTreEmMacDinh)
                .HasColumnName("gia_tre_em_mac_dinh")
                .HasColumnType("decimal(18,2)");

            entity.Property(x => x.TrangThai)
                .HasColumnName("trang_thai")
                .HasColumnType("enum('nhap','dang_mo_ban','tam_ngung','an')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaTour)
                .IsUnique();

            entity.HasOne(x => x.LoaiTour)
                .WithMany()
                .HasForeignKey(x => x.LoaiTourId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.DiaDiemKhoiHanh)
                .WithMany()
                .HasForeignKey(x => x.DiaDiemKhoiHanhId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<LichTrinh>(entity =>
        {
            entity.ToTable("lich_trinh");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TourId)
                .HasColumnName("tour_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.NgayThu)
                .HasColumnName("ngay_thu")
                .HasColumnType("tinyint unsigned")
                .IsRequired();

            entity.Property(x => x.ThuTuTrongNgay)
                .HasColumnName("thu_tu_trong_ngay")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.GioBatDau)
                .HasColumnName("gio_bat_dau")
                .HasColumnType("time");

            entity.Property(x => x.GioKetThuc)
                .HasColumnName("gio_ket_thuc")
                .HasColumnType("time");

            entity.Property(x => x.TieuDe)
                .HasColumnName("tieu_de")
                .HasMaxLength(300);

            entity.Property(x => x.NoiDung)
                .HasColumnName("noi_dung")
                .HasColumnType("text");

            entity.Property(x => x.DiaDiemId)
                .HasColumnName("dia_diem_id")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.TourId, x.NgayThu, x.ThuTuTrongNgay })
                .IsUnique();

            entity.HasOne(x => x.Tour)
                .WithMany()
                .HasForeignKey(x => x.TourId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.DiaDiem)
                .WithMany()
                .HasForeignKey(x => x.DiaDiemId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<LichKhoiHanh>(entity =>
        {
            entity.ToTable("lich_khoi_hanh");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TourId)
                .HasColumnName("tour_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.MaDotTour)
                .HasColumnName("ma_dot_tour")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.NgayKhoiHanh)
                .HasColumnName("ngay_khoi_hanh")
                .HasColumnType("date")
                .IsRequired();

            entity.Property(x => x.NgayKetThuc)
                .HasColumnName("ngay_ket_thuc")
                .HasColumnType("date")
                .IsRequired();

            entity.Property(x => x.NoiTapTrung)
                .HasColumnName("noi_tap_trung")
                .HasMaxLength(300);

            entity.Property(x => x.SoChoToiDa)
                .HasColumnName("so_cho_toi_da")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.GhiChu)
                .HasColumnName("ghi_chu")
                .HasMaxLength(500);

            entity.Property(x => x.LyDoHuy)
                .HasColumnName("ly_do_huy")
                .HasMaxLength(500);

            entity.Property(x => x.TrangThai)
                .HasColumnName("trang_thai")
                .HasColumnType("enum('mo_ban','het_cho','da_khoi_hanh','da_ket_thuc','da_huy')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaDotTour)
                .IsUnique();

            entity.HasIndex(x => new { x.TourId, x.NgayKhoiHanh, x.TrangThai })
                .HasDatabaseName("idx_lich_khoi_hanh_tim_kiem");

            entity.HasOne(x => x.Tour)
                .WithMany()
                .HasForeignKey(x => x.TourId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.ToTable("booking");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.MaBooking)
                .HasColumnName("ma_booking")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.LichKhoiHanhId)
                .HasColumnName("lich_khoi_hanh_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.NguoiDungId)
                .HasColumnName("nguoi_dung_id")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.VoucherId)
                .HasColumnName("voucher_id")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.HoTenLienHe)
                .HasColumnName("ho_ten_lien_he")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.EmailLienHe)
                .HasColumnName("email_lien_he")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.SoDienThoaiLienHe)
                .HasColumnName("so_dien_thoai_lien_he")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.DiaChiLienHe)
                .HasColumnName("dia_chi_lien_he")
                .HasMaxLength(300);

            entity.Property(x => x.NgayDat)
                .HasColumnName("ngay_dat")
                .HasColumnType("datetime")
                .IsRequired();

            entity.Property(x => x.SoNguoiLon)
                .HasColumnName("so_nguoi_lon")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.SoTreEm)
                .HasColumnName("so_tre_em")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.SoEmBe)
                .HasColumnName("so_em_be")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.LoaiGiaApDung)
                .HasColumnName("loai_gia_ap_dung")
                .HasColumnType("enum('ngay_thuong','cuoi_tuan')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.DonGiaNguoiLon)
                .HasColumnName("don_gia_nguoi_lon")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.DonGiaTreEm)
                .HasColumnName("don_gia_tre_em")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.DonGiaEmBe)
                .HasColumnName("don_gia_em_be")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TamTinh)
                .HasColumnName("tam_tinh")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.GiamGia)
                .HasColumnName("giam_gia")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TongTien)
                .HasColumnName("tong_tien")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.SoTienDaThanhToan)
                .HasColumnName("so_tien_da_thanh_toan")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TienCocYeuCau)
                .HasColumnName("tien_coc_yeu_cau")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.PhuongThucThanhToanDuKien)
                .HasColumnName("phuong_thuc_thanh_toan_du_kien")
                .HasColumnType("enum('tien_mat','chuyen_khoan','the','vi_dien_tu','cong_thanh_toan')")
                .HasConversion<string>();

            entity.Property(x => x.TrangThaiBooking)
                .HasColumnName("trang_thai_booking")
                .HasColumnType("enum('moi_tao','cho_thanh_toan','da_coc','da_xac_nhan','da_huy','hoan_tat')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.TrangThaiThanhToan)
                .HasColumnName("trang_thai_thanh_toan")
                .HasColumnType("enum('chua_thanh_toan','thanh_toan_mot_phan','da_thanh_toan_du','that_bai','da_hoan_tien')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.HanThanhToan)
                .HasColumnName("han_thanh_toan")
                .HasColumnType("datetime");

            entity.Property(x => x.GhiChu)
                .HasColumnName("ghi_chu")
                .HasColumnType("text");

            entity.Property(x => x.NguoiXacNhanId)
                .HasColumnName("nguoi_xac_nhan_id")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.ThoiGianXacNhan)
                .HasColumnName("thoi_gian_xac_nhan")
                .HasColumnType("datetime");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaBooking)
                .IsUnique();

            entity.HasOne(x => x.LichKhoiHanh)
                .WithMany()
                .HasForeignKey(x => x.LichKhoiHanhId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.NguoiDung)
                .WithMany()
                .HasForeignKey(x => x.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.NguoiXacNhan)
                .WithMany()
                .HasForeignKey(x => x.NguoiXacNhanId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
