using IdentityService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<NguoiDung> NguoiDungs => Set<NguoiDung>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.ToTable("NguoiDung");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("NguoiDungId")
                .HasColumnType("bigint")
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
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.TrangThai)
                .HasColumnName("TrangThai")
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime2")
                .HasDefaultValueSql("SYSDATETIME()")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("UpdatedAt")
                .HasColumnType("datetime2")
                .HasDefaultValueSql("SYSDATETIME()")
                .ValueGeneratedOnAdd();

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.HasIndex(x => new { x.VaiTro, x.TrangThai })
                .HasDatabaseName("IdxNguoiDung_VaiTro_TrangThai");
        });
    }
}
