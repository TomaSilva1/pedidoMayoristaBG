import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { cargarCliente, traerClientePorId, traerClientes } from "../services/clientes.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function traerFormCliente(req, res){
    res.sendFile(join(__dirname, "../views/public/cliente/cliente.html"));
}

export async function guardaCliente(req, res){
    const { nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, idEmpresa } = req.body;

    //console.log(nombre +" "+ apellido+ " "+telefono + " " +dni+" "+provincia+" "+localidad+" "+codigoP+" "+direccion+" "+idEmpresa);

    const resultado = await cargarCliente(nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, idEmpresa);

    if (resultado == 500) {
        return res.json({message: "Error del servidor, intentelo de nuevo mas tarde."});
    }

    if(resultado == 200){
        return res.json({message: "La operación se realizo con exito! En breve nos comunicaremos contigo.", reload: true});
    }

    return res.json({message: "Error desconocido, por favor intente de nuevo mas tarde."});
}

export async function enviarClientes(req, res){
    try {
        const resultado = await traerClientes();

        res.json(resultado);
        return;
    } catch (error) {
        console.error("Error en el controller de enviar clientes: "+ error);
        res.status(500);
        return;
    }
}

export async function enviarClientePorId(req, res){
    const id = req.params.id;

    try {
        const cliente = await traerClientePorId(id);

        return res.json(cliente);
    } catch (error) {
        console.error("Error en el controller traer cliente por id: "+error);
        return res.status(500);
    }
    
}