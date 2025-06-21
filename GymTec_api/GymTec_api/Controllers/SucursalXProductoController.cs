using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalXProductoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SucursalXProductoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sucursalxproducto/{id_sucursal}
        [HttpGet("{id_sucursal}")]
        public IActionResult GetProductoSucursal([FromRoute] int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }
            try
            {
                var productos = _context.sucursal_producto_view
                    .Where(sp => sp.id_sucursal == id_sucursal)
                    .ToList();
                if (productos == null || !productos.Any())
                {
                    return NotFound(new { success = false, error = "No hay productos para esta sucursal." });
                }
                return Ok(new { success = true, data = productos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/sucursalxproducto/{id_sucursal}/{codigo_barra}
        [HttpPost("{id_sucursal}/{codigo_barra}")]
        public IActionResult Create(int id_sucursal, string codigo_barra)
        {
            try
            {
                if (_context.sucursal.Find(id_sucursal) == null)
                    return NotFound(new { success = false, error = "Sucursal no encontrada." });
                if (_context.producto.Find(codigo_barra) == null)
                    return NotFound(new { success = false, error = "Producto no encontrado." });
                _context.sucursalxproducto.Add(new SucursalXProducto
                {
                    id_sucursal = id_sucursal,
                    codigo_barra = codigo_barra
                });
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Producto asignado correctamente." });
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate") == true)
            {
                return BadRequest(new { success = false, error = "La sucursal ya tiene este producto." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }


        // DELETE: api/sucursalxproducto/{id_sucursal}/{codigo_barra}
        [HttpDelete("{id_sucursal}/{codigo_barra}")]
        public IActionResult Delete(int id_sucursal, string codigo_barra)
        {
            try
            {
                var sucursalProducto = _context.sucursalxproducto
                    .FirstOrDefault(sp => sp.id_sucursal == id_sucursal && sp.codigo_barra == codigo_barra);
                if (sucursalProducto == null)
                {
                    return NotFound(new { success = false, error = "Asignación de producto no encontrada." });
                }
                _context.sucursalxproducto.Remove(sucursalProducto);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Producto eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
