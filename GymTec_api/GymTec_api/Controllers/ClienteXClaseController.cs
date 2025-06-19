using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteXClaseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClienteXClaseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/clientexclase/{id_clase}
        [HttpGet("{id_clase}")]
        public IActionResult GetClienteClase([FromRoute] int id_clase) {
            var clases = _context.clase.Find(id_clase);
            if (clases == null)
            {
                return NotFound(new { success = false, error = "Clase no encontrada." });
            }
            try
            {
                var clientes = _context.cliente_clase_view
                    .Where(cc => cc.id_clase == id_clase)
                    .ToList();
                if (clientes == null || !clientes.Any())
                {
                    return NotFound(new { success = false, error = "No hay clientes para esta clase." });
                }
                return Ok(new { success = true, data = clientes });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST : api/clientexclase/{id_clase}/{id_cliente}
        [HttpPost("{id_clase}/{id_cliente}")]
        public IActionResult CreateClienteClase(int id_clase, int id_cliente)
        {
            try
            {
                if (_context.cliente.Find(id_cliente) == null)
                    return NotFound(new { success = false, error = "Cliente no encontrado." });
                if (_context.clase.Find(id_clase) == null)
                    return NotFound(new { success = false, error = "Clase no encontrada." });
                _context.clientexclase.Add(new ClienteXClase
                {
                    id_clase = id_clase,
                    id_cliente = id_cliente
                });
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Cliente inscrito en la clase correctamente." });
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate") == true)
            {
                return BadRequest(new { success = false, error = "El cliente ya está inscrito en esta clase." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }


        // DELETE : api/clientexclase/{id_clase}/{id_cliente}
        [HttpDelete("{id_clase:int}/{id_cliente:int}")]
        public IActionResult DeleteClienteClase(int id_clase, int id_cliente)
        {
            try
            {
                var clienteClase = _context.clientexclase
                    .FirstOrDefault(cc => cc.id_clase == id_clase && cc.id_cliente == id_cliente);
                if (clienteClase == null)
                {
                    return NotFound(new { success = false, error = "Inscripción no encontrada." });
                }
                _context.clientexclase.Remove(clienteClase);
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Inscripción eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }
}
