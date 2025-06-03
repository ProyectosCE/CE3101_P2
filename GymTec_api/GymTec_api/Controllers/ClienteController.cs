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
            var clientes = _context.cliente.ToList();
            return Ok(clientes);
        }

        // POST: api/cliente
        [HttpPost]
        public IActionResult CreateCliente([FromBody] Cliente cliente)
        {
            if (cliente == null)
            {
                return BadRequest("Cliente no puede ser nulo");
            }

            // Encriptar contraseña
            cliente.password = BCrypt.Net.BCrypt.HashPassword(cliente.password);

            _context.cliente.Add(cliente);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetClientes), new { id = cliente.id_cliente }, cliente);
        }

        // PATCH: api/cliente/{id_cliente}
        [HttpPatch("{id_cliente}")]
        public IActionResult UpdateCliente(int id_cliente, [FromBody] Cliente cliente)
        {
            if (cliente == null || id_cliente != cliente.id_cliente)
            {
                return BadRequest("Datos del cliente no válidos");
            }
            var existingCliente = _context.cliente.Find(id_cliente);
            if (existingCliente == null)
            {
                return NotFound("Cliente no encontrado");
            }
            existingCliente.cedula = cliente.cedula;
            existingCliente.peso = cliente.peso;
            existingCliente.imc = cliente.imc;
            existingCliente.correo = cliente.correo;
            existingCliente.password = cliente.password;
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
            }
            catch (DbUpdateException dbEx)
            {
                // Si es una violación lanzada desde el trigger
                return BadRequest($"Error en la base de datos: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }

            return NoContent();
        }

        // DELETE: api/cliente/{id_cliente}
        [HttpDelete("{id_cliente}")]
        public IActionResult DeleteCliente(int id_cliente)
        {
            var cliente = _context.cliente.Find(id_cliente);
            if (cliente == null)
            {
                return NotFound("Cliente no encontrado");
            }
            _context.cliente.Remove(cliente);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
