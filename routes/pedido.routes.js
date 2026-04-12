import { Router } from "express";
import { cambiarEstadoController, cargarPedido, cargarPedidoId, traerPedidoId, traerPedidosPendientesC } from "../controller/pedidos.controller.js";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sessionOk } from "../middlewares/loginRequired.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.use("/pedidos", sessionOk, express.static(join(__dirname, "..", "/views", "/private", "/pedidos")));
router.use("/agregar/:id", sessionOk, express.static(join(__dirname, "..", "/views", "/private", "/agregar")));
router.post("/cargar/:id", sessionOk, cargarPedido);
router.post("/agregar/:id", sessionOk, cargarPedidoId);
router.get("/traerPorId/:id", sessionOk, traerPedidoId);
router.get("/listPendientes", sessionOk, traerPedidosPendientesC);
router.put("/cambiarEstado", sessionOk, cambiarEstadoController);

export default router;