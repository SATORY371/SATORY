CREATE DATABASE aerolinea;
USE aerolinea;

-- Tabla de aviones
CREATE TABLE aviones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    base VARCHAR(100) NOT NULL
);

-- Tabla de pilotos
CREATE TABLE pilotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    horas_vuelo INT NOT NULL,
    base VARCHAR(100) NOT NULL
);

-- Tabla de tripulación
CREATE TABLE tripulacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    base VARCHAR(100) NOT NULL
);

-- Tabla de vuelos
CREATE TABLE vuelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_vuelo VARCHAR(20) UNIQUE NOT NULL,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    hora TIME NOT NULL,
    avion_id INT,
    piloto_id INT,
    FOREIGN KEY (avion_id) REFERENCES aviones(id),
    FOREIGN KEY (piloto_id) REFERENCES pilotos(id)
);

-- Tabla intermedia para tripulación en vuelos
CREATE TABLE vuelo_tripulacion (
    vuelo_id INT,
    tripulacion_id INT,
    PRIMARY KEY (vuelo_id, tripulacion_id),
    FOREIGN KEY (vuelo_id) REFERENCES vuelos(id),
    FOREIGN KEY (tripulacion_id) REFERENCES tripulacion(id)
);
INSERT INTO aviones (codigo, tipo, base) VALUES
('A320-001', 'Airbus A320', 'Lima'),
('B737-002', 'Boeing 737', 'Cusco'),
('E190-003', 'Embraer 190', 'Arequipa'),
('A330-004', 'Airbus A330', 'Trujillo'),
('B787-005', 'Boeing 787', 'Piura');

INSERT INTO pilotos (codigo, nombre, horas_vuelo, base) VALUES
('PIL-001', 'Carlos Fernández', 5000, 'Lima'),
('PIL-002', 'Juan Pérez', 4200, 'Cusco'),
('PIL-003', 'María López', 3800, 'Arequipa'),
('PIL-004', 'Roberto Gómez', 6000, 'Trujillo'),
('PIL-005', 'Ana Torres', 4500, 'Piura');

INSERT INTO tripulacion (codigo, nombre, base) VALUES
('TRP-001', 'Luis García', 'Lima'),
('TRP-002', 'Andrea Mendoza', 'Cusco'),
('TRP-003', 'Sofía Ramírez', 'Arequipa'),
('TRP-004', 'Pedro Castillo', 'Trujillo'),
('TRP-005', 'Carmen Rojas', 'Piura');

INSERT INTO vuelos (numero_vuelo, origen, destino, hora, avion_id, piloto_id) VALUES
('VU-1001', 'Lima', 'Cusco', '08:30:00', 1, 1),
('VU-1002', 'Cusco', 'Arequipa', '09:15:00', 2, 2),
('VU-1003', 'Arequipa', 'Trujillo', '10:45:00', 3, 3),
('VU-1004', 'Trujillo', 'Piura', '12:00:00', 4, 4),
('VU-1005', 'Piura', 'Lima', '14:20:00', 5, 5);

INSERT INTO vuelo_tripulacion (vuelo_id, tripulacion_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 1),
(4, 2),
(4, 3),
(5, 4),
(5, 5);