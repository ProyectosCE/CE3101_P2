using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TratamientoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TratamientoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tratamiento
        [HttpGet]
        public IActionResult GetTratamientos()
        {
            try
            {
                var tratamientos = _context.tratamiento.ToList();
                return Ok(new
                {
                    success = true,
                    data = tratamientos
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

        // POST: api/tratamiento
        [HttpPost]
        public IActionResult CreateTratamiento([FromBody] Tratamiento nuevoTratamiento)
        {
            if (nuevoTratamiento == null)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Tratamiento no puede ser nulo."
                });
            }

            nuevoTratamiento.is_default = false;

            try
            {
                _context.tratamiento.Add(nuevoTratamiento);
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Tratamiento creado exitosamente.",
                    data = nuevoTratamiento
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

        // PATCH: api/tratamiento/{id_tratamiento}
        [HttpPatch("{id_tratamiento}")]
        public IActionResult UpdateTratamiento(int id_tratamiento, [FromBody] Tratamiento tratamientoActualizado)
        {
            if (tratamientoActualizado == null || id_tratamiento != tratamientoActualizado.id_tratamiento)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "Datos del tratamiento no válidos."
                });
            }

            var tratamientoExistente = _context.tratamiento.Find(id_tratamiento);
            if (tratamientoExistente == null)
            {
                return NotFound(new
                {
                    success = false,
                    error = "Tratamiento no encontrado."
                });
            }

            tratamientoExistente.nombre_tratamiento = tratamientoActualizado.nombre_tratamiento;

            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Tratamiento actualizado correctamente."
                });
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest(new
                {
                    success = false,
                    error = $"Error en la base de datos: {dbEx.InnerException?.Message ?? dbEx.Message}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = $"Error inesperado: {ex.Message}"
                });
            }
        }

        // DELETE: api/tratamiento/{id_tratamiento}
        [HttpDelete("{id_tratamiento}")]
        public IActionResult DeleteTratamiento(int id_tratamiento)
        {
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_tratamiento({0})", id_tratamiento);
                return Ok(new
                {
                    success = true,
                    mensaje = "Tratamiento eliminado correctamente."
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
    }
}