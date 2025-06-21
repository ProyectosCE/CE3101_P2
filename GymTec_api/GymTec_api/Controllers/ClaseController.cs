using GymTec_api.Data;
using GymTec_api.Models;
using GymTec_api.Models.Vistas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClaseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/clase
        [HttpGet]
        public IActionResult GetClases()
        {
            try
            {
                var clases = _context.clase.ToList();
                return Ok(new { success = true, data = clases });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/clase
        [HttpPost]
        public IActionResult CreateClase([FromBody] Clase nuevaClase)
        {
            if (nuevaClase == null)
            {
                return BadRequest(new { success = false, error = "Clase no puede ser nula." });
            }

            _context.clase.Add(nuevaClase);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Clase creada correctamente.",
                    data = nuevaClase
                });
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest(new { success = false, error = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PATCH : api/clase/{id_clase}
        [HttpPatch("{id_clase}")]
        public IActionResult UpdateClase(int id_clase, [FromBody] Clase claseActualizada)
        {
            if (claseActualizada == null || id_clase != claseActualizada.id_clase)
            {
                return BadRequest(new { success = false, error = "Datos de clase no válidos." });
            }

            var claseExistente = _context.clase.Find(id_clase);
            if (claseExistente == null)
            {
                return NotFound(new { success = false, error = "Clase no encontrada." });
            }

            // Actualizar campos
            claseExistente.hora_inicio = claseActualizada.hora_inicio;
            claseExistente.hora_fin = claseActualizada.hora_fin;
            claseExistente.grupal = claseActualizada.grupal;
            claseExistente.capacidad = claseActualizada.capacidad;
            claseExistente.fecha = claseActualizada.fecha;
            claseExistente.id_servicio = claseActualizada.id_servicio;
            claseExistente.id_instructor = claseActualizada.id_instructor;

            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Clase actualizada correctamente." });
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest(new { success = false, error = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/clase/{id_clase}
        [HttpDelete("{id_clase}")]
        public IActionResult DeleteClase(int id_clase)
        {
            var clase = _context.clase.Find(id_clase);
            if (clase == null)
            {
                return NotFound(new { success = false, error = "Clase no encontrada." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_clase({0})", id_clase);
                return Ok(new
                {
                    success = true,
                    mensaje = "Clase eliminado correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        // GET: api/clase/clases_disponibles
        [HttpGet("clases_disponibles")]
        public IActionResult GetClasesDisponibles()
        {
            try
            {
                var clasesDisponibles = _context.clases_disponibles.ToList();
                if (clasesDisponibles == null || !clasesDisponibles.Any())
                {
                    return NotFound(new { success = false, error = "No hay clases disponibles." });
                }
                return Ok(new { success = true, data = clasesDisponibles });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }
}
