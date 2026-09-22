using System.Collections.Generic;

namespace KioskoManager.Application.DTOs;

public class CajaDetalleDto
{
    public CajaDto Caja { get; set; } = null!;

    public decimal TotalIngresos { get; set; }

    public decimal TotalEgresos { get; set; }

    public List<MovimientoCajaDto> Movimientos { get; set; }
        = new List<MovimientoCajaDto>();
}