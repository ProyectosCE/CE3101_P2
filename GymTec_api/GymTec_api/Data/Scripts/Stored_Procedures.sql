
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



