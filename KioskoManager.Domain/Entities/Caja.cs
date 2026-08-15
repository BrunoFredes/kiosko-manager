namespace KioskoManager.Domain.Entities;

public class Caja
{
    public long IdCaja { get; set; }

    public long IdUsuarioApertura { get; set; }

    public DateTime FechaApertura { get; set; }

    public decimal MontoInicial { get; set; }

    public DateTime? FechaCierre { get; set; }

    public decimal? MontoEsperado { get; set; }

    public decimal? MontoFinal { get; set; }

    public decimal? Diferencia { get; set; }

    public string Estado { get; set; } = "ABIERTA";

    public long? IdUsuarioCierre { get; set; }

    public string? Observacion { get; set; }

    public Usuario UsuarioApertura { get; set; } = null!;

    public Usuario? UsuarioCierre { get; set; }

    public ICollection<MovimientoCaja> Movimientos { get; set; }
        = new List<MovimientoCaja>();
}