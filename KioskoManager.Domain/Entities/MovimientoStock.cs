using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace KioskoManager.Domain.Entities;

public class MovimientoStock
{
    [Key]
    public long IdMovimientoStock { get; set; }

    public long IdProducto { get; set; }


    [JsonIgnore]
    public Producto? Producto { get; set; } = null!;

    public long IdUsuario { get; set; }

    public Usuario Usuario { get; set; } = null!;

    public string TipoMovimiento { get; set; } = string.Empty;

    public int Cantidad { get; set; }

    public int StockAnterior { get; set; }

    public int StockNuevo { get; set; }

    public string? Observacion { get; set; }

    public DateTime FechaMovimiento { get; set; }
}