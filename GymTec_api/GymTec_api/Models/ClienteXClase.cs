using System.ComponentModel.DataAnnotations.Schema;

namespace GymTec_api.Models
{
    public class ClienteXClase
    {
        // Fks
        public int id_cliente { get; set; }
        [ForeignKey("id_cliente")]
        public Cliente? cliente { get; set; }

        public int id_clase { get; set; }
        [ForeignKey("id_clase")]
        public Clase? clase { get; set; }
    }
}
