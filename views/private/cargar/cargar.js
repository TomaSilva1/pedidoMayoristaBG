let idx = 0;

window.addEventListener("DOMContentLoaded", async () => {
    
    const idCliente = window.location.pathname.split("/")[3];
    
    const cliente =  await traerClientePorId(idCliente);
    const message = document.getElementById("message");

    const infoC = document.getElementById("info-cliente");
    infoC.textContent = `Cliente: ${cliente.nombre}, ${cliente.apellido} - DNI: ${cliente.dni}`;

    const virt = document.getElementById("virtual");
    const check = document.getElementsByClassName("media");
    const form = document.getElementById("formulario");
    const msj = document.getElementById("mensaje");
    msj.style.display = "none";

    document.getElementById("agregar").addEventListener("click", (e) => {
        agregarForm();
    });

    //bloque que se genera al apretar el boton: "virt"
    virt.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-quitar");
        if(!btn){
            return;
        }
        const bloque = btn.closest(".pedido");
        if(!bloque){
            return;
        }
        bloque.remove();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const bloques = form.querySelectorAll(".pedido");
        //const cliente = form.querySelector(".cliente").value;

        if(bloques.length < 1){
            alert("Debe cargar al menos 1 pedido");
            return;
        }

        let pedido = [];

        bloques.forEach(bloque => {
            const producto = bloque.querySelector(".producto").value;
            const cant = bloque.querySelector(".cant").value;
            const precio = bloque.querySelector(".precio").value;

            pedido.push({producto, precio, cant});
        });

        //const payload = [];
        //payload.push(cliente, pedido);

        console.log(pedido);

        try {
            const env = await fetch(`/cargar/${idCliente}`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(pedido)
            });

            const respuesta = await env.json();
            console.log(respuesta);
            message.textContent = respuesta.message;
            setTimeout(() => {
                message.textContent = "";
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.log("ERROR AL ENVIA PEDIDO: "+error);
            message.textContent = "Ocurrió un error al enviar el pedido.";
			message.style.color = "#7a1f1f";
            return;
        }
    });

    agregarForm();
    
});

async function traerClientePorId(id){
    const respuesta = await fetch(`/venta/traerCliente/${id}`);
    const cliente = await respuesta.json();

    return cliente;
}

function agregarForm() {
    const virt = document.getElementById("virtual");
    const hr = document.createElement("hr");
    const h5 = document.createElement("h5");
    h5.textContent = "Pedido";
    h5.className = "bg-cargar-pedido-title";

    const bloque = document.createElement("div");
    bloque.className = "pedido bg-cargar-pedido";
    bloque.dataset.index = idx;

    const pedidoHeader = document.createElement("div");
	pedidoHeader.className = "bg-cargar-pedido-head";

    //Producto
    const divProd = document.createElement("div");
    divProd.className = "bg-cargar-field";

    const labelProd = document.createElement("label");
	labelProd.className = "bg-cargar-label";
	labelProd.textContent = "Producto";

    const inputProd = document.createElement("input");
	inputProd.type = "text";
	inputProd.className = "producto bg-cargar-input";
	inputProd.required = true;
	inputProd.placeholder = "Ej: Top deportivo negro talle M";

	divProd.append(labelProd, inputProd);

    //new Cant
    const divNewCant = document.createElement("div");
    divNewCant.className = "bg-cargar-field";

    const labelCant = document.createElement("label");
	labelCant.className = "bg-cargar-label";
	labelCant.textContent = "Cantidad";

    const selectCant = document.createElement("select");
	selectCant.className = "cant bg-cargar-select";

    const option6 = document.createElement("option");
    const option12 = document.createElement("option");
    const option24 = document.createElement("option");
    const option36 = document.createElement("option");
    const option48 = document.createElement("option");
    const option60 = document.createElement("option");
    const option72 = document.createElement("option");
    const option84 = document.createElement("option");
    const option96 = document.createElement("option");
    const option108 = document.createElement("option");
    const option120 = document.createElement("option");

    option6.textContent = "Media docena";
    option6.value = 6;

    option12.textContent = "Docena";
    option12.value = 12;

    option24.textContent = "2 Docenas";
    option24.value = 24;

    option36.textContent = "3 Docenas";
    option36.value = 36;
    
    option48.textContent = "4 Docenas";
    option48.value = 48;

    option60.textContent = "5 Docenas";
    option60.value = 60;

    option72.textContent = "6 Docenas";
    option72.value = 72;

    option84.textContent = "7 Docenas";
    option84.value = 84;

    option96.textContent = "8 Docenas";
    option96.value = 96;

    option108.textContent = "9 Docenas";
    option108.value = 108;

    option120.textContent = "10 Docenas";
    option120.value = 120;


    selectCant.append(option6, option12, option24, option36, option48, option60, option72, option84, option96, option108, option120);
    divNewCant.append(labelCant, selectCant);

    //precio
    const divPrecio = document.createElement("div");
    divPrecio.className = "bg-cargar-field";

    const labelPrecio = document.createElement("label");
	labelPrecio.className = "bg-cargar-label";
	labelPrecio.textContent = "Precio";

    const inputPrecio = document.createElement("input");
	inputPrecio.type = "number";
	inputPrecio.className = "precio bg-cargar-input";
    inputPrecio.placeholder = "Valor de lo que se carga.";

	divPrecio.append(labelPrecio, inputPrecio);
    
    //quitar
    const btnQuitar = document.createElement("button");
	btnQuitar.type = "button";
	btnQuitar.className = "bg-cargar-remove btn-quitar";
	btnQuitar.textContent = "Quitar";

    pedidoHeader.append(h5, btnQuitar);
    bloque.append(pedidoHeader, divProd, divPrecio, divNewCant);
    virt.appendChild(bloque);

    idx++;
}