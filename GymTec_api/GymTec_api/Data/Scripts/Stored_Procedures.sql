
/*
    =========================================================
                          COPIAR DATOS
    =========================================================
*/

-- Copiar un sucursal
CREATE OR REPLACE FUNCTION copiar_sucursal(p_id_sucursal INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_new_id_sucursal INT;
BEGIN
    -- Insertar nueva sucursal con datos copiados y ajustes
    INSERT INTO sucursal (
        nombre_sucursal, fecha_apertura, horario_atencion, capacidad_max,
        spa_activo, tienda_activo, distrito, canton, provincia, id_admin
    )
    SELECT
        'Copia de ' || nombre_sucursal,
        CURRENT_DATE,
        NULL,
        NULL,
        FALSE,
        FALSE,
        NULL,
        NULL,
        NULL,
        NULL
    FROM sucursal
    WHERE id_sucursal = p_id_sucursal
    RETURNING id_sucursal INTO v_new_id_sucursal;

    -- Copiar tratamientos
    INSERT INTO sucursalxtratamiento (id_sucursal, id_tratamiento)
    SELECT v_new_id_sucursal, id_tratamiento
    FROM sucursalxtratamiento
    WHERE id_sucursal = p_id_sucursal;

    -- Copiar productos
    INSERT INTO sucursalxproducto (id_sucursal, codigo_barra)
    SELECT v_new_id_sucursal, codigo_barra
    FROM sucursalxproducto
    WHERE id_sucursal = p_id_sucursal;

    -- Copiar servicios
    INSERT INTO sucursalxservicio (id_sucursal, id_servicio)
    SELECT v_new_id_sucursal, id_servicio
    FROM sucursalxservicio
    WHERE id_sucursal = p_id_sucursal;

    -- Copiar clases con instructor NULL
    INSERT INTO clase (
        hora_inicio, hora_fin, grupal, capacidad, fecha,
        id_instructor, id_servicio, id_sucursal
    )
    SELECT
        hora_inicio, hora_fin, grupal, capacidad, fecha,
        NULL, id_servicio, v_new_id_sucursal
    FROM clase
    WHERE id_sucursal = p_id_sucursal;

    RETURN v_new_id_sucursal;
END;
$$;


/*
    =========================================================
                       ELIMINACION DE DATOS
    =========================================================
*/

-- Eliminar sucursal
CREATE OR REPLACE PROCEDURE eliminar_sucursal_completa(p_id_sucursal INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1. Eliminar relaciones auxiliares
    DELETE FROM telefonossucursal WHERE id_sucursal = p_id_sucursal;
    DELETE FROM sucursalxtratamiento WHERE id_sucursal = p_id_sucursal;
    DELETE FROM sucursalxproducto WHERE id_sucursal = p_id_sucursal;
    DELETE FROM sucursalxservicio WHERE id_sucursal = p_id_sucursal;

    -- 2. Eliminar registros clientexclase de clases de esa sucursal
    DELETE FROM clientexclase
    WHERE id_clase IN (
        SELECT id_clase FROM clase WHERE id_sucursal = p_id_sucursal
    );

    -- 3. Eliminar clases asociadas a esa sucursal
    DELETE FROM clase WHERE id_sucursal = p_id_sucursal;

    -- 4. Poner NULL en id_sucursal de empleados
    UPDATE empleado
    SET id_sucursal = NULL
    WHERE id_sucursal = p_id_sucursal;

    -- 5. Poner NULL en maquinas
    UPDATE maquina
    SET id_sucursal = NULL
    WHERE id_sucursal = p_id_sucursal;

    -- 6. Eliminar la sucursal
    DELETE FROM sucursal WHERE id_sucursal = p_id_sucursal;
END;
$$;

-- Eliminar tratamiento
CREATE OR REPLACE PROCEDURE eliminar_tratamiento(tratamiento_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar relaciones en sucursalxtratamiento
    DELETE FROM sucursalxtratamiento
    WHERE id_tratamiento = tratamiento_id;

    -- Eliminar tratamiento en tabla tratamiento
    DELETE FROM tratamiento
    WHERE id_tratamiento = tratamiento_id;
END;
$$;

-- Eliminar productos
CREATE OR REPLACE PROCEDURE eliminar_producto(codigo_barra TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar relaciones en sucursalxproducto
    DELETE FROM sucursalxproducto
    WHERE codigo_barra = codigo_barra;

    -- Eliminar producto en tabla producto
    DELETE FROM producto
    WHERE codigo_barra = codigo_barra;
END;
$$;

-- Eliminar puestos
CREATE OR REPLACE PROCEDURE eliminar_puesto(puesto_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar relaciones en empleado
    DELETE FROM empleado
    WHERE id_puesto = puesto_id;

    -- Eliminar puesto en tabla puesto
    DELETE FROM puesto
    WHERE id_puesto = puesto_id;
END;
$$;

--Eliminar planillas
CREATE OR REPLACE PROCEDURE eliminar_planilla(planilla_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar relaciones en empleado
    DELETE FROM empleado
    WHERE id_planilla = planilla_id;

    -- Eliminar planilla en tabla planilla
    DELETE FROM planilla
    WHERE id_planilla = planilla_id;
END;
$$;

-- Eliminar clases
CREATE OR REPLACE PROCEDURE eliminar_clase(clase_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar relaciones en clientexclase
    DELETE FROM clientexclase
    WHERE id_clase = clase_id;

    -- Eliminar la clase de la tabla clase
    DELETE FROM clase
    WHERE id_clase = clase_id;
END;
$$;

-- Eliminar servicios
CREATE OR REPLACE PROCEDURE eliminar_servicio(servicio_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    clase_id_actual INT;
BEGIN
    FOR clase_id_actual IN
        SELECT id_clase FROM clase WHERE id_servicio = servicio_id
    LOOP
        CALL eliminar_clase(clase_id_actual); 
    END LOOP;

    DELETE FROM sucursalxservicio 
    WHERE id_servicio = servicio_id;

    DELETE FROM servicio 
    WHERE id_servicio = servicio_id;
END;
$$;

-- Eliminar PlanTrabajo
CREATE OR REPLACE PROCEDURE eliminar_plan_trabajo(plan_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar detalles asociados al plan
    DELETE FROM detalleplan
    WHERE id_plan_trabajo = plan_id;

    -- Eliminar el plan de trabajo
    DELETE FROM plantrabajo
    WHERE id_plan_trabajo = plan_id;
END;
$$;


-- Eliminar Clientes
CREATE OR REPLACE PROCEDURE eliminar_cliente(cliente_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    plan RECORD;
BEGIN
    -- Eliminar registros en clientesxclase asociados al cliente
    DELETE FROM clientexclase
    WHERE id_cliente = cliente_id;

    -- Para cada plan de trabajo asociado al cliente, llamar a eliminar_plan_trabajo
    FOR plan IN
        SELECT id_plan_trabajo FROM plantrabajo WHERE id_cliente = cliente_id
    LOOP
        CALL eliminar_plan_trabajo(plan.id_plan_trabajo);
    END LOOP;

    -- Eliminar el cliente
    DELETE FROM cliente
    WHERE id_cliente = cliente_id;
END;
$$;

-- Eliminar Empleados
CREATE OR REPLACE PROCEDURE eliminar_empleado(empleado_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Null en id_admin de sucursal si el empleado es un administrador
    UPDATE sucursal
    SET id_admin = NULL
    WHERE id_admin = empleado_id;

    -- Null en id_instructor de clase si el empleado es un instructor
    UPDATE clase
    SET id_instructor = NULL
    WHERE id_instructor = empleado_id;

    -- Null en id_instructor de cliente si el empleado es un instructor
    UPDATE cliente
    SET id_instructor = NULL
    WHERE id_instructor = empleado_id;

    -- Eliminar el empleado
    DELETE FROM empleado
    WHERE id_empleado = empleado_id;
END;
$$;

-- Eliminar TipoEquipo
CREATE OR REPLACE PROCEDURE eliminar_tipo_equipo(tipo_equipo_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Eliminar maquinas asociadas a este tipo de equipo
    DELETE FROM maquina
    WHERE id_tipo_equipo = tipo_equipo_id;
    -- Eliminar el tipo de equipo
    DELETE FROM tipo_equipo
    WHERE id_tipo_equipo = tipo_equipo_id;
END;
$$;

/*
    =========================================================
                       Generar Planilla
    =========================================================
*/


CREATE OR REPLACE PROCEDURE generar_planilla_sucursal(
    IN p_id_sucursal INT,
    INOUT ref REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN ref FOR
    SELECT
        e.cedula,
        e.nombres || ' ' || e.apellidos AS nombre_empleado,
        p.descripcion AS tipo_planilla,
        CASE p.descripcion
            WHEN 'Pago mensual' THEN 1
            WHEN 'Pago por horas' THEN e.clases_horas
            WHEN 'Pago por clase' THEN e.clases_horas
            ELSE 0
        END AS unidades_trabajadas,
        CASE p.descripcion
            WHEN 'Pago mensual' THEN e.salario
            WHEN 'Pago por horas' THEN e.salario * e.clases_horas
            WHEN 'Pago por clase' THEN e.salario * e.clases_horas
            ELSE 0
        END AS monto_pagar,
        s.nombre_sucursal
    FROM empleado e
    JOIN planilla p ON e.id_planilla = p.id_planilla
    JOIN sucursal s ON e.id_sucursal = s.id_sucursal
    WHERE e.id_sucursal = p_id_sucursal
    ORDER BY e.nombres, e.apellidos;
END;
$$;


