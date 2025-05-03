create database ElliotCrud
go
use ElliotCrud

go
---------------Creacion de Tablas----------------------------------------
CREATE TABLE Departamentos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
);


go

CREATE TABLE Empleados (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL,
	Apellido_Paterno VARCHAR(50) NOT NULL,
	Apellido_Materno VARCHAR(50) NOT NULL,
	Edad int NOT NULL,
    Correo VARCHAR(100) NOT NULL,
	numero_telefono  varchar(10),
	Estatus CHAR(1) NOT NULL DEFAULT '1',  -- 1 = Activo, 0 = Inactivo
    ID_Departamento INT NOT NULL,
    FOREIGN KEY (ID_Departamento) REFERENCES Departamentos(ID)
);

go

CREATE TABLE Equipos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Tipo VARCHAR(50) NOT NULL,
    Numero_Serie VARCHAR(50) UNIQUE NOT NULL,
	Estatus CHAR(1) NOT NULL DEFAULT '1',  -- 1 = Activo, 0 = Inactivo
    ID_Empleado INT NULL,
    FOREIGN KEY (ID_Empleado) REFERENCES Empleados(ID) ON DELETE SET NULL
);
go


CREATE TABLE AsignacionesEquipos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ID_Empleado INT NOT NULL,
    ID_Equipo INT NOT NULL,
    Fecha_Asignacion DATE NOT NULL,
    FOREIGN KEY (ID_Empleado) REFERENCES Empleados(ID),
    FOREIGN KEY (ID_Equipo) REFERENCES Equipos(ID)
);

GO
----------------------------------Población-------------------------------------------------
INSERT INTO Departamentos(Nombre) VALUES
('IT'),
('Recursos Humanos'),
('Ventas'),
('Finanzas'),
('Marketing'),
('Producción'),
('Logística'),
('Compras'),
('Soporte Técnico'),
('Calidad');

GO

INSERT INTO Empleados (Nombre, Apellido_Paterno, Apellido_Materno, Edad, Correo, numero_telefono, ID_Departamento) VALUES
('Juan', 'Pérez', 'Gómez', 30, 'juan.perez@example.com', '1234567890', 1),
('María', 'López', 'Fernández', 28, 'maria.lopez@example.com', '6673203040', 2),
('Carlos', 'Ramírez', 'Hernández', 35, 'carlos.ramirez@example.com', '6676202040', 3),
('Ana', 'Martínez', 'Díaz', 29, 'ana.martinez@example.com', '6673245040', 4),
('Luis', 'González', 'Torres', 40, 'luis.gonzalez@example.com', '6673403042', 5),
('Elena', 'Castro', 'Ortiz', 33, 'elena.castro@example.com', '6673202456', 6),
('Pedro', 'Sánchez', 'Morales', 37, 'pedro.sanchez@example.com', '987654321', 7),
('Sofía', 'Navarro', 'Vega', 26, 'sofia.navarro@example.com', '1234567098', 8),
('Roberto', 'Cruz', 'Jiménez', 45, 'roberto.cruz@example.com', '6673204440', 9),
('Laura', 'Vázquez', 'Ruiz', 31, 'laura.vazquez@example.com', '5556677880', 10);


GO

INSERT INTO Equipos(Nombre, Tipo, Numero_Serie, ID_Empleado) VALUES
('Laptop Dell', 'Computadora', 'SN123456', 1),
('Monitor LG', 'Pantalla', 'SN654321', 2),
('Impresora HP', 'Impresora', 'SN112233', 3),
('Teléfono Samsung', 'Celular', 'SN445566', 4),
('Servidor IBM', 'Servidor', 'SN778899', 5),
('Tablet iPad', 'Tablet', 'SN223344', 6),
('Mouse Logitech', 'Accesorio', 'SN667788', 7),
('Teclado Razer', 'Accesorio', 'SN889900', 8),
('Cámara Sony', 'Cámara', 'SN334455', 9),
('Audífonos Bose', 'Accesorio', 'SN556677', 10);

GO

INSERT INTO AsignacionesEquipos (ID_Empleado, ID_Equipo, Fecha_Asignacion) VALUES
(1, 1, '2025-05-01'),
(2, 2, '2025-04-15'),
(3, 3, '2025-03-10'),
(4, 4, '2025-02-20'),
(5, 5, '2025-01-30'),
(6, 6, '2025-05-05'),
(7, 7, '2025-04-22'),
(8, 8, '2025-03-18'),
(9, 9, '2025-02-28'),
(10, 10, '2025-01-15')



GO
------------------------------------Procedimientos-----------------------
-- drop procedure proc_ObtenerEmpleados

CREATE  PROCEDURE proc_ObtenerEmpleados
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        E.ID, 
        E.Nombre, 
        E.Apellido_Paterno, 
        E.Apellido_Materno,
		E.Edad,
        E.Correo,
		E.numero_telefono,
		E.Estatus,
        E.ID_Departamento,
		D.Nombre as Nombre_Departamento
    FROM Empleados E
	inner join Departamentos D on D.ID=ID_Departamento
	where E.Estatus=1
	order by E.ID desc
END;

GO
-- drop procedure proc_InsertarEmpleado
CREATE PROCEDURE proc_InsertarEmpleado
    @Nombre VARCHAR(50),
    @Apellido_Paterno VARCHAR(50),
    @Apellido_Materno VARCHAR(50),
    @Edad INT,
    @Correo VARCHAR(100),
    @numero_telefono VARCHAR(10),
    @ID_Departamento INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Empleados (Nombre, Apellido_Paterno, Apellido_Materno, Edad, Correo, numero_telefono, ID_Departamento)
    VALUES (@Nombre, @Apellido_Paterno, @Apellido_Materno, @Edad, @Correo, @numero_telefono, @ID_Departamento);
END;

GO
-- drop procedure proc_ActualizarEmpleado
CREATE PROCEDURE proc_ActualizarEmpleado
    @ID INT,
    @Nombre VARCHAR(50),
    @Apellido_Paterno VARCHAR(50),
    @Apellido_Materno VARCHAR(50),
    @Edad INT,
    @Correo VARCHAR(100),
    @numero_telefono VARCHAR(10),
    @ID_Departamento INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Empleados
    SET 
        Nombre = @Nombre,
        Apellido_Paterno = @Apellido_Paterno,
        Apellido_Materno = @Apellido_Materno,
        Edad = @Edad,
        Correo = @Correo,
        numero_telefono = @numero_telefono,
        ID_Departamento = @ID_Departamento
    WHERE ID = @ID;
END;


GO

-- drop procedure proc_eliminarEmpleado
CREATE PROCEDURE proc_eliminarEmpleado
    @ID INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Empleados
    SET Estatus = '0'
    WHERE ID = @ID;
END;

GO
-- drop procedure proc_ObtenerDepartamentos
CREATE PROCEDURE proc_ObtenerDepartamentos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT ID, Nombre FROM Departamentos;
END;

GO
-- drop procedure proc_ObtenerEquipos
CREATE PROCEDURE proc_ObtenerEquipos
AS
BEGIN
    SELECT 
        E.ID,
        E.Nombre ,
        E.Tipo,
        E.Numero_Serie,
        E.ID_Empleado,
        COALESCE(EM.Nombre + ' ' + EM.Apellido_Paterno + ' ' + EM.Apellido_Materno, 'Sin asignar') AS Nombre_Empleado
    FROM Equipos E
    LEFT JOIN Empleados EM ON E.ID_Empleado = EM.ID
	where E.estatus=1
	order by E.ID desc
END;


GO
 -- drop procedure proc_ActualizarEquipo
CREATE PROCEDURE proc_ActualizarEquipo
    @ID INT,
    @Nombre VARCHAR(100),
    @Tipo VARCHAR(50)
AS
BEGIN
    UPDATE Equipos
    SET Nombre = @Nombre,
        Tipo = @Tipo
    WHERE ID = @ID;
END;

GO
-- drop procedure proc_eliminarEquipo
CREATE PROCEDURE proc_eliminarEquipo
    @ID INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Equipos
    SET Estatus = '0'
    WHERE ID = @ID;
END;


GO

--drop procedure proc_insertarEquipo
CREATE PROCEDURE proc_insertarEquipo
    @Nombre VARCHAR(100),
    @Tipo VARCHAR(50),
    @Numero_Serie VARCHAR(50)
AS
BEGIN
    INSERT INTO Equipos (Nombre, Tipo, Numero_Serie, ID_Empleado)
    VALUES (@Nombre, @Tipo, @Numero_Serie,  NULL);
END;


GO
--drop procedure proc_AsignarEquipo
CREATE PROCEDURE proc_AsignarEquipo
    @ID_Equipo INT,
    @ID_Empleado INT = NULL 
AS
BEGIN

    IF EXISTS (SELECT 1 FROM AsignacionesEquipos WHERE ID_Equipo = @ID_Equipo)
    BEGIN
        IF @ID_Empleado IS NULL
        BEGIN
            DELETE FROM AsignacionesEquipos
			WHERE ID_Equipo = @ID_Equipo;

            UPDATE Equipos
            SET ID_Empleado = NULL
            WHERE ID = @ID_Equipo;
        END
        ELSE
        BEGIN
            UPDATE AsignacionesEquipos
            SET ID_Empleado = @ID_Empleado, Fecha_Asignacion = GETDATE()
            WHERE ID_Equipo = @ID_Equipo;

            UPDATE Equipos
            SET ID_Empleado = @ID_Empleado
            WHERE ID = @ID_Equipo;
        END
    END
    ELSE
    BEGIN
        INSERT INTO AsignacionesEquipos (ID_Empleado, ID_Equipo, Fecha_Asignacion)
        VALUES (@ID_Empleado, @ID_Equipo, GETDATE());

        UPDATE Equipos
        SET ID_Empleado = @ID_Empleado
        WHERE ID = @ID_Equipo;
    END
END;

