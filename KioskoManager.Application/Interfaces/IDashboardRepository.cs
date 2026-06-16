using KioskoManager.Application.DTOs;

namespace KioskoManager.Application.Interfaces;

public interface IDashboardRepository
{
    Task<DashboardResumenDto>
        ObtenerResumenDiaAsync();

    Task<DashboardResumenDto>
        ObtenerResumenSemanaAsync();

    Task<DashboardResumenDto>
        ObtenerResumenMesAsync();

    Task<DashboardResumenDto>
        ObtenerResumenAnioAsync();

    Task<List<ProductoMasVendidoDto>>
        ObtenerProductosMasVendidosAsync(
            int cantidad);

    Task<List<ProductoMasVendidoDto>>
        ObtenerProductosMasVendidosSemanaAsync(
            int cantidad);

    Task<List<ProductoMasVendidoDto>>
        ObtenerProductosMasVendidosMesAsync(
            int cantidad);

    Task<List<ProductoMasVendidoDto>>
        ObtenerProductosMasVendidosAnioAsync(
            int cantidad);
}