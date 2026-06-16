using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KioskoManager.Domain.Entities;

public class Producto
{
    [Key]
    public long IdProducto { get; set; }

    public string NombreProducto { get; set; } = string.Empty;

    public string? CodigoBarras { get; set; }

    public decimal PrecioCompra { get; set; }

    public decimal PrecioVenta { get; set; }

    public int StockActual { get; set; }

    public int StockMinimo { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaCreacion { get; set; }

    public long IdCategoria { get; set; }

    [JsonIgnore]
    public Categoria? Categoria { get; set; }
    
    
    [JsonIgnore]
    public ICollection<DetalleVenta>
    DetallesVenta
    { get; set; }
    = new List<DetalleVenta>();


    [JsonIgnore]
    public ICollection<MovimientoStock>
    MovimientosStock
    { get; set; }
    = new List<MovimientoStock>();
}