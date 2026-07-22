namespace KioskoManager.Application.DTOs;

public class UpdateUsuarioDto
{
    public string NombreUsuario { get; set; } = string.Empty;

    public string ApellidoUsuario { get; set; } = string.Empty;

    public string EmailUsuario { get; set; } = string.Empty;

    public string RolUsuario { get; set; } = "Empleado";
}