using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Producto
    {
        // Atributos
        [Key]
        public string codigo_barra { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public decimal costo { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<SucursalXProducto>? sucursales { get; set; } = new List<SucursalXProducto>();
    }
}
