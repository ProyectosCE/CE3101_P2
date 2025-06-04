using GymTec_api.Data;
using GymTec_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Npgsql;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmpleadoController(AppDbContext context)
        {
            _context = context;
        }

        // GET : api/empleado
        [HttpGet]
        public ActionResult Index()
        {
            try
            {
                var empleados = _context.empleado.ToList();
                return Ok(new { success = true, data = empleados });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // GET : api/empleado/{id_sucursal}
        // VISTA

        // POST : api/empleado
        [HttpPost]
        public ActionResult CreateEmpleado([FromBody] Empleado nuevoEmpleado)
        {
            if (nuevoEmpleado == null)
            {
                return BadRequest(new { success = false, error = "Empleado no puede ser nulo." });
            }
            _context.empleado.Add(nuevoEmpleado);
            try
            {
                _context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    mensaje = "Empleado creado correctamente.",
                    data = nuevoEmpleado
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

        // PATCH : api/empleado/{id_empleado}
        [HttpPatch("{id_empleado}")]
        public ActionResult UpdateEmpleado(int id_empleado, [FromBody] Empleado empleadoActualizado)
        {
            if (empleadoActualizado == null || empleadoActualizado.id_empleado != id_empleado)
            {
                return BadRequest(new { success = false, error = "Datos inválidos." });
            }
            var empleadoExistente = _context.empleado.Find(id_empleado);
            if (empleadoExistente == null)
            {
                return NotFound(new { success = false, error = "Empleado no encontrado." });
            }
            // Actualizar propiedades del empleado existente
            empleadoExistente.salario = empleadoActualizado.salario;
            empleadoExistente.correo = empleadoActualizado.correo;
            empleadoExistente.password = empleadoActualizado.password;
            empleadoExistente.clases_horas = empleadoActualizado.clases_horas;
            empleadoExistente.nombres = empleadoActualizado.nombres;
            empleadoExistente.apellidos = empleadoActualizado.apellidos;
            empleadoExistente.distrito = empleadoActualizado.distrito;
            empleadoExistente.canton = empleadoActualizado.canton;
            empleadoExistente.provincia = empleadoActualizado.provincia;
            empleadoExistente.id_planilla = empleadoActualizado.id_planilla;
            empleadoExistente.id_sucursal = empleadoActualizado.id_sucursal;
            empleadoExistente.id_puesto = empleadoActualizado.id_puesto;
            try
            {
                _context.SaveChanges();
                return Ok(new { success = true, mensaje = "Empleado actualizado correctamente.", data = empleadoExistente });
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

        // DELETE : api/empleado/{id_empleado}
        [HttpDelete("{id_empleado}")]
        public IActionResult DeleteEmpleado(int id_empleado)
        {
            try
            {
                _context.Database.ExecuteSqlRaw("CALL eliminar_empleado({0})", id_empleado);
                return Ok(new { success = true, mensaje = "Empleado eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}