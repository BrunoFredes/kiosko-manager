using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KioskoManager.Domain.Entities
{
    public class Usuario
    {
        [Key]
        public long IdUsuario { get; set; }

        public string NombreUsuario { get; set; } = string.Empty;

        public string ApellidoUsuario { get; set; } = string.Empty;

        public string EmailUsuario { get; set; } = string.Empty;

        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        public string RolUsuario { get; set; } = string.Empty;

        public bool ActivoUsuario { get; set; }

        public DateTime FechaCreacionUsuario { get; set; }

        [JsonIgnore]
        public ICollection<Venta> Ventas { get; set; }
            = new List<Venta>();

        [JsonIgnore]
        public ICollection<MovimientoStock> MovimientosStock { get; set; }
            = new List<MovimientoStock>();
    }
}