using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class ClienteXClase
    {
        // Fks
        public int id_cliente { get; set; }
        [JsonIgnore]
        [ForeignKey("id_cliente")]
        public Cliente? cliente { get; set; }

        public int id_clase { get; set; }
        [JsonIgnore]
        [ForeignKey("id_clase")]
        public Clase? clase { get; set; }
    }
}
