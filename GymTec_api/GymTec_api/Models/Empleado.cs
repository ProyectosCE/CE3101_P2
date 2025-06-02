using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Empleado
    {
        //Atributos
        [Key]
        public int id_empleado { get; set; }
        public string cedula { get; set; }
        public decimal salario { get; set; }
        public string correo { get; set; }
        public string password { get; set; }
        public int clases_horas { get; set; }

        public string nombres { get; set; }
        public string apellidos { get; set; }

        [NotMapped]
        public string? nombre_completo
        {
            get { return $"{nombres} {apellidos}"; }
        }

        public string distrito { get; set; }
        public string canton { get; set; }
        public string provincia { get; set; }
        [NotMapped]
        public string direccion => $"{provincia}, {canton}, {distrito}";


        // Fks
        public int id_planilla { get; set; }
        [ForeignKey("id_planilla")]
        public Planilla? planilla { get; set; }

        public int id_sucursal { get; set; }
        [ForeignKey("id_sucursal")]
        public Sucursal? sucursal { get; set; }

        public int id_puesto { get; set; }
        [ForeignKey("id_puesto")]
        public Puesto? puesto { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<Clase>? clases { get; set; } = new List<Clase>();

        [JsonIgnore]
        public ICollection<Cliente>? clientes { get; set; } = new List<Cliente>();
    }
}
