namespace KioskoManager.Application.DTOs;

public class CreateProductoDto
{
    public string NombreProducto { get; set; } = string.Empty;

    public string? CodigoBarras { get; set; }

    public decimal PrecioCompra { get; set; }

    public decimal PrecioVenta { get; set; }

    public int StockActual { get; set; }

    public int StockMinimo { get; set; }

    public long IdCategoria { get; set; }
}