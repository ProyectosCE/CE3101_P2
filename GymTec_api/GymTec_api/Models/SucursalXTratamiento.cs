using System.ComponentModel.DataAnnotations.Schema;

namespace GymTec_api.Models
{
    public class SucursalXTratamiento
    {
        // Fks
        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public int id_tratamiento { get; set; }
        [ForeignKey("id_tratamiento")]
        public Tratamiento? tratamiento { get; set; }
    }
}
