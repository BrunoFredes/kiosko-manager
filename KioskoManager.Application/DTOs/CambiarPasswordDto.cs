namespace KioskoManager.Application.DTOs;

public class CambiarPasswordDto
{
    public long IdUsuario { get; set; }

    public string PasswordActual { get; set; }
        = string.Empty;

    public string PasswordNueva { get; set; }
        = string.Empty;
}