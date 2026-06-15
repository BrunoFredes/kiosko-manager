using System.ComponentModel.DataAnnotations;

namespace KioskoManager.Domain.Entities;

public class DetalleVenta
{
    [Key]
    public long IdDetalle { get; set; }

    public long IdVenta { get; set; }

    public Venta Venta { get; set; } = null!;

    public long IdProducto { get; set; }

    public Producto Producto { get; set; } = null!;

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal Subtotal { get; set; }
}