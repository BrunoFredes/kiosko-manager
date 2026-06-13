using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaRepository _categoriaRepository;

    public CategoriasController(
        ICategoriaRepository categoriaRepository
    )
    {
        _categoriaRepository = categoriaRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categorias =
            await _categoriaRepository.GetAllAsync();

        return Ok(categorias);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(
        long id
    )
    {
        var categoria =
            await _categoriaRepository.GetByIdAsync(id);

        if (categoria == null)
        {
            return NotFound();
        }

        return Ok(categoria);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        Categoria categoria
    )
    {
        var nuevaCategoria =
            await _categoriaRepository.CreateAsync(categoria);

        return CreatedAtAction(
            nameof(GetById),
            new { id = nuevaCategoria.IdCategoria },
            nuevaCategoria
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        long id,
        Categoria categoria
    )
    {
        categoria.IdCategoria = id;

        var categoriaActualizada =
            await _categoriaRepository.UpdateAsync(categoria);

        if (categoriaActualizada == null)
        {
            return NotFound();
        }

        return Ok(categoriaActualizada);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        long id
    )
    {
        var eliminado =
            await _categoriaRepository.DeleteAsync(id);

        if (!eliminado)
        {
            return NotFound();
        }

        return NoContent();
    }
}