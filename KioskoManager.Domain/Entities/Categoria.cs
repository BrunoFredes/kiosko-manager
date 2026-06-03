using System.ComponentModel.DataAnnotations;

namespace KioskoManager.Domain.Entities;

public class Categoria
{
    [Key]
    public long IdCategoria { get; set; }

    public string NombreCategoria { get; set; } = string.Empty;

    public ICollection<Producto> Productos { get; set; }
    = new List<Producto>();
}