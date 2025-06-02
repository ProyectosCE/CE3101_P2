using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Tratamiento
    {
        // Atributos 
        [Key]
        public int id_tratamiento { get; set; }
        public string nombre_tratamiento { get; set; }
        public bool is_default { get; set; } = false;

        // Navegacion

        [JsonIgnore]
        public ICollection<SucursalXTratamiento>? sucursales { get; set; } = new List<SucursalXTratamiento>();

    }
}
