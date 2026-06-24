using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface IProductoRepository
{
    Task<List<Producto>> GetAllAsync();

    Task<Producto?> GetByIdAsync(long id);

    Task<Producto> CreateAsync(Producto producto);

    Task<Producto?> UpdateAsync(Producto producto);

    Task<bool> SoftDeleteAsync(long id);


    Task<List<Producto>> BuscarAsync(string texto);

    Task<List<Producto>> ObtenerStockBajoAsync();

    Task<Producto?> GetByCodigoAsync(string codigo);

    Task<List<Producto>> GetByCategoriaAsync(long idCategoria);

    Task<List<Producto>> ObtenerTodosActivosAsync();
}