using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class TelefonosSucursal
    {
        //Atributos
        [Key]
        public int id_telefono_sucursal { get; set; }
        public string numero_telefono { get; set; }


        //Fks
        public int id_sucursal { get; set; }
        [JsonIgnore]
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }
    }
}
