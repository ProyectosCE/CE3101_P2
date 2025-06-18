using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaquinaController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MaquinaController(AppDbContext context)
        {
            _context = context;
        }

        // GET : api/maquina
        [HttpGet]
        public IActionResult GetMaquinas()
        {
            try
            {
                var maquinas = _context.maquina.ToList();
                return Ok(new { success = true, data = maquinas });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // GET : api/maquina/{id_sucursal}
        [HttpGet("{id_sucursal}")]
        public IActionResult GetMaquinasBySucursal(int id_sucursal)
        {
            try
            {
                var maquinasSucursal = _context.maquina
                    .Where(m => m.id_sucursal == id_sucursal)
                    .ToList();
                if (maquinasSucursal == null || !maquinasSucursal.Any())
                {
                    return NotFound(new { success = false, error = "No hay máquinas para esta sucursal." });
                }
                return Ok(new { success = true, data = maquinasSucursal });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/maquina
        [HttpPost]
        public IActionResult CreateMaquina([FromBody] Maquina nuevaMaquina)
        {
            if (nuevaMaquina == null)
            {
                return BadRequest(new { success = false, error = "Máquina no puede ser nula." });
            }
            _context.maquina.Add(nuevaMaquina);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Máquina creada correctamente.",
                    data = nuevaMaquina
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

        // PATCH: api/maquina/{id_maquina}
        [HttpPatch("{id_maquina}")]
        public IActionResult UpdateMaquina(int id_maquina, [FromBody] Maquina maquinaActualizada)
        {
            if (maquinaActualizada == null)
            {
                return BadRequest(new { success = false, error = "Máquina no puede ser nula." });
            }
            var maquinaExistente = _context.maquina.Find(id_maquina);
            if (maquinaExistente == null)
            {
                return NotFound(new { success = false, error = "Máquina no encontrada." });
            }
            maquinaExistente.marca = maquinaActualizada.marca;
            maquinaExistente.num_serie = maquinaActualizada.num_serie;
            maquinaExistente.costo = maquinaActualizada.costo;
            maquinaExistente.id_sucursal = maquinaActualizada.id_sucursal;
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Máquina actualizada correctamente.",
                    data = maquinaExistente
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

        // DELETE: api/maquina/{id_maquina}
        [HttpDelete("{id_maquina}")]
        public IActionResult DeleteMaquina(int id_maquina)
        {
            var maquina = _context.maquina.Find(id_maquina);
            if (maquina == null)
            {
                return NotFound(new { success = false, error = "Máquina no encontrada." });
            }
            _context.maquina.Remove(maquina);
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Máquina eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}