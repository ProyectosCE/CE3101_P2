using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GymTec_api.Models.Vistas
{
    public class PlanTrabajoCliente
    {
        public int id_plan_trabajo { get; set; }
        public string nombre_cliente { get; set; }
        public string nombre_instructor { get; set; }
        public DateOnly start_date { get; set; }
        public DateOnly end_date { get; set; }
        public string descripcion { get; set; }
        public List<DetallePlanVista> detalles { get; set; }

        [JsonIgnore]
        public int id_cliente { get; set; }



    }

    public class DetallePlanVista
    {
        public int id_detalle_plan { get; set; }
        public DateOnly fecha { get; set; }
        public string actividad { get; set; }
    }
}
