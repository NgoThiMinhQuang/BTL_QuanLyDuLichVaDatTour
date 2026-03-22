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
    }
}
