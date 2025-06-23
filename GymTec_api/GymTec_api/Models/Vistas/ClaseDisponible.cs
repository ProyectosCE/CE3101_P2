namespace GymTec_api.Models.Vistas
{
    public class ClaseDisponible
    {
        public string nombre_servicio { get; set; }
        public bool es_grupal { get; set; }
        public string nombre_sucursal { get; set; }
        public int capacidad { get; set; }
        public string instructor { get; set; }
        public TimeSpan hora_inicio { get; set; }
        public TimeSpan hora_fin { get; set; }
        public DateTime fecha { get; set; }
        public int cupos_disponibles { get; set; }
    }

}
