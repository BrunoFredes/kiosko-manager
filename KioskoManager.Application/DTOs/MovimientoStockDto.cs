namespace KioskoManager.Application.DTOs;

public class MovimientoStockDto
{
    public long IdMovimientoStock { get; set; }

    public DateTime FechaMovimiento { get; set; }

    public string NombreProducto { get; set; } = string.Empty;

    public string NombreUsuario { get; set; } = string.Empty;

    public string TipoMovimiento { get; set; } = string.Empty;

    public int Cantidad { get; set; }

    public int StockAnterior { get; set; }

    public int StockNuevo { get; set; }

    public string? Observacion { get; set; }
}