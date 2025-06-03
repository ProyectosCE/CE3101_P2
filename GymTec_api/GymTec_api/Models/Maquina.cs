using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Maquina
    {
        //Atributos
        [Key]
        public int id_maquina { get; set; }
        public string marca { get; set; }
        public string num_serie { get; set; }
        public decimal costo { get; set; }

        // Fks
        public int id_tipo_equipo { get; set; }
        [ForeignKey("id_tipo_equipo")]
        public Tipo_Equipo? tipo_equipo { get; set; }

        public int? id_sucursal { get; set; } // Puede ser null
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }


        // Navegacion
    }
}
