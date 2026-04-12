let idx = 0;

window.addEventListener("DOMContentLoaded", async () => {
    
    const idPedido = window.location.pathname.split("/")[2];
    
    const pedidoId =  await traerPedidoPorId(idPedido);
    const message = document.getElementById("message");
    console.log(pedidoId);

    const infoC = document.getElementById("info-cliente");
    infoC.textContent = `Cliente: ${pedidoId.nombre}, ${pedidoId.apellido} - DNI: ${pedidoId.dni}`;

    const virt = document.getElementById("virtual");
    //const check = document.getElementsByClassName("media");
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

            pedido.push({producto, cant});
        });

        //const payload = [];
        //payload.push(cliente, pedido);

        console.log(pedido);

        try {
            const env = await fetch(`/agregar/${idPedido}`, {
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
            return;
        }
    });

    agregarForm();
    
});

async function traerPedidoPorId(id){
    const respuesta = await fetch(`/traerPorId/${id}`);
    const pedido = await respuesta.json();

    return pedido;
}

function agregarForm() {
    const virt = document.getElementById("virtual");
    const hr = document.createElement("hr");
    const h5 = document.createElement("h5");
    h5.textContent = "Pedido";
    h5.className = "text-center";

    const bloque = document.createElement("div");
    bloque.className = "pedido border rounded p-3 mb-3";
    bloque.dataset.index = idx;

    //Producto
    const divProd = document.createElement("div");
    divProd.className = "mb-3";

    const labelProd = document.createElement("label");
    labelProd.className = "form-label";
    labelProd.textContent = "Producto: "

    const inputProd = document.createElement("input");
    inputProd.type = "text";
    inputProd.className = "producto form-control border-secondary shadow-sm";
    inputProd.required = true;


    //new Cant
    const divNewCant = document.createElement("div");
    
    const labelCant = document.createElement("label");
    labelCant.textContent = "Cantidad: ";

    const selectCant = document.createElement("select");
    selectCant.className = "cant";

    const option6 = document.createElement("option");
    const option12 = document.createElement("option");
    const option24 = document.createElement("option");
    const option36 = document.createElement("option");
    const option48 = document.createElement("option");
    const option60 = document.createElement("option");
    const option72 = document.createElement("option");

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


    selectCant.append(option6, option12, option24, option36, option48, option60, option72);
    divNewCant.append(labelCant, selectCant);

    //quitar
    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "btn btn-outline-danger btn-sm btn-quitar";
    btnQuitar.textContent = "Quitar";

    divProd.appendChild(labelProd);
    divProd.appendChild(inputProd);

    bloque.append(h5, divProd, divNewCant, btnQuitar,hr);
    virt.appendChild(bloque);

    idx++;
}