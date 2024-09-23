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
exports.agregarCuenta = agregarCuenta;
exports.consultarListado = consultarListado;
exports.borrarCuenta = borrarCuenta;
exports.actualizarCuenta = actualizarCuenta;
const crypto_js_1 = __importDefault(require("crypto-js"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Abre una conexión a la base de datos SQLite
function abrirConexion() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: 'db.sqlite',
            driver: sqlite3_1.default.Database
        });
    });
}
// Agrega una cuenta a la base de datos
function agregarCuenta(usuario, contrasenia, nombreWeb) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield abrirConexion();
        console.log("Contraseña sin encriptar", contrasenia);
        const ciphertext = crypto_js_1.default.AES.encrypt(contrasenia, process.env.SECRETKEY).toString();
        console.log("Contraseña encriptada", ciphertext);
        yield db.run('INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)', [usuario, ciphertext, nombreWeb]);
        yield db.close();
        //return { usuario, contrasenia, nombreWeb };
    });
}
// Consulta el listado de cuentas
function consultarListado(claveMaestra) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            // Obtener todas las cuentas desde la base de datos
            const cuentasEncriptadas = yield db.all('SELECT * FROM Cuenta');
            console.log("Cuentas con pw encrypted", cuentasEncriptadas);
            // Desencriptar las contraseñas usando la clave maestra proporcionada por el usuario
            const cuentasDesencriptadas = cuentasEncriptadas.map((cuenta) => {
                const bytes = crypto_js_1.default.AES.decrypt(cuenta.contrasenia, claveMaestra);
                const contraseniaDesencriptada = bytes.toString(crypto_js_1.default.enc.Utf8);
                return Object.assign(Object.assign({}, cuenta), { contrasenia: contraseniaDesencriptada });
            });
            yield db.close();
            console.log("Cuentas con pw desencrypted", cuentasDesencriptadas);
            return cuentasDesencriptadas;
        }
        catch (error) {
            console.error('Error al consultar el listado de cuentas:', error);
            return [];
        }
    });
}
function borrarCuenta(nombreWeb, usuario) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            yield db.run('DELETE FROM Cuenta WHERE nombreWeb = ? AND usuario = ?', [nombreWeb, usuario]);
            yield db.close();
            console.log(`La cuenta para ${usuario} en ${nombreWeb} ha sido eliminada.`);
        }
        catch (error) {
            console.error('Error al borrar la cuenta:', error);
        }
    });
}
// Actualiza una cuenta en la base de datos
function actualizarCuenta(nombreWeb, usuario, nuevaContrasenia) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            console.log(nuevaContrasenia);
            const newCiphertext = crypto_js_1.default.AES.encrypt(nuevaContrasenia, process.env.SECRETKEY).toString();
            console.log(newCiphertext);
            yield db.run('UPDATE Cuenta SET contrasenia = ? WHERE nombreWeb = ? AND usuario = ?', [newCiphertext, nombreWeb, usuario]);
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
