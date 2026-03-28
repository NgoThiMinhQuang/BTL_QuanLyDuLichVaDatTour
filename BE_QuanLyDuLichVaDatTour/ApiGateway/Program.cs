using Ocelot.DependencyInjection;
using Ocelot.Middleware;
var builder = WebApplication.CreateBuilder(args);
// yêu cầu hệ thống nạp cấu hình từ file ocelot.json
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Đăng ký dịch vụ Ocelot
builder.Services.AddOcelot(builder.Configuration);
var app = builder.Build();
app.MapGet("/", () => "Hello from API Gateway!");
// Sử dụng middleware của Ocelot 
await app.UseOcelot();
app.Run();