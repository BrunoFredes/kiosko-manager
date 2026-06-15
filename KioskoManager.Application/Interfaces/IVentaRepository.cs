using KioskoManager.Application.DTOs;
using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface IVentaRepository
{
    Task<Venta?> CrearVentaAsync(
        CreateVentaDto ventaDto
    );
}