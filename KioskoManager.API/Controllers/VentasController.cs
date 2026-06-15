using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly IVentaRepository
        _ventaRepository;

    public VentasController(
        IVentaRepository ventaRepository
    )
    {
        _ventaRepository =
            ventaRepository;
    }

    [HttpPost]
    public async Task<IActionResult> CrearVenta(
        CreateVentaDto ventaDto
    )
    {
        var venta =
            await _ventaRepository
                .CrearVentaAsync(
                    ventaDto
                );

        if (venta == null)
        {
            return BadRequest(
                "No se pudo registrar la venta"
            );
        }

        return Ok(new
        {
            venta.IdVenta,
            venta.FechaVenta,
            venta.TotalVenta,
            venta.IdUsuario
        });
    }
}