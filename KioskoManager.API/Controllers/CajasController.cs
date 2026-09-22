using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CajasController : ControllerBase
{
    private readonly ICajaRepository _cajaRepository;

    public CajasController(
        ICajaRepository cajaRepository
    )
    {
        _cajaRepository =
            cajaRepository;
    }

    // =====================================================
    // CAJA ACTUAL
    // =====================================================

    [HttpGet("actual")]
    public async Task<IActionResult> ObtenerCajaActual()
    {
        try
        {
            var caja =
                await _cajaRepository
                    .ObtenerCajaActualAsync();

            return Ok(
                new
                {
                    abierta = caja != null,
                    caja
                }
            );
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje =
                        "Error al obtener la caja actual",

                    detalle =
                        ex.ToString()
                }
            );
        }
    }

    // =====================================================
    // ABRIR CAJA
    // =====================================================

    [HttpPost("abrir")]
    public async Task<IActionResult> AbrirCaja(
        AbrirCajaDto dto
    )
    {
        try
        {
            // TEMPORAL.
            // Después lo sacamos y usamos JWT.
            long idUsuario = 3;

            var caja =
                await _cajaRepository
                    .AbrirCajaAsync(
                        dto,
                        idUsuario
                    );

            if (caja == null)
            {
                return BadRequest(
                    "No se pudo abrir la caja. " +
                    "Puede que ya exista una caja abierta."
                );
            }

            return Ok(caja);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje =
                        "Error al abrir la caja",

                    detalle =
                        ex.ToString()
                }
            );
        }
    }

    // =====================================================
    // INGRESO / EGRESO
    // =====================================================

    [HttpPost("movimiento")]
    public async Task<IActionResult>
        RegistrarMovimiento(
            CrearMovimientoCajaDto dto
        )
    {
        try
        {
            // TEMPORAL.
            long idUsuario = 3;

            var movimiento =
                await _cajaRepository
                    .RegistrarMovimientoAsync(
                        dto,
                        idUsuario
                    );

            if (movimiento == null)
            {
                return BadRequest(
                    "No se pudo registrar el movimiento. " +
                    "Verificá que haya una caja abierta, " +
                    "que el monto sea mayor a 0 y " +
                    "que el tipo sea INGRESO o EGRESO."
                );
            }

            return Ok(movimiento);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje =
                        "Error al registrar movimiento de caja",

                    detalle =
                        ex.ToString()
                }
            );
        }
    }

    // =====================================================
    // CERRAR CAJA
    // =====================================================

    [HttpPost("cerrar/{idCaja:long}")]
    public async Task<IActionResult> CerrarCaja(
        long idCaja,
        CerrarCajaDto dto
    )
    {
        try
        {
            // TEMPORAL.
            long idUsuario = 3;

            var caja =
                await _cajaRepository
                    .CerrarCajaAsync(
                        idCaja,
                        dto,
                        idUsuario
                    );

            if (caja == null)
            {
                return BadRequest(
                    "No se pudo cerrar la caja."
                );
            }

            return Ok(caja);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje =
                        "Error al cerrar la caja",

                    detalle =
                        ex.ToString()
                }
            );
        }
    }

    // =====================================================
    // HISTORIAL
    // =====================================================

    [HttpGet("historial")]
    public async Task<IActionResult>
        ObtenerHistorial()
    {
        try
        {
            var historial =
                await _cajaRepository
                    .ObtenerHistorialAsync();

            return Ok(historial);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje =
                        "Error al obtener el historial de cajas",

                    detalle =
                        ex.ToString()
                }
            );
        }
    }
    [HttpGet("{idCaja:long}/detalle")]
public async Task<IActionResult> ObtenerDetalle(
    long idCaja
)
{
    try
    {
        var detalle =
            await _cajaRepository
                .ObtenerDetalleAsync(idCaja);

        if (detalle == null)
        {
            return NotFound(
                "No se encontró la caja."
            );
        }

        return Ok(detalle);
    }
    catch (Exception ex)
    {
        return StatusCode(
            500,
            new
            {
                mensaje =
                    "Error al obtener el detalle de la caja",
                detalle =
                    ex.ToString()
            }
        );
    }
}
}