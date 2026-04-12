import pool from "../DB/db.js";

export async function cargarCliente(nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, idEmpresa){
    const client = await pool.connect();
    await client.query("BEGIN");
    try {
        const res = await client.query("INSERT INTO clientes (nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, idEmpresa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [nombre, apellido, telefono, dni, provincia, localidad, codigoP, direccion, idEmpresa]);

        if (res.rowCount > 0) {
            await client.query("COMMIT");
            return 200;
        }else{
            await client.query("ROLLBACK");
            return 500;
        }
    } catch (error) {
        console.error("Error al cargar cliente: "+error.message);
        await client.query("ROLLBACK");
        return 500;
    }finally{
        client.release();
    }
}

export async function traerClientes(){
    try {
        const resultado = await pool.query("SELECT * FROM clientes INNER JOIN empresaenvio using(idempresa) ORDER BY idcliente ASC");

        return resultado.rows;
    } catch (error) {
        console.error("Error al traer clientes: "+error);
        return 500;
    }
}

export async function traerClientePorId(id){
    try {
        const resultado = await pool.query("SELECT * FROM clientes INNER JOIN empresaenvio using(idempresa) WHERE idcliente = $1", [id]);

        return resultado.rows[0];
    } catch (error) {
        console.error("Error en el service de traer cliente por id: "+error);
        return 500;
    }
}