import {Router} from "express";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { sessionOk } from "../middlewares/loginRequired.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.use("/menu", sessionOk, express.static(join(__dirname, "..","views", "private", "menu"))); //sirvo el menu
router.use("/css", sessionOk, express.static(join(__dirname, "..","views", "private", "css"))); //sirvo la carpeta private con el css

export default router;