using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/cliente
        [HttpGet]
        public IActionResult GetClientes()
        {
            try
            {
                var clientes = _context.cliente.ToList();
                return Ok(new { success = true, data = clientes });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/cliente
        [HttpPost]
        public IActionResult CreateCliente([FromBody] Cliente cliente)
        {
            if (cliente == null)
            {
                return BadRequest(new { success = false, error = "Cliente no puede ser nulo" });
            }

            // Encriptar contraseña
            cliente.password = BCrypt.Net.BCrypt.HashPassword(cliente.password);

            _context.cliente.Add(cliente);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Cliente creado correctamente.",
                    data = cliente
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

        // PATCH: api/cliente/{id_cliente}
        [HttpPatch("{id_cliente}")]
        public IActionResult UpdateCliente(int id_cliente, [FromBody] Cliente cliente)
        {
            if (cliente == null || id_cliente != cliente.id_cliente)
            {
                return BadRequest(new { success = false, error = "Datos del cliente no válidos" });
            }

            var existingCliente = _context.cliente.Find(id_cliente);
            if (existingCliente == null)
            {
                return NotFound(new { success = false, error = "Cliente no encontrado" });
            }

            existingCliente.cedula = cliente.cedula;
            existingCliente.peso = cliente.peso;
            existingCliente.imc = cliente.imc;
            existingCliente.correo = cliente.correo;
            existingCliente.password = cliente.password; // Si deseas, aquí podrías encriptar la password si cambia
            existingCliente.nombres = cliente.nombres;
            existingCliente.apellidos = cliente.apellidos;
            existingCliente.fecha_nacimiento = cliente.fecha_nacimiento;
            existingCliente.distrito = cliente.distrito;
            existingCliente.canton = cliente.canton;
            existingCliente.provincia = cliente.provincia;
            existingCliente.id_instructor = cliente.id_instructor;

            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Cliente actualizado correctamente." });
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


        // DELETE: api/cliente/{id_cliente}
        [HttpDelete("{id_cliente}")]
        public IActionResult DeleteCliente(int id_cliente)
        {
            var cliente = _context.cliente.Find(id_cliente);
            if (cliente == null)
            {
                return NotFound(new { success = false, error = "Cliente no encontrado." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_cliente({0})", id_cliente);
                return Ok(new { success = true, mensaje = "Cliente eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
