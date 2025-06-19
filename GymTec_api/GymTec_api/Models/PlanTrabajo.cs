using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class PlanTrabajo
    {
        // Atributos
        [Key]
        public int id_plan_trabajo { get; set; }
        public DateOnly start_date { get; set; }
        public DateOnly end_date { get; set; }
        public string descripcion { get; set; }

        // Fks

        public int id_cliente { get; set; }
        [JsonIgnore]
        [ForeignKey("id_cliente")]
        public Cliente? cliente { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<DetallePlan>? detalles { get; set; } = new List<DetallePlan>();
    }
}
