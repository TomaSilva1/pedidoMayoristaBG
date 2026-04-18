const { jsPDF } = window.jspdf;

window.addEventListener("DOMContentLoaded", async () => {
	const sectionPedidos = document.getElementById("list-pedidos");
	await renderPendientes(sectionPedidos);
});

async function renderPendientes(sectionPedidos) {
	const respuesta = await fetch("/listPendientes");
	const pedidos = await respuesta.json();

	if (!pedidos || pedidos.length === 0) {
		sectionPedidos.innerHTML = `
			<article class="bg-pedidos-empty">
				<h3 class="bg-pedidos-empty-title">No hay pedidos pendientes</h3>
				<p class="bg-pedidos-empty-text">Cuando se carguen nuevos pedidos, aparecerán aquí.</p>
			</article>
		`;
		return;
	}

	let cliente = {
		"idcliente": pedidos[0].idcliente,
		"id_pedido": pedidos[0].id_pedido,
		"nombre": pedidos[0].nombre,
		"apellido": pedidos[0].apellido,
		"estado": pedidos[0].finalizado,
		"pedidos": []
	};

	let objeto = [];

	objeto.push(cliente);
	objeto[0].pedidos.push(pedidos[0]);

	let x = 0;
	for (let i = 1; i < pedidos.length; i++) {
		if (pedidos[i].idcliente == objeto[x].idcliente && pedidos[i].id_pedido == objeto[x].id_pedido) {
			objeto[x].pedidos.push(pedidos[i]);
		} else {
			cliente = {
				"idcliente": pedidos[i].idcliente,
				"id_pedido": pedidos[i].id_pedido,
				"nombre": pedidos[i].nombre,
				"apellido": pedidos[i].apellido,
				"estado": pedidos[i].finalizado,
				"pedidos": []
			};
			objeto.push(cliente);
			x++;
			objeto[x].pedidos.push(pedidos[i]);
		}
	}

	sectionPedidos.innerHTML = "";

	for (const ped of objeto) {
		const article = document.createElement("article");
		article.className = "pedido-art bg-pedidos-card";

		const cardHead = document.createElement("div");
		cardHead.className = "bg-pedidos-card-head";

		const h4 = document.createElement("h4");
		h4.className = "bg-pedidos-card-title";
		h4.textContent = `${ped.nombre}, ${ped.apellido}`;

		const nroPed = document.createElement("span");
		nroPed.className = "bg-pedidos-card-id";
		nroPed.textContent = `Pedido nro: ${ped.id_pedido}`;

		cardHead.append(h4, nroPed);

		const body = document.createElement("div");
		body.className = "bg-pedidos-card-body";

		for (const detalle of ped.pedidos) {
			const item = document.createElement("div");
			item.className = "bg-pedidos-item";

			const producto = document.createElement("span");
			producto.className = "bg-pedidos-item-producto";
			producto.textContent = `Producto: ${detalle.producto}`;

			let cant = "";

			switch (detalle.cantidad) {
				case 6:
					cant = "Media Docena";
					break;
				case 12:
					cant = "1 Docena";
					break;
				case 24:
					cant = "2 Docenas";
					break;
				case 36:
					cant = "3 Docenas";
					break;
				case 48:
					cant = "4 Docenas";
					break;
				case 60:
					cant = "5 Docenas";
					break;
				case 72:
					cant = "6 Docenas";
					break;
                case 84:
					cant = "7 Docenas";
					break;
                case 96:
					cant = "8 Docenas";
					break;
                case 108:
					cant = "9 Docenas";
					break;
                case 120:
					cant = "10 Docenas";
					break;    
				default:
					cant = detalle.cantidad;
					break;
			}

			const cantidad = document.createElement("span");
			cantidad.className = "bg-pedidos-item-cantidad";
			cantidad.textContent = `Cantidad: ${cant}`;

			item.append(producto, cantidad);
			body.append(item);
		}

		const footer = document.createElement("div");
		footer.className = "bg-pedidos-card-footer";

		const estadoWrap = document.createElement("div");
		estadoWrap.className = "bg-pedidos-estado-wrap";

		const estado = document.createElement("span");
		estado.className = "bg-pedidos-estado";
		estado.textContent = `Estado: ${ped.estado}`;

		const select = document.createElement("select");
		select.className = "bg-pedidos-select";

		const option1 = document.createElement("option");
		option1.textContent = "Cambiar estado";
		option1.disabled = true;
		option1.selected = true;

		const option2 = document.createElement("option");
		option2.textContent = "Pendiente";
		option2.value = "pendiente";

		const option3 = document.createElement("option");
		option3.textContent = "Despachado";
		option3.value = "despachado";

		const option4 = document.createElement("option");
		option4.textContent = "Cancelado";
		option4.value = "cancelado";

		select.addEventListener("change", async (e) => {
			try {
				await fetch("/cambiarEstado", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						"id": ped.id_pedido,
						"nuevoEstado": e.target.value
					})
				});

				renderPendientes(sectionPedidos);
			} catch (error) {
				console.log("Error al enviar cambio de estado: " + error);
				return;
			}
		});

		const acciones = document.createElement("div");
		acciones.className = "bg-pedidos-actions";

		const agregar = document.createElement("button");
		agregar.className = "bg-pedidos-btn bg-pedidos-btn-secondary";
		agregar.textContent = "+ Agregar";
		agregar.addEventListener("click", () => {
			window.location.href = `/agregar/${ped.id_pedido}`;
		});

		const pdf = document.createElement("button");
		pdf.className = "bg-pedidos-btn bg-pedidos-btn-primary";
		pdf.textContent = "Crear PDF";
		pdf.addEventListener("click", () => {
			crearPDF(ped);
		});

		select.append(option1, option3, option4);
		estadoWrap.append(estado, select);
		acciones.append(agregar, pdf);
		footer.append(estadoWrap, acciones);

		article.append(cardHead, body, footer);
		sectionPedidos.append(article);
	}
}

async function crearPDF(pedido) {
	const doc = new jsPDF();

	const respuesta = await fetch(`/venta/traerCliente/${pedido.idcliente}`);
	const cliente = await respuesta.json();

	doc.setFontSize(16);
	doc.text("Detalle del pedido", 20, 20);

	doc.setFontSize(12);
	doc.text(`Fecha:__/__/____`, 20, 40);
	doc.text(`Nro Pedido: ${pedido.id_pedido}`, 20, 50);
	doc.text("________________________________________________", 20, 60);
	doc.text(`Cliente`, 20, 75);
	doc.text(`Nombre: ${cliente.nombre}, ${cliente.apellido}`, 20, 85);
	doc.text(`Telefono: ${cliente.telefono}`, 20, 95);
	doc.text("________________________________________________", 20, 105);
	doc.text(`Envio`, 20, 120);
	doc.text(`${cliente.empresa}`, 20, 130);
	doc.text(`Sucursarl / direccion`, 20, 140);
	doc.text(`${cliente.direccion || "Sin asignar"}`, 20, 145);
	doc.text(`Provincia: ${cliente.provincia}`, 20, 155);
	doc.text(`Localidad: ${cliente.localidad}`, 20, 165);
	doc.text(`Codigo postal: ${cliente.codigop}`, 20, 175);
	doc.text(`DNI: ${cliente.dni || "Sin asignar"}`, 20, 185);
	doc.text("________________________________________________", 20, 195);
	doc.text(`Pedido`, 20, 205);

	let i = 1, total = 0, y = 215;
	for (const ped of pedido.pedidos) {
		if(ped.precio != null) total += parseFloat(ped.precio);
			else ped.precio = "Sin cargar";
		if (y > 280) {
			doc.addPage();
			y = 20;
			doc.text(`pedido nro: ${pedido.id_pedido}`, 20, y);
			y += 10;
		}
		doc.text(`${i} - Producto: ${ped.producto} | Precio: $${ped.precio} | Cantidad: ${ped.cantidad}`, 20, y);
		y += 10;
		i++;
	}
	doc.text(`PEDIDOS: ${i - 1}`, 20, y + 5);
	doc.text(`TOTAL: $${total}`, 20, y + 10);
	doc.addPage();
	y = 20;
	doc.setFontSize(18);
	doc.text(`! CONTROL DE ARMADO ! (pedido nro: ${pedido.id_pedido})`, 20, y);

	y += 15;
	doc.setFontSize(16);
	doc.text(`[_] Armé cada producto por separado`, 20, y);
	y += 10;
	doc.text(`[_] Conté cada bloque (12 / 6)`, 20, y);
	y += 10;
	doc.text(`[_] No mesclé productos`, 20, y);
	y += 10;
	doc.text(`[_] Coincide con el pedido`, 20, y);
	y += 15;
	doc.text(`! CONTROL FINAL (ANTES DE CERRAR) !`, 20, y);
	y += 15;
	doc.text(`[_] Reconté todo`, 20, y);
	y += 10;
	doc.text(`[_] Total final correcto`, 20, y);
	y += 10;
	doc.text(`[_] Nada faltante`, 20, y);
	y += 15;
	doc.text(`FINAL`, 20, y);
	y += 15;
	doc.text(`[_] Foto del pedido antes de cerrar`, 20, y);
	y += 10;
	doc.text(`[_] Bolsa cerrada correctamente`, 20, y);
	y += 10;
	doc.text(`[_] Etiqueta correcta pegada`, 20, y);
	y += 10;
	doc.text(`[_] Datos de envío verificados`, 20, y);
	y += 30;
	doc.text(`Armado por: _____________`, 20, y);
	y += 12;
	doc.text(`Control final: ______________`, 20, y);

	doc.save(`pedido-${pedido.id_pedido}.pdf`);
}