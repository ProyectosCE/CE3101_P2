using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class SucursalXTratamiento
    {
        // Fks
        public int id_sucursal { get; set; }
        [JsonIgnore]
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public int id_tratamiento { get; set; }
        [JsonIgnore]
        [ForeignKey("id_tratamiento")]
        public Tratamiento? tratamiento { get; set; }
    }
}
