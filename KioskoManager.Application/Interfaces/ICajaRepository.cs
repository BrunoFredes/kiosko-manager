using KioskoManager.Application.DTOs;

namespace KioskoManager.Application.Interfaces;

public interface ICajaRepository
{
    Task<CajaDto?> ObtenerCajaActualAsync();

    Task<CajaDto?> AbrirCajaAsync(
        AbrirCajaDto dto,
        long idUsuario
    );

    Task<CajaDto?> CerrarCajaAsync(
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