namespace KioskoManager.Application.DTOs;

public class CreateVentaDto
{
    public long IdUsuario { get; set; }

    public List<CreateDetalleVentaDto>
        Detalles
    { get; set; }
        = new();
}