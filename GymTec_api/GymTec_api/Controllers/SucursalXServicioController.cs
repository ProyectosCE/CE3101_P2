using GymTec_api.Data;
using Microsoft.AspNetCore.Mvc;

namespace GymTec_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SucursalXServicioController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SucursalXServicioController(AppDbContext context)
        {
            _context = context;
        }
    }
}
