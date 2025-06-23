-- Vistas

-- clases_disponibles
CREATE OR REPLACE VIEW clases_disponibles AS
SELECT
	c.id_clase,
    s.descripcion AS nombre_servicio,
    c.grupal AS es_grupal,
    su.nombre_sucursal,
    c.capacidad,
    COALESCE(CONCAT(e.nombres, ' ', e.apellidos), 'Sin instructor asignado') AS instructor,
    c.hora_inicio, 
    c.hora_fin, 
    c.fecha,
    (c.capacidad - COUNT(cxc.id_cliente)) AS cupos_disponibles
FROM clase c
JOIN servicio s ON c.id_servicio = s.id_servicio
JOIN sucursal su ON c.id_sucursal = su.id_sucursal
LEFT JOIN empleado e ON c.id_instructor = e.id_empleado
LEFT JOIN clientexclase cxc ON c.id_clase = cxc.id_clase
GROUP BY 
	c.id_clase,
    s.descripcion, 
    c.grupal, 
    su.nombre_sucursal, 
    c.capacidad, 
    e.nombres, 
    e.apellidos, 
    c.hora_inicio, 
    c.hora_fin, 
    c.fecha;

-- empleados_sucursal
CREATE OR REPLACE VIEW empleados_sucursal AS
SELECT
    su.id_sucursal,
    su.nombre_sucursal,
    e.cedula,
    CONCAT(e.nombres, ' ', e.apellidos)       AS nombre_completo,
    e.correo,
    pu.descripcion                            AS puesto,
    pl.descripcion                            AS tipo_planilla,
    e.clases_horas
FROM empleado   e
JOIN sucursal   su ON su.id_sucursal = e.id_sucursal
JOIN puesto     pu ON pu.id_puesto   = e.id_puesto
JOIN planilla   pl ON pl.id_planilla = e.id_planilla;



-- plantrabajo_cliente
CREATE OR REPLACE VIEW plantrabajo_cliente AS
SELECT
    p.id_plan_trabajo,
    p.id_cliente,  -- ← necesario para filtrar luego
    CONCAT(c.nombres, ' ', c.apellidos)  AS nombre_cliente,
    CONCAT(i.nombres, ' ', i.apellidos)  AS nombre_instructor,
    p.start_date,
    p.end_date,
    p.descripcion,
    COALESCE(
        json_agg(
            json_build_object(
                'id_detalle_plan', d.id_detalle_plan,
                'fecha',           d.fecha,
                'actividad',       d.actividad
            )
            ORDER BY d.fecha                                 
        ) FILTER (WHERE d.id_detalle_plan IS NOT NULL),
        '[]'::json
    ) AS detalles
FROM plantrabajo p
JOIN cliente  c  ON c.id_cliente   = p.id_cliente
LEFT JOIN empleado i ON i.id_empleado = c.id_instructor
LEFT JOIN detalleplan d ON d.id_plan_trabajo = p.id_plan_trabajo
GROUP BY
    p.id_plan_trabajo, p.id_cliente,
    nombre_cliente, nombre_instructor,
    p.start_date, p.end_date, p.descripcion;

-- sucursal_tratamiento_view
CREATE OR REPLACE VIEW sucursal_tratamiento_view AS
SELECT
  st.id_sucursal,
  st.id_tratamiento,
  t.nombre_tratamiento
FROM sucursalxtratamiento st
JOIN tratamiento t ON st.id_tratamiento = t.id_tratamiento;

-- sucursal_producto_view
CREATE OR REPLACE VIEW sucursal_producto_view AS
SELECT
  sp.id_sucursal,
  sp.codigo_barra,
  p.nombre,
  p.descripcion,
  p.costo
FROM sucursalxproducto sp
JOIN producto p ON sp.codigo_barra = p.codigo_barra;

-- sucursal_servicio_view
CREATE OR REPLACE VIEW sucursal_servicio_view AS
SELECT
  ss.id_sucursal,
  ss.id_servicio,
  s.descripcion AS nombre_servicio,
  su.nombre_sucursal
  FROM sucursalxservicio ss
  JOIN servicio s ON ss.id_servicio = s.id_servicio
  JOIN sucursal su ON ss.id_sucursal = su.id_sucursal;

-- cliente_clase_view
CREATE OR REPLACE VIEW cliente_clase_view AS
SELECT
  cc.id_cliente,
  cc.id_clase,
  s.descripcion AS nombre_clase,
  cl.cedula,
  CONCAT(cl.nombres, ' ', cl.apellidos) AS nombre_cliente
FROM clientexclase cc
JOIN clase c ON cc.id_clase = c.id_clase
JOIN servicio s ON c.id_servicio = s.id_servicio
JOIN cliente cl ON cc.id_cliente = cl.id_cliente;