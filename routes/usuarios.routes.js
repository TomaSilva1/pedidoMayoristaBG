import { Router } from "express";
import { entrar, paginaLogin, registrarController } from "../controller/usuarios.controller.js";

const router = Router();

router.get("/login", paginaLogin);
router.post("/entrar", entrar);
router.post("/registrar", registrarController);

export default router;