window.addEventListener("DOMContentLoaded", () => {

	const buscador = document.getElementById("buscador");
	buscador.addEventListener("input", (e) => {
		renderizarTabla(e.target.value);
	});	

    renderizarTabla();
});

async function renderizarTabla(filtro = ""){
    const table = document.getElementById("table");
    table.innerHTML = "";

    let clientes = await traerClientes();

	if (filtro != "") {
		filtro = filtro.toLocaleLowerCase();
		clientes = clientes.filter(c => c.nombre.toLocaleLowerCase().includes(filtro) || c.apellido.toLocaleLowerCase().includes(filtro) || c.telefono.includes(filtro) || c.dni.includes(filtro));
	}

    if (!clientes || !clientes.length) {
		const tr = document.createElement("tr");
		tr.className = "bg-clientes-empty-row";

		const td = document.createElement("td");
		td.colSpan = 10;
		td.className = "bg-clientes-empty-cell";
		td.textContent = "No hay clientes cargados.";

		tr.appendChild(td);
		table.appendChild(tr);
		return;
	}

    for (const cliente of clientes) {
		const tr = document.createElement("tr");
		tr.className = "bg-clientes-row";

		const nombre = document.createElement("td");
		nombre.textContent = cliente.nombre || "-";

		const apellido = document.createElement("td");
		apellido.textContent = cliente.apellido || "-";

		const telefono = document.createElement("td");
		telefono.textContent = cliente.telefono || "-";

		const dni = document.createElement("td");
		dni.textContent = cliente.dni || "-";

		const provincia = document.createElement("td");
		provincia.textContent = cliente.provincia || "-";

		const localidad = document.createElement("td");
		localidad.textContent = cliente.localidad || "-";

		const codigoP = document.createElement("td");
		codigoP.textContent = cliente.codigop || "-";

		const direccion = document.createElement("td");
		direccion.textContent = cliente.direccion || "-";

		const envio = document.createElement("td");
		envio.textContent = cliente.empresa || "-";

		const config = document.createElement("td");
		config.className = "bg-clientes-actions";

		const cargarPedido = document.createElement("button");
		cargarPedido.textContent = "Cargar";
		cargarPedido.className = "bg-clientes-btn bg-clientes-btn-primary";
		cargarPedido.addEventListener("click", () => {
			window.location.href = `/venta/cargar/${cliente.idcliente}`;
		});

		const editar = document.createElement("button");
		editar.textContent = "Configurar";
		editar.className = "bg-clientes-btn bg-clientes-btn-secondary";

		config.append(cargarPedido);

		tr.append(
			nombre,
			apellido,
			telefono,
			dni,
			provincia,
			localidad,
			codigoP,
			direccion,
			envio,
			config
		);

		table.appendChild(tr);
	}
}

async function traerClientes() {
	try {
		const resultado = await fetch("/venta/traerClientes");
		const clientes = await resultado.json();
		return clientes;
	} catch (error) {
		console.error("Error del sistema");
		return [];
	}
}