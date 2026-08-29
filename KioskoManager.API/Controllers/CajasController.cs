using Microsoft.AspNetCore.Mvc;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CajasController : ControllerBase
{
    private readonly ICajaRepository _cajaRepository;

    public CajasController(ICajaRepository cajaRepository)
    {
        _cajaRepository = cajaRepository;
    }

    // =====================================================
    // OBTENER CAJA ACTUAL
    // =====================================================

    [HttpGet("actual")]
    public async Task<IActionResult> ObtenerCajaActual()
    {
        try
        {
            var caja =
                await _cajaRepository
                    .ObtenerCajaActualAsync();

            if (caja == null)
            {
                return Ok(new
                {
                    abierta = false,
                    caja = (CajaDto?)null
                });
            }

            return Ok(new
            {
                abierta = true,
                caja
            });
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje = "Error al obtener la caja actual",
                    detalle = ex.Message
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
            // Por ahora usamos un usuario temporal.
            // Después lo reemplazamos por el usuario
            // obtenido desde JWT.
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
                    mensaje = "Error al abrir la caja",
                    detalle = ex.ToString()
                }
            );
        
    }
    }

    // =====================================================
    // CERRAR CAJA
    // =====================================================

    [HttpPost("cerrar/{idCaja}")]
    public async Task<IActionResult> CerrarCaja(
        long idCaja,
        CerrarCajaDto dto
    )
    {
        try
        {
            // Por ahora usamos un usuario temporal.
            // Después lo reemplazamos por JWT.
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
                    "No se encontró una caja abierta con ese ID."
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
                    mensaje = "Error al cerrar la caja",
                    detalle = ex.Message
                }
            );
        }
    }

    // =====================================================
    // HISTORIAL DE CAJAS
    // =====================================================

    [HttpGet("historial")]
    public async Task<IActionResult> ObtenerHistorial()
    {
        try
        {
            var cajas =
                await _cajaRepository
                    .ObtenerHistorialAsync();

            return Ok(cajas);
        }
        catch (Exception ex)
        {
            return StatusCode(
                500,
                new
                {
                    mensaje = "Error al obtener el historial de cajas",
                    detalle = ex.Message
                }
            );
        }
    }
    // =====================================================
    // REGISTRAR INGRESO / EGRESO
    // =====================================================

    [HttpPost("movimiento")]
    public async Task<IActionResult> RegistrarMovimiento(
        CrearMovimientoCajaDto dto
    )
    {
        try
        {
            // Temporalmente usamos Admin Sistema.
            // Después lo obtenemos del JWT.
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
                    "que el monto sea mayor a 0 y que el tipo sea INGRESO o EGRESO."
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
                    mensaje = "Error al registrar movimiento de caja",
                    detalle = ex.ToString()
                }
            );
        }
    }
}