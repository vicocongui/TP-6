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
exports.generarContraseniaSegura = exports.actualizarCuenta = exports.borrarCuenta = exports.consultarListado = exports.verificarContrasenaEnHaveIBeenPwned = exports.agregarCuenta = void 0;
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
exports.agregarCuenta = agregarCuenta;
// Función para revisar si la contraseña ha sido expuesta en una violación de datos usando SHA-1 con CryptoJS
const verificarContrasenaEnHaveIBeenPwned = (contrasena) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Hashea la contraseña desencriptada usando SHA-1 (CryptoJS)
    const sha1Hash = crypto_js_1.default.SHA1(contrasena).toString(crypto_js_1.default.enc.Hex).toUpperCase();
    // 2. Envía los primeros 5 caracteres del hash SHA-1 a la API de HaveIBeenPwned
    const prefix = sha1Hash.substring(0, 5);
    const suffix = sha1Hash.substring(5);
    try {
        const response = yield axios_1.default.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const hashes = response.data.split('\n');
        // 3. Verifica si el hash completo está en los resultados de la API
        const encontrado = hashes.some((hashLine) => {
            const [hashSuffix, count] = hashLine.split(':');
            return suffix === hashSuffix;
        });
        return encontrado
            ? 'CONTRASEÑA COMPROMETIDA'
            : 'CONTRASEÑA NO COMPROMETIDA';
    }
    catch (error) {
        console.error('Error al verificar la contraseña en HaveIBeenPwned:', error);
        throw new Error('No se pudo verificar la contraseña');
    }
});
exports.verificarContrasenaEnHaveIBeenPwned = verificarContrasenaEnHaveIBeenPwned;
// Función para consultar el listado de cuentas
function consultarListado(claveMaestra) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield abrirConexion();
            // Obtener todas las cuentas desde la base de datos
            const cuentasEncriptadas = yield db.all('SELECT * FROM Cuenta');
            // Desencriptar las contraseñas y verificar si están comprometidas
            const cuentasDesencriptadas = yield Promise.all(cuentasEncriptadas.map((cuenta) => __awaiter(this, void 0, void 0, function* () {
                // Desencriptar la contraseña usando la clave maestra
                const bytes = crypto_js_1.default.AES.decrypt(cuenta.contrasenia, claveMaestra);
                const contraseniaDesencriptada = bytes.toString(crypto_js_1.default.enc.Utf8);
                // Verificar si la contraseña ha sido comprometida usando la API de HaveIBeenPwned
                const estadoContrasenia = yield (0, exports.verificarContrasenaEnHaveIBeenPwned)(contraseniaDesencriptada);
                return Object.assign(Object.assign({}, cuenta), { contrasenia: contraseniaDesencriptada, // Contraseña desencriptada
                    estadoContrasenia });
            })));
            yield db.close();
            return cuentasDesencriptadas;
        }
        catch (error) {
            console.error('Error al consultar el listado de cuentas:', error);
            return [];
        }
    });
}
exports.consultarListado = consultarListado;
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
exports.borrarCuenta = borrarCuenta;
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
exports.actualizarCuenta = actualizarCuenta;
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
/*async function verificarContraseniaComprometida(contrasenia: string): Promise<boolean> {
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
*/ 
