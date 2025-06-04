using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicioController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ServicioController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/servicio
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var servicios = _context.servicio.ToList();
                return Ok(new { success = true, data = servicios });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/servicio
        [HttpPost]
        public IActionResult Create([FromBody] Servicio nuevoServicio)
        {
            if (nuevoServicio == null)
            {
                return BadRequest(new { success = false, error = "Servicio no puede ser nulo." });
            }

            nuevoServicio.is_default = false;

            _context.servicio.Add(nuevoServicio);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Servicio creado correctamente.",
                    data = nuevoServicio
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

        // PATCH: api/servicio/{id_servicio}
        [HttpPatch("{id_servicio}")]
        public IActionResult Update(int id_servicio, [FromBody] Servicio servicioActualizado)
        {
            if (servicioActualizado == null || servicioActualizado.id_servicio != id_servicio)
            {
                return BadRequest(new { success = false, error = "Datos inválidos." });
            }
            var servicioExistente = _context.servicio.Find(id_servicio);
            if (servicioExistente == null)
            {
                return NotFound(new { success = false, error = "Servicio no encontrado." });
            }
            // Actualizar campos
            servicioExistente.descripcion = servicioActualizado.descripcion;
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Servicio actualizado correctamente.", data = servicioExistente });
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

        // DELETE: api/servicio/{id_servicio}
        [HttpDelete("{id_servicio}")]
        public IActionResult DeleteServicio(int id_servicio)
        {
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_servicio({0})", id_servicio);
                return Ok(new { success = true, mensaje = "Servicio eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
