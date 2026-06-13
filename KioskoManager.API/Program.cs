using Microsoft.EntityFrameworkCore;
using KioskoManager.Infrastructure.Data;
using KioskoManager.Application.Interfaces;
using KioskoManager.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddOpenApi();

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
builder.Services.AddScoped<
    IProductoRepository,
    ProductoRepository
>();

builder.Services.AddScoped<
    ICategoriaRepository,
    CategoriaRepository
>();

builder.Services.AddScoped<
    IUsuarioRepository,
    UsuarioRepository
>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();