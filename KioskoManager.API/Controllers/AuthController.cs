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
        Console.WriteLine("ENTRO AL LOGIN");

        var usuario =
            await _usuarioRepository
                .GetByEmailAsync(request.Email);

        Console.WriteLine("PASO BUSQUEDA");

        if (usuario == null)
        {
            Console.WriteLine("USUARIO NULL");
            return Unauthorized();
        }

        Console.WriteLine("USUARIO ENCONTRADO");

        if (usuario.PasswordHash != request.Password)
        {
            Console.WriteLine("PASSWORD INCORRECTA");
            return Unauthorized();
        }

        Console.WriteLine("ANTES DEL RETURN");

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