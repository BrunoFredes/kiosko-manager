using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KioskoManager.Application.DTOs;
using KioskoManager.Application.Interfaces;
using KioskoManager.Domain.Entities;
using KioskoManager.Infrastructure.Data;

namespace KioskoManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly IProductoRepository _productoRepository;
    private readonly KioskoDbContext _context;

    public ProductosController(
        IProductoRepository productoRepository,
        KioskoDbContext context
    )
    {
        _productoRepository = productoRepository;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProductos()
    {
        var productos =
            await _productoRepository.GetAllAsync();

        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductoPorId(
        long id
    )
    {
        var producto =
            await _productoRepository
                .GetByIdAsync(id);

        if (producto == null)
        {
            return NotFound(
                "Producto no encontrado."
            );
        }

        return Ok(producto);
    }

    [HttpPost]
    public async Task<IActionResult> CrearProducto(
        CreateProductoDto dto
    )
    {
        var categoriaExiste = await _context.Categorias
            .AnyAsync(
                c => c.IdCategoria == dto.IdCategoria
            );

        if (!categoriaExiste)
        {
            return BadRequest(
                "La categoría seleccionada no existe."
            );
        }

        var codigoExiste = await _context.Productos
            .AnyAsync(
                p => p.CodigoBarras == dto.CodigoBarras
            );

        if (codigoExiste)
        {
            return BadRequest(
                "Ya existe un producto con ese código de barras."
            );
        }

        var producto = new Producto
        {
            NombreProducto = dto.NombreProducto,
            CodigoBarras = dto.CodigoBarras,
            PrecioCompra = dto.PrecioCompra,
            PrecioVenta = dto.PrecioVenta,
            StockActual = dto.StockActual,
            StockMinimo = dto.StockMinimo,
            IdCategoria = dto.IdCategoria,
            Activo = true,
            FechaCreacion = DateTime.UtcNow
        };

        var productoCreado =
            await _productoRepository
                .CreateAsync(producto);

        return Ok(productoCreado);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarProducto(
        long id,
        UpdateProductoDto dto
    )
    {
        var producto =
            await _productoRepository
                .GetByIdAsync(id);

        if (producto == null)
        {
            return NotFound(
                "Producto no encontrado."
            );
        }

        producto.NombreProducto = dto.NombreProducto;
        producto.CodigoBarras = dto.CodigoBarras;
        producto.PrecioCompra = dto.PrecioCompra;
        producto.PrecioVenta = dto.PrecioVenta;
        producto.StockActual = dto.StockActual;
        producto.StockMinimo = dto.StockMinimo;
        producto.IdCategoria = dto.IdCategoria;

        await _productoRepository
            .UpdateAsync(producto);

        return Ok(producto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarProducto(
        long id
    )
    {
        var eliminado =
            await _productoRepository
                .SoftDeleteAsync(id);

        if (!eliminado)
        {
            return NotFound(
                "Producto no encontrado."
            );
        }

        return Ok(
            "Producto desactivado correctamente."
        );
    }
    [HttpGet("stock-bajo")]
        public async Task<ActionResult<List<Producto>>>
    ObtenerStockBajo()
        {
            var productos =
                await _productoRepository
                    .ObtenerStockBajoAsync();

            return Ok(productos);
        }
    [HttpGet("buscar")]
    public async Task<ActionResult<List<Producto>>>
    Buscar(
        string texto)
    {
        var productos =
            await _productoRepository
                .BuscarAsync(texto);

        return Ok(productos);
    }
    [HttpGet("codigo/{codigo}")]
    public async Task<ActionResult<Producto>>
    BuscarPorCodigo(string codigo)
        {
            var producto =
                await _productoRepository
                    .GetByCodigoAsync(codigo);

            if (producto == null)
            {
                return NotFound();
            }

            return Ok(producto);
        }
    [HttpGet("categoria/{idCategoria}")]
    public async Task<ActionResult<List<Producto>>>
    GetPorCategoria(long idCategoria)
        {
            var productos =
                await _productoRepository
                    .GetByCategoriaAsync(idCategoria);

            return Ok(productos);
        }
    [HttpGet("activos")]
    public async Task<ActionResult<List<Producto>>>
    ObtenerActivos()
        {
            var productos =
                await _productoRepository
                    .ObtenerTodosActivosAsync();

            return Ok(productos);
        }
    
    [HttpGet("todos")]
    public async Task<IActionResult> ObtenerTodos()
    {
        var productos =
            await _productoRepository.GetAllAsync();

        return Ok(productos);
    }
    [HttpPatch("{id}/activo")]
    public async Task<IActionResult> CambiarEstado(long id)
    {
        var producto =
            await _productoRepository.GetByIdAsync(id);

        if (producto == null)
            return NotFound();

        producto.Activo = !producto.Activo;

        await _productoRepository.UpdateAsync(producto);

        return Ok(producto);
    }
}