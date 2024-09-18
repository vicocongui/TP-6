import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as fs from 'fs';
import * as path from 'path';

const dbFile = 'passwords.db';  // Ruta de la base de datos SQLite
const sqlFile = path.join(__dirname, 'creardb.sql');  // Ruta del archivo SQL

export async function openDb() {
    return open({
        filename: dbFile,
        driver: sqlite3.Database
    });
}

export async function initializeDb() {
    const db = await openDb();

    try {
        const sql = fs.readFileSync(sqlFile, 'utf-8');
        console.log("Contenido del archivo SQL:", sql);  // Agrega esta línea para depurar
        await db.exec(sql);
        console.log("Base de datos inicializada correctamente.");
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
    }
}
