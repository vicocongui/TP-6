"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const dbFilePath = 'db.sqlite';
function crearBaseDeDatos(clave) {
    // Verifica si la base de datos ya existe
    if (fs_1.default.existsSync(dbFilePath)) {
        console.log('La base de datos ya existe.');
        return;
    }
    // Crea la nueva base de datos
    const db = new better_sqlite3_1.default(dbFilePath);
    // Aplica la clave de encriptación
    db.exec(`PRAGMA key = '${clave}'`);
    console.log(`PRAGMA key = '${clave}'`);
    // Crea la tabla
    db.exec(`
        CREATE TABLE Cuenta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            contrasenia TEXT NOT NULL,
            nombreWeb TEXT NOT NULL
        );
    `);
    // Inserta un ejemplo
    db.exec(`
        INSERT INTO Cuenta (usuario, contrasenia, nombreWeb)
        VALUES ('Vico', 'pepeespiola', 'Google.com');
    `);
    // Cierra la conexión
    db.close();
}
// Llama a la función de creación de base de datos con la clave deseada
crearBaseDeDatos(`${process.env.SECRETKEY}`);
