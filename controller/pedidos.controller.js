import { agregarPedidoId, buscarPedidoPorId, cambiarEstado, guardarPedido, traerPedidosPendientes } from "../services/pedidos.service.js"

export async function cargarPedido(req, res){
    const id = req.params.id;
    const payload = req.body;

    //console.log("id: "+id);
    //console.log(payload);

    const resultado = await guardarPedido(id, payload);

    if (resultado == 200) {
        res.json({message: "Pedido cargado con exito"});
        return;
    }

    if(resultado == 500){
        res.json({message: "Error interno al cargar el pedido"});
        return;
    }

    res.json({message: "Error desconocido."});
};

export async function cargarPedidoId(req, res){
    const id = req.params.id;
    const payload = req.body;

    const resultado = await agregarPedidoId(id, payload);

    if (resultado == 200) {
        res.json({message: "Pedido cargado con exito"});
        return;
    }

    if(resultado == 500){
        res.json({message: "Error interno al cargar el pedido"});
        return;
    }

    res.json({message: "Error desconocido."});
};

export async function traerPedidosPendientesC(req, res){
    const pedidos = await traerPedidosPendientes();

    if(pedidos == 500){
        res.json({message: "Error al traer pedidos."});
        return;
    }

    return res.json(pedidos);
}

export async function cambiarEstadoController(req, res){
    const datos = req.body;

    const respuesta = await cambiarEstado(datos.id, datos.nuevoEstado);

    if(respuesta == 200){
        res.json({message: "Estado actualizado con exito"});
        return;
    }

    if(respuesta == 500){
        res.json({message: "Error al cambiar estado, intentelo de nuevo mas tarde"});
        return;
    }

    res.json({message: "Error desconocido, intentelo de nuevo mas tarde"});
}

export async function traerPedidoId(req, res){
    const id = req.params.id;

    const pedido = await buscarPedidoPorId(id);

    if(pedido != 500){
        res.json(pedido);
        return;
    }

    res.json({message: "error del servidor."});
}