let idx = 0;

window.addEventListener("DOMContentLoaded", async () => {
	const idPedido = window.location.pathname.split("/")[2];

	const pedidoId = await traerPedidoPorId(idPedido);
	const message = document.getElementById("message");
	const infoC = document.getElementById("info-cliente");
	const virt = document.getElementById("virtual");
	const form = document.getElementById("formulario");
	const msj = document.getElementById("mensaje");

	msj.style.display = "none";

	infoC.textContent = `Cliente: ${pedidoId.nombre}, ${pedidoId.apellido} - DNI: ${pedidoId.dni}`;

	document.getElementById("agregar").addEventListener("click", () => {
		agregarForm();
	});

	virt.addEventListener("click", (e) => {
		const btn = e.target.closest(".btn-quitar");
		if (!btn) {
			return;
		}

		const bloque = btn.closest(".pedido");
		if (!bloque) {
			return;
		}

		bloque.remove();
	});

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const bloques = form.querySelectorAll(".pedido");

		if (bloques.length < 1) {
			alert("Debe cargar al menos 1 producto");
			return;
		}

		let pedido = [];

		bloques.forEach((bloque) => {
			const producto = bloque.querySelector(".producto").value.trim();
			const cant = bloque.querySelector(".cant").value;
			const precio = bloque.querySelector(".precio").value;

			pedido.push({ producto, precio, cant});
		});

		try {
			const env = await fetch(`/agregar/${idPedido}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(pedido)
			});

			const respuesta = await env.json();
			console.log(respuesta);

			message.textContent = respuesta.message;
			message.style.color = respuesta.ok ? "#1f6b3b" : "#7a1f1f";

			setTimeout(() => {
				message.textContent = "";
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.log("ERROR AL ENVIAR PEDIDO: " + error);
			message.textContent = "Ocurrió un error al guardar los cambios.";
			message.style.color = "#7a1f1f";
			return;
		}
	});

	agregarForm();
});

async function traerPedidoPorId(id) {
	const respuesta = await fetch(`/traerPorId/${id}`);
	const pedido = await respuesta.json();
	return pedido;
}

function agregarForm() {
	const virt = document.getElementById("virtual");

	const bloque = document.createElement("div");
	bloque.className = "pedido bg-agregar-pedido";
	bloque.dataset.index = idx;

	const pedidoHeader = document.createElement("div");
	pedidoHeader.className = "bg-agregar-pedido-head";

	const h5 = document.createElement("h5");
	h5.textContent = `Producto adicional ${idx + 1}`;
	h5.className = "bg-agregar-pedido-title";

	const btnQuitar = document.createElement("button");
	btnQuitar.type = "button";
	btnQuitar.className = "bg-agregar-remove btn-quitar";
	btnQuitar.textContent = "Quitar";

	pedidoHeader.append(h5, btnQuitar);

	const divProd = document.createElement("div");
	divProd.className = "bg-agregar-field";

	const labelProd = document.createElement("label");
	labelProd.className = "bg-agregar-label";
	labelProd.textContent = "Producto";

	const inputProd = document.createElement("input");
	inputProd.type = "text";
	inputProd.className = "producto bg-agregar-input";
	inputProd.required = true;
	inputProd.placeholder = "Ej: Calza deportiva negra";

	divProd.append(labelProd, inputProd);

	const divCant = document.createElement("div");
	divCant.className = "bg-agregar-field";

	const labelCant = document.createElement("label");
	labelCant.className = "bg-agregar-label";
	labelCant.textContent = "Cantidad";

	const selectCant = document.createElement("select");
	selectCant.className = "cant bg-agregar-select";

	const opciones = [
		{ texto: "Media docena", valor: 6 },
		{ texto: "Docena", valor: 12 },
		{ texto: "2 Docenas", valor: 24 },
		{ texto: "3 Docenas", valor: 36 },
		{ texto: "4 Docenas", valor: 48 },
		{ texto: "5 Docenas", valor: 60 },
		{ texto: "6 Docenas", valor: 72 },
		{ texto: "7 Docenas", valor: 84 },
		{ texto: "8 Docenas", valor: 96 },
		{ texto: "9 Docenas", valor: 108 },
		{ texto: "10 Docenas", valor: 120 }
	];

	opciones.forEach((item) => {
		const option = document.createElement("option");
		option.textContent = item.texto;
		option.value = item.valor;
		selectCant.appendChild(option);
	});

	divCant.append(labelCant, selectCant);

	//precio
    const divPrecio = document.createElement("div");
    divPrecio.className = "bg-cargar-field";

    const labelPrecio = document.createElement("label");
	labelPrecio.className = "bg-cargar-label";
	labelPrecio.textContent = "Precio";

    const inputPrecio = document.createElement("input");
	inputPrecio.type = "number";
	inputPrecio.className = "precio bg-cargar-input";
	inputPrecio.placeholder = "Valor de la docena.";

	divPrecio.append(labelPrecio, inputPrecio);

	bloque.append(pedidoHeader, divProd, divPrecio, divCant);
	virt.appendChild(bloque);

	idx++;
}
