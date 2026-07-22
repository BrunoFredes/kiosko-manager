using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

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
    CreateUsuarioDto dto
)
    {
        var usuario = new Usuario
        {
            NombreUsuario = dto.NombreUsuario,
            ApellidoUsuario = dto.ApellidoUsuario,
            EmailUsuario = dto.EmailUsuario,
            PasswordHash = dto.Password, // después lo vamos a hashear
            RolUsuario = dto.RolUsuario,
            ActivoUsuario = true,
            FechaCreacionUsuario = DateTime.UtcNow
        };

        var usuarioCreado =
            await _usuarioRepository.CreateAsync(usuario);

        return Ok(usuarioCreado);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUsuario(
    long id,
    UpdateUsuarioDto dto
)
    {
        var usuario =
            await _usuarioRepository.GetByIdAsync(id);

        if (usuario == null)
            return NotFound();

        usuario.NombreUsuario = dto.NombreUsuario;
        usuario.ApellidoUsuario = dto.ApellidoUsuario;
        usuario.EmailUsuario = dto.EmailUsuario;
        usuario.RolUsuario = dto.RolUsuario;

        await _usuarioRepository.UpdateAsync(usuario);

        return Ok(usuario);
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
    [HttpPut("cambiar-password")]
    public async Task<IActionResult>
CambiarPassword(
    CambiarPasswordDto dto)
    {
        Console.WriteLine("Entró al endpoint");

        var resultado =
            await _usuarioRepository
                .CambiarPasswordAsync(
                    dto.IdUsuario,
                    dto.PasswordActual,
                    dto.PasswordNueva);

        Console.WriteLine($"Resultado: {resultado}");

        if (!resultado)
        {
            return BadRequest(
                "Contraseña actual incorrecta");
        }

        return Ok(
            "Contraseña actualizada");
    }
    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(string texto)
    {
        var usuarios =
            await _usuarioRepository.BuscarAsync(texto);

        return Ok(usuarios);
    }
    [HttpPatch("{id}/activo")]
    public async Task<IActionResult> CambiarEstado(long id)
    {
        var resultado =
            await _usuarioRepository.CambiarEstadoAsync(id);

        if (!resultado)
            return NotFound();

        return Ok();
    }
}