using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly KioskoDbContext _context;


    public DashboardRepository(KioskoDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductoMasVendidoDto>>
        ObtenerProductosMasVendidosAsync(int cantidad)
    {
        return await _context.DetalleVenta
            .GroupBy(d =>
                d.Producto.NombreProducto)
            .Select(g =>
                new ProductoMasVendidoDto
                {
                    NombreProducto = g.Key,
                    CantidadVendida = g.Sum(x =>
                        x.Cantidad)
                })
            .OrderByDescending(x =>
                x.CantidadVendida)
            .Take(cantidad)
            .ToListAsync();
    }
    private async Task<DashboardResumenDto>
    ObtenerResumenPeriodoAsync(
        DateTime inicio,
        DateTime fin)
    {
        var ventas =
            await _context.Ventas
                .Where(v =>
                    v.FechaVenta >= inicio &&
                    v.FechaVenta < fin)
                .ToListAsync();

        return new DashboardResumenDto
        {
            CantidadVentas =
                ventas.Count,

            TotalIngresos =
                ventas.Sum(v =>
                    v.TotalVenta),

            ProductosVendidos =
                await _context.DetalleVenta
                    .Where(d =>
                        d.Venta.FechaVenta >= inicio &&
                        d.Venta.FechaVenta < fin)
                    .SumAsync(d =>
                        d.Cantidad)
        };
    }
    public async Task<DashboardResumenDto>
    ObtenerResumenDiaAsync()
    {
        var inicio =
            DateTime.UtcNow.Date;

        var fin =
            inicio.AddDays(1);

        return await ObtenerResumenPeriodoAsync(
            inicio,
            fin);
    }
    public async Task<DashboardResumenDto>
    ObtenerResumenSemanaAsync()
    {
        var inicio =
            DateTime.UtcNow.Date.AddDays(-7);

        var fin =
            DateTime.UtcNow.Date.AddDays(1);

        return await ObtenerResumenPeriodoAsync(
            inicio,
            fin);
    }
    public async Task<DashboardResumenDto>
    ObtenerResumenMesAsync()
    {
        var inicio =
            DateTime.UtcNow.Date.AddMonths(-1);

        var fin =
            DateTime.UtcNow.Date.AddDays(1);

        return await ObtenerResumenPeriodoAsync(
            inicio,
            fin);
    }
    public async Task<DashboardResumenDto>
    ObtenerResumenAnioAsync()
    {
        var inicio =
            DateTime.UtcNow.Date.AddYears(-1);

        var fin =
            DateTime.UtcNow.Date.AddDays(1);

        return await ObtenerResumenPeriodoAsync(
            inicio,
            fin);
    }
    private async Task<List<ProductoMasVendidoDto>>
    ObtenerTopProductosPeriodoAsync(
        DateTime inicio,
        DateTime fin,
        int cantidad)
    {
        return await _context.DetalleVenta
            .Where(d =>
                d.Venta.FechaVenta >= inicio &&
                d.Venta.FechaVenta < fin)
            .GroupBy(d =>
                d.Producto.NombreProducto)
            .Select(g =>
                new ProductoMasVendidoDto
                {
                    NombreProducto =
                        g.Key,

                    CantidadVendida =
                        g.Sum(x =>
                            x.Cantidad)
                })
            .OrderByDescending(x =>
                x.CantidadVendida)
            .Take(cantidad)
            .ToListAsync();
    }
    public async Task<List<ProductoMasVendidoDto>>
    ObtenerProductosMasVendidosSemanaAsync(
        int cantidad)
{
    return await ObtenerTopProductosPeriodoAsync(
        DateTime.UtcNow.Date.AddDays(-7),
        DateTime.UtcNow.Date.AddDays(1),
        cantidad);
}

public async Task<List<ProductoMasVendidoDto>>
    ObtenerProductosMasVendidosMesAsync(
        int cantidad)
{
    return await ObtenerTopProductosPeriodoAsync(
        DateTime.UtcNow.Date.AddMonths(-1),
        DateTime.UtcNow.Date.AddDays(1),
        cantidad);
}

public async Task<List<ProductoMasVendidoDto>>
    ObtenerProductosMasVendidosAnioAsync(
        int cantidad)
{
    return await ObtenerTopProductosPeriodoAsync(
        DateTime.UtcNow.Date.AddYears(-1),
        DateTime.UtcNow.Date.AddDays(1),
        cantidad);
}
}
