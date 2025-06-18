using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Data;

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
            try
            {
                var sucursales = _context.sucursal.ToList();
                return Ok(new { success = true, data = sucursales });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/sucursal
        [HttpPost("api/sucursal")]
        public IActionResult CreateSucursal([FromBody] Sucursal nuevaSucursal)
        {
            if (nuevaSucursal == null)
            {
                return BadRequest(new { success = false, error = "Sucursal no puede ser nula." });
            }

            _context.sucursal.Add(nuevaSucursal);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Sucursal creada correctamente.",
                    data = nuevaSucursal
                });
            }
            catch (DbUpdateException dbEx)
            {
                // Si es una violación lanzada desde el trigger
                return BadRequest(new { success = false, error = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PATCH: api/sucursal/{id_sucursal}
        [HttpPatch("api/sucursal/{id_sucursal}")]
        public IActionResult UpdateSucursal(int id_sucursal, [FromBody] Sucursal sucursalActualizada)
        {
            if (sucursalActualizada == null || id_sucursal != sucursalActualizada.id_sucursal)
            {
                return BadRequest(new { success = false, error = "Datos de la sucursal no válidos." });
            }

            var sucursalExistente = _context.sucursal.Find(id_sucursal);
            if (sucursalExistente == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }

            // Actualizar campos
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
                return Ok(new { success = true, mensaje = "Sucursal actualizada correctamente." });
            }
            catch (DbUpdateException dbEx)
            {
                // Si es una violación lanzada desde el trigger
                return BadRequest(new { success = false, error = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PATCH: api/sucursal/spa_toggle/{id_sucursal}
        [HttpPatch("api/sucursal/spa_toggle/{id_sucursal}")]
        public IActionResult ToggleSpa(int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }

            sucursal.spa_activo = !sucursal.spa_activo;
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                mensaje = "Estado de spa actualizado correctamente.",
                data = sucursal
            });
        }


        // PATCH: api/sucursal/tienda_toggle/{id_sucursal}
        [HttpPatch("api/sucursal/tienda_toggle/{id_sucursal}")]
        public IActionResult ToggleTienda(int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }

            sucursal.tienda_activo = !sucursal.tienda_activo;
            _context.SaveChanges();

            return Ok(new
            {
                success = true,
                mensaje = "Estado de tienda actualizado correctamente.",
                data = sucursal
            });
        }

        // DELETE: api/sucursal/{id_sucursal}
        [HttpDelete("api/sucursal/{id_sucursal}")]
        public IActionResult Delete(int id_sucursal)
        {
            var sucursal = _context.sucursal.Find(id_sucursal);
            if (sucursal == null)
            {
                return NotFound(new { success = false, error = "Sucursal no encontrada." });
            }
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_sucursal_completa({0})", id_sucursal);
                return Ok(new { success = true, mensaje = "Sucursal eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/sucursal/copiar_sucursal/{id_sucursal}
        [HttpPost("api/sucursal/copiar_sucursal/{id_sucursal}")]
        public IActionResult CopiarSucursal(int id_sucursal)
        {
            try
            {
                var newIdSucursal = _context
                    .sucursal
                    .FromSqlRaw("SELECT copiar_sucursal({0}) AS id_sucursal", id_sucursal)
                    .Select(s => s.id_sucursal)
                    .FirstOrDefault();

                if (newIdSucursal == 0)
                {
                    return NotFound(new { success = false, error = "Sucursal original no encontrada o no pudo copiarse." });
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


        // GET: api/sucursal/generar_planilla/{id_sucursal}
        [HttpGet("generar_planilla/{id_sucursal}")]
        public IActionResult GenerarPlanilla([FromRoute] int id_sucursal)
        {
            var results = new List<PlanillaEmpleadoDTO>();

            try
            {
                using var connection = new NpgsqlConnection(_context.Database.GetConnectionString());
                connection.Open();

                // Iniciar una transacción para mantener el cursor abierto
                using var transaction = connection.BeginTransaction();

                // Llamar al procedimiento almacenado
                using (var cmd = new NpgsqlCommand("CALL generar_planilla_sucursal(@p_id_sucursal, @ref)", connection, transaction))
                {
                    cmd.Parameters.AddWithValue("p_id_sucursal", id_sucursal);
                    cmd.Parameters.Add(new NpgsqlParameter("ref", NpgsqlTypes.NpgsqlDbType.Refcursor)
                    {
                        Direction = ParameterDirection.InputOutput,
                        Value = "planilla_cursor"
                    });

                    cmd.ExecuteNonQuery();
                }

                // Obtener los resultados del cursor
                using (var fetch = new NpgsqlCommand("FETCH ALL IN planilla_cursor", connection, transaction))
                using (var reader = fetch.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        results.Add(new PlanillaEmpleadoDTO
                        {
                            cedula = reader.GetString(0),
                            nombre_empleado = reader.GetString(1),
                            tipo_planilla = reader.GetString(2),
                            unidades_trabajadas = reader.GetInt32(3),
                            monto_pagar = reader.GetDecimal(4),
                            nombre_sucursal = reader.GetString(5)
                        });
                    }
                }

                // Terminar la transacción
                transaction.Commit();

                return Ok(new { success = true, data = results });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }


    }

    public class PlanillaEmpleadoDTO
    {
        public string cedula { get; set; }
        public string nombre_empleado { get; set; }
        public string tipo_planilla { get; set; }
        public int unidades_trabajadas { get; set; }
        public decimal monto_pagar { get; set; }
        public string nombre_sucursal { get; set; }
    }

}

