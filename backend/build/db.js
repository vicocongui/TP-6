"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.openDb = openDb;
exports.initializeDb = initializeDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_js_1 = __importDefault(require("crypto-js")); // Importar CryptoJS
const dbFile = 'db.sqlite'; // Ruta de la base de datos SQLite
const sqlFile = path.join(__dirname, '../creardb.sql'); // Ruta del archivo SQL
// Función para abrir la base de datos
function openDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: dbFile,
            driver: sqlite3_1.default.Database
        });
    });
}
// Función para inicializar la base de datos ejecutando el archivo SQL
function initializeDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDb();
        try {
            const sql = fs.readFileSync(sqlFile, 'utf-8');
            console.log("Contenido del archivo SQL:", sql); // Para depuración
            yield db.exec(sql);
            console.log("Base de datos inicializada correctamente.");
            // Insertar la cuenta predeterminada
            const defaultUser = 'ejemplo1';
            const defaultPassword = 'acasecreatucontraseniasegura';
            const defaultWeb = 'ejemplo.web';
            // Encriptar la contraseña antes de almacenarla
            const ciphertext = crypto_js_1.default.AES.encrypt(defaultPassword, process.env.SECRETKEY).toString();
            yield db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [defaultUser, ciphertext, defaultWeb]);
            console.log("Cuenta predeterminada creada correctamente.");
        }
        catch (error) {
            console.error("Error al inicializar la base de datos:", error);
        }
        finally {
            yield db.close();
        }
    });
}
