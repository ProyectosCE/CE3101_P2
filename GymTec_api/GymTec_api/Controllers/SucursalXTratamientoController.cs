using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalXTratamientoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SucursalXTratamientoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sucursalxtratamiento/{id_sucursal}
        [HttpGet("{id_sucursal}")]
        public IActionResult Get([FromRoute] int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }
            try
            {
                var tratamientos = _context.sucursal_tratamiento_view
                    .Where(st => st.id_sucursal == id_sucursal)
                    .ToList();
                if (tratamientos == null || !tratamientos.Any())
                {
                    return NotFound(new { success = false, error = "No hay tratamientos para esta sucursal." });
                }
                return Ok(new { success = true, data = tratamientos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/sucursalxtratamiento/{id_sucursal}/{id_tratamiento}
        [HttpPost("{id_sucursal:int}/{id_tratamiento:int}")]
        public IActionResult Create(int id_sucursal, int id_tratamiento)
        {
            try
            {
                if (_context.sucursal.Find(id_sucursal) == null)
                    return NotFound(new { success = false, error = "Sucursal no encontrada." });

                if (_context.tratamiento.Find(id_tratamiento) == null)
                    return NotFound(new { success = false, error = "Tratamiento no encontrado." });

                _context.sucursalxtratamiento.Add(new SucursalXTratamiento
                {
                    id_sucursal = id_sucursal,
                    id_tratamiento = id_tratamiento
                });

                _context.SaveChanges();      
                return Ok(new { success = true, mensaje = "Tratamiento asignado correctamente." });
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate") == true)
            {
                return BadRequest(new { success = false, error = "La sucursal ya tiene este tratamiento." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/sucursalxtratamiento/{id_sucursal}/{id_tratamiento}
        [HttpDelete("{id_sucursal:int}/{id_tratamiento:int}")]
        public IActionResult Delete(int id_sucursal, int id_tratamiento)
        {
            try
            {
                var sucursalTratamiento = _context.sucursalxtratamiento
                    .FirstOrDefault(st => st.id_sucursal == id_sucursal && st.id_tratamiento == id_tratamiento);
                if (sucursalTratamiento == null)
                {
                    return NotFound(new { success = false, error = "Asignación de tratamiento no encontrada." });
                }
                _context.sucursalxtratamiento.Remove(sucursalTratamiento);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Tratamiento eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }
}
