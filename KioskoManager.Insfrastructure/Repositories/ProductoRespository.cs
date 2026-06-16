using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class ProductoRepository : IProductoRepository
{
    private readonly KioskoDbContext _context;

    public ProductoRepository(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    public async Task<List<Producto>> GetAllAsync()
    {
        return await _context.Productos
            .Where(p => p.Activo)
            .ToListAsync();
    }

    public async Task<Producto?> GetByIdAsync(long id)
    {
        return await _context.Productos
            .FirstOrDefaultAsync(
                p => p.IdProducto == id
            );
    }

    public async Task<Producto> CreateAsync(
        Producto producto
    )
    {
        _context.Productos.Add(producto);

        await _context.SaveChangesAsync();

        return producto;
    }

    public async Task<Producto?> UpdateAsync(
        Producto producto
    )
    {
        var productoExistente =
            await _context.Productos
                .FirstOrDefaultAsync(
                    p => p.IdProducto == producto.IdProducto
                );

        if (productoExistente == null)
        {
            return null;
        }

        _context.Entry(productoExistente)
            .CurrentValues
            .SetValues(producto);

        await _context.SaveChangesAsync();

        return productoExistente;
    }

    public async Task<bool> SoftDeleteAsync(
        long id
    )
    {
        var producto =
            await _context.Productos
                .FirstOrDefaultAsync(
                    p => p.IdProducto == id
                );

        if (producto == null)
        {
            return false;
        }

        producto.Activo = false;

        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<List<Producto>> BuscarAsync(string texto)
    {
        texto = texto.ToLower();

        return await _context.Productos
            .Where(p =>
                p.NombreProducto.ToLower().Contains(texto)
                ||
                (p.CodigoBarras != null &&
                 p.CodigoBarras.Contains(texto))
            )
            .ToListAsync();
    }

    public async Task<List<Producto>> ObtenerStockBajoAsync()
    {
        return await _context.Productos
            .Where(p =>
                p.Activo &&
                p.StockActual <= p.StockMinimo
            )
            .OrderBy(p => p.StockActual)
            .ToListAsync();
    }
}