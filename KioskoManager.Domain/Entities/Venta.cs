using System.ComponentModel.DataAnnotations;

namespace KioskoManager.Domain.Entities;

public class Venta
{
    [Key]
    public long IdVenta { get; set; }

    public DateTime FechaVenta { get; set; }

    public decimal TotalVenta { get; set; }

    public long IdUsuario { get; set; }

    public string MetodoPago { get; set; } = "Efectivo";

    public Usuario Usuario { get; set; } = null!;

    public ICollection<DetalleVenta>
        Detalles
    { get; set; }
        = new List<DetalleVenta>();
}