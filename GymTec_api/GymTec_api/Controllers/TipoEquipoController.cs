using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoEquipoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TipoEquipoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tipoequipo
        [HttpGet]
        public ActionResult Get()
        {
            try
            {
                var tiposEquipo = _context.tipo_equipo.ToList();
                return Ok(new { success = true, data = tiposEquipo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/tipoequipo
        [HttpPost]
        public IActionResult CreateTipoEquipo([FromBody] Tipo_Equipo nuevoTipoEquipo)
        {
            if (nuevoTipoEquipo == null)
            {
                return BadRequest(new { success = false, error = "Tipo de equipo no puede ser nulo." });
            }
            _context.tipo_equipo.Add(nuevoTipoEquipo);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Tipo de equipo creado correctamente.",
                    data = nuevoTipoEquipo
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

        // PATCH: api/tipoequipo/{id_tipo_equipo}
        [HttpPatch("{id_tipo_equipo}")]
        public IActionResult UpdateTipoEquipo(int id_tipo_equipo, [FromBody] Tipo_Equipo tipoEquipoActualizado)
        {
            if (tipoEquipoActualizado == null || tipoEquipoActualizado.id_tipo_equipo != id_tipo_equipo)
            {
                return BadRequest(new { success = false, error = "Datos inválidos." });
            }
            var tipoEquipoExistente = _context.tipo_equipo.Find(id_tipo_equipo);
            if (tipoEquipoExistente == null)
            {
                return NotFound(new { success = false, error = "Tipo de equipo no encontrado." });
            }
            tipoEquipoExistente.descripcion = tipoEquipoActualizado.descripcion;
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Tipo de equipo actualizado correctamente.", data = tipoEquipoExistente });
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

        // DELETE: api/tipoequipo/{id_tipo_equipo}
        [HttpDelete("{id_tipo_equipo}")]
        public IActionResult DeleteTipoEquipo(int id_tipo_equipo)
        {
            var tipoEquipo = _context.tipo_equipo.Find(id_tipo_equipo);
            if (tipoEquipo == null)
            {
                return NotFound(new { success = false, error = "Tipo de equipo no encontrado." });
            }
            _context.tipo_equipo.Remove(tipoEquipo);
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_tipo_equipo({0})", id_tipo_equipo);
                return Ok(new { success = true, mensaje = "Tipo de equipo eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }

        }
    }
}