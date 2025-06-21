using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Puesto
    {
        // Atributos
        [Key]
        public int id_puesto { get; set; }
        public string descripcion { get; set; }
        public bool is_default { get; set; } = false;

        // Navegacion
        [JsonIgnore]
        public List<Empleado>? empleados { get; set; } = new List<Empleado>();
    }
}
