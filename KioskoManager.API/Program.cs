using Microsoft.EntityFrameworkCore;
using KioskoManager.Infrastructure.Data;
using KioskoManager.Application.Interfaces;
using KioskoManager.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddOpenApi();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// DbContext
builder.Services.AddDbContext<KioskoDbContext>(
    options =>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"
            )
        )
);

// Repositories
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IVentaRepository, VentaRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IMovimientoStockRepository, MovimientoStockRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// ← IMPORTANTE
app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();