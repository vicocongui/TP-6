import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { test, agregarCuenta, actualizarCuenta, generarContraseniaSegura, consultarListado } from "./Modelo";
dotenv.config();
import cors from 'cors';

const port = process.env.PORT || 5000;
const app: Express = express();

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
//app.use(express.json());

app.use(cors());

app.get("/v1/test", async (req: Request, res:Response)=>{
    try{
        res.send (await test());
    } catch (error){
       console.log(error);
    }
})


// Endpoint para descifrar la base de datos
app.post("/admin/descifrar", async (req: Request, res: Response) => {
    //const { clave } = req.body;
    try {
       // await descifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos descifrada con éxito." });
    } catch (error) {
        console.error('Error al descifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al descifrar la base de datos' });
    }
});

// Endpoint para cifrar la base de datos
app.post("/admin/cifrar", async (req: Request, res: Response) => {
    //const { clave } = req.body;
    try {
       // await cifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos cifrada con éxito." });
    } catch (error) {
        console.error('Error al cifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al cifrar la base de datos' });
    }
});


//mostrar toda la informacion del usuario que lo solicita.
app.post("/v1/listado", async (req: Request, res: Response) => {
    try {
        res.send(await consultarListado());
    } catch (error) {
        console.log("se rompido el post base de datos", error);
    }
});

//crear la cuenta que requiere el usuario
app.post("/v1/listado/add-account", async (req: Request, res: Response) => {
    console.log ('encabezados de la solicitud:', req.headers);
    console.log('cuerpo de la solicitud:', req.body );
    
    const { usuario, nombreWeb } = req.body;
    try {
       
        console.log(usuario, nombreWeb)

        if (!usuario || !nombreWeb) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }

        const nuevaCuenta = await agregarCuenta(usuario, generarContraseniaSegura(), nombreWeb);
        res.status(201).send(nuevaCuenta);
    } catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).send({ error: 'Error al agregar la cuenta' });
    }
});

//actualizar la contraseña
app.put("/v1/usuario/update", async (req: Request, res: Response) => {
    const {usuario, nombreWeb} = req.body;

    if (!nombreWeb || !usuario) {
        return res.status(400).send({ error: "Todos los campos son obligatorios" });
    }

    try {
        await actualizarCuenta(usuario, generarContraseniaSegura(), nombreWeb);
        res.status(200).send({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ error: 'Error al actualizar la cuenta' });
    }
});



app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});


