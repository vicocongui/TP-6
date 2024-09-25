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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Modelo_1 = require("./Modelo");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db"); // Importar la función para inicializar la base de datos
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Inicializar la base de datos al iniciar el servidor
(0, db_1.initializeDb)().then(() => {
    console.log("Base de datos inicializada correctamente.");
}).catch((error) => {
    console.error("Error al inicializar la base de datos:", error);
});
// Mostrar toda la información del usuario que lo solicita
app.post("/v1/listado", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        res.send(yield (0, Modelo_1.consultarListado)(clave));
    }
    catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
}));
// Crear la cuenta que requiere el usuario
app.post("/v1/listado/add-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, nombreWeb } = req.body;
    try {
        if (!usuario || !nombreWeb) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }
        const nuevaCuenta = yield (0, Modelo_1.agregarCuenta)(usuario, (0, Modelo_1.generarContraseniaSegura)(), nombreWeb);
        res.status(200).send(nuevaCuenta);
    }
    catch (error) {
        console.error('Error al agregar la cuenta:', error);
        res.status(500).send({ error: 'Error al agregar la cuenta' });
    }
}));
// Actualizar la contraseña
app.put("/v1/usuario/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, nombreWeb } = req.body;
    if (!usuario || !nombreWeb) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    try {
        const contraseniaActualizada = yield (0, Modelo_1.actualizarCuenta)(nombreWeb, usuario, (0, Modelo_1.generarContraseniaSegura)());
        res.status(200).send(contraseniaActualizada);
    }
    catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ error: 'Error al actualizar la cuenta' });
    }
}));
// Borrar cuenta
app.delete("/v1/usuario/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clave, usuario, nombreWeb } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        yield (0, Modelo_1.borrarCuenta)(nombreWeb, usuario);
        return res.status(200).json({ message: `La cuenta ${usuario} en ${nombreWeb} ha sido eliminada.` });
    }
    catch (error) {
        console.error("Error al eliminar cuenta", error);
        res.status(500).send({ error: 'Error al eliminar cuenta' });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});
