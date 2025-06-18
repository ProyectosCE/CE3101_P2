using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetallePlanController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DetallePlanController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/detalleplan/{id_plan_trabajo}
        [HttpGet("{id_plan_trabajo}")]
        public IActionResult GetDetallePlan(int id_plan_trabajo)
        {
            try
            {
                var detallePlan = _context.detalleplan
                    .Where(dp => dp.id_plan_trabajo == id_plan_trabajo)
                    .ToList();
                if (detallePlan == null || !detallePlan.Any())
                {
                    return NotFound(new { success = false, error = "No hay detalles para este plan de trabajo." });
                }
                return Ok(new { success = true, data = detallePlan });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/detalleplan/{id_plan_trabajo}
        [HttpPost("{id_plan_trabajo}")]
        public async Task<IActionResult> CreateDetallePlan(int id_plan_trabajo, [FromBody] DetallePlan nuevoDetalle)
        {
            if (nuevoDetalle == null)
            {
                return BadRequest(new { success = false, error = "Detalle de plan no puede ser nulo." });
            }
            nuevoDetalle.id_plan_trabajo = id_plan_trabajo; // Asignar el ID del plan de trabajo
            _context.detalleplan.Add(nuevoDetalle);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    mensaje = "Detalle de plan creado correctamente.",
                    data = nuevoDetalle
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

        // PATCH: api/detalleplan/{id_detalle_plan}
        [HttpPatch("{id_detalle_plan}")]
        public IActionResult UpdateDetallePlan(int id_detalle_plan, [FromBody] DetallePlan detallePlanActualizado)
        {
            if (detallePlanActualizado == null)
            {
                return BadRequest(new { success = false, error = "Detalle de plan no puede ser nulo." });
            }
            var detallePlanExistente = _context.detalleplan.Find(id_detalle_plan);
            if (detallePlanExistente == null)
            {
                return NotFound(new { success = false, error = "Detalle de plan no encontrado." });
            }
            // Actualizar los campos necesarios
            detallePlanExistente.fecha = detallePlanActualizado.fecha;
            detallePlanExistente.actividad = detallePlanActualizado.actividad;
            // Otros campos que necesites actualizar
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Detalle de plan actualizado correctamente.",
                    data = detallePlanExistente
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

        // DELETE: api/detalleplan/{id_detalle_plan}
        [HttpDelete("{id_detalle_plan}")]
        public IActionResult DeleteDetallePlan(int id_detalle_plan)
        {
            var detallePlan = _context.detalleplan.Find(id_detalle_plan);
            if (detallePlan == null)
            {
                return NotFound(new { success = false, error = "Detalle de plan no encontrado." });
            }
            _context.detalleplan.Remove(detallePlan);
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Detalle de plan eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}