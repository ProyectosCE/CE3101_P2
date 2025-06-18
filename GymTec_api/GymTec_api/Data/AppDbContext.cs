using GymTec_api.Controllers;
using GymTec_api.Models;
using GymTec_api.Models.Vistas;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace GymTec_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        // DbSets para los modelos
        public DbSet<Clase> clase { get; set; }
        public DbSet<Cliente> cliente { get; set; }
        public DbSet<ClienteXClase> clientexclase { get; set; }
        public DbSet<DetallePlan> detalleplan { get; set; }
        public DbSet<Empleado> empleado { get; set; }
        public DbSet<Maquina> maquina { get; set; }
        public DbSet<Planilla> planilla { get; set; }
        public DbSet<PlanTrabajo> plantrabajo { get; set; }
        public DbSet<Producto> producto { get; set; }
        public DbSet<Puesto> puesto { get; set; }
        public DbSet<Servicio> servicio { get; set; }
        public DbSet<Sucursal> sucursal { get; set; }
        public DbSet<SucursalXProducto> sucursalxproducto { get; set; }
        public DbSet<SucursalXServicio> sucursalxservicio { get; set; }
        public DbSet<SucursalXTratamiento> sucursalxtratamiento { get; set; }
        public DbSet<TelefonosSucursal> telefonossucursal { get; set; }
        public DbSet<Tipo_Equipo> tipo_equipo { get; set; }
        public DbSet<Tratamiento> tratamiento { get; set; }

        // Vistas
        public DbSet<ClaseDisponible> clases_disponibles { get; set; }
        public DbSet<EmpleadoSucursal> empleados_sucursal { get; set; }
        public DbSet<PlanTrabajoCliente> plantrabajo_cliente { get; set; }

        // DTOs
        public DbSet<PlanillaEmpleadoDTO> planillaEmpleadoDTO { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //============== Relaciones 1 a 1 ==============
            // Empleado(1) con Sucursal(1)
            modelBuilder.Entity<Sucursal>()
                .HasOne(s => s.admin)
                .WithOne(e => e.sucursalQueAdministra)
                .HasForeignKey<Sucursal>(s => s.id_admin)
                .IsRequired(); 


            //============== Relaciones 1 a N ==============

            // Empleado(N) con Puesto(1)
            modelBuilder.Entity<Empleado>()
                .HasOne(e => e.puesto)
                .WithMany(p => p.empleados)
                .HasForeignKey(e => e.id_puesto);

            // Empleado(N) con Sucursal(1)
            modelBuilder.Entity<Empleado>()
                .HasOne(e => e.sucursal)
                .WithMany(s => s.empleados)
                .HasForeignKey(e => e.id_sucursal)
                .IsRequired(false);

            modelBuilder.Entity<Sucursal>()
                .Property(s => s.id_admin)
                .IsRequired(false);


            // Empleado(N) con Planilla(1)
            modelBuilder.Entity<Empleado>()
                .HasOne(e => e.planilla)
                .WithMany(p => p.empleados)
                .HasForeignKey(e => e.id_planilla);

            // Clase(N) con Servicio(1)
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.servicio)
                .WithMany(s => s.clases)
                .HasForeignKey(c => c.id_servicio);

            // Maquina (N) con Tipo_Equipo(1)
            modelBuilder.Entity<Maquina>()
                .HasOne(m => m.tipo_equipo)
                .WithMany(t => t.maquinas)
                .HasForeignKey(m => m.id_tipo_equipo);

            // Maquina (N) con Sucursal(1)
            modelBuilder.Entity<Maquina>()
                .HasOne(m => m.sucursal)
                .WithMany(s => s.maquinas)
                .HasForeignKey(m => m.id_sucursal);

            // Clase(N) con Empleado(1)
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.instructor)
                .WithMany(e => e.clases)
                .HasForeignKey(c => c.id_instructor);

            // Cliente(N) con Empleado(1)
            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.instructor)
                .WithMany(e => e.clientes)
                .HasForeignKey(c => c.id_instructor);

            // PlanTrabajo(N) con Cliente(1)
            modelBuilder.Entity<PlanTrabajo>()
                .HasOne(pt => pt.cliente)
                .WithMany(c => c.planTrabajos)
                .HasForeignKey(pt => pt.id_cliente);

            // DetallePlan(N) con PlanTrabajo(1)
            modelBuilder.Entity<DetallePlan>()
                .HasOne(dp => dp.plan_trabajo)
                .WithMany(pt => pt.detalles)
                .HasForeignKey(dp => dp.id_plan_trabajo);

            // TelefonosSucursal(N) con Sucursal(1)
            modelBuilder.Entity<TelefonosSucursal>()
                .HasOne(ts => ts.sucursal)
                .WithMany(s => s.telefonos)
                .HasForeignKey(ts => ts.id_sucursal);

            // Clase(N) con Sucursal(1)
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.sucursal)
                .WithMany(s => s.clases)
                .HasForeignKey(c => c.id_sucursal);

            // ============== Relaciones N a M ==============
            // Cliente(N) con Clase(M)
            modelBuilder.Entity<ClienteXClase>()
                .HasKey(cc => new { cc.id_cliente, cc.id_clase });
            modelBuilder.Entity<ClienteXClase>()
                .HasOne(cc => cc.cliente)
                .WithMany(c => c.clases)
                .HasForeignKey(cc => cc.id_cliente);
            modelBuilder.Entity<ClienteXClase>()
                .HasOne(cc => cc.clase)
                .WithMany(c => c.clientes)
                .HasForeignKey(cc => cc.id_clase);

            // Sucursal(N) con Producto(M)
            modelBuilder.Entity<SucursalXProducto>()
                .HasKey(sp => new { sp.id_sucursal, sp.codigo_barra });
            modelBuilder.Entity<SucursalXProducto>()
                .HasOne(sp => sp.sucursal)
                .WithMany(s => s.productos)
                .HasForeignKey(sp => sp.id_sucursal);
            modelBuilder.Entity<SucursalXProducto>()
                .HasOne(sp => sp.producto)
                .WithMany(p => p.sucursales)
                .HasForeignKey(sp => sp.codigo_barra);

            // Sucursal(N) con Servicio(M)
            modelBuilder.Entity<SucursalXServicio>()
                .HasKey(ss => new { ss.id_sucursal, ss.id_servicio });
            modelBuilder.Entity<SucursalXServicio>()
                .HasOne(ss => ss.sucursal)
                .WithMany(s => s.servicios)
                .HasForeignKey(ss => ss.id_sucursal);
            modelBuilder.Entity<SucursalXServicio>()
                .HasOne(ss => ss.servicio)
                .WithMany(s => s.sucursales)
                .HasForeignKey(ss => ss.id_servicio);

            // Sucursal(N) con Tratamiento(M)
            modelBuilder.Entity<SucursalXTratamiento>()
                .HasKey(st => new { st.id_sucursal, st.id_tratamiento });
            modelBuilder.Entity<SucursalXTratamiento>()
                .HasOne(st => st.sucursal)
                .WithMany(s => s.tratamientos)
                .HasForeignKey(st => st.id_sucursal);
            modelBuilder.Entity<SucursalXTratamiento>()
                .HasOne(st => st.tratamiento)
                .WithMany(t => t.sucursales)
                .HasForeignKey(st => st.id_tratamiento);

            //================ Relaciones con Vistas ==============

            // clase_disponible
            modelBuilder.Entity<ClaseDisponible>()
                .HasNoKey()
                .ToView("clases_disponibles");

            // empleado_sucursal
            modelBuilder.Entity<EmpleadoSucursal>()
                .HasNoKey()
                .ToView("empleados_sucursal");

            // plantrabajo_cliente
            modelBuilder.Entity<PlanTrabajoCliente>()
                .HasNoKey()
                .ToView("plantrabajo_cliente");
            var detallesConverter = new ValueConverter<List<DetallePlanVista>, string>(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<List<DetallePlanVista>>(v, (JsonSerializerOptions)null)
             ); 

            modelBuilder.Entity<PlanTrabajoCliente>()
                .Property(p => p.detalles)
                .HasConversion(detallesConverter);

            //====================== DTOs =======================
            modelBuilder.Entity<PlanillaEmpleadoDTO>().HasNoKey();

        }
    }
}
