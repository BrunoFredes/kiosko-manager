using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.Insfrastructure.Repositories;

public class CajaRepository : ICajaRepository
{
    private readonly KioskoDbContext _context;

    public CajaRepository(KioskoDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // OBTENER CAJA ACTUAL
    // =====================================================

    public async Task<CajaDto?> ObtenerCajaActualAsync()
    {
        var caja = await _context.Cajas
            .AsNoTracking()
            .Include(c => c.UsuarioApertura)
            .Include(c => c.UsuarioCierre)
            .FirstOrDefaultAsync(c => c.Estado == "ABIERTA");

        if (caja == null)
            return null;

        var ahora = DateTime.UtcNow;

        var montoEsperado =
            await CalcularMontoEsperadoAsync(
                caja,
                ahora
            );

        var dto = ConvertirADto(caja);

        dto.MontoEsperado = montoEsperado;

        return dto;
    }

    // =====================================================
    // ABRIR CAJA
    // =====================================================

    public async Task<Caja?> AbrirCajaAsync(
        AbrirCajaDto dto,
        long idUsuario
    )
    {
        var cajaAbierta =
            await _context.Cajas
                .AnyAsync(c => c.Estado == "ABIERTA");

        if (cajaAbierta)
            return null;

        if (dto.MontoInicial < 0)
            return null;

        var caja = new Caja
        {
            IdUsuarioApertura = idUsuario,
            FechaApertura = DateTime.UtcNow,
            MontoInicial = dto.MontoInicial,
            Estado = "ABIERTA"
        };

        _context.Cajas.Add(caja);

        await _context.SaveChangesAsync();

        return caja;
    }

    // =====================================================
    // REGISTRAR INGRESO / EGRESO
    // =====================================================

    public async Task<MovimientoCajaDto?> RegistrarMovimientoAsync(
        CrearMovimientoCajaDto dto,
        long idUsuario
    )
    {
        var caja =
            await _context.Cajas
                .FirstOrDefaultAsync(
                    c => c.Estado == "ABIERTA"
                );

        if (caja == null)
            return null;

        if (dto.Monto <= 0)
            return null;

        var tipo =
            dto.TipoMovimiento
                .Trim()
                .ToUpper();

        if (
            tipo != "INGRESO" &&
            tipo != "EGRESO"
        )
        {
            return null;
        }

        var movimiento = new MovimientoCaja
        {
            IdCaja = caja.IdCaja,

            TipoMovimiento = tipo,

            Monto = dto.Monto,

            Descripcion =
                string.IsNullOrWhiteSpace(dto.Descripcion)
                    ? null
                    : dto.Descripcion.Trim(),

            FechaMovimiento = DateTime.UtcNow
        };

        _context.MovimientosCaja.Add(movimiento);

        await _context.SaveChangesAsync();

        return new MovimientoCajaDto
        {
            IdMovimientoCaja =
                movimiento.IdMovimientoCaja,

            IdCaja =
                movimiento.IdCaja,

            TipoMovimiento =
                movimiento.TipoMovimiento,

            Descripcion =
                movimiento.Descripcion,

            Monto =
                movimiento.Monto,

            FechaMovimiento =
                movimiento.FechaMovimiento
        };
    }

    // =====================================================
    // CERRAR CAJA
    // =====================================================

    public async Task<Caja?> CerrarCajaAsync(
        long idCaja,
        CerrarCajaDto dto,
        long idUsuario
    )
    {
        var caja = await _context.Cajas
            .Include(c => c.UsuarioApertura)
            .Include(c => c.UsuarioCierre)
            .FirstOrDefaultAsync(c =>
                c.IdCaja == idCaja &&
                c.Estado == "ABIERTA"
            );

        if (caja == null)
            return null;

        if (dto.MontoFinal < 0)
            return null;

        var fechaCierre = DateTime.UtcNow;

        var montoEsperado =
            await CalcularMontoEsperadoAsync(
                caja,
                fechaCierre
            );

        var diferencia =
            dto.MontoFinal - montoEsperado;

        caja.FechaCierre = fechaCierre;

        caja.MontoEsperado = montoEsperado;

        caja.MontoFinal = dto.MontoFinal;

        caja.Diferencia = diferencia;

        caja.IdUsuarioCierre = idUsuario;

        caja.Observacion = dto.Observacion;

        caja.Estado = "CERRADA";

        await _context.SaveChangesAsync();

        return caja;
    }

    // =====================================================
    // HISTORIAL DE CAJAS
    // =====================================================

    public async Task<List<CajaDto>> ObtenerHistorialAsync()
    {
        var cajas = await _context.Cajas
            .AsNoTracking()
            .Include(c => c.UsuarioApertura)
            .Include(c => c.UsuarioCierre)
            .OrderByDescending(c => c.FechaApertura)
            .ToListAsync();

        return cajas
            .Select(ConvertirADto)
            .ToList();
    }

    // =====================================================
    // CALCULAR EFECTIVO ESPERADO
    // =====================================================

    private async Task<decimal> CalcularMontoEsperadoAsync(
        Caja caja,
        DateTime fechaHasta
    )
    {
        var totalVentasEfectivo =
            await _context.Ventas
                .Where(v =>
                    v.FechaVenta >= caja.FechaApertura &&
                    v.FechaVenta <= fechaHasta &&
                    v.MetodoPago == "EFECTIVO"
                )
                .SumAsync(v =>
                    (decimal?)v.TotalVenta
                ) ?? 0m;

        var movimientosCaja =
            await _context.MovimientosCaja
                .Where(m =>
                    m.IdCaja == caja.IdCaja &&
                    m.FechaMovimiento >= caja.FechaApertura &&
                    m.FechaMovimiento <= fechaHasta
                )
                .ToListAsync();

        var totalIngresos =
            movimientosCaja
                .Where(m =>
                    m.TipoMovimiento == "INGRESO"
                )
                .Sum(m => m.Monto);

        var totalEgresos =
            movimientosCaja
                .Where(m =>
                    m.TipoMovimiento == "EGRESO"
                )
                .Sum(m => m.Monto);

        return
            caja.MontoInicial
            + totalVentasEfectivo
            + totalIngresos
            - totalEgresos;
    }

    // =====================================================
    // CONVERTIR CAJA A DTO
    // =====================================================

    private static CajaDto ConvertirADto(Caja caja)
    {
        return new CajaDto
        {
            IdCaja =
                caja.IdCaja,

            IdUsuarioApertura =
                caja.IdUsuarioApertura,

            UsuarioApertura =
                caja.UsuarioApertura != null
                    ? caja.UsuarioApertura.NombreUsuario +
                      " " +
                      caja.UsuarioApertura.ApellidoUsuario
                    : string.Empty,

            FechaApertura =
                caja.FechaApertura,

            MontoInicial =
                caja.MontoInicial,

            FechaCierre =
                caja.FechaCierre,

            MontoEsperado =
                caja.MontoEsperado,

            MontoFinal =
                caja.MontoFinal,

            Diferencia =
                caja.Diferencia,

            Estado =
                caja.Estado,

            IdUsuarioCierre =
                caja.IdUsuarioCierre,

            UsuarioCierre =
                caja.UsuarioCierre != null
                    ? caja.UsuarioCierre.NombreUsuario +
                      " " +
                      caja.UsuarioCierre.ApellidoUsuario
                    : null,

            Observacion =
                caja.Observacion
        };
    }
}