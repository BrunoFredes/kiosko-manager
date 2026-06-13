using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface ICategoriaRepository
{
    Task<List<Categoria>> GetAllAsync();

    Task<Categoria?> GetByIdAsync(long id);

    Task<Categoria> CreateAsync(Categoria categoria);

    Task<Categoria?> UpdateAsync(Categoria categoria);

    Task<bool> DeleteAsync(long id);
}