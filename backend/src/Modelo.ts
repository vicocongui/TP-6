
import CryptoJS from 'crypto-js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

export interface Cuenta {
    usuario: string;
    contrasenia: string;
    nombreWeb: string;
    estadoContrasenia?: string; // Nuevo campo para indicar si está comprometida o no
}

// Abre una conexión a la base de datos SQLite
async function abrirConexion() {
    return open({
        filename: 'db.sqlite',
        driver: sqlite3.Database
    });
}

// Agrega una cuenta a la base de datos
export async function agregarCuenta(usuario: string, contrasenia: string, nombreWeb: string): Promise<void> {
    const db = await abrirConexion();
    const ciphertext = CryptoJS.AES.encrypt(contrasenia, process.env.SECRETKEY!).toString();
    await db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [usuario, ciphertext, nombreWeb]);
    await db.close();
    //return { usuario, contrasenia, nombreWeb };
}


// Función para revisar si la contraseña ha sido expuesta en una violación de datos usando SHA-1 con CryptoJS
export const verificarContrasenaEnHaveIBeenPwned = async (contrasena: string) => {
    // 1. Hashea la contraseña desencriptada usando SHA-1 (CryptoJS)
    const sha1Hash = CryptoJS.SHA1(contrasena).toString(CryptoJS.enc.Hex).toUpperCase();

    // 2. Envía los primeros 5 caracteres del hash SHA-1 a la API de HaveIBeenPwned
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);

    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const hashes = response.data.split('\n');

        // 3. Verifica si el hash completo está en los resultados de la API
        const encontrado = hashes.some((hashLine: string) => {
            const [hashSuffix, count] = hashLine.split(':');
            return suffix === hashSuffix;
        });

        return encontrado 
            ? 'CONTRASEÑA COMPROMETIDA' 
            : 'CONTRASEÑA NO COMPROMETIDA';
    } catch (error) {
        console.error('Error al verificar la contraseña en HaveIBeenPwned:', error);
        throw new Error('No se pudo verificar la contraseña');
    }
};

// Función para consultar el listado de cuentas
export async function consultarListado(claveMaestra: string): Promise<Cuenta[]> {
    try {
        const db = await abrirConexion();

        // Obtener todas las cuentas desde la base de datos
        const cuentasEncriptadas = await db.all<Cuenta[]>('SELECT * FROM Cuenta');

        // Desencriptar las contraseñas y verificar si están comprometidas
        const cuentasDesencriptadas: Cuenta[] = await Promise.all(cuentasEncriptadas.map(async (cuenta) => {
            // Desencriptar la contraseña usando la clave maestra
            const bytes = CryptoJS.AES.decrypt(cuenta.contrasenia, claveMaestra);
            const contraseniaDesencriptada = bytes.toString(CryptoJS.enc.Utf8);

            // Verificar si la contraseña ha sido comprometida usando la API de HaveIBeenPwned
            const estadoContrasenia = await verificarContrasenaEnHaveIBeenPwned(contraseniaDesencriptada);

            return {
                ...cuenta,
                contrasenia: contraseniaDesencriptada,  // Contraseña desencriptada
                estadoContrasenia,  // Mensaje sobre el estado de la contraseña
            };
        }));

        await db.close();
        return cuentasDesencriptadas;

    } catch (error) {
        console.error('Error al consultar el listado de cuentas:', error);
        return [];
    }
}

export async function borrarCuenta(nombreWeb: string, usuario: string): Promise<void> {
    try {
        const db = await abrirConexion();
        await db.run('DELETE FROM Cuenta WHERE nombreWeb = ? AND usuario = ?', [nombreWeb, usuario]);
        await db.close();
        console.log(`La cuenta para ${usuario} en ${nombreWeb} ha sido eliminada.`);
    } catch (error) {
        console.error('Error al borrar la cuenta:', error);
    }
}


// Actualiza una cuenta en la base de datos
export async function actualizarCuenta(nombreWeb: string, usuario: string, nuevaContrasenia: string): Promise<void> {
    try {
        const db = await abrirConexion();
        const newCiphertext = CryptoJS.AES.encrypt(nuevaContrasenia, process.env.SECRETKEY!).toString();
        await db.run('UPDATE Cuenta SET contrasenia = ? WHERE nombreWeb = ? AND usuario = ?', [newCiphertext, nombreWeb, usuario]);
        await db.close();
    } catch (error) {
        console.error('Error al actualizar la cuenta:', error);
    }
}

// Genera una contraseña segura
export const generarContraseniaSegura = (): string => {
    const caracteresRegEx = /[A-Za-z0-9]/;
    const longitud = 16;

    return [...Array(longitud)]
        .map(() => {
            let caracter;
            do {
                caracter = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
            } while (!caracteresRegEx.test(caracter));
            return caracter;
        })
        .join('');
};
