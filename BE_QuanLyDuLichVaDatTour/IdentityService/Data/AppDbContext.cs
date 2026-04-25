using IdentityService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<NguoiDung> NguoiDungs => Set<NguoiDung>();

    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();

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

        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.ToTable("PasswordResetToken");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("PasswordResetTokenId")
                .HasColumnType("bigint")
                .ValueGeneratedOnAdd();

            entity.Property(x => x.NguoiDungId)
                .HasColumnName("NguoiDungId")
                .HasColumnType("bigint")
                .IsRequired();

            entity.Property(x => x.TokenHash)
                .HasColumnName("TokenHash")
                .HasMaxLength(128)
                .IsRequired();

            entity.Property(x => x.ExpiresAt)
                .HasColumnName("ExpiresAt")
                .HasColumnType("datetime2")
                .IsRequired();

            entity.Property(x => x.UsedAt)
                .HasColumnName("UsedAt")
                .HasColumnType("datetime2");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("CreatedAt")
                .HasColumnType("datetime2")
                .HasDefaultValueSql("SYSDATETIME()")
                .ValueGeneratedOnAdd();

            entity.HasOne(x => x.NguoiDung)
                .WithMany(x => x.PasswordResetTokens)
                .HasForeignKey(x => x.NguoiDungId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(x => x.TokenHash)
                .IsUnique();

            entity.HasIndex(x => new { x.NguoiDungId, x.UsedAt, x.ExpiresAt })
                .HasDatabaseName("IdxPasswordResetToken_NguoiDung_TrangThai");
        });
    }
}
