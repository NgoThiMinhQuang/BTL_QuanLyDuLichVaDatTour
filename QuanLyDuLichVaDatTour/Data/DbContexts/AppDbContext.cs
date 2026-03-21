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
    }
}
