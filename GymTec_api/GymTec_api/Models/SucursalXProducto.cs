using System.ComponentModel.DataAnnotations.Schema;

namespace GymTec_api.Models
{
    public class SucursalXProducto
    {
        // Fks
        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public string codigo_barra { get; set; }
        [ForeignKey("codigo_barra")]
        public Producto? producto { get; set; }
    }
}
