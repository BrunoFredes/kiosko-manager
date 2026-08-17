namespace KioskoManager.Application.DTOs;

public class CajaDto
{
    public long IdCaja { get; set; }

    public long IdUsuarioApertura { get; set; }

    public string UsuarioApertura { get; set; } = string.Empty;

    public DateTime FechaApertura { get; set; }

    public decimal MontoInicial { get; set; }

    public DateTime? FechaCierre { get; set; }

    public decimal? MontoEsperado { get; set; }

    public decimal? MontoFinal { get; set; }

    public decimal? Diferencia { get; set; }

    public string Estado { get; set; } = string.Empty;

    public long? IdUsuarioCierre { get; set; }

    public string? UsuarioCierre { get; set; }

    public string? Observacion { get; set; }
}