using KioskoManager.Application.DTOs;
using KioskoManager.Domain.Entities;

namespace KioskoManager.Application.Interfaces;

public interface ICajaRepository
{
    Task<CajaDto?> ObtenerCajaActualAsync();

    Task<Caja?> AbrirCajaAsync(
        AbrirCajaDto dto,
        long idUsuario
    );

    Task<Caja?> CerrarCajaAsync(
        long idCaja,
        CerrarCajaDto dto,
        long idUsuario
    );

    Task<List<CajaDto>> ObtenerHistorialAsync();

    Task<MovimientoCajaDto?> RegistrarMovimientoAsync(
        CrearMovimientoCajaDto dto,
        long idUsuario
    );
}