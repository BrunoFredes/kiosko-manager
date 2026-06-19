using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class UsuarioRepository
    : IUsuarioRepository
{
    private readonly KioskoDbContext _context;

    public UsuarioRepository(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    public async Task<List<Usuario>>
       GetAllAsync()
    {
        return await _context.Usuarios
            .Where(u => u.ActivoUsuario)
            .ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(
        long id
    )
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.IdUsuario == id
            );
    }

    public async Task<Usuario?> GetByEmailAsync(
        string email
    )
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.EmailUsuario == email
            );
    }

    public async Task<Usuario> CreateAsync(
        Usuario usuario
    )
    {
        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario?> UpdateAsync(
        Usuario usuario
    )
    {
        var usuarioExistente =
            await _context.Usuarios
                .FirstOrDefaultAsync(
                    u => u.IdUsuario ==
                         usuario.IdUsuario
                );

        if (usuarioExistente == null)
        {
            return null;
        }

        usuarioExistente.NombreUsuario =
            usuario.NombreUsuario;

        usuarioExistente.ApellidoUsuario =
            usuario.ApellidoUsuario;

        usuarioExistente.EmailUsuario =
            usuario.EmailUsuario;

        usuarioExistente.RolUsuario =
            usuario.RolUsuario;

        usuarioExistente.ActivoUsuario =
            usuario.ActivoUsuario;

        await _context.SaveChangesAsync();

        return usuarioExistente;
    }

    public async Task<bool> DeleteAsync(
     long id)
    {
        var usuario =
            await _context.Usuarios
                .FirstOrDefaultAsync(
                    u => u.IdUsuario == id);

        if (usuario == null)
        {
            return false;
        }

        usuario.ActivoUsuario =
            false;

        await _context.SaveChangesAsync();

        return true;
    }
    public async Task<bool> CambiarPasswordAsync(
    long idUsuario,
    string passwordActual,
    string passwordNueva)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(
                u => u.IdUsuario == idUsuario);

        if (usuario == null)
        {
            return false;
        }

        if (usuario.PasswordHash != passwordActual)
        {
            return false;
        }

        usuario.PasswordHash = passwordNueva;

        await _context.SaveChangesAsync();

        return true;
    }
}