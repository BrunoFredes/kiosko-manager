namespace KioskoManager.Application.DTOs;

public class CreateVentaDto
{
    public long IdUsuario { get; set; }
    public string MetodoPago { get; set; } = "Efectivo";
    public List<CreateDetalleVentaDto>
        Detalles
    { get; set; }
        = new();
}