using KioskoManager.Application.DTOs;

namespace KioskoManager.Application.Interfaces;

public interface IMovimientoStockRepository
{
    Task<List<MovimientoStockDto>> GetAllAsync();
}