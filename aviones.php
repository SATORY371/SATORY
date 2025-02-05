<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sky Voyager Database Management</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body class="bg-gray-100">
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

class DatabaseManager {
    private $connection;

    public function __construct() {
        $host = 'localhost';
        $username = 'root';
        $password = '';
        $database = 'sky_voyager';
        $port = 3307;

        try {
            $this->connection = new mysqli($host, $username, $password, $database, $port);
            
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }
        } catch (Exception $e) {
            die("Database Connection Error: " . $e->getMessage());
        }
    }

    public function getTables() {
        try {
            $query = "SHOW TABLES";
            $result = $this->connection->query($query);
            
            if (!$result) {
                throw new Exception("Error fetching tables: " . $this->connection->error);
            }
            
            $tables = [];
            while ($row = $result->fetch_array()) {
                $tables[] = $row[0];
            }
            
            return $tables;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return [];
        }
    }

    public function getTableData($tableName) {
        try {
            $tableName = $this->connection->real_escape_string($tableName);
            
            $columnQuery = "SHOW COLUMNS FROM `$tableName`";
            $columnResult = $this->connection->query($columnQuery);
            
            if (!$columnResult) {
                throw new Exception("Error fetching columns: " . $this->connection->error);
            }
            
            $columns = [];
            while ($columnRow = $columnResult->fetch_assoc()) {
                $columns[] = $columnRow['Field'];
            }
            
            $query = "SELECT * FROM `$tableName`";
            $result = $this->connection->query($query);
            
            if (!$result) {
                throw new Exception("Error fetching data: " . $this->connection->error);
            }
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            
            return ['columns' => $columns, 'data' => $data];
        } catch (Exception $e) {
            echo "Error in getTableData: " . $e->getMessage();
            return ['columns' => [], 'data' => []];
        }
    }

    public function insertRecord($tableName, $data) {
        try {
            $tableName = $this->connection->real_escape_string($tableName);
            
            $columns = implode('`, `', array_keys($data));
            $values = array_map([$this->connection, 'real_escape_string'], array_values($data));
            $valuesString = implode("', '", $values);
            
            $query = "INSERT INTO `$tableName` (`$columns`) VALUES ('$valuesString')";
            
            if ($this->connection->query($query)) {
                return true;
            } else {
                throw new Exception("Error inserting record: " . $this->connection->error);
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function deleteRecord($tableName, $primaryKey, $value) {
        try {
            $tableName = $this->connection->real_escape_string($tableName);
            $primaryKey = $this->connection->real_escape_string($primaryKey);
            $value = $this->connection->real_escape_string($value);
            
            $query = "DELETE FROM `$tableName` WHERE `$primaryKey` = '$value'";
            
            if ($this->connection->query($query)) {
                return true;
            } else {
                throw new Exception("Error deleting record: " . $this->connection->error);
            }
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    public function __destruct() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
}

// Process form submissions
$manager = new DatabaseManager();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $deleteResult = $manager->deleteRecord($_POST['table'], $_POST['primaryKey'], $_POST['value']);
        echo $deleteResult ? "Registro eliminado" : "Error al eliminar";
        exit;
    }
    
    if (isset($_POST['action']) && $_POST['action'] === 'add') {
        $tableData = $manager->getTableData($_POST['table']);
        $insertData = [];
        
        foreach ($tableData['columns'] as $column) {
            if (isset($_POST[$column]) && $_POST[$column] !== '') {
                $insertData[$column] = $_POST[$column];
            }
        }
        
        $insertResult = $manager->insertRecord($_POST['table'], $insertData);
        echo $insertResult ? "Registro agregado" : "Error al agregar";
        exit;
    }
}

$tables = $manager->getTables();
?>

<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">Sky Voyager Database Management</h1>
    
    <?php if (empty($tables)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            No se encontraron tablas en la base de datos.
        </div>
    <?php else: ?>
        <?php foreach ($tables as $table): ?>
            <div class="bg-white shadow-md rounded-lg mb-6">
                <div class="bg-blue-100 p-4 rounded-t-lg flex justify-between items-center">
                    <h2 class="text-2xl font-semibold text-blue-800"><?php echo htmlspecialchars($table); ?> Table</h2>
                    <button onclick="showAddModal('<?php echo $table; ?>')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Agregar Registro
                    </button>
                </div>
                
                <?php 
                $tableData = $manager->getTableData($table);
                if (!empty($tableData['data'])): 
                ?>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-200">
                                <tr>
                                    <?php foreach ($tableData['columns'] as $column): ?>
                                        <th class="p-3 text-left"><?php echo htmlspecialchars(ucfirst($column)); ?></th>
                                    <?php endforeach; ?>
                                    <th class="p-3 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($tableData['data'] as $row): ?>
                                    <tr class="border-b">
                                        <?php foreach ($tableData['columns'] as $column): ?>
                                            <td class="p-3"><?php echo htmlspecialchars($row[$column]); ?></td>
                                        <?php endforeach; ?>
                                        <td class="p-3">
                                            <button onclick="deleteRecord('<?php echo $table; ?>', '<?php echo $tableData['columns'][0]; ?>', '<?php echo $row[$tableData['columns'][0]]; ?>')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p class="p-4 text-gray-600">No hay registros en esta tabla.</p>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<!-- Modal for Adding Records -->
<div id="addModal" class="fixed z-10 inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form id="addRecordForm" method="POST" class="p-6">
                <input type="hidden" name="action" value="add">
                <input type="hidden" id="modalTableName" name="table" value="">
                <div id="dynamicFields" class="space-y-4"></div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                    <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Agregar
                    </button>
                    <button type="button" onclick="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function showAddModal(tableName) {
    const modal = document.getElementById('addModal');
    const dynamicFields = document.getElementById('dynamicFields');
    const tableNameInput = document.getElementById('modalTableName');
    
    // Reset previous fields
    dynamicFields.innerHTML = '';
    tableNameInput.value = tableName;
    
    // Dynamically create input fields based on table columns
    <?php foreach ($tables as $table): ?>
        if (tableName === '<?php echo $table; ?>') {
            <?php 
            $tableData = $manager->getTableData($table);
            foreach ($tableData['columns'] as $column): 
            ?>
                const <?php echo $column; ?>Field = document.createElement('div');
                <?php echo $column; ?>Field.innerHTML = `
                    <label class="block text-sm font-medium text-gray-700"><?php echo ucfirst($column); ?></label>
                    <input type="text" name="<?php echo $column; ?>" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200">
                `;
                dynamicFields.appendChild(<?php echo $column; ?>Field);
            <?php endforeach; ?>
        }
    <?php endforeach; ?>
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
}

function deleteRecord(table, primaryKey, value) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=delete&table=${table}&primaryKey=${primaryKey}&value=${value}`
            })
            .then(response => response.text())
            .then(result => {
                if (result === "Registro eliminado") {
                    Swal.fire(
                        'Eliminado',
                        'El registro ha sido eliminado.',
                        'success'
                    ).then(() => location.reload());
                } else {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar el registro.',
                        'error'
                    );
                }
            });
        }
    });
}

document.getElementById('addRecordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch('', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === "Registro agregado") {
            Swal.fire(
                'Agregado',
                'El registro ha sido agregado.',
                'success'
            ).then(() => location.reload());
            closeModal();
        } else {
            Swal.fire(
                'Error',
                'No se pudo agregar el registro.',
                'error'
            );
        }
    });
});
</script>
</body>
</html>