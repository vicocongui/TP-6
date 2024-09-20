"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarContraseniaSegura = void 0;
exports.consultarListado = consultarListado;
/* import CryptoJS from 'crypto-js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; */
const axios_1 = __importDefault(require("axios"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const secretKey = 'alagrandelepusecuca';
// Abre una conexión a la base de datos SQLite
/* async function abrirConexion() {
    return open({
        filename: 'db.sqlite',
        driver: sqlite3.Database
    });
} */
// Encripta la base de datos y guarda el resultado en un archivo nuevo
/* export async function cifrarBaseDeDatos(clave: string): Promise<void> {
    try {
        const db = await abrirConexion();
        const data = await db.all('SELECT * FROM Cuenta');
        await db.close();

        const contenido = JSON.stringify(data); // Convierte los datos a JSON para la encriptación
        const contenidoCifrado = CryptoJS.AES.encrypt(contenido, clave).toString();

        fs.writeFileSync('db.encrypted', contenidoCifrado);
        fs.unlinkSync('db.sqlite'); // Elimina el archivo original
        console.log('Base de datos encriptada con éxito.');
    } catch (error) {
        console.error('Error al encriptar la base de datos:', error);
    }
} */
// Desencripta el archivo encriptado y lo guarda como un nuevo archivo de base de datos
/* export async function descifrarBaseDeDatos(clave: string): Promise<void> {
    try {
        const contenidoCifrado = fs.readFileSync('db.encrypted', 'utf8');
        const bytes = CryptoJS.AES.decrypt(contenidoCifrado, clave);
        const contenidoDescifrado = bytes.toString(CryptoJS.enc.Utf8);

        const data = JSON.parse(contenidoDescifrado); // Convierte los datos de JSON a un formato compatible con SQLite

        const db = await abrirConexion();
        await db.run('DELETE FROM Cuenta'); // Borra los datos existentes
        for (const cuenta of data) {
            await db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [cuenta.usuario, cuenta.contrasenia, cuenta.nombreWeb]);
        }
        await db.close();

        console.log('Base de datos desencriptada con éxito.');
    } catch (error) {
        console.error('Error al desencriptar la base de datos:', error);
    }
} */
// Agrega una cuenta a la base de datos
/* export async function agregarCuenta(usuario: string, contrasenia: string, nombreWeb: string): Promise<Cuenta> {
    const db = await abrirConexion();
    await db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [usuario, contrasenia, nombreWeb]);
    await db.close();
    return { usuario, contrasenia, nombreWeb };
} */
// Consulta el listado de cuentas
/* export async function consultarListado(clave: string): Promise<Cuenta[]> {
    try {
        await descifrarBaseDeDatos(clave);
        const db = await abrirConexion();
        const cuentas = await db.all<Cuenta[]>('SELECT * FROM Cuenta');
        await db.close();
        await cifrarBaseDeDatos(clave);
        return cuentas;
    } catch (error) {
        console.error('Error al consultar el listado de cuentas:', error);
        return [];
    }
} */
// Definimos la interfaz para el tipo de dato "Cuenta"
function consultarListado(clave) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Abre la conexión a la base de datos
            const db = new better_sqlite3_1.default('db.sqlite');
            // Aplica la clave de encriptación proporcionada por el usuario
            db.exec(`PRAGMA key = '${clave}'`); // Asigna la clave directamente en la consulta
            // Realiza la consulta
            const getStmt = db.prepare('SELECT * FROM Cuenta');
            const cuentas = getStmt.all(); // Obtiene todos los elementos de la tabla 'Cuenta'
            db.close(); // Cierra la conexión
            return cuentas;
        }
        catch (error) {
            console.error('Error al consultar el listado de cuentas:', error);
            throw error; // Re-lanza el error para que el controlador lo capture
        }
    });
}
// Actualiza una cuenta en la base de datos--------------------------------------------------------
/* export async function actualizarCuenta(nombreWeb: string, usuario: string, nuevaContrasenia: string): Promise<void> {
    try {
        const db = await abrirConexion();
        await db.run('UPDATE Cuenta SET contrasenia = ? WHERE nombreWeb = ? AND usuario = ?', [nuevaContrasenia, nombreWeb, usuario]);
        await db.close();
    } catch (error) {
        console.error('Error al actualizar la cuenta:', error);
    }
} */
// Genera una contraseña segura
const generarContraseniaSegura = () => {
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
exports.generarContraseniaSegura = generarContraseniaSegura;
// Verifica si la contraseña ha sido comprometida
function verificarContraseniaComprometida(contrasenia) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nombreAplicacion = 'SecurePassManager';
            const response = yield axios_1.default.get(`https://haveibeenpwned.com/api/v3/pwnedpassword/${contrasenia}`, {
                headers: { 'user-agent': nombreAplicacion }
            });
            return response.status === 200;
        }
        catch (error) {
            console.error('Error al verificar la contraseña comprometida:', error);
            return false;
        }
    });
}
