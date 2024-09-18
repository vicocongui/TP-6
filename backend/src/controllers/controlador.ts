import { openDb } from '../db/db';
import CryptoJS from 'crypto-js';

// Función para encriptar usando la contrasenia maestra
function encriptar(texto: string, contraseniaMaestra: string): string {
    return CryptoJS.AES.encrypt(texto, contraseniaMaestra).toString();
}

// Función para desencriptar usando la contrasenia maestra
function desencriptar(textoCifrado: string, contraseniaMaestra: string): string {
    try {
        const bytes = CryptoJS.AES.decrypt(textoCifrado, contraseniaMaestra);
        const textoDesencriptado = bytes.toString(CryptoJS.enc.Utf8);
        if (!textoDesencriptado) {
            throw new Error('contrasenia maestra incorrecta');
        }
        return textoDesencriptado;
    } catch (error) {
        throw new Error('Error al desencriptar la contrasenia: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
}

// Función para agregar una cuenta con la contrasenia encriptada
export async function agregarCuenta(nombreSitio: string, usuario: string, contrasenia: string, contraseniaMaestra: string) {
    const db = await openDb();
    const sitio = await db.get(`SELECT * FROM SitioWeb WHERE nombre = ?`, nombreSitio);

    let sitioId: number;

    if (!sitio) {
        const result = await db.run(`INSERT INTO SitioWeb (nombre) VALUES (?)`, nombreSitio);
        if (result && result.lastID !== undefined) {
            sitioId = result.lastID;
        } else {
            throw new Error('No se pudo insertar el sitio y obtener el ID.');
        }
    } else {
        sitioId = sitio.id!;
    }

    const contraseniaEncriptada = encriptar(contrasenia, contraseniaMaestra);  // Encriptar con la contrasenia maestra
    await db.run(`INSERT INTO Cuenta (sitioId, usuario, contrasenia) VALUES (?, ?, ?)`, sitioId, usuario, contraseniaEncriptada);
}

// Función para obtener una contrasenia desencriptada usando la contrasenia maestra
export async function obtenercontrasenia(nombreSitio: string, usuario: string, contraseniaMaestra: string) {
    try {
        const db = await openDb();
        const sitio = await db.get(`SELECT * FROM SitioWeb WHERE nombre = ?`, nombreSitio);

        if (sitio) {
            const cuenta = await db.get(`SELECT * FROM Cuenta WHERE sitioId = ? AND usuario = ?`, sitio.id!, usuario);
            if (cuenta) {
                // Desencriptar usando la contrasenia maestra proporcionada por el usuario
                const contraseniaDesencriptada = desencriptar(cuenta.contrasenia, contraseniaMaestra);
                return { tipo: "exito", encontrado: contraseniaDesencriptada };
            }
        }
        return { tipo: "no_encontrado" };
    } catch (error) {
        // Verificar si el error es una instancia de Error para acceder a la propiedad `message`
        const mensajeError = error instanceof Error ? error.message : 'Error desconocido al obtener la contrasenia';
        console.error('Error al obtener la contrasenia:', mensajeError);
        return { tipo: "error", mensaje: mensajeError };
    }
}
