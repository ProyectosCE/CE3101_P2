using System.Text.Json.Serialization;

namespace GymTec_api.Models.Vistas
{
    public class SucursalTratamientoView
    {
        [JsonIgnore]
        public int id_sucursal { get; set; }
        public int id_tratamiento { get; set; }
        public string nombre_tratamiento { get; set; }
    }
}
