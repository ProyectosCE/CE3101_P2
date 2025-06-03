using GymTec_api.Data;
using GymTec_api.Models;
using GymTec_api.Models.Vistas;
using Microsoft.AspNetCore.Mvc;

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
            var clases = _context.clase.ToList();
            return Ok(clases);
        }

        // POST: api/clase
        [HttpPost]
        public IActionResult CreateClase([FromBody] Clase nuevaClase)
        {
            if (nuevaClase == null)
            {
                return BadRequest("Clase no puede ser nula.");
            }
            _context.clase.Add(nuevaClase);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetClases), new { id = nuevaClase.id_clase }, nuevaClase);
        }

        // PATCH : api/clase/{id_clase}
        [HttpPatch("{id_clase}")]
        public IActionResult UpdateClase(int id_clase, [FromBody] Clase claseActualizada)
        {
            if (claseActualizada == null || id_clase != claseActualizada.id_clase)
            {
                return BadRequest("Datos de clase no válidos.");
            }
            var claseExistente = _context.clase.Find(id_clase);
            if (claseExistente == null)
            {
                return NotFound("Clase no encontrada.");
            }
            // Actualizar los campos necesarios
            claseExistente.hora_inicio = claseActualizada.hora_inicio;
            claseExistente.hora_fin = claseActualizada.hora_fin;
            claseExistente.grupal = claseActualizada.grupal;
            claseExistente.capacidad = claseActualizada.capacidad;
            claseExistente.fecha = claseActualizada.fecha;
            claseExistente.id_servicio = claseActualizada.id_servicio;
            claseExistente.id_instructor = claseActualizada.id_instructor;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/clase/{id_clase}
        [HttpDelete("{id_clase}")]
        public IActionResult DeleteClase(int id_clase)
        {
            var clase = _context.clase.Find(id_clase);
            if (clase == null)
            {
                return NotFound("Clase no encontrada.");
            }
            _context.clase.Remove(clase);
            _context.SaveChanges();
            return NoContent();
        }

        //GET: api/clase/clases_disponibles
        [HttpGet("clases_disponibles")]
        public ActionResult<IEnumerable<ClaseDisponible>> GetClasesDisponibles()
        {
            var clasesDisponibles = _context.clases_disponibles.ToList();
            if (clasesDisponibles == null || !clasesDisponibles.Any())
            {
                return NotFound("No hay clases disponibles.");
            }
            return Ok(clasesDisponibles);
        }

    }
}
