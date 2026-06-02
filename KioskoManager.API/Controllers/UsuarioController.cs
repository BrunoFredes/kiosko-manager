using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly KioskoDbContext _context;

        public UsuariosController(
            KioskoDbContext context
        )
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();

            return Ok(usuarios);
        }

    }

}