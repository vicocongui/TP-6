import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';
import CryptoJS from 'crypto-js';  // Importar CryptoJS

const dbFile = 'db.sqlite';  // Ruta de la base de datos SQLite
const sqlFile = path.join(__dirname, '../creardb.sql');  // Ruta del archivo SQL

// Función para abrir la base de datos
export async function openDb() {
    return open({
        filename: dbFile,
        driver: sqlite3.Database
    });
}

// Función para inicializar la base de datos ejecutando el archivo SQL
export async function initializeDb() {
    const db = await openDb();

    try {
        const sql = fs.readFileSync(sqlFile, 'utf-8');
        console.log("Contenido del archivo SQL:", sql);  // Para depuración
        await db.exec(sql);
        console.log("Base de datos inicializada correctamente.");

        // Insertar la cuenta predeterminada
        const defaultUser = 'ejemplo1';
        const defaultPassword = 'acasecreatucontraseniasegura';
        const defaultWeb = 'ejemplo.web';

        // Encriptar la contraseña antes de almacenarla
        const ciphertext = CryptoJS.AES.encrypt(defaultPassword, process.env.SECRETKEY!).toString();

        await db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [defaultUser, ciphertext, defaultWeb]);
        console.log("Cuenta predeterminada creada correctamente.");
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    } finally {
        await db.close();
    }
}
