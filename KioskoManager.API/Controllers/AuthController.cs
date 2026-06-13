using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.Interfaces;
using KioskoManager.Application.DTOs;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUsuarioRepository
        _usuarioRepository;

    public AuthController(
        IUsuarioRepository usuarioRepository
    )
    {
        _usuarioRepository =
            usuarioRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequestDto request
    )
    {
        var usuario =
            await _usuarioRepository
                .GetByEmailAsync(
                    request.Email
                );

        if (usuario == null)
        {
            return Unauthorized(
                "Usuario no encontrado"
            );
        }

        if (
            usuario.PasswordHash !=
            request.Password
        )
        {
            return Unauthorized(
                "Contraseña incorrecta"
            );
        }

        if (!usuario.ActivoUsuario)
        {
            return Unauthorized(
                "Usuario inactivo"
            );
        }

        return Ok(
            new
            {
                usuario.IdUsuario,
                usuario.NombreUsuario,
                usuario.RolUsuario
            }
        );
    }
}