using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TelefonosSucursalController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TelefonosSucursalController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/telefonossucursal/{id_sucursal}
        [HttpGet("{id_sucursal}")]
        public IActionResult GetTelefonosSucursal(int id_sucursal)
        {
            try
            {
                var telefonosSucursal = _context.telefonossucursal
                    .Where(ts => ts.id_sucursal == id_sucursal)
                    .ToList();
                if (telefonosSucursal == null || !telefonosSucursal.Any())
                {
                    return NotFound(new { success = false, error = "No hay teléfonos para esta sucursal." });
                }
                return Ok(new { success = true, data = telefonosSucursal });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }


        // POST: api/telefonossucursal/{id_sucursal}
        [HttpPost("{id_sucursal}")]
        public IActionResult CreateTelefonoSucursal(int id_sucursal, [FromBody] TelefonosSucursal nuevoTelefono)
        {
            if (nuevoTelefono == null)
            {
                return BadRequest(new { success = false, error = "Teléfono no puede ser nulo." });
            }
            nuevoTelefono.id_sucursal = id_sucursal; 
            _context.telefonossucursal.Add(nuevoTelefono);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Teléfono de sucursal creado correctamente.",
                    data = nuevoTelefono
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/telefonossucursal/{id_telefono_sucursal}
        [HttpDelete("{id_telefono_sucursal}")]
        public IActionResult DeleteTelefonoSucursal(int id_telefono_sucursal)
        {
            try
            {
                var telefonoSucursal = _context.telefonossucursal.Find(id_telefono_sucursal);
                if (telefonoSucursal == null)
                {
                    return NotFound(new { success = false, error = "Teléfono de sucursal no encontrado." });
                }
                _context.telefonossucursal.Remove(telefonoSucursal);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Teléfono de sucursal eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }
}
