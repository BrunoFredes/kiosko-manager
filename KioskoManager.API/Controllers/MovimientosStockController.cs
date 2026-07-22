using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.Interfaces;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovimientosStockController : ControllerBase
{
    private readonly IMovimientoStockRepository _repository;

    public MovimientosStockController(
        IMovimientoStockRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetMovimientos()
    {
        var movimientos =
            await _repository.GetAllAsync();

        return Ok(movimientos);
    }
}