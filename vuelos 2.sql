-- Database creation
CREATE DATABASE sky_voyager;
USE sky_voyager;

-- Aircraft Table
CREATE TABLE aircraft (
    aircraft_code VARCHAR(10) PRIMARY KEY,
    aircraft_type VARCHAR(50) NOT NULL,
    maintenance_base VARCHAR(100) NOT NULL
);

-- Pilot Table
CREATE TABLE pilot (
    pilot_code VARCHAR(10) PRIMARY KEY,
    pilot_name VARCHAR(100) NOT NULL,
    flight_hours DECIMAL(10,2) NOT NULL,
    base_location VARCHAR(100) NOT NULL
);

-- Crew Member Table
CREATE TABLE crew_member (
    crew_code VARCHAR(10) PRIMARY KEY,
    crew_name VARCHAR(100) NOT NULL,
    base_location VARCHAR(100) NOT NULL
);

-- Flight Table
CREATE TABLE flight (
    flight_number VARCHAR(20) PRIMARY KEY,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    flight_time TIME NOT NULL,
    aircraft_code VARCHAR(10),
    pilot_code VARCHAR(10),
    flight_date DATE NOT NULL,
    FOREIGN KEY (aircraft_code) REFERENCES aircraft(aircraft_code),
    FOREIGN KEY (pilot_code) REFERENCES pilot(pilot_code)
);

-- Flight Crew Mapping Table
CREATE TABLE flight_crew_mapping (
    flight_number VARCHAR(20),
    crew_code VARCHAR(10),
    PRIMARY KEY (flight_number, crew_code),
    FOREIGN KEY (flight_number) REFERENCES flight(flight_number),
    FOREIGN KEY (crew_code) REFERENCES crew_member(crew_code)
);

INSERT INTO aircraft (aircraft_code, aircraft_type, maintenance_base) VALUES
('A320', 'Airbus A320', 'Lima'),
('B737', 'Boeing 737', 'Cusco'),
('E190', 'Embraer 190', 'Arequipa');
INSERT INTO pilot (pilot_code, pilot_name, flight_hours, base_location) VALUES
('P001', 'Carlos Fernández', 5200.50, 'Lima'),
('P002', 'María Rodríguez', 4800.75, 'Cusco'),
('P003', 'Javier Gómez', 3500.25, 'Arequipa');
INSERT INTO crew_member (crew_code, crew_name, base_location) VALUES
('C001', 'Ana López', 'Lima'),
('C002', 'Luis Pérez', 'Cusco'),
('C003', 'Sofía Ramírez', 'Arequipa'),
('C004', 'Miguel Torres', 'Lima');
INSERT INTO flight (flight_number, origin, destination, flight_time, aircraft_code, pilot_code, flight_date) VALUES
('F1001', 'Lima', 'Cusco', '08:30:00', 'A320', 'P001', '2025-02-05'),
('F1002', 'Cusco', 'Arequipa', '10:45:00', 'B737', 'P002', '2025-02-06'),
('F1003', 'Arequipa', 'Lima', '14:20:00', 'E190', 'P003', '2025-02-07');
INSERT INTO flight_crew_mapping (flight_number, crew_code) VALUES
('F1001', 'C001'),
('F1001', 'C004'),
('F1002', 'C002'),
('F1003', 'C003');