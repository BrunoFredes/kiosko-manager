namespace KioskoManager.Application.DTOs;

public class CrearMovimientoCajaDto
{
    public string TipoMovimiento { get; set; } = string.Empty;

    public decimal Monto { get; set; }

    public string? Descripcion { get; set; }
}