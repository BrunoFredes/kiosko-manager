using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Infrastructure.Repositories;

public class CategoriaRepository
    : ICategoriaRepository
{
    private readonly KioskoDbContext _context;

    public CategoriaRepository(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    public async Task<List<Categoria>> GetAllAsync()
    {
        return await _context.Categorias
            .ToListAsync();
    }

    public async Task<Categoria?> GetByIdAsync(
        long id
    )
    {
        return await _context.Categorias
            .FirstOrDefaultAsync(
                c => c.IdCategoria == id
            );
    }

    public async Task<Categoria> CreateAsync(
        Categoria categoria
    )
    {
        _context.Categorias.Add(categoria);

        await _context.SaveChangesAsync();

        return categoria;
    }

    public async Task<Categoria?> UpdateAsync(
        Categoria categoria
    )
    {
        var categoriaExistente =
            await _context.Categorias
                .FirstOrDefaultAsync(
                    c => c.IdCategoria ==
                         categoria.IdCategoria
                );

        if (categoriaExistente == null)
        {
            return null;
        }

        categoriaExistente.NombreCategoria =
            categoria.NombreCategoria;

        await _context.SaveChangesAsync();

        return categoriaExistente;
    }

    public async Task<bool> DeleteAsync(
        long id
    )
    {
        var categoria =
            await _context.Categorias
                .FirstOrDefaultAsync(
                    c => c.IdCategoria == id
                );

        if (categoria == null)
        {
            return false;
        }

        _context.Categorias.Remove(categoria);

        await _context.SaveChangesAsync();

        return true;
    }
}