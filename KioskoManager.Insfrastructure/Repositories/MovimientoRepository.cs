using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class MovimientoRepository : IMovimientoRepository
{
    private readonly KioskoDbContext _context;

    public MovimientoRepository(KioskoDbContext context)
    {
        _context = context;
    }

    public async Task<List<MovimientoDto>> ObtenerHistorialAsync()
    {
        var ventas =
            await _context.Ventas
                .Include(v => v.Usuario)
                .Select(v => new MovimientoDto
                {
                    Fecha = v.FechaVenta,
                    Tipo = "VENTA",
                    Usuario =
                        v.Usuario.NombreUsuario + " " +
                        v.Usuario.ApellidoUsuario,
                    Monto = v.TotalVenta,
                    Descripcion = $"Venta #{v.IdVenta}",
                    IdReferencia = v.IdVenta
                })
                .ToListAsync();

        var movimientosStock =
            await _context.MovimientosStock
                .Include(m => m.Usuario)
                .Include(m => m.Producto)
                .Select(m => new MovimientoDto
                {
                    Fecha = m.FechaMovimiento,
                    Tipo = m.TipoMovimiento,
                    Usuario =
                        m.Usuario.NombreUsuario + " " +
                        m.Usuario.ApellidoUsuario,
                    Monto = null,
                    Descripcion =
                        $"{m.Producto.NombreProducto} - {m.Observacion}",
                    IdReferencia = m.IdMovimientoStock
                })
                .ToListAsync();

        return ventas
            .Concat(movimientosStock)
            .OrderByDescending(m => m.Fecha)
            .ToList();
    }
}