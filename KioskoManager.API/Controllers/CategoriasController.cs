using KioskoManager.Application.DTOs;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly KioskoDbContext _context;

    public CategoriasController(
        KioskoDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategorias()
    {
        var categorias = await _context.Categorias.ToListAsync();

        return Ok(categorias);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCategoria(
        CreateCategoriaDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.NombreCategoria))
        {
            return BadRequest(
                "El nombre de la categoría es obligatorio."
            );
        }

        var categoriaExistente =
            await _context.Categorias.AnyAsync(
                c => c.NombreCategoria.ToLower() ==
                     dto.NombreCategoria.ToLower()
            );

        if (categoriaExistente)
        {
            return BadRequest(
                "La categoría ya existe."
            );
        }

        var categoria = new Categoria
        {
            NombreCategoria = dto.NombreCategoria
        };

        _context.Categorias.Add(categoria);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCategorias),
            new { id = categoria.IdCategoria },
            categoria
        );
    }
}