import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { agregarCuenta, actualizarCuenta, generarContraseniaSegura, consultarListado, borrarCuenta } from "./Modelo";
import cors from 'cors';
import { initializeDb } from "./db"; // Importar la función para inicializar la base de datos

dotenv.config();

const port = process.env.PORT || 5000;
const app: Express = express();

app.use(express.json());
app.use(cors());

// Inicializar la base de datos al iniciar el servidor
initializeDb().then(() => {
    console.log("Base de datos inicializada correctamente.");
}).catch((error) => {
    console.error("Error al inicializar la base de datos:", error);
});

// Mostrar toda la información del usuario que lo solicita
app.post("/v1/listado", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        res.send(await consultarListado(clave));
    } catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
});

// Crear la cuenta que requiere el usuario
app.post("/v1/listado/add-account", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    try {
        if (!usuario || !nombreWeb) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }
        const nuevaCuenta = await agregarCuenta(usuario, generarContraseniaSegura(), nombreWeb);
        res.status(200).send(nuevaCuenta);
    } catch (error) {
        console.error('Error al agregar la cuenta:', error);
        res.status(500).send({ error: 'Error al agregar la cuenta' });
    }
});

// Actualizar la contraseña
app.put("/v1/usuario/update", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    if (!usuario || !nombreWeb) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const contraseniaActualizada = await actualizarCuenta(nombreWeb, usuario, generarContraseniaSegura());
        res.status(200).send(contraseniaActualizada);
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ error: 'Error al actualizar la cuenta' });
    }
});

// Borrar cuenta
app.delete("/v1/usuario/delete", async (req: Request, res: Response) => {
    const { clave, usuario, nombreWeb } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        await borrarCuenta(nombreWeb, usuario);
        return res.status(200).json({ message: `La cuenta ${usuario} en ${nombreWeb} ha sido eliminada.` });
    } catch (error) {
        console.error("Error al eliminar cuenta", error);
        res.status(500).send({ error: 'Error al eliminar cuenta' });
    }
});

app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});
