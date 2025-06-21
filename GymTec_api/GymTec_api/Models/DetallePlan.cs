using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class DetallePlan
    {
        // Atributos
        [Key]
        public int id_detalle_plan { get; set; }
        public DateOnly fecha { get; set; }
        public string actividad { get; set; }

        // Fks
        public int id_plan_trabajo { get; set; }
        [JsonIgnore]
        [ForeignKey("id_plan_trabajo")]
        public PlanTrabajo? plan_trabajo { get; set; }
    }
}
