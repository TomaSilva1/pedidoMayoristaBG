import pool from "../DB/db.js";
import bcrypt from "bcrypt";

async function traerUsuario(user){
    /*
    claves de error: 
    404: usuario no encontrado
    500: error interno
    */

    try {
        const res = await pool.query("SELECT usuario, contrasenia FROM usuario WHERE usuario = $1", [user]);
        if (res.rows.length > 0) {
            return res.rows[0];
        }else{
            return 404;
        }
    } catch (error) {
        console.error("Error en la funcion de traer usuario: "+ error);
        return 500;      
    }
};

export async function registrarUsuario(user, pass, nombre, apellido, telefono, mail){
    /*
    claves errores:
    500: error interno.
    601: el usuario ya existe
    */

    if (await traerUsuario(user) == 500) {
        return 500;
    }

    if (await traerUsuario(user) != 404) {
        return 601; //usuario ya existe
    }

    try {
        //hasheamos la contra
        const hash = await bcrypt.hash(pass, 10);

        const res = await pool.query("INSERT INTO usuario (usuario, contrasenia, nombre, apellido, telefono, mail) VALUES ($1, $2, $3, $4, $5, $6)", [user, hash, nombre, apellido, telefono, mail]);

        if (res.rowCount > 0) {
            return 200;
        }else{
            return 500;
        }

    } catch (error) {
        console.error("Error al registrar usuario: "+ error.message);
        return 500;
    }
}

export async function login(user, pass){
    try {
        const res = await traerUsuario(user);

        if (res == 500) {
            return res;
        }

        if (res == 404) {
            return res;
        }

        const coincide = await bcrypt.compare(pass, res.contrasenia);

        if (coincide) {
            return 200;
        }else{
            return 600; //contra inconrrecta.
        }

    } catch (error) {
        console.error("Error interno al logear: "+error.message);
        return 500;
    }
}