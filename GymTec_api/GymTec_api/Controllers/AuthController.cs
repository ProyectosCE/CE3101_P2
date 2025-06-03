using GymTec_api.Data;
using Microsoft.AspNetCore.Mvc;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.rol) ||
                string.IsNullOrWhiteSpace(request.correo) ||
                string.IsNullOrWhiteSpace(request.password))
            {
                return BadRequest(new { succes = false, mensaje = "Faltan datos para iniciar sesión", rol = (string)null });
            }

            if (request.rol == "cliente")
            {
                var cliente = _context.cliente.SingleOrDefault(c => c.correo == request.correo);

                if (cliente == null)
                {
                    return NotFound(new {succes = false, mensaje = "No existe una cuenta cliente con ese correo", rol = "cliente" });
                }

                if (BCrypt.Net.BCrypt.Verify(request.password, cliente.password))
                {
                    return Ok(new
                    {
                        success = true,
                        mensaje = "inicio sesión exitoso",
                        rol = "cliente",
                        id = cliente.id_cliente,
                        cliente = cliente.nombre_completo
                    });
                }
                else
                {
                    return Unauthorized(new { succes = false, mensaje = "contraseña o correo invalidos", rol = "cliente" });
                }
            }
            else
            {
                var puesto = _context.puesto.SingleOrDefault(p => p.descripcion == request.rol);
                if (puesto == null)
                {
                    return BadRequest(new { succes = false, mensaje = "Rol inválido", rol = (string)null });
                }

                var empleado = _context.empleado
                    .SingleOrDefault(e => e.correo == request.correo && e.id_puesto == puesto.id_puesto);

                if (empleado == null)
                {
                    return NotFound(new { succes = false, mensaje = $"No existe una cuenta con el rol '{request.rol}' para ese correo", rol = request.rol });
                }

                if (BCrypt.Net.BCrypt.Verify(request.password, empleado.password))
                {
                    return Ok(new
                    {
                        succes = true,
                        mensaje = "inicio sesión exitoso",
                        rol = request.rol,
                        id = empleado.id_empleado,
                        empleado = empleado.nombre_completo
                    });
                }
                else
                {
                    return Unauthorized(new { succes = false, mensaje = "contraseña o correo inválidos", rol = request.rol });
                }
            }
        }


        // PATCH: api/auth/migrar_passwords 
        // SOLO PARA PRUEBAS
        [HttpPatch("migrar_passwords")]
        public IActionResult MigrarPasswords()
        {
            int clientesActualizados = 0;
            int empleadosActualizados = 0;

            var clientes = _context.cliente.ToList();
            foreach (var cliente in clientes)
            {
                if (!cliente.password.StartsWith("$2a$"))
                {
                    cliente.password = BCrypt.Net.BCrypt.HashPassword(cliente.password);
                    clientesActualizados++;
                }
            }

            var empleados = _context.empleado.ToList();
            foreach (var empleado in empleados)
            {
                if (!empleado.password.StartsWith("$2a$"))
                {
                    empleado.password = BCrypt.Net.BCrypt.HashPassword(empleado.password);
                    empleadosActualizados++;
                }
            }

            _context.SaveChanges();

            return Ok(new
            {
                mensaje = "Contraseñas migradas correctamente",
                clientesActualizados,
                empleadosActualizados
            });
        }


    }


    public class LoginRequest
    {
        public string correo { get; set; }
        public string password { get; set; }
        public string rol { get; set; }
    }

}
