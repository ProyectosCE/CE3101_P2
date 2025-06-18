using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanTrabajoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PlanTrabajoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/plantrabajo/{id_cliente}
        [HttpGet("{id_cliente}")]
        public IActionResult GetPlanTrabajo(int id_cliente)
        {
            try
            {
                var planTrabajo = _context.plantrabajo_cliente
                    .Where(pt => pt.id_cliente == id_cliente)
                    .ToList();

                if (planTrabajo == null || !planTrabajo.Any())
                {
                    return NotFound(new { success = false, error = "No hay planes de trabajo para este cliente." });
                }
                return Ok(new { success = true, data = planTrabajo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/plantrabajo/{id_cliente}
        [HttpPost("{id_cliente}")]
        public IActionResult CreatePlanTrabajo(int id_cliente, [FromBody] PlanTrabajo nuevoPlan)
        {
            if (nuevoPlan == null)
            {
                return BadRequest(new { success = false, error = "Plan de trabajo no puede ser nulo." });
            }
            nuevoPlan.id_cliente = id_cliente; // Asignar el ID del cliente
            _context.plantrabajo.Add(nuevoPlan);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Plan de trabajo creado correctamente.",
                    data = nuevoPlan
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PATCH: api/plantrabajo/{id_plan_trabajo}
        [HttpPatch("{id_plan_trabajo}")]
        public IActionResult UpdatePlanTrabajo(int id_plan_trabajo, [FromBody] PlanTrabajo planTrabajoActualizado)
        {
            if (planTrabajoActualizado == null)
            {
                return BadRequest(new { success = false, error = "Plan de trabajo no puede ser nulo." });
            }
            var planExistente = _context.plantrabajo.Find(id_plan_trabajo);
            if (planExistente == null)
            {
                return NotFound(new { success = false, error = "Plan de trabajo no encontrado." });
            }
            // Actualizar los campos necesarios
            planExistente.start_date = planTrabajoActualizado.start_date;
            planExistente.end_date = planTrabajoActualizado.end_date;
            planExistente.descripcion = planTrabajoActualizado.descripcion;
            // Otros campos que necesites actualizar
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Plan de trabajo actualizado correctamente.",
                    data = planExistente
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/plantrabajo/{id_plan_trabajo}
        [HttpDelete("{id_plan_trabajo}")]
        public IActionResult DeletePlanTrabajo(int id_plan_trabajo)
        {
            var planExistente = _context.plantrabajo.Find(id_plan_trabajo);
            if (planExistente == null)
            {
                return NotFound(new { success = false, error = "Plan de trabajo no encontrado." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_plan_trabajo({0})", id_plan_trabajo);
                return Ok(new { success = true, mensaje = "Plan de trabajo eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }

        }

        // POST: api/plantrabajo/copiar_actividades
        [HttpPost("copiar_actividades")]
        public IActionResult CopiarActividadesSemana([FromBody] CopiarActividadesDTO dto)
        {
            try
            {
                var conn = _context.Database.GetDbConnection();
                conn.Open();

                using var command = conn.CreateCommand();
                command.CommandText = "CALL copiar_actividades_semana(@id, @start, @end, @newstart, @newend)";

                // ID del plan de trabajo
                command.Parameters.Add(new Npgsql.NpgsqlParameter("@id", NpgsqlDbType.Integer){
                    Value = dto.id_plan_trabajo
                });
                // Semana de inicio y fin
                command.Parameters.Add(new Npgsql.NpgsqlParameter("@start", NpgsqlDbType.Date)
                {
                    Value = dto.start_date.ToDateTime(TimeOnly.MinValue)
                });
                command.Parameters.Add(new Npgsql.NpgsqlParameter("@end", NpgsqlDbType.Date)
                {
                    Value = dto.end_date.ToDateTime(TimeOnly.MinValue)
                });
                // Nueva semana de inicio y fin
                command.Parameters.Add(new Npgsql.NpgsqlParameter("@newstart", NpgsqlDbType.Date)
                {
                    Value = dto.new_start_date.ToDateTime(TimeOnly.MinValue)
                });
                command.Parameters.Add(new Npgsql.NpgsqlParameter("@newend", NpgsqlDbType.Date)
                {
                    Value = dto.new_end_date.ToDateTime(TimeOnly.MinValue)
                });

                command.ExecuteNonQuery();
                conn.Close();

                return Ok(new { success = true, message = "Actividades copiadas correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }

    public class CopiarActividadesDTO
    {
        public int id_plan_trabajo { get; set; }
        public DateOnly start_date { get; set; }
        public DateOnly end_date { get; set; }
        public DateOnly new_start_date { get; set; }
        public DateOnly new_end_date { get; set; }
    }

}