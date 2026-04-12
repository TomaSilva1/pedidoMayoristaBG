import express from "express";
import session from "express-session";
import connectPgSession from "connect-pg-simple";
const pgSession = connectPgSession(session);
import pool from "./DB/db.js";

import login from "./routes/usuarios.routes.js";
import cliente from "./routes/cliente.routes.js";
import menu from "./routes/menu.routes.js";
import pedidos from "./routes/pedido.routes.js";

const app = express();
const PORT = process.env.APPORT;

app.use(session({
    secret: 'cambiarDespuesEnDotEnv',
    resave: false,
    saveUninitialized: false,
    rolling: false,
    store: new pgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 12,
        httpOnly: true,
        secure: false, //despues true
        sameSite: 'lax'
    }
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//sirvo los archivos estaticos
app.use(express.static("views/public"));

//manejo de apis
app.use("/", login);
app.use("/venta", cliente);
app.use("/", menu);
app.use("/", pedidos);

app.listen(PORT, () => {
    console.log("App corriendo en puerto: "+PORT);
});