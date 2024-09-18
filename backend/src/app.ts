import express from 'express';
import cors from 'cors';
import { initializeDb } from './db/db';
import { agregarCuenta, obtenercontrasenia } from './controllers/controlador';
import * as dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde el archivo .env

const PORT = process.env.PORT || 3000;  // Usar el puerto de .env, o 3000 como fallback

const app = express();

app.use(cors());  // Configurar CORS para permitir solicitudes desde otros orígenes
app.use(express.json());  // Para parsear JSON en el cuerpo de las solicitudes

// Ruta para agregar cuenta (requiere la contrasenia maestra)
app.post('/agregar-cuenta', async (req, res) => {
    const { nombreSitio, usuario, contrasenia, contraseniaMaestra } = req.body;
    if (!nombreSitio || !usuario || !contrasenia || !contraseniaMaestra) {
        return res.status(400).send('Faltan datos');
    }
    await agregarCuenta(nombreSitio, usuario, contrasenia, contraseniaMaestra);
    res.status(200).send('Cuenta agregada');
});

// Ruta para obtener la contrasenia (requiere la contrasenia maestra)
app.get('/obtener-contrasenia', async (req, res) => {
    const { nombreSitio, usuario, contraseniaMaestra } = req.query as any;
    if (!nombreSitio || !usuario || !contraseniaMaestra) {
        return res.status(400).send('Faltan datos');
    }
    const resultado = await obtenercontrasenia(nombreSitio, usuario, contraseniaMaestra);
    if (resultado.tipo === "exito") {
        res.status(200).send({ contrasenia: resultado.encontrado });
    } else if (resultado.tipo === "no_encontrado") {
        res.status(404).send('Cuenta no encontrada');
    } else {
        res.status(500).send(`Error: ${resultado.mensaje}`);
    }
});

app.listen(PORT, async () => {
    await initializeDb();  // Inicializa la base de datos desde el archivo SQL
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
