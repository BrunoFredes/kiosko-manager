using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class VentaRepository
    : IVentaRepository
{
    private readonly KioskoDbContext _context;

    public VentaRepository(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    public async Task<Venta?> CrearVentaAsync(
    CreateVentaDto ventaDto
)
    {
        decimal totalVenta = 0;

        var detallesVenta =
            new List<DetalleVenta>();

        foreach (var detalle in ventaDto.Detalles)
        {
            var producto =
                await _context.Productos
                    .FirstOrDefaultAsync(
                        p => p.IdProducto ==
                             detalle.IdProducto
                    );

            if (producto == null)
            {
                return null;
            }

            if (
                producto.StockActual <
                detalle.Cantidad
            )
            {
                return null;
            }

            var subtotal =
                producto.PrecioVenta *
                detalle.Cantidad;

            totalVenta += subtotal;

            detallesVenta.Add(
                new DetalleVenta
                {
                    IdProducto =
                        producto.IdProducto,

                    Cantidad =
                        detalle.Cantidad,

                    PrecioUnitario =
                        producto.PrecioVenta,

                    Subtotal =
                        subtotal
                }
            );
        }

        var venta = new Venta
        {
            FechaVenta = DateTime.UtcNow,
            TotalVenta = totalVenta,
            IdUsuario = ventaDto.IdUsuario
        };
        _context.Ventas.Add(venta);

        await _context.SaveChangesAsync();

        foreach (var detalle in detallesVenta)
        {
            detalle.IdVenta =
                venta.IdVenta;

            _context.DetalleVenta.Add(
                detalle
            );

            var producto =
                await _context.Productos
                    .FirstAsync(
                        p => p.IdProducto ==
                             detalle.IdProducto
                    );

            producto.StockActual -=
                detalle.Cantidad;
        }

        await _context.SaveChangesAsync();

        return venta;
    }
}