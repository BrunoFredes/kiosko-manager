using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController
    : ControllerBase
{
    private readonly
        IDashboardRepository
        _dashboardRepository;

    public DashboardController(
        IDashboardRepository dashboardRepository)
    {
        _dashboardRepository =
            dashboardRepository;
    }

    [HttpGet("resumen-dia")]
    public async Task<IActionResult>
        ResumenDia()
    {
        var resultado =
            await _dashboardRepository
                .ObtenerResumenDiaAsync();

        return Ok(resultado);
    }

    [HttpGet("top-productos")]
    public async Task<IActionResult>
        TopProductos()
    {
        var resultado =
            await _dashboardRepository
                .ObtenerProductosMasVendidosAsync(5);

        return Ok(resultado);
    }
    [HttpGet("resumen-semana")]
    public async Task<ActionResult<DashboardResumenDto>>
    ObtenerResumenSemana()
    {
        var resumen =
            await _dashboardRepository
                .ObtenerResumenSemanaAsync();

        return Ok(resumen);
    }
    [HttpGet("resumen-mes")]
    public async Task<ActionResult<DashboardResumenDto>>
ObtenerResumenMes()
    {
        var resumen =
            await _dashboardRepository
                .ObtenerResumenMesAsync();

        return Ok(resumen);
    }

    [HttpGet("resumen-anio")]
    public async Task<ActionResult<DashboardResumenDto>>
    ObtenerResumenAnio()
    {
        var resumen =
            await _dashboardRepository
                .ObtenerResumenAnioAsync();

        return Ok(resumen);
    }
    [HttpGet("top-productos-semana")]
    public async Task<IActionResult>
TopProductosSemana()
    {
        var resultado =
            await _dashboardRepository
                .ObtenerProductosMasVendidosSemanaAsync(5);

        return Ok(resultado);
    }

    [HttpGet("top-productos-mes")]
    public async Task<IActionResult>
    TopProductosMes()
    {
        var resultado =
            await _dashboardRepository
                .ObtenerProductosMasVendidosMesAsync(5);

        return Ok(resultado);
    }

    [HttpGet("top-productos-anio")]
    public async Task<IActionResult>
    TopProductosAnio()
    {
        var resultado =
            await _dashboardRepository
                .ObtenerProductosMasVendidosAnioAsync(5);

        return Ok(resultado);
    }
}