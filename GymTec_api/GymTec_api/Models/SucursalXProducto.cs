using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class SucursalXProducto
    {
        // Fks
        public int id_sucursal { get; set; }
        [JsonIgnore]
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public string codigo_barra { get; set; }
        [JsonIgnore]
        [ForeignKey("codigo_barra")]
        public Producto? producto { get; set; }
    }
}
