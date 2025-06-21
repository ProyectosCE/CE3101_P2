namespace GymTec_api.Models.Vistas
{
    public class EmpleadoSucursal
    {
        public int id_sucursal { get; set; } 
        public string nombre_sucursal { get; set; }
        public string cedula { get; set; }
        public string nombre_completo { get; set; }
        public string correo { get; set; }
        public string puesto { get; set; }
        public string tipo_planilla { get; set; }
        public int clases_horas { get; set; }
    }
}
