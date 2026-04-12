window.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = formLogin.querySelector("#user").value.trim();
        const pass = formLogin.querySelector("#pass").value.trim();
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
        span.style.color = respuesta.login ? "#1f6b3b" : "#7a1f1f";

        if(respuesta.login){
            setTimeout(() => {
                window.location.href = "/menu";
            }, 500);
        }
        
    });
});