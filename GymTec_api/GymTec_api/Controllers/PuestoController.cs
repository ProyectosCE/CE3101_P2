using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PuestoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PuestoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/puesto
        [HttpGet]
        public IActionResult GetPuestos()
        {
            try
            {
                var puestos = _context.puesto.ToList();
                return Ok(new { success = true, data = puestos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/puesto
        [HttpPost]
        public IActionResult CreatePuesto([FromBody] Puesto nuevoPuesto)
        {
            if (nuevoPuesto == null)
            {
                return BadRequest(new { success = false, error = "Puesto no puede ser nulo." });
            }
            // Valores por default
            nuevoPuesto.is_default = false;

            // Validar que no exista un puesto con la misma descripción
            var puestoExistente = _context.puesto.FirstOrDefault(p => p.descripcion == nuevoPuesto.descripcion);
            if (puestoExistente != null)
            {
                return BadRequest(new { success = false, error = "Ya existe un puesto con la misma descripción." });
            }

            _context.puesto.Add(nuevoPuesto);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Puesto creado correctamente.",
                    data = nuevoPuesto
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

        // PATCH : api/puesto/{id_puesto}
        [HttpPatch("{id_puesto}")]
        public IActionResult UpdatePuesto(int id_puesto, [FromBody] Puesto puestoActualizado)
        {
            if (puestoActualizado == null || id_puesto != puestoActualizado.id_puesto)
            {
                return BadRequest(new { success = false, error = "Datos inválidos para actualizar el puesto." });
            }
            var puestoExistente = _context.puesto.Find(id_puesto);
            if (puestoExistente == null)
            {
                return NotFound(new { success = false, error = "Puesto no encontrado." });
            }
            puestoExistente.descripcion = puestoActualizado.descripcion;
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Puesto actualizado correctamente.", data = puestoExistente });
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

        // DELETE: api/puesto/{id_puesto}
        [HttpDelete("{id_puesto}")]
        public IActionResult DeletePuesto(int id_puesto)
        {
            var puestoExistente = _context.puesto.Find(id_puesto);
            if (puestoExistente == null)
            {
                return NotFound(new { success = false, error = "Puesto no encontrado." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_puesto({0})", id_puesto);
                return Ok(new { success = true, mensaje = "Puesto eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
