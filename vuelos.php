<?php
require_once 'conexion.php';

// Crear instancia de conexión
$database = new Conexion();

// Consultar todas las tablas con JOIN para obtener datos completos
$query = "
    SELECT 
        v.numero_vuelo, v.origen, v.destino, v.hora,
        a.codigo AS avion_codigo, a.tipo AS avion_tipo, a.base AS avion_base,
        p.codigo AS piloto_codigo, p.nombre AS piloto_nombre, p.horas_vuelo AS piloto_horas_vuelo, p.base AS piloto_base,
        t.codigo AS tripulacion_codigo, t.nombre AS tripulacion_nombre, t.base AS tripulacion_base
    FROM vuelos v
    LEFT JOIN aviones a ON v.avion_id = a.id
    LEFT JOIN pilotos p ON v.piloto_id = p.id
    LEFT JOIN vuelo_tripulacion vt ON v.id = vt.vuelo_id
    LEFT JOIN tripulacion t ON vt.tripulacion_id = t.id;
";

// Ejecutar la consulta
$result = $database->conn->query($query);

// Verificar si la consulta fue exitosa
if (!$result) {
    die("Error en la consulta: " . $database->conn->error);
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Vuelos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background-color: white;
            margin-bottom: 40px;
        }
        thead {
            background-color: #2c3e50;
            color: white;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #e0e0e0;
        }
        /* Styling for alternating rows */
        tbody tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        tbody tr:hover {
            background-color: #e6f2ff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Lista de Vuelos</h2>

        <!-- Tabla de Vuelos -->
        <h3>Vuelos</h3>
        <table>
            <thead>
                <tr>
                    <th>Número de Vuelo</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Hora</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $result->fetch_assoc()): ?>
                <tr>
                    <td><?= htmlspecialchars($row['numero_vuelo']) ?></td>
                    <td><?= htmlspecialchars($row['origen']) ?></td>
                    <td><?= htmlspecialchars($row['destino']) ?></td>
                    <td><?= htmlspecialchars($row['hora']) ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <!-- Tabla de Aviones -->
        <h3>Aviones</h3>
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Base</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                    // Reset the result pointer to fetch airplane-related data
                    $result->data_seek(0);
                    while ($row = $result->fetch_assoc()):
                ?>
                <tr>
                    <td><?= htmlspecialchars($row['avion_codigo']) ?></td>
                    <td><?= htmlspecialchars($row['avion_tipo']) ?></td>
                    <td><?= htmlspecialchars($row['avion_base']) ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <!-- Tabla de Pilotos -->
        <h3>Pilotos</h3>
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Horas de Vuelo</th>
                    <th>Base</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                    // Reset the result pointer to fetch pilot-related data
                    $result->data_seek(0);
                    while ($row = $result->fetch_assoc()):
                ?>
                <tr>
                    <td><?= htmlspecialchars($row['piloto_codigo']) ?></td>
                    <td><?= htmlspecialchars($row['piloto_nombre']) ?></td>
                    <td><?= htmlspecialchars($row['piloto_horas_vuelo']) ?></td>
                    <td><?= htmlspecialchars($row['piloto_base']) ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <!-- Tabla de Tripulación -->
        <h3>Tripulación</h3>
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Base</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                    // Reset the result pointer to fetch crew-related data
                    $result->data_seek(0);
                    while ($row = $result->fetch_assoc()):
                ?>
                <tr>
                    <td><?= htmlspecialchars($row['tripulacion_codigo']) ?></td>
                    <td><?= htmlspecialchars($row['tripulacion_nombre']) ?></td>
                    <td><?= htmlspecialchars($row['tripulacion_base']) ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

    </div>
</body>
</html>

<?php 
// Cierra la conexión
$database->conn->close(); 
?>