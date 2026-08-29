namespace KioskoManager.Application.DTOs;

public class MovimientoCajaDto
{
    public long IdMovimientoCaja { get; set; }

    public long IdCaja { get; set; }

    public string TipoMovimiento { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public decimal Monto { get; set; }

    public DateTime FechaMovimiento { get; set; }
}