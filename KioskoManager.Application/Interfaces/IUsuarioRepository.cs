using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<List<Usuario>> GetAllAsync();

    Task<Usuario?> GetByIdAsync(long id);

    Task<Usuario?> GetByEmailAsync(string email);

    Task<Usuario> CreateAsync(Usuario usuario);

    Task<Usuario?> UpdateAsync(Usuario usuario);

    Task<bool> DeleteAsync(long id);

    Task<bool> CambiarPasswordAsync(
    long idUsuario,
    string passwordActual,
    string passwordNueva
    );
    Task<List<Usuario>> BuscarAsync(string texto);

    Task<bool> CambiarEstadoAsync(long id);
}