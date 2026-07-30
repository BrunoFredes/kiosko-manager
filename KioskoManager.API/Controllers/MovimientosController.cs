using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.Interfaces;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovimientosController : ControllerBase
{
    private readonly IMovimientoRepository _movimientoRepository;

    public MovimientosController(
        IMovimientoRepository movimientoRepository)
    {
        _movimientoRepository = movimientoRepository;
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerHistorial()
    {
        var historial =
            await _movimientoRepository.ObtenerHistorialAsync();

        return Ok(historial);
    }
}