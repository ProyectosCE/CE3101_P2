using GymTec_api.Data;
using Microsoft.AspNetCore.Mvc;

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

    }
}
