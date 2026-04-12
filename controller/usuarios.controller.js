import { registrarUsuario, login } from "../services/usuarios.service.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function paginaLogin(req, res){
    res.sendFile(join(__dirname, "../views/public/login/login.html"));
};

export async function registrarController(req, res) {
    const {user, pass, nombre, apellido, telefono, mail} = req.body;

    const resultado = await registrarUsuario(user, pass, nombre, apellido, telefono, mail);

    if (resultado == 500) {
        res.json({message: "Error del servidor"});
        return;
    }

    if(resultado == 601) {
        res.json({message: "El usuario ya existe"});
        return;
    }

    if(resultado == 200){
        res.json({message: "Usuario creado con exito"});
        return;
    }

    res.json({message: "Error desconocido"});
}

export async function entrar(req, res){
    const { user, pass } = req.body;

    const resultado = await login(user, pass);

    if(resultado == 500){
        return res.json({message: "Error del servidor", login: false});
    }

    if(resultado == 404){
        return res.json({message: "Usuario o contraseña incorrectos", login: false});
    }

    if(resultado == 600){
        return res.json({message: "Usuario o contraseña incorrectos", login: false});
    }

    if (resultado == 200) {

        req.session.login = true;

        return res.json({message: "Logueado con exito", login: true});
    }

    return res.json({message: "Error desconocido", login: false});
}