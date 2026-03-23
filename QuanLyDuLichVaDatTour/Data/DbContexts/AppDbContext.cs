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

    public DbSet<BangGiaLichKhoiHanh> BangGiaLichKhoiHanhs => Set<BangGiaLichKhoiHanh>();

    public DbSet<Booking> Bookings => Set<Booking>();

    public DbSet<ThanhToan> ThanhToans => Set<ThanhToan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.ToTable("NguoiDung");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.Email)
                .HasColumnName("Email")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.MatKhau)
                .HasColumnName("MatKhau")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.HoTen)
                .HasColumnName("HoTen")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.SoDienThoai)
                .HasColumnName("SoDienThoai")
                .HasMaxLength(20);

            entity.Property(x => x.DiaChi)
                .HasColumnName("DiaChi")
                .HasMaxLength(300);

            entity.Property(x => x.AnhDaiDien)
                .HasColumnName("AnhDaiDien")
                .HasMaxLength(500);

            entity.Property(x => x.VaiTro)
                .HasColumnName("VaiTro")
                .HasColumnType("enum('admin','khach_hang')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('hoat_dong','bi_khoa')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.HasIndex(x => new { x.VaiTro, x.TrangThai })
                .HasDatabaseName("IdxNguoiDungVaiTroTrangThai");
        });

        modelBuilder.Entity<LoaiTour>(entity =>
        {
            entity.ToTable("LoaiTour");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.Ten)
                .HasColumnName("TenLoai")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.MoTa)
                .HasColumnName("MoTa")
                .HasColumnType("text");

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('hoat_dong','an')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.Ten)
                .IsUnique();
        });

        modelBuilder.Entity<DiaDiem>(entity =>
        {
            entity.ToTable("DiaDiem");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TenDiaDiem)
                .HasColumnName("TenDiaDiem")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.TinhThanh)
                .HasColumnName("TinhThanh")
                .HasMaxLength(100);

            entity.Property(x => x.QuocGia)
                .HasColumnName("QuocGia")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.MoTa)
                .HasColumnName("MoTa")
                .HasColumnType("text");

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('hoat_dong','an')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.TinhThanh, x.QuocGia })
                .HasDatabaseName("IdxDiaDiemTinhThanhQuocGia");
        });

        modelBuilder.Entity<Tour>(entity =>
        {
            entity.ToTable("Tour");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.MaTour)
                .HasColumnName("MaTour")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.TenTour)
                .HasColumnName("TenTour")
                .HasMaxLength(300)
                .IsRequired();

            entity.Property(x => x.LoaiTourId)
                .HasColumnName("LoaiTourId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.DiemXuatPhatId)
                .HasColumnName("DiemXuatPhatId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.SoNgay)
                .HasColumnName("SoNgay")
                .HasColumnType("tinyint unsigned")
                .IsRequired();

            entity.Property(x => x.SoDem)
                .HasColumnName("SoDem")
                .HasColumnType("tinyint unsigned")
                .IsRequired();

            entity.Property(x => x.PhuongTien)
                .HasColumnName("PhuongTien")
                .HasMaxLength(100);

            entity.Property(x => x.GiaTuThamKhao)
                .HasColumnName("GiaTuThamKhao")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.MoTaNgan)
                .HasColumnName("MoTaNgan")
                .HasMaxLength(500);

            entity.Property(x => x.MoTaChiTiet)
                .HasColumnName("MoTaChiTiet")
                .HasColumnType("longtext");

            entity.Property(x => x.DieuKienTour)
                .HasColumnName("DieuKienTour")
                .HasColumnType("longtext");

            entity.Property(x => x.IsNoiBat)
                .HasColumnName("IsNoiBat")
                .HasColumnType("tinyint(1)")
                .IsRequired();

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('nhap','dang_mo_ban','tam_ngung','an','ngung_kinh_doanh')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaTour)
                .IsUnique();

            entity.HasIndex(x => new { x.TrangThai, x.LoaiTourId, x.DiemXuatPhatId, x.IsNoiBat, x.GiaTuThamKhao })
                .HasDatabaseName("IdxTourTimKiem");

            entity.HasOne(x => x.LoaiTour)
                .WithMany()
                .HasForeignKey(x => x.LoaiTourId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.DiemXuatPhat)
                .WithMany()
                .HasForeignKey(x => x.DiemXuatPhatId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<LichTrinh>(entity =>
        {
            entity.ToTable("LichTrinh");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TourId)
                .HasColumnName("TourId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.NgayThu)
                .HasColumnName("NgayThu")
                .HasColumnType("tinyint unsigned")
                .IsRequired();

            entity.Property(x => x.ThuTuTrongNgay)
                .HasColumnName("ThuTuTrongNgay")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.GioBatDau)
                .HasColumnName("GioBatDau")
                .HasColumnType("time");

            entity.Property(x => x.GioKetThuc)
                .HasColumnName("GioKetThuc")
                .HasColumnType("time");

            entity.Property(x => x.TieuDe)
                .HasColumnName("TieuDe")
                .HasMaxLength(300);

            entity.Property(x => x.NoiDung)
                .HasColumnName("NoiDung")
                .HasColumnType("text");

            entity.Property(x => x.DiaDiemId)
                .HasColumnName("DiaDiemId")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.TourId, x.NgayThu, x.ThuTuTrongNgay })
                .IsUnique()
                .HasDatabaseName("UkLichTrinh");

            entity.HasIndex(x => new { x.TourId, x.NgayThu, x.ThuTuTrongNgay })
                .HasDatabaseName("IdxLichTrinhTourNgay");

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
            entity.ToTable("LichKhoiHanh");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.TourId)
                .HasColumnName("TourId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.MaDotTour)
                .HasColumnName("MaDotTour")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.NgayKhoiHanh)
                .HasColumnName("NgayKhoiHanh")
                .HasColumnType("date")
                .IsRequired();

            entity.Property(x => x.NgayKetThuc)
                .HasColumnName("NgayKetThuc")
                .HasColumnType("date")
                .IsRequired();

            entity.Property(x => x.NoiTapTrung)
                .HasColumnName("NoiTapTrung")
                .HasMaxLength(300);

            entity.Property(x => x.SoChoToiDa)
                .HasColumnName("SoChoToiDa")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.GhiChu)
                .HasColumnName("GhiChu")
                .HasMaxLength(500);

            entity.Property(x => x.LyDoHuy)
                .HasColumnName("LyDoHuy")
                .HasMaxLength(500);

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('mo_ban','het_cho','da_khoi_hanh','da_ket_thuc','da_huy')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaDotTour)
                .IsUnique();

            entity.HasIndex(x => new { x.TourId, x.NgayKhoiHanh, x.TrangThai })
                .HasDatabaseName("IdxLichKhoiHanhTimKiem");

            entity.HasOne(x => x.Tour)
                .WithMany()
                .HasForeignKey(x => x.TourId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<BangGiaLichKhoiHanh>(entity =>
        {
            entity.ToTable("BangGiaLichKhoiHanh");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.LichKhoiHanhId)
                .HasColumnName("LichKhoiHanhId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.LoaiKhach)
                .HasColumnName("LoaiKhach")
                .HasColumnType("enum('nguoi_lon','tre_em','em_be')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.LoaiGia)
                .HasColumnName("LoaiGia")
                .HasColumnType("enum('ngay_thuong','cuoi_tuan')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.DonGia)
                .HasColumnName("DonGia")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.MoTa)
                .HasColumnName("MoTa")
                .HasMaxLength(300);

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.LichKhoiHanhId, x.LoaiKhach, x.LoaiGia })
                .IsUnique()
                .HasDatabaseName("UkBangGiaLichKhoiHanh");

            entity.HasIndex(x => new { x.LichKhoiHanhId, x.LoaiKhach, x.LoaiGia })
                .HasDatabaseName("IdxBangGiaLichKhoiHanh");

            entity.HasOne(x => x.LichKhoiHanh)
                .WithMany()
                .HasForeignKey(x => x.LichKhoiHanhId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.ToTable("Booking");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.MaBooking)
                .HasColumnName("MaBooking")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.LichKhoiHanhId)
                .HasColumnName("LichKhoiHanhId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.NguoiDungId)
                .HasColumnName("NguoiDungId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.VoucherId)
                .HasColumnName("VoucherId")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.HoTenLienHe)
                .HasColumnName("HoTenLienHe")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(x => x.EmailLienHe)
                .HasColumnName("EmailLienHe")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.SoDienThoaiLienHe)
                .HasColumnName("SoDienThoaiLienHe")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.DiaChiLienHe)
                .HasColumnName("DiaChiLienHe")
                .HasMaxLength(300);

            entity.Property(x => x.NgayDat)
                .HasColumnName("NgayDat")
                .HasColumnType("datetime")
                .IsRequired();

            entity.Property(x => x.SoNguoiLon)
                .HasColumnName("SoNguoiLon")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.SoTreEm)
                .HasColumnName("SoTreEm")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.SoEmBe)
                .HasColumnName("SoEmBe")
                .HasColumnType("smallint unsigned")
                .IsRequired();

            entity.Property(x => x.LoaiGiaApDung)
                .HasColumnName("LoaiGiaApDung")
                .HasColumnType("enum('ngay_thuong','cuoi_tuan')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.DonGiaNguoiLon)
                .HasColumnName("DonGiaNguoiLon")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.DonGiaTreEm)
                .HasColumnName("DonGiaTreEm")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.DonGiaEmBe)
                .HasColumnName("DonGiaEmBe")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TamTinh)
                .HasColumnName("TamTinh")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.GiamGia)
                .HasColumnName("GiamGia")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TongTien)
                .HasColumnName("TongTien")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.SoTienDaThanhToan)
                .HasColumnName("SoTienDaThanhToan")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.TienCocYeuCau)
                .HasColumnName("TienCocYeuCau")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.PhuongThucThanhToanDuKien)
                .HasColumnName("PhuongThucThanhToanDuKien")
                .HasColumnType("enum('tien_mat','chuyen_khoan','the','vi_dien_tu','cong_thanh_toan')")
                .HasConversion<string>();

            entity.Property(x => x.TrangThaiBooking)
                .HasColumnName("TrangThaiBooking")
                .HasColumnType("enum('moi_tao','cho_thanh_toan','da_coc','da_xac_nhan','da_huy','hoan_tat')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.TrangThaiThanhToan)
                .HasColumnName("TrangThaiThanhToan")
                .HasColumnType("enum('chua_thanh_toan','thanh_toan_mot_phan','da_thanh_toan_du','that_bai','da_hoan_tien')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.HanThanhToan)
                .HasColumnName("HanThanhToan")
                .HasColumnType("datetime");

            entity.Property(x => x.GhiChu)
                .HasColumnName("GhiChu")
                .HasColumnType("text");

            entity.Property(x => x.NguoiXacNhanId)
                .HasColumnName("NguoiXacNhanId")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.ThoiGianXacNhan)
                .HasColumnName("ThoiGianXacNhan")
                .HasColumnType("datetime");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => x.MaBooking)
                .IsUnique();

            entity.HasIndex(x => new { x.NguoiDungId, x.NgayDat })
                .HasDatabaseName("IdxBookingNguoiDung");

            entity.HasIndex(x => new { x.TrangThaiBooking, x.TrangThaiThanhToan, x.NgayDat })
                .HasDatabaseName("IdxBookingTrangThai");

            entity.HasIndex(x => x.LichKhoiHanhId)
                .HasDatabaseName("IdxBookingLichKhoiHanh");

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

        modelBuilder.Entity<ThanhToan>(entity =>
        {
            entity.ToTable("ThanhToan");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("Id")
                .HasColumnType("bigint unsigned")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.BookingId)
                .HasColumnName("BookingId")
                .HasColumnType("bigint unsigned")
                .IsRequired();

            entity.Property(x => x.LoaiGiaoDich)
                .HasColumnName("LoaiGiaoDich")
                .HasColumnType("enum('dat_coc','thanh_toan_con_lai','thanh_toan_toan_bo','hoan_tien')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.KenhThanhToan)
                .HasColumnName("KenhThanhToan")
                .HasColumnType("enum('noi_bo','ben_thu_ba')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.PhuongThucThanhToan)
                .HasColumnName("PhuongThucThanhToan")
                .HasColumnType("enum('tien_mat','chuyen_khoan','the','vi_dien_tu','cong_thanh_toan')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.NhaCungCap)
                .HasColumnName("NhaCungCap")
                .HasMaxLength(100);

            entity.Property(x => x.SoTien)
                .HasColumnName("SoTien")
                .HasColumnType("decimal(15,2)")
                .IsRequired();

            entity.Property(x => x.MaGiaoDichNoiBo)
                .HasColumnName("MaGiaoDichNoiBo")
                .HasMaxLength(100);

            entity.Property(x => x.MaGiaoDichBenThuBa)
                .HasColumnName("MaGiaoDichBenThuBa")
                .HasMaxLength(150);

            entity.Property(x => x.MaThamChieuBenThuBa)
                .HasColumnName("MaThamChieuBenThuBa")
                .HasMaxLength(150);

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasColumnType("enum('khoi_tao','cho_xu_ly','thanh_cong','that_bai','da_hoan_tien')")
                .HasConversion<string>()
                .IsRequired();

            entity.Property(x => x.DuLieuPhanHoi)
                .HasColumnName("DuLieuPhanHoi")
                .HasColumnType("json");

            entity.Property(x => x.GhiChu)
                .HasColumnName("GhiChu")
                .HasMaxLength(500);

            entity.Property(x => x.NguoiXacNhanId)
                .HasColumnName("NguoiXacNhanId")
                .HasColumnType("bigint unsigned");

            entity.Property(x => x.ThoiGianTao)
                .HasColumnName("ThoiGianTao")
                .HasColumnType("datetime")
                .IsRequired();

            entity.Property(x => x.ThoiGianXacNhan)
                .HasColumnName("ThoiGianXacNhan")
                .HasColumnType("datetime");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.HasIndex(x => new { x.BookingId, x.TrangThai, x.ThoiGianTao })
                .HasDatabaseName("IdxThanhToanBooking");

            entity.HasIndex(x => x.MaGiaoDichBenThuBa)
                .HasDatabaseName("IdxThanhToanMaGiaoDichBenThuBa");

            entity.HasOne(x => x.Booking)
                .WithMany()
                .HasForeignKey(x => x.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.NguoiXacNhan)
                .WithMany()
                .HasForeignKey(x => x.NguoiXacNhanId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
