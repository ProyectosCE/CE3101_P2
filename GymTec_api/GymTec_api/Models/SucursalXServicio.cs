using System.ComponentModel.DataAnnotations.Schema;

namespace GymTec_api.Models
{
    public class SucursalXServicio
    {
        // Fks
        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public int id_servicio { get; set; }
        [ForeignKey("id_servicio")]
        public Servicio? servicio { get; set; }
    }
}
