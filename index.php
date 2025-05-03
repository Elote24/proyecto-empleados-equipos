<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Empleados y Equipos</title>
    <link rel="stylesheet" href="assets/libs/Bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/principal.css">

</head>
<body>

<div class="sidebar">
    <h3 onclick="mostrarBienvenida()">Gestión</h3> 
    <a href="#" onclick="cargarPagina('empleados/frm_Empleados.php')">🧑‍💼 Empleados</a>
    <a href="#" onclick="cargarPagina('equipos/frm_Equipos.php')">💻 Equipos</a>
</div>


    <div class="content">
        <iframe id="contenido"></iframe>
        <div id="mensajeBienvenida">
            
            <h2>Bienvenido a la Gestión de Empleados y Equipos</h2>
            <p>Seleccione una opción en el menú para comenzar.</p>
            <img src="assets/img/Logo.png" alt="Logo Impulsora" class="logo">
        </div>
    </div>

   <script src="assets/js/principal.js"></script>

</body>
</html>
