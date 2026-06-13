using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuariosController(
        IUsuarioRepository usuarioRepository
    )
    {
        _usuarioRepository = usuarioRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsuarios()
    {
        var usuarios =
            await _usuarioRepository.GetAllAsync();

        return Ok(usuarios);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUsuarioById(
        long id
    )
    {
        var usuario =
            await _usuarioRepository.GetByIdAsync(id);

        if (usuario == null)
        {
            return NotFound();
        }

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUsuario(
        Usuario usuario
    )
    {
        var usuarioCreado =
            await _usuarioRepository.CreateAsync(usuario);

        return CreatedAtAction(
            nameof(GetUsuarioById),
            new { id = usuarioCreado.IdUsuario },
            usuarioCreado
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUsuario(
        long id,
        Usuario usuario
    )
    {
        usuario.IdUsuario = id;

        var usuarioActualizado =
            await _usuarioRepository.UpdateAsync(usuario);

        if (usuarioActualizado == null)
        {
            return NotFound();
        }

        return Ok(usuarioActualizado);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsuario(
        long id
    )
    {
        var eliminado =
            await _usuarioRepository.DeleteAsync(id);

        if (!eliminado)
        {
            return NotFound();
        }

        return NoContent();
    }
}