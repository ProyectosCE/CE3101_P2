using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalXServicioController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SucursalXServicioController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sucursalxservicio/{id_sucursal}
        [HttpGet("{id_sucursal}")]
        public ActionResult Get([FromRoute] int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }
            try
            {
                var servicios = _context.sucursal_servicio_view
                    .Where(ss => ss.id_sucursal == id_sucursal)
                    .ToList();
                if (servicios == null || !servicios.Any())
                {
                    return NotFound(new { success = false, error = "No hay servicios para esta sucursal." });
                }
                return Ok(new { success = true, data = servicios });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }


        // POST: api/sucursalxservicio/{id_sucursal}/{id_servicio}
        [HttpPost("{id_sucursal}/{id_servicio}")]
        public IActionResult Create(int id_sucursal, int id_servicio)
        {
            try
            {
                if (_context.sucursal.Find(id_sucursal) == null)
                    return NotFound(new { success = false, error = "Sucursal no encontrada." });
                if (_context.servicio.Find(id_servicio) == null)
                    return NotFound(new { success = false, error = "Servicio no encontrado." });
                _context.sucursalxservicio.Add(new SucursalXServicio
                {
                    id_sucursal = id_sucursal,
                    id_servicio = id_servicio
                });
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Servicio asignado correctamente." });
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate") == true)
            {
                return BadRequest(new { success = false, error = "La sucursal ya tiene este servicio." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/sucursalxservicio/{id_sucursal}/{id_servicio}
        [HttpDelete("{id_sucursal}/{id_servicio}")]
        public IActionResult Delete(int id_sucursal, int id_servicio)
        {
            try
            {
                var sucursalServicio = _context.sucursalxservicio
                    .FirstOrDefault(ss => ss.id_sucursal == id_sucursal && ss.id_servicio == id_servicio);
                if (sucursalServicio == null)
                {
                    return NotFound(new { success = false, error = "Asignación de servicio no encontrada." });
                }
                _context.sucursalxservicio.Remove(sucursalServicio);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Servicio eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }
}
