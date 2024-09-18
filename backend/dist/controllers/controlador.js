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
exports.obtenercontrasenia = exports.agregarCuenta = void 0;
const db_1 = require("../db/db");
const crypto_js_1 = __importDefault(require("crypto-js"));
// Función para encriptar usando la contrasenia maestra
function encriptar(texto, contraseniaMaestra) {
    return crypto_js_1.default.AES.encrypt(texto, contraseniaMaestra).toString();
}
// Función para desencriptar usando la contrasenia maestra
function desencriptar(textoCifrado, contraseniaMaestra) {
    try {
        const bytes = crypto_js_1.default.AES.decrypt(textoCifrado, contraseniaMaestra);
        const textoDesencriptado = bytes.toString(crypto_js_1.default.enc.Utf8);
        if (!textoDesencriptado) {
            throw new Error('contrasenia maestra incorrecta');
        }
        return textoDesencriptado;
    }
    catch (error) {
        throw new Error('Error al desencriptar la contrasenia: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
}
// Función para agregar una cuenta con la contrasenia encriptada
function agregarCuenta(nombreSitio, usuario, contrasenia, contraseniaMaestra) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.openDb)();
        const sitio = yield db.get(`SELECT * FROM SitioWeb WHERE nombre = ?`, nombreSitio);
        let sitioId;
        if (!sitio) {
            const result = yield db.run(`INSERT INTO SitioWeb (nombre) VALUES (?)`, nombreSitio);
            if (result && result.lastID !== undefined) {
                sitioId = result.lastID;
            }
            else {
                throw new Error('No se pudo insertar el sitio y obtener el ID.');
            }
        }
        else {
            sitioId = sitio.id;
        }
        const contraseniaEncriptada = encriptar(contrasenia, contraseniaMaestra); // Encriptar con la contrasenia maestra
        yield db.run(`INSERT INTO Cuenta (sitioId, usuario, contrasenia) VALUES (?, ?, ?)`, sitioId, usuario, contraseniaEncriptada);
    });
}
exports.agregarCuenta = agregarCuenta;
// Función para obtener una contrasenia desencriptada usando la contrasenia maestra
function obtenercontrasenia(nombreSitio, usuario, contraseniaMaestra) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, db_1.openDb)();
            const sitio = yield db.get(`SELECT * FROM SitioWeb WHERE nombre = ?`, nombreSitio);
            if (sitio) {
                const cuenta = yield db.get(`SELECT * FROM Cuenta WHERE sitioId = ? AND usuario = ?`, sitio.id, usuario);
                if (cuenta) {
                    // Desencriptar usando la contrasenia maestra proporcionada por el usuario
                    const contraseniaDesencriptada = desencriptar(cuenta.contrasenia, contraseniaMaestra);
                    return { tipo: "exito", encontrado: contraseniaDesencriptada };
                }
            }
            return { tipo: "no_encontrado" };
        }
        catch (error) {
            // Verificar si el error es una instancia de Error para acceder a la propiedad `message`
            const mensajeError = error instanceof Error ? error.message : 'Error desconocido al obtener la contrasenia';
            console.error('Error al obtener la contrasenia:', mensajeError);
            return { tipo: "error", mensaje: mensajeError };
        }
    });
}
exports.obtenercontrasenia = obtenercontrasenia;
