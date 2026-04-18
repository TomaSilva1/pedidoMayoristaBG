import pool from "../DB/db.js";

export async function guardarPedido(id, payload){
    if (payload.length == 0) {
        return 500;
    };

    const client = await pool.connect();
    client.query("BEGIN");

    try {
        const idPedido = await client.query("INSERT INTO pedido (idcliente) VALUES ($1) RETURNING id_pedido", [id]);

        //console.log(idPedido.rows[0].id_pedido);

        for (const compra of payload) {
            const precio = calcularPrecio(compra.cant, compra.precio);

            await client.query("INSERT INTO detalle_pedido (producto, cantidad, id_pedido, precio) VALUES ($1, $2, $3, $4)", [compra.producto, compra.cant, idPedido.rows[0].id_pedido, precio]);
        }

        await client.query("COMMIT");
        return 200;

    } catch (error) {
        console.error("ERROR en guardar pedido: "+error);
        await client.query("ROLLBACK");
        return 500;
    }finally{
        client.release()
    }
}

export async function traerPedidosPendientes(){
    try {
        const pedidos_pendientes = await pool.query("SELECT * FROM pedido INNER JOIN detalle_pedido using(id_pedido) INNER JOIN clientes using(idcliente) WHERE finalizado = 'pendiente'");

        return pedidos_pendientes.rows;
    } catch (error) {
        console.log("Error al traer pedidos pendientes: "+error);
        return 500;
    }
};

export async function buscarPedidoPorId(id){
    try {
        const pedido = await pool.query("SELECT * FROM pedido INNER JOIN clientes using(idcliente) WHERE id_pedido = $1", [id]);

        return pedido.rows[0];
    } catch (error) {
        console.error("ERROR AL TRAER PEDIDO POR ID: ", +error);
        return 500;
    }
}

export async function agregarPedidoId(id, payload){
    if (payload.length == 0) {
        return 500;
    };

    const client = await pool.connect();
    client.query("BEGIN");

    try {

        for (const compra of payload) {
            const precio = calcularPrecio(compra.cant, compra.precio);
            await client.query("INSERT INTO detalle_pedido (producto, cantidad, id_pedido, precio) VALUES ($1, $2, $3, $4)", [compra.producto, compra.cant, id, precio]);
        }

        await client.query("COMMIT");
        return 200;

    } catch (error) {
        console.error("ERROR en guardar pedido: "+error);
        await client.query("ROLLBACK");
        return 500;
    }finally{
        client.release()
    }
}

export async function cambiarEstado(id, estado){
    try {
        await pool.query("UPDATE pedido SET finalizado = $1 WHERE id_pedido = $2", [estado, id]);

        return 200;
    } catch (error) {
        console.log("ERROR al intentar cambiar de estado: "+error);
        return;
    }
};

function calcularPrecio(cant, precio){
	if(cant == 6){
		precio = precio/2 + 5000;
	}

	if(cant > 12){
		cant = cant / 12;
		precio = precio*cant;
	}else{
		return precio;
	}

	return precio;
}