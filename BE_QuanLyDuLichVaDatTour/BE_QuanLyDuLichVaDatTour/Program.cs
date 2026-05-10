using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Repositories;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection chưa được cấu hình.");
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret chưa được cấu hình.");
var jwtIssuer = jwtSection["Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer chưa được cấu hình.");
var jwtAudience = jwtSection["Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience chưa được cấu hình.");

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? [
        "http://localhost:5175",
        "https://localhost:5175",
        "http://localhost:5174",
        "https://localhost:5174",
        "http://localhost:5173",
        "https://localhost:5173"
    ];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<INguoiDungRepository, NguoiDungRepository>();
builder.Services.AddScoped<ILoaiTourRepository, LoaiTourRepository>();
builder.Services.AddScoped<ITourRepository, TourRepository>();
builder.Services.AddScoped<IDiaDiemRepository, DiaDiemRepository>();
builder.Services.AddScoped<ILichTrinhRepository, LichTrinhRepository>();
builder.Services.AddScoped<ILichKhoiHanhRepository, LichKhoiHanhRepository>();
builder.Services.AddScoped<IBangGiaLichKhoiHanhRepository, BangGiaLichKhoiHanhRepository>();
builder.Services.AddScoped<IVoucherRepository, VoucherRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ITinTucRepository, TinTucRepository>();
builder.Services.AddScoped<ILoaiTourService, LoaiTourService>();
builder.Services.AddScoped<ITourService, TourService>();
builder.Services.AddScoped<IDiaDiemService, DiaDiemService>();
builder.Services.AddScoped<ILichTrinhService, LichTrinhService>();
builder.Services.AddScoped<ILichKhoiHanhService, LichKhoiHanhService>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ITinTucService, TinTucService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<IGlobalSearchService, GlobalSearchService>();
builder.Services.AddScoped<IInvoiceExportService, InvoiceExportService>();
builder.Services.AddScoped<ILienHeService, LienHeService>();
builder.Services.AddScoped<ILienHeRepository, LienHeRepository>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IYeuThichRepository, YeuThichRepository>();
builder.Services.AddScoped<IYeuThichService, YeuThichService>();
builder.Services.AddScoped<IYeuCauHuyTourRepository, YeuCauHuyTourRepository>();
builder.Services.AddScoped<IYeuCauHuyTourService, YeuCauHuyTourService>();
builder.Services.AddScoped<IThongBaoRepository, ThongBaoRepository>();
builder.Services.AddScoped<IThongBaoService, ThongBaoService>();
builder.Services.AddScoped<ISeatHoldRepository, SeatHoldRepository>();
builder.Services.AddScoped<ISeatHoldService, SeatHoldService>();
builder.Services.AddScoped<ITinNhanRepository, TinNhanRepository>();
builder.Services.AddScoped<ITinNhanService, TinNhanService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var connectionInfo = new SqlConnectionStringBuilder(connectionString);

    try
    {
        // Run raw schema fixes via SqlConnection (avoid EF model validation before column exists)
        using var sqlConnection = new SqlConnection(connectionString);
        await sqlConnection.OpenAsync();

        using var cmd = sqlConnection.CreateCommand();
        cmd.CommandText = @"
            IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'HinhAnh' AND Object_ID = Object_ID(N'DanhGiaTour'))
            BEGIN
                ALTER TABLE DanhGiaTour ADD HinhAnh NVARCHAR(MAX) NULL;
            END";
        await cmd.ExecuteNonQueryAsync();

        // Tạo bảng SeatHold nếu chưa có
        cmd.CommandText = @"
            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'SeatHold')
            BEGIN
                CREATE TABLE SeatHold (
                    SeatHoldId      BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    LichKhoiHanhId  BIGINT NOT NULL,
                    KhachHangId     BIGINT NOT NULL,
                    SoCho           SMALLINT NOT NULL,
                    HoldToken       NVARCHAR(64) NOT NULL,
                    ExpiresAt       DATETIME2 NOT NULL,
                    TrangThai       NVARCHAR(20) NOT NULL DEFAULT N'active',
                    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                    UpdatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                    CONSTRAINT FK_SeatHold_LichKhoiHanh FOREIGN KEY (LichKhoiHanhId) REFERENCES LichKhoiHanh(LichKhoiHanhId),
                    CONSTRAINT FK_SeatHold_KhachHang FOREIGN KEY (KhachHangId) REFERENCES NguoiDung(NguoiDungId),
                    CONSTRAINT UQ_SeatHold_Token UNIQUE (HoldToken)
                );
                CREATE INDEX IdxSeatHold_LichKhoiHanh_Active ON SeatHold(LichKhoiHanhId, TrangThai);
                CREATE INDEX IdxSeatHold_ExpiresAt ON SeatHold(ExpiresAt);
            END";
        await cmd.ExecuteNonQueryAsync();

        // Tạo bảng TinNhan nếu chưa có + thêm cột KhachHangId
        cmd.CommandText = @"
            IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'TinNhan')
            BEGIN
                CREATE TABLE TinNhan (
                    TinNhanId       BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    BookingId       BIGINT NULL,
                    KhachHangId     BIGINT NOT NULL,
                    NguoiGuiId      BIGINT NOT NULL,
                    NoiDung         NVARCHAR(MAX) NOT NULL,
                    DaDoc           BIT NOT NULL CONSTRAINT DF_TinNhan_DaDoc DEFAULT 0,
                    ThoiGianGui     DATETIME2 NOT NULL CONSTRAINT DF_TinNhan_ThoiGianGui DEFAULT SYSDATETIME(),
                    CreatedAt       DATETIME2 NOT NULL CONSTRAINT DF_TinNhan_CreatedAt DEFAULT SYSDATETIME(),
                    UpdatedAt       DATETIME2 NOT NULL CONSTRAINT DF_TinNhan_UpdatedAt DEFAULT SYSDATETIME(),
                    CONSTRAINT FK_TinNhan_Booking FOREIGN KEY (BookingId) REFERENCES Booking(BookingId),
                    CONSTRAINT FK_TinNhan_NguoiDung FOREIGN KEY (NguoiGuiId) REFERENCES NguoiDung(NguoiDungId),
                    CONSTRAINT FK_TinNhan_KhachHang FOREIGN KEY (KhachHangId) REFERENCES NguoiDung(NguoiDungId)
                );
                CREATE INDEX IdxTinNhanBooking ON TinNhan (BookingId, ThoiGianGui);
                CREATE INDEX IdxTinNhan_KhachHang ON TinNhan (KhachHangId);
            END
            ELSE
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = N'KhachHangId' AND Object_ID = Object_ID(N'TinNhan'))
                BEGIN
                    ALTER TABLE TinNhan ADD KhachHangId BIGINT NOT NULL CONSTRAINT DF_TinNhan_KhachHangId DEFAULT 0;
                    -- Backfill: tin nhắn general (BookingId NULL) gán KhachHangId = NguoiGuiId
                    UPDATE TinNhan SET KhachHangId = NguoiGuiId WHERE BookingId IS NULL;
                    -- Backfill: tin nhắn theo booking lấy KhachHangId từ Booking
                    UPDATE tn SET KhachHangId = b.KhachHangId
                    FROM TinNhan tn
                    JOIN Booking b ON b.BookingId = tn.BookingId
                    WHERE tn.BookingId IS NOT NULL;
                    -- Tạo FK nếu chưa có (sau khi dữ liệu đã hợp lệ)
                    IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_TinNhan_KhachHang' AND parent_object_id = OBJECT_ID('TinNhan'))
                    BEGIN
                        ALTER TABLE TinNhan ADD CONSTRAINT FK_TinNhan_KhachHang FOREIGN KEY (KhachHangId) REFERENCES NguoiDung(NguoiDungId);
                    END
                    -- Tạo index nếu chưa có
                    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IdxTinNhan_KhachHang' AND object_id = OBJECT_ID('TinNhan'))
                    BEGIN
                        CREATE INDEX IdxTinNhan_KhachHang ON TinNhan (KhachHangId);
                    END
                    -- Xóa default sau khi backfill
                    ALTER TABLE TinNhan DROP CONSTRAINT DF_TinNhan_KhachHangId;
                END
            END";
        await cmd.ExecuteNonQueryAsync();

        await sqlConnection.CloseAsync();
    }
    catch (SqlException ex)
    {
        app.Logger.LogError(
            ex,
            "Không thể kết nối tới SQL Server {DataSource} / database {InitialCatalog}. Hãy kiểm tra ConnectionStrings:DefaultConnection và chạy script trong thư mục CSDL nếu database chưa tồn tại.",
            connectionInfo.DataSource,
            connectionInfo.InitialCatalog);
        throw;
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Không thể khởi tạo schema database.");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
