import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { /* agregarCuenta, actualizarCuenta, */ generarContraseniaSegura, consultarListado, /* cifrarBaseDeDatos, descifrarBaseDeDatos */ } from "./Modelo";
dotenv.config();
import cors from 'cors';
import './generatedb';

const port = process.env.PORT || 5000;
const app: Express = express();

app.use(express.json());
app.use(cors());

// Endpoint para descifrar la base de datos
/* app.post("/admin/descifrar", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        await descifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos descifrada con éxito." });
    } catch (error) {
        console.error('Error al descifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al descifrar la base de datos' });
    }
}); */

// Endpoint para cifrar la base de datos
/* app.post("/admin/cifrar", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (!clave) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        await cifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos cifrada con éxito." });
    } catch (error) {
        console.error('Error al cifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al cifrar la base de datos' });
    }
}); */

// Mostrar toda la información del usuario que lo solicita.
/* app.post("/v1/listado", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        //const listado = await consultarListado();
        res.send(await consultarListado(clave));
    } catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
}); */

app.post("/v1/listado", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (!clave || clave !== process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria o incorrecta' });
    }
    try {
        const listado = await consultarListado(clave);  // Llama a la función actualizada
        res.send(listado);
    } catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
});

// Crear la cuenta que requiere el usuario-----------------------------
/* app.post("/v1/listado/add-account", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    try {
        if (!usuario || !nombreWeb) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }
        const nuevaCuenta = await agregarCuenta(usuario, generarContraseniaSegura(), nombreWeb);
        res.status(201).send(nuevaCuenta);
    } catch (error) {
        console.error('Error al agregar la cuenta:', error);
        res.status(500).send({ error: 'Error al agregar la cuenta' });
    }
}); */

// Actualizar la contraseña------------------------
/* app.put("/v1/usuario/update", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    if (!usuario || !nombreWeb) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    try {
        await actualizarCuenta(nombreWeb, usuario, generarContraseniaSegura());
        res.status(200).send({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ error: 'Error al actualizar la cuenta' });
    }
}); */

app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});
