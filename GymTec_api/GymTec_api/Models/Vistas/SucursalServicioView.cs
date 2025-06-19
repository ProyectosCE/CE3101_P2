using System.Text.Json.Serialization;

namespace GymTec_api.Models.Vistas
{
    public class SucursalServicioView
    {
        [JsonIgnore]
        public int id_sucursal { get; set; }
        public string nombre_sucursal { get; set; }
        public int id_servicio { get; set; }
        public string nombre_servicio { get; set; }
    }
}
