using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductoController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/producto
        [HttpGet]
        public IActionResult GetProductos()
        {
            try
            {
                var productos = _context.producto.ToList();
                return Ok(new { success = true, data = productos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/producto
        [HttpPost]
        public IActionResult CreateProducto([FromBody] Producto nuevoProducto)
        {
            if (nuevoProducto == null)
            {
                return BadRequest(new { success = false, error = "Producto no puede ser nulo." });
            }
            try
            {
                _context.producto.Add(nuevoProducto);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Producto creado correctamente.", data = nuevoProducto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PATCH: api/producto/{codigo_barra}
        [HttpPatch("{codigo_barra}")]
        public IActionResult UpdateProducto(string codigo_barra, [FromBody] Producto productoActualizado)
        {
            if (productoActualizado == null)
            {
                return BadRequest(new { success = false, error = "Producto no puede ser nulo." });
            }
            var productoExistente = _context.producto.FirstOrDefault(p => p.codigo_barra == codigo_barra);
            if (productoExistente == null)
            {
                return NotFound(new { success = false, error = "Producto no encontrado." });
            }
            try
            {
                productoExistente.nombre = productoActualizado.nombre;
                productoExistente.descripcion = productoActualizado.descripcion;
                productoExistente.costo = productoActualizado.costo;
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Producto actualizado correctamente.", data = productoExistente });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/producto/{codigo_barra}
        [HttpDelete("{codigo_barra}")]
        public IActionResult DeleteProducto(string codigo_barra)
        {
            var producto = _context.producto.FirstOrDefault(p => p.codigo_barra == codigo_barra);
            if (producto == null)
            {
                return NotFound(new { success = false, error = "Producto no encontrado." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_producto({0})", codigo_barra);
                return Ok(new { success = true, mensaje = "Producto eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }

        }
    }
}