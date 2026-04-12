window.addEventListener("DOMContentLoaded", () => {
    const formCliente = document.getElementById("form-cliente");

    mandarForm(formCliente);
});

//mandar formulario
function mandarForm(formCliente) {
        formCliente.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = formCliente.querySelector("#nom").value;
        const apellido = formCliente.querySelector("#ape").value;
        const telefono = formCliente.querySelector("#tele").value;
        const dni = formCliente.querySelector("#DNI").value;
        const provincia = formCliente.querySelector("#provincia").value;
        const localidad = formCliente.querySelector("#localidad").value;
        const codigoP = formCliente.querySelector("#cp").value;
        const direccion = formCliente.querySelector("#dire").value;
        const idEmpresa = formCliente.querySelector("#metodo-e").value;
        const span = formCliente.querySelector("#text");

        if(!Number(idEmpresa)){
            alert("Debe seleccionar un metodo de envio");
            return;
        }

        const objeto = {
            "nombre": nombre,
            "apellido": apellido,
            "telefono": telefono,
            "dni": dni,
            "provincia": provincia,
            "localidad": localidad,
            "codigoP": codigoP,
            "direccion": direccion,
            "idEmpresa": idEmpresa
        }

        console.log(objeto);

        const res = await fetch("/venta/guardar", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(objeto)
        });

        const text = await res.json();
        
        span.textContent = text.message;

        if (text.reload) {
            alert("REDIRIGIR?");
        }
    });
}