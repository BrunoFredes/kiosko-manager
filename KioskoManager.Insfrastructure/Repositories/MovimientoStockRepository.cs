using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class MovimientoStockRepository
    : IMovimientoStockRepository
{
    private readonly KioskoDbContext _context;

    public MovimientoStockRepository(KioskoDbContext context)
    {
        _context = context;
    }

    public async Task<List<MovimientoStockDto>> GetAllAsync()
    {
        return await _context.MovimientosStock
            .Include(m => m.Producto)
            .Include(m => m.Usuario)
            .OrderByDescending(m => m.FechaMovimiento)
            .Select(m => new MovimientoStockDto
            {
                IdMovimientoStock = m.IdMovimientoStock,
                FechaMovimiento = m.FechaMovimiento,
                NombreProducto = m.Producto.NombreProducto,
                NombreUsuario = m.Usuario.NombreUsuario,
                TipoMovimiento = m.TipoMovimiento,
                Cantidad = m.Cantidad,
                StockAnterior = m.StockAnterior,
                StockNuevo = m.StockNuevo,
                Observacion = m.Observacion
            })
            .ToListAsync();
    }
}