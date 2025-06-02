using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Servicio
    {
        // Atributos
        [Key]
        public int id_servicio { get; set; }
        public string descripcion { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<Clase>? clases { get; set; } = new List<Clase>();

        [JsonIgnore]
        public ICollection<SucursalXServicio>? sucursales { get; set; } = new List<SucursalXServicio>();

    }
}
