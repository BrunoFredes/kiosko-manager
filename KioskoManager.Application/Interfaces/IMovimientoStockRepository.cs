using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface IMovimientoStockRepository
{
    Task<List<MovimientoStock>>
        GetAllAsync();
}