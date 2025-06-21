using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Tipo_Equipo
    {
        // Atributos
        [Key]
        public int id_tipo_equipo { get; set; }
        public string descripcion { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<Maquina>? maquinas { get; set; } = new List<Maquina>();
    }
}
