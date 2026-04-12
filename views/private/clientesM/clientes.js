window.addEventListener("DOMContentLoaded", () => {

    renderizarTabla();
});

async function renderizarTabla(){
    const table = document.getElementById("table");

    const clientes = await traerClientes();

    for (const cliente of clientes) {
        const tr = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = cliente.nombre;

        const apellido = document.createElement("td");
        apellido.textContent = cliente.apellido;

        const telefono = document.createElement("td");
        telefono.textContent = cliente.telefono;

        const dni = document.createElement("td");
        dni.textContent = cliente.dni;

        const provincia = document.createElement("td");
        provincia.textContent = cliente.provincia;

        const localidad = document.createElement("td");
        localidad.textContent = cliente.localidad;

        const codigoP = document.createElement("td");
        codigoP.textContent = cliente.codigop;

        const direccion = document.createElement("td");
        direccion.textContent = cliente.direccion;

        const envio = document.createElement("td");
        envio.textContent = cliente.empresa;

        const config = document.createElement("td");
        //botones
        const cargarPedido = document.createElement("button");
        cargarPedido.textContent = "Cargar";
        cargarPedido.addEventListener("click", () => {
            window.location.href = `/venta/cargar/${cliente.idcliente}`;
        });

        const editar = document.createElement("button");
        editar.textContent = "Configurar";

        config.append(cargarPedido, editar);

        tr.append(nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, envio, config);
        table.appendChild(tr);
    }
}

async function traerClientes(){
    try {
        const resultado = await fetch("/venta/traerClientes");
        const clientes = await resultado.json();

        return clientes;
    } catch (error) {
        console.error("Error del sistema");
        return;
    }
}