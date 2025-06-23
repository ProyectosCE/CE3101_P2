using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Planilla
    {
        // Atributos
        [Key]
        public int id_planilla { get; set; }
        public string descripcion { get; set; }

        //Navegacion
        [JsonIgnore]
        public List<Empleado>? empleados { get; set; } = new List<Empleado>();
    }
}
