namespace KioskoManager.Application.DTOs;

public class CreateUsuarioDto
{
    public string NombreUsuario { get; set; } = string.Empty;

    public string ApellidoUsuario { get; set; } = string.Empty;

    public string EmailUsuario { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string RolUsuario { get; set; } = "Empleado";
}