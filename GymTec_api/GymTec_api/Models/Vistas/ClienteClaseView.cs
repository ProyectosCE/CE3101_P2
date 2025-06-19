using System.Text.Json.Serialization;

namespace GymTec_api.Models.Vistas
{
    public class ClienteClaseView
    {
        [JsonIgnore]
        public int id_clase{ get; set; }
        public int id_cliente { get; set; }
        public string nombre_clase { get; set; }
        public string cedula { get; set; }
        public string nombre_cliente { get; set; }
    }
}
