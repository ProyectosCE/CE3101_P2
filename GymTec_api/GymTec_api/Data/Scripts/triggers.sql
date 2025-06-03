
-- Triggers for GymTec API

--Denegar eliminaciones a registros marcados como default
CREATE OR REPLACE FUNCTION deny_delete_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_default THEN
        RAISE EXCEPTION 'No se puede eliminar un registro marcado como default';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deny_delete_default_tratamiento
    BEFORE DELETE ON tratamiento
    FOR EACH ROW EXECUTE FUNCTION deny_delete_defaults();

CREATE TRIGGER trg_deny_delete_default_puesto
    BEFORE DELETE ON puesto
    FOR EACH ROW EXECUTE FUNCTION deny_delete_defaults();

CREATE TRIGGER trg_deny_delete_default_servicio
    BEFORE DELETE ON servicio
    FOR EACH ROW EXECUTE FUNCTION deny_delete_defaults();


-- Denegar actualizaciones a registros marcados como default
CREATE OR REPLACE FUNCTION deny_patch_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_default THEN
        RAISE EXCEPTION 'No se puede modificar un registro marcado como default';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deny_patch_default_tratamiento
    BEFORE UPDATE ON tratamiento
    FOR EACH ROW EXECUTE FUNCTION deny_patch_defaults();

CREATE TRIGGER trg_deny_patch_default_puesto
    BEFORE UPDATE ON puesto
    FOR EACH ROW EXECUTE FUNCTION deny_patch_defaults();
    
CREATE TRIGGER trg_deny_patch_default_servicio
    BEFORE UPDATE ON servicio
    FOR EACH ROW EXECUTE FUNCTION deny_patch_defaults();


-- Validar que el id_instructor en cliente sea un instructor válido
CREATE OR REPLACE FUNCTION validate_instructor_cliente()
RETURNS TRIGGER AS $$
DECLARE
    desc_puesto TEXT;
BEGIN
    IF NEW.id_instructor IS NOT NULL THEN
        SELECT p.descripcion INTO desc_puesto
        FROM empleado e
        JOIN puesto p ON e.id_puesto = p.id_puesto
        WHERE e.id_empleado = NEW.id_instructor;

        IF desc_puesto IS DISTINCT FROM 'instructor' THEN
            RAISE EXCEPTION 'El id_instructor no corresponde a un instructor válido';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_instructor_cliente
    BEFORE UPDATE ON cliente
    FOR EACH ROW EXECUTE FUNCTION validate_instructor_cliente();


-- Validar que el id_instructor en clase sea un instructor válido
CREATE OR REPLACE FUNCTION validate_instructor_clase()
RETURNS TRIGGER AS $$
DECLARE
    desc_puesto TEXT;
BEGIN
    IF NEW.id_instructor IS NOT NULL THEN
        SELECT p.descripcion INTO desc_puesto
        FROM empleado e
        JOIN puesto p ON e.id_puesto = p.id_puesto
        WHERE e.id_empleado = NEW.id_instructor;

        IF desc_puesto IS DISTINCT FROM 'instructor' THEN
            RAISE EXCEPTION 'El id_instructor en clase no es válido (no es un Instructor)';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_validate_instructor_clase_insert
    BEFORE INSERT ON clase
    FOR EACH ROW EXECUTE FUNCTION validate_instructor_clase();

CREATE TRIGGER trg_validate_instructor_clase_update
    BEFORE UPDATE ON clase
    FOR EACH ROW EXECUTE FUNCTION validate_instructor_clase();


-- Validar que el id_admin en sucursal sea un administrador válido
CREATE OR REPLACE FUNCTION validate_admin_sucursal()
RETURNS TRIGGER AS $$
DECLARE
    desc_puesto TEXT;
BEGIN
    IF NEW.id_admin IS NOT NULL THEN
        SELECT p.descripcion INTO desc_puesto
        FROM empleado e
        JOIN puesto p ON e.id_puesto = p.id_puesto
        WHERE e.id_empleado = NEW.id_admin;

        IF desc_puesto IS DISTINCT FROM 'admin' THEN
            RAISE EXCEPTION 'El empleado no es un administrador válido';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_admin_sucursal_insert
    BEFORE INSERT ON sucursal
    FOR EACH ROW EXECUTE FUNCTION validate_admin_sucursal();

CREATE TRIGGER trg_validate_admin_sucursal_update
    BEFORE UPDATE ON sucursal
    FOR EACH ROW EXECUTE FUNCTION validate_admin_sucursal();


-- Validar que el id_instructor y id_servicio en creacion de clase esten en sucursalxservicio
CREATE OR REPLACE FUNCTION validate_servicio_sucursal_instructor()
RETURNS TRIGGER AS $$
DECLARE
    id_sucursal_instructor INT;
    existe BOOL;
BEGIN
    IF NEW.id_instructor IS NOT NULL THEN
        -- Obtener sucursal del instructor
        SELECT id_sucursal INTO id_sucursal_instructor
        FROM empleado
        WHERE id_empleado = NEW.id_instructor;

        IF id_sucursal_instructor IS NULL THEN
            RAISE EXCEPTION 'Instructor sin sucursal asignada';
        END IF;

        -- Validar que el servicio esté disponible en esa sucursal
        SELECT TRUE INTO existe
        FROM sucursalxservicio
        WHERE id_sucursal = id_sucursal_instructor
          AND id_servicio = NEW.id_servicio;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'El servicio no está disponible en la sucursal del instructor';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_servicio_sucursal
    BEFORE INSERT OR UPDATE ON clase
    FOR EACH ROW EXECUTE FUNCTION validate_servicio_sucursal_instructor();

