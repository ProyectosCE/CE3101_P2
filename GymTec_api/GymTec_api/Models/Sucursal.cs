using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GymTec_api.Models
{
    public class Sucursal
    {
        //Atributos
        [Key]
        public int id_sucursal { get; set; }
        public string nombre_sucursal { get; set; }
        public DateOnly fecha_apertura { get; set; }
        public string horario_atencion { get; set; }
        public int capacidad_max { get; set; }
        public bool spa_activo { get; set; } = false;
        public bool tienda_activo { get; set; } = false;


        public string distrito { get; set; }
        public string canton { get; set; }
        public string provincia { get; set; }
        [NotMapped]
        public string direccion => $"{provincia}, {canton}, {distrito}";

        // Fks
        public int? id_admin { get; set; }
        [ForeignKey("id_admin")]
        public Empleado? admin { get; set; }

        // Navegacion
        public ICollection<TelefonosSucursal>? telefonos { get; set; } = new List<TelefonosSucursal>();

        [JsonIgnore]
        public ICollection<Empleado>? empleados { get; set; } = new List<Empleado>();

        [JsonIgnore]
        public ICollection<Maquina>? maquinas { get; set; } = new List<Maquina>();

        [JsonIgnore]
        public ICollection<SucursalXProducto>? productos { get; set; } = new List<SucursalXProducto>();

        [JsonIgnore]
        public ICollection<SucursalXServicio>? servicios { get; set; } = new List<SucursalXServicio>();

        [JsonIgnore]
        public ICollection<SucursalXTratamiento> tratamientos { get; set; } = new List<SucursalXTratamiento>();

        [JsonIgnore]
        public ICollection<Clase>? clases { get; set; } = new List<Clase>();
    }
}
