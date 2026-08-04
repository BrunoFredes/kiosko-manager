namespace KioskoManager.Application.DTOs;

public class MovimientoDto
{
    public DateTime Fecha { get; set; }

    public string Tipo { get; set; } = string.Empty;

    public string Usuario { get; set; } = string.Empty;

    public decimal? Monto { get; set; }

    public string Descripcion { get; set; } = string.Empty;

    public long IdReferencia { get; set; }

    public long? IdVenta { get; set; }

}