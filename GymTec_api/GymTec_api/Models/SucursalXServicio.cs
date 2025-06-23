using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class SucursalXServicio
    {
        // Fks
        public int id_sucursal { get; set; }
        [JsonIgnore]
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public int id_servicio { get; set; }
        [JsonIgnore]
        [ForeignKey("id_servicio")]
        public Servicio? servicio { get; set; }
    }
}
