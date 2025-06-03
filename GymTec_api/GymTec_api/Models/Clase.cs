using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Clase
    {
        // Atributos
        [Key]
        public int id_clase { get; set; }
        public TimeSpan hora_inicio { get; set; }
        public TimeSpan hora_fin { get; set; }
        public bool grupal { get; set; } = false;
        public int capacidad { get; set; }
        public DateOnly fecha { get; set; }

        // Fks
        public int id_servicio { get; set; }
        [ForeignKey("id_servicio")]
        public Servicio? servicio { get; set; }

        public int? id_instructor { get; set; }
        [ForeignKey("id_instructor")]
        public Empleado? instructor { get; set; }

        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }


        // Navegacion

        [JsonIgnore]
        public ICollection<ClienteXClase> clientes { get; set; } = new List<ClienteXClase>();
    }
}
