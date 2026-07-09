namespace KioskoManager.Application.DTOs;

public class CreateDetalleVentaDto
{
    public long? IdProducto { get; set; }

    public string? DescripcionManual { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }
}