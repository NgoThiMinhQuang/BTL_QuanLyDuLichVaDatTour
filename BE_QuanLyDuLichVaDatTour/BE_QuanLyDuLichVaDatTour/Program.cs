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

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var connectionInfo = new SqlConnectionStringBuilder(connectionString);

    try
    {
        await dbContext.Database.OpenConnectionAsync();
        await dbContext.Database.CloseConnectionAsync();

        await dbContext.Database.ExecuteSqlRawAsync("""
            IF COL_LENGTH('TinTuc', 'DanhMuc') IS NULL
            BEGIN
                ALTER TABLE TinTuc ADD DanhMuc NVARCHAR(100) NULL;
            END
            """);

        await dbContext.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID('DanhGiaTour', 'U') IS NULL
            BEGIN
                CREATE TABLE DanhGiaTour (
                    DanhGiaTourId BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
                    BookingId BIGINT NOT NULL,
                    TourId BIGINT NOT NULL,
                    KhachHangId BIGINT NOT NULL,
                    SoSao TINYINT NOT NULL,
                    NoiDungComment NVARCHAR(MAX) NOT NULL,
                    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_DanhGiaTour_CreatedAt DEFAULT SYSDATETIME(),
                    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_DanhGiaTour_UpdatedAt DEFAULT SYSDATETIME(),
                    CONSTRAINT FK_DanhGiaTour_Booking FOREIGN KEY (BookingId) REFERENCES Booking(BookingId),
                    CONSTRAINT FK_DanhGiaTour_Tour FOREIGN KEY (TourId) REFERENCES Tour(TourId),
                    CONSTRAINT FK_DanhGiaTour_KhachHang FOREIGN KEY (KhachHangId) REFERENCES NguoiDung(NguoiDungId)
                );

                CREATE UNIQUE INDEX UX_DanhGiaTour_BookingId ON DanhGiaTour(BookingId);
                CREATE INDEX IdxDanhGiaTour_Tour_KhachHang ON DanhGiaTour(TourId, KhachHangId);
            END
            """);
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
        app.Logger.LogError(ex, "Không thể chạy SQL bootstrap khi khởi động BE_QuanLyDuLichVaDatTour.");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
