using GymTec_api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult TestGet()
        {
            return GenerateResponse("GET");
        }

        [HttpPost]
        public IActionResult TestPost()
        {
            return GenerateResponse("POST");
        }

        [HttpPatch]
        public IActionResult TestPatch()
        {
            return GenerateResponse("PATCH");
        }

        [HttpDelete]
        public IActionResult TestDelete()
        {
            return GenerateResponse("DELETE");
        }

        private IActionResult GenerateResponse(string operation)
        {
            string dbStatus = "ok";
            int dbResponseCode = 200;
            string dbLocation = "GymTec Database";

            try
            {
                _context.Database.CanConnect();
            }
            catch (Exception ex)
            {
                dbStatus = "error";
                dbResponseCode = 500;
                dbLocation = ex.Message;
            }

            return Ok(new
            {
                status = 200,
                codigo_op = operation,
                op_ejecutada = $"Operación {operation} ejecutada.",
                base_de_datos = new
                {
                    db_status = dbStatus,
                    db_response_code = dbResponseCode,
                    db_location = dbLocation
                }
            });
        }
    }
}