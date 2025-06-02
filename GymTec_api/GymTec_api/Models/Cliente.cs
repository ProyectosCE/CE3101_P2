using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Cliente
    {
        // Atributos
        [Key]
        public int id_cliente { get; set; }
        public string cedula { get; set; }

        public float peso { get; set; }
        public float imc { get; set; }
        public string correo { get; set; }
        public string password { get; set; }

        public string nombres { get; set; }
        public string apellidos { get; set; }

        [NotMapped]
        public string? nombre_completo
        {
            get { return $"{nombres} {apellidos}"; }
        }

        public DateOnly fecha_nacimiento { get; set; }
        [NotMapped]
        public int? edad
        {
            get
            {
                var today = DateTime.Today;
                int age = today.Year - fecha_nacimiento.Year;
                if (fecha_nacimiento.ToDateTime(TimeOnly.MinValue) > today.AddYears(-age)) age--;
                return age;
            }
        }


        public string distrito { get; set; }
        public string canton { get; set; }
        public string provincia { get; set; }
        [NotMapped]
        public string direccion => $"{provincia}, {canton}, {distrito}";


        // Fks

        public int? id_instructor { get; set; }
        [ForeignKey("id_instructor")]
        public Empleado? instructor { get; set; }

        // Navegacion
        [JsonIgnore]
        public ICollection<PlanTrabajo>? planTrabajos { get; set; } = new List<PlanTrabajo>();

        [JsonIgnore]
        public ICollection<ClienteXClase> clases { get; set; } = new List<ClienteXClase>();

    }
}
