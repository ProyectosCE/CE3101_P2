using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    public class SucursalController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SucursalController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sucursal
        [HttpGet("api/sucursal")]
        public IActionResult GetSucursales()
        {
            var sucursales = _context.sucursal.ToList();
            return Ok(sucursales);
        }

        // POST: api/sucursal   
        [HttpPost("api/sucursal")]
        public IActionResult CreateSucursal([FromBody] Sucursal nuevaSucursal)
        {
            if (nuevaSucursal == null)
            {
                return BadRequest("Sucursal no puede ser nula.");
            }
            _context.sucursal.Add(nuevaSucursal);
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

            return CreatedAtAction(nameof(GetSucursales), new { id = nuevaSucursal.id_sucursal }, nuevaSucursal);
        }

        // PATCH: api/sucursal/{id_sucursal}
        [HttpPatch("api/sucursal/{id_sucursal}")]
        public IActionResult UpdateSucursal(int id_sucursal, [FromBody] Sucursal sucursalActualizada)
        {
            if (sucursalActualizada == null || id_sucursal != sucursalActualizada.id_sucursal)
            {
                return BadRequest("Datos de la sucursal no válidos.");
            }
            var sucursalExistente = _context.sucursal.Find(id_sucursal);
            if (sucursalExistente == null)
            {
                return NotFound("Sucursal no encontrada.");
            }
            // Actualizar los campos necesarios
            sucursalExistente.nombre_sucursal = sucursalActualizada.nombre_sucursal;
            sucursalExistente.id_admin = sucursalActualizada.id_admin;
            sucursalExistente.horario_atencion = sucursalActualizada.horario_atencion;
            sucursalExistente.capacidad_max = sucursalActualizada.capacidad_max;
            sucursalExistente.distrito = sucursalActualizada.distrito;
            sucursalExistente.canton = sucursalActualizada.canton;
            sucursalExistente.provincia = sucursalActualizada.provincia;
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

        // PATCH: api/sucursal/spa_toggle/{id_sucursal}
        [HttpPatch("api/sucursal/spa_toggle/{id_sucursal}")]
        public IActionResult ToggleSpa(int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound("Sucursal no encontrada.");
            }
            sucursal.spa_activo = !sucursal.spa_activo;
            _context.SaveChanges();

            return Ok(sucursal);
        }

        // PATCH: api/sucursal/tienda_toggle/{id_sucursal}
        [HttpPatch("api/sucursal/tienda_toggle/{id_sucursal}")]
        public IActionResult ToggleTienda(int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound("Sucursal no encontrada.");
            }
            sucursal.tienda_activo = !sucursal.tienda_activo;
            _context.SaveChanges();

            return Ok(sucursal);
        }

        // DELETE: api/sucursal/{id_sucursal}   
        [HttpDelete("api/sucursal/{id_sucursal}")]
        public IActionResult Delete(int id_sucursal)
        {
            try
            {
                // STORED PROCEDURE
                _context.Database.ExecuteSqlRaw("CALL eliminar_sucursal_completa({0})", id_sucursal);
                return NoContent(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // POST: api/sucursal/copiar_sucursal/{id_sucursal}
        [HttpPost("api/sucursal/copiar_sucursal/{id_sucursal}")]
        public IActionResult CopiarSucursal(int id_sucursal)
        {
            try
            {
                // Ejecutar la función y obtener el nuevo id_sucursal
                var newIdSucursal = _context
                    .sucursal
                    .FromSqlRaw("SELECT copiar_sucursal({0}) AS id_sucursal", id_sucursal)
                    .Select(s => s.id_sucursal)
                    .FirstOrDefault();

                if (newIdSucursal == 0)
                {
                    return NotFound(new { message = "Sucursal original no encontrada o no pudo copiarse." });
                }

                return Ok(new
                {
                    success = true,
                    nuevo_id_sucursal = newIdSucursal,
                    mensaje = "Sucursal copiada correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

    }

}

