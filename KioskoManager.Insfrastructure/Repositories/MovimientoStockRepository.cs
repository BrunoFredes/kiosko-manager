using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class MovimientoStockRepository
    : IMovimientoStockRepository
{
    private readonly KioskoDbContext _context;

    public MovimientoStockRepository(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    public async Task<List<MovimientoStock>>
        GetAllAsync()
    {
        return await _context
            .MovimientosStock
            .Include(m => m.Producto)
            .Include(m => m.Usuario)
            .OrderByDescending(
                m => m.FechaMovimiento
            )
            .ToListAsync();
    }
}