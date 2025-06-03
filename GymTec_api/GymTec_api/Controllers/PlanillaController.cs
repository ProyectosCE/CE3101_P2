using GymTec_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanillaController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PlanillaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/planilla
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var planillas = _context.planilla.ToList();
                return Ok(new { success = true, data = planillas });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }

        }

        // POST: api/planilla
        [HttpPost]
        public IActionResult Create([FromBody] Models.Planilla nuevaPlanilla)
        {
            if (nuevaPlanilla == null)
            {
                return BadRequest(new { success = false, error = "Planilla no puede ser nula." });
            }
            _context.planilla.Add(nuevaPlanilla);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Planilla creada correctamente.",
                    data = nuevaPlanilla
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

        // PATCH: api/planilla/{id_planilla}
        [HttpPatch("{id_planilla}")]
        public IActionResult Update(int id_planilla, [FromBody] Models.Planilla planillaActualizada)
        {
            if (planillaActualizada == null || planillaActualizada.id_planilla != id_planilla)
            {
                return BadRequest(new { success = false, error = "Datos de planilla no válidos." });
            }
            var planillaExistente = _context.planilla.Find(id_planilla);
            if (planillaExistente == null)
            {
                return NotFound(new { success = false, error = "Planilla no encontrada." });
            }
            // Actualizar los campos necesarios
            planillaExistente.descripcion = planillaActualizada.descripcion;
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Planilla actualizada correctamente.", data = planillaExistente });
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

        // DELETE: api/planilla/{id_planilla}
        [HttpDelete("{id_planilla}")]
        public IActionResult DeletePlanilla(int id_planilla)
        {
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_planilla({0})", id_planilla);
                return Ok(new { success = true, mensaje = "Planilla eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
