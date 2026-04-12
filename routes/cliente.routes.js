import { Router } from "express";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path"
import { enviarClientePorId, enviarClientes, guardaCliente, traerFormCliente } from "../controller/cliente.controller.js";
import { sessionOk } from "../middlewares/loginRequired.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get("/clientes", traerFormCliente);
router.post("/guardar", guardaCliente);
router.get("/traerClientes", sessionOk, enviarClientes);
router.get("/traerCliente/:id", sessionOk, enviarClientePorId);
router.use("/listaClientes", sessionOk, express.static(join(__dirname, "..", "/views", "/private", "/clientesM")));
router.use("/cargar/:id", sessionOk, express.static(join(__dirname, "..", "/views", "/private", "/cargar")));

export default router;