window.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = formLogin.querySelector("#user").value;
        const pass = formLogin.querySelector("#pass").value;
        const span = formLogin.querySelector("#message");

        const res = await fetch("/entrar", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                user: user,
                pass: pass
            })
        });

        const respuesta = await res.json();

        span.textContent = respuesta.message;

        if(respuesta.login){
            window.location.href = "/menu";
        }
        
    });
});