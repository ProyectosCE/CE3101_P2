using System.Text.Json.Serialization;

namespace GymTec_api.Models.Vistas
{
    public class SucursalProductoView
    {
        [JsonIgnore]
        public int id_sucursal { get; set; }
        public string codigo_barra { get; set; }
        public string nombre { get; set; }
        public decimal costo { get; set; }
    }
}
