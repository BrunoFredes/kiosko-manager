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
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("Categorias");

                entity.HasKey(e => e.IdCategoria);

                entity.Property(e => e.IdCategoria)
                    .HasColumnName("id_categorias");

                entity.Property(e => e.NombreCategoria)
                    .HasColumnName("nombre_categoria");
            });

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Producto>(entity =>
            {
                entity.ToTable("Productos");

                entity.HasKey(e => e.IdProducto);

                entity.Property(e => e.IdProducto)
                    .HasColumnName("id_producto");

                entity.Property(e => e.NombreProducto)
                    .HasColumnName("nombre_producto");

                entity.Property(e => e.CodigoBarras)
                    .HasColumnName("codigo_barras");

                entity.Property(e => e.PrecioCompra)
                    .HasColumnName("precio_compra");

                entity.Property(e => e.PrecioVenta)
                    .HasColumnName("precio_venta");

                entity.Property(e => e.StockActual)
                    .HasColumnName("stock_actual");

                entity.Property(e => e.StockMinimo)
                    .HasColumnName("stock_minimo");

                entity.Property(e => e.Activo)
                    .HasColumnName("activo");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnName("fecha_creacion");

                entity.Property(e => e.IdCategoria)
                    .HasColumnName("id_categoria");

                entity.HasOne(e => e.Categoria)
                    .WithMany(c => c.Productos)
                    .HasForeignKey(e => e.IdCategoria);
            });
            modelBuilder.Entity<Venta>(entity =>
            {
                entity.ToTable("Ventas");

                entity.HasKey(e => e.IdVenta);

                entity.Property(e => e.IdVenta)
                    .HasColumnName("id_venta");

                entity.Property(e => e.FechaVenta)
                    .HasColumnName("fecha_venta");

                entity.Property(e => e.TotalVenta)
                    .HasColumnName("total_venta");

                entity.Property(e => e.IdUsuario)
                    .HasColumnName("id_usuario");
                entity.Property(e => e.MetodoPago)

                    .HasColumnName("metodo_pago");
                entity.Property(e => e.MetodoPago)
                    .HasColumnName("metodo_pago");
                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.Ventas)
                    .HasForeignKey(e => e.IdUsuario);
            });

            modelBuilder.Entity<DetalleVenta>(entity =>
            {
                entity.ToTable("Detalle_Venta");

                entity.HasKey(e => e.IdDetalle);

                entity.Property(e => e.IdDetalle)
                    .HasColumnName("id_detalle");

                entity.Property(e => e.IdVenta)
                    .HasColumnName("id_venta");

                entity.Property(e => e.IdProducto)
                    .HasColumnName("id_producto");

                entity.Property(e => e.Cantidad)
                    .HasColumnName("cantidad");

                entity.Property(e => e.PrecioUnitario)
                    .HasColumnName("precio_unitario");
                entity.Property(e => e.DescripcionManual)
                    .HasColumnName("descripcion_manual");
                entity.Property(e => e.Subtotal)
                    .HasColumnName("subtotal");
                entity.Property(e => e.DescripcionManual)
                    .HasColumnName("descripcion_manual");

                entity.HasOne(e => e.Venta)
                    .WithMany(v => v.Detalles)
                    .HasForeignKey(e => e.IdVenta);

                entity.HasOne(e => e.Producto)
                    .WithMany(p => p.DetallesVenta)
                    .HasForeignKey(e => e.IdProducto);
            });
            modelBuilder.Entity<MovimientoStock>(entity =>
            {
                entity.ToTable("Movimientos_Stock");

                entity.HasKey(e => e.IdMovimientoStock);

                entity.Property(e => e.IdMovimientoStock)
                    .HasColumnName("id_movimiento_stock");

                entity.Property(e => e.IdProducto)
                    .HasColumnName("id_producto");

                entity.Property(e => e.IdUsuario)
                    .HasColumnName("id_usuario");

                entity.Property(e => e.TipoMovimiento)
                    .HasColumnName("tipo_movimiento");

                entity.Property(e => e.Cantidad)
                    .HasColumnName("cantidad");

                entity.Property(e => e.StockAnterior)
                    .HasColumnName("stock_anterior");

                entity.Property(e => e.StockNuevo)
                    .HasColumnName("stock_nuevo");

                entity.Property(e => e.Observacion)
                    .HasColumnName("observacion");

                entity.Property(e => e.FechaMovimiento)
                    .HasColumnName("fecha_movimiento");

                entity.Property(e => e.Monto)
                    .HasColumnName("monto");

                entity.Property(e => e.IdVenta)
                    .HasColumnName("id_venta");

                entity.HasOne(e => e.Producto)
                    .WithMany(p => p.MovimientosStock)
                    .HasForeignKey(e => e.IdProducto);

                entity.HasOne(e => e.Usuario)
                    .WithMany(u => u.MovimientosStock)
                    .HasForeignKey(e => e.IdUsuario);

                entity.HasOne(e => e.Venta)
                    .WithMany()
                    .HasForeignKey(e => e.IdVenta)
                    .OnDelete(DeleteBehavior.SetNull);
            });
            modelBuilder.Entity<Caja>(entity =>
            {
                entity.ToTable("Cajas");

                entity.HasKey(e => e.IdCaja);

                entity.Property(e => e.IdCaja)
                    .HasColumnName("id_caja");

                entity.Property(e => e.IdUsuarioApertura)
                    .HasColumnName("id_usuario_apertura");

                entity.Property(e => e.FechaApertura)
                    .HasColumnName("fecha_apertura");

                entity.Property(e => e.MontoInicial)
                    .HasColumnName("monto_inicial")
                    .HasPrecision(18, 2);

                entity.Property(e => e.FechaCierre)
                    .HasColumnName("fecha_cierre");

                entity.Property(e => e.MontoEsperado)
                    .HasColumnName("monto_esperado")
                    .HasPrecision(18, 2);

                entity.Property(e => e.MontoFinal)
                    .HasColumnName("monto_final")
                    .HasPrecision(18, 2);

                entity.Property(e => e.Diferencia)
                    .HasColumnName("diferencia")
                    .HasPrecision(18, 2);

                entity.Property(e => e.Estado)
                    .HasColumnName("estado");

                entity.Property(e => e.IdUsuarioCierre)
                    .HasColumnName("id_usuario_cierre");

                entity.Property(e => e.Observacion)
                    .HasColumnName("observacion");

                entity.HasOne(e => e.UsuarioApertura)
                    .WithMany(u => u.CajasAbiertas)
                    .HasForeignKey(e => e.IdUsuarioApertura)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.UsuarioCierre)
                    .WithMany(u => u.CajasCerradas)
                    .HasForeignKey(e => e.IdUsuarioCierre)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<MovimientoCaja>(entity =>
            {
                entity.ToTable("Movimientos_Caja");

                entity.HasKey(e => e.IdMovimientoCaja);

                entity.Property(e => e.IdMovimientoCaja)
                    .HasColumnName("id_movimiento_caja");

                entity.Property(e => e.IdCaja)
                    .HasColumnName("id_caja");

                entity.Property(e => e.TipoMovimiento)
                    .HasColumnName("tipo_movimiento");

                entity.Property(e => e.Descripcion)
                    .HasColumnName("descripcion");

                entity.Property(e => e.Monto)
                    .HasColumnName("monto")
                    .HasPrecision(18, 2);

                entity.Property(e => e.FechaMovimiento)
                    .HasColumnName("fecha_movimiento");

                entity.HasOne(e => e.Caja)
                    .WithMany(c => c.Movimientos)
                    .HasForeignKey(e => e.IdCaja)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        public DbSet<Producto> Productos { get; set; }

        public DbSet<Venta> Ventas { get; set; }

        public DbSet<DetalleVenta> DetalleVenta { get; set; }

        public DbSet<Caja> Cajas { get; set; }

        public DbSet<MovimientoCaja> MovimientosCaja { get; set; }

        public DbSet<MovimientoStock>
            MovimientosStock
                { get; set; }
    }
}