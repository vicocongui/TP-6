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
exports.generarContraseniaSegura = void 0;
exports.cifrarBaseDeDatos = cifrarBaseDeDatos;
exports.descifrarBaseDeDatos = descifrarBaseDeDatos;
exports.agregarCuenta = agregarCuenta;
exports.consultarListado = consultarListado;
exports.actualizarCuenta = actualizarCuenta;
const fs = __importStar(require("fs"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const axios_1 = __importDefault(require("axios"));
const secretKey = 'alagrandelepusecuca';
// Abre una conexión a la base de datos SQLite
function abrirConexion() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: 'db.sqlite',
            driver: sqlite3_1.default.Database
        });
    });
}
// Encripta la base de datos y guarda el resultado en un archivo nuevo
function cifrarBaseDeDatos(clave) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            const data = yield db.all('SELECT * FROM Cuenta');
            yield db.close();
            const contenido = JSON.stringify(data); // Convierte los datos a JSON para la encriptación
            const contenidoCifrado = crypto_js_1.default.AES.encrypt(contenido, clave).toString();
            fs.writeFileSync('db.encrypted', contenidoCifrado);
            fs.unlinkSync('db.sqlite'); // Elimina el archivo original
            console.log('Base de datos encriptada con éxito.');
        }
        catch (error) {
            console.error('Error al encriptar la base de datos:', error);
        }
    });
}
// Desencripta el archivo encriptado y lo guarda como un nuevo archivo de base de datos
function descifrarBaseDeDatos(clave) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const contenidoCifrado = fs.readFileSync('db.encrypted', 'utf8');
            const bytes = crypto_js_1.default.AES.decrypt(contenidoCifrado, clave);
            const contenidoDescifrado = bytes.toString(crypto_js_1.default.enc.Utf8);
            const data = JSON.parse(contenidoDescifrado); // Convierte los datos de JSON a un formato compatible con SQLite
            const db = yield abrirConexion();
            yield db.run('DELETE FROM Cuenta'); // Borra los datos existentes
            for (const cuenta of data) {
                yield db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [cuenta.usuario, cuenta.contrasenia, cuenta.nombreWeb]);
            }
            yield db.close();
            console.log('Base de datos desencriptada con éxito.');
        }
        catch (error) {
            console.error('Error al desencriptar la base de datos:', error);
        }
    });
}
// Agrega una cuenta a la base de datos
function agregarCuenta(usuario, contrasenia, nombreWeb) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield abrirConexion();
        yield db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [usuario, contrasenia, nombreWeb]);
        yield db.close();
        return { usuario, contrasenia, nombreWeb };
    });
}
// Consulta el listado de cuentas
function consultarListado(clave) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield descifrarBaseDeDatos(clave);
            const db = yield abrirConexion();
            const cuentas = yield db.all('SELECT * FROM Cuenta');
            yield db.close();
            yield cifrarBaseDeDatos(clave);
            return cuentas;
        }
        catch (error) {
            console.error('Error al consultar el listado de cuentas:', error);
            return [];
        }
    });
}
// Actualiza una cuenta en la base de datos
function actualizarCuenta(nombreWeb, usuario, nuevaContrasenia) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            yield db.run('UPDATE Cuenta SET contrasenia = ? WHERE nombreWeb = ? AND usuario = ?', [nuevaContrasenia, nombreWeb, usuario]);
            yield db.close();
        }
        catch (error) {
            console.error('Error al actualizar la cuenta:', error);
        }
    });
}
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
