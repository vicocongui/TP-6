import * as fs from 'fs';
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
    console.log("Contraseña sin encriptar", contrasenia);
    const ciphertext = CryptoJS.AES.encrypt(contrasenia, process.env.SECRETKEY!).toString();
    console.log("Contraseña encriptada", ciphertext);
    await db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [usuario, ciphertext, nombreWeb]);
    await db.close();
    //return { usuario, contrasenia, nombreWeb };
}

// Consulta el listado de cuentas
export async function consultarListado(claveMaestra: string): Promise<Cuenta[]> {
    try {
        const db = await abrirConexion();
        
        // Obtener todas las cuentas desde la base de datos
        const cuentasEncriptadas = await db.all<Cuenta[]>('SELECT * FROM Cuenta');
        console.log("Cuentas con pw encrypted", cuentasEncriptadas);
        // Desencriptar las contraseñas usando la clave maestra proporcionada por el usuario
        const cuentasDesencriptadas: Cuenta[] = cuentasEncriptadas.map((cuenta) => {
            const bytes = CryptoJS.AES.decrypt(cuenta.contrasenia, claveMaestra);
            const contraseniaDesencriptada = bytes.toString(CryptoJS.enc.Utf8);
            
            return {
                ...cuenta,
                contrasenia: contraseniaDesencriptada,  // Almacena la contraseña desencriptada
            };
        });

        await db.close();
        console.log("Cuentas con pw desencrypted", cuentasDesencriptadas);
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
        console.log(nuevaContrasenia);
        const newCiphertext = CryptoJS.AES.encrypt(nuevaContrasenia, process.env.SECRETKEY!).toString();
        console.log(newCiphertext);
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

// Verifica si la contraseña ha sido comprometida
async function verificarContraseniaComprometida(contrasenia: string): Promise<boolean> {
    try {
        const nombreAplicacion = 'SecurePassManager';
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/pwnedpassword/${contrasenia}`, {
            headers: { 'user-agent': nombreAplicacion }
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error al verificar la contraseña comprometida:', error);
        return false;
    }
}
