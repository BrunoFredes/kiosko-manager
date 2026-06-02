using Microsoft.EntityFrameworkCore;
using KioskoManager.Domain.Entities;

namespace KioskoManager.Infrastructure.Data
{
    public class KioskoDbContext : DbContext
    {
        public KioskoDbContext(
            DbContextOptions<KioskoDbContext> options
        ) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");

                entity.HasKey(e => e.IdUsuario);

                entity.Property(e => e.IdUsuario)
                    .HasColumnName("id_usuario");

                entity.Property(e => e.NombreUsuario)
                    .HasColumnName("nombre_usuario");

                entity.Property(e => e.ApellidoUsuario)
                    .HasColumnName("apellido_usuario");

                entity.Property(e => e.EmailUsuario)
                    .HasColumnName("email_usuario");

                entity.Property(e => e.PasswordHash)
                    .HasColumnName("password_hash");

                entity.Property(e => e.RolUsuario)
                    .HasColumnName("rol_usuario");

                entity.Property(e => e.ActivoUsuario)
                    .HasColumnName("activo_usuario");

                entity.Property(e => e.FechaCreacionUsuario)
                    .HasColumnName("fecha_creacion_usuario");
            });

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}