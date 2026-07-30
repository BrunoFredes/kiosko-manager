using KioskoManager.Application.DTOs;

namespace KioskoManager.Application.Interfaces;

public interface IMovimientoRepository
{
    Task<List<MovimientoDto>> ObtenerHistorialAsync();
}