using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymTec_api.Models
{
    public class TelefonosSucursal
    {
        //Atributos
        [Key]
        public int id_telefono_sucursal { get; set; }
        public string telefono { get; set; }

        //Fks
        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }
    }
}
