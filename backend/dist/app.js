"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const controlador_1 = require("./controllers/controlador");
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Cargar variables de entorno desde el archivo .env
const PORT = process.env.PORT || 3000; // Usar el puerto de .env, o 3000 como fallback
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Configurar CORS para permitir solicitudes desde otros orígenes
app.use(express_1.default.json()); // Para parsear JSON en el cuerpo de las solicitudes
// Ruta para agregar cuenta (requiere la contrasenia maestra)
app.post('/agregar-cuenta', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreSitio, usuario, contrasenia, contraseniaMaestra } = req.body;
    if (!nombreSitio || !usuario || !contrasenia || !contraseniaMaestra) {
        return res.status(400).send('Faltan datos');
    }
    yield (0, controlador_1.agregarCuenta)(nombreSitio, usuario, contrasenia, contraseniaMaestra);
    res.status(200).send('Cuenta agregada');
}));
// Ruta para obtener la contrasenia (requiere la contrasenia maestra)
app.get('/obtener-contrasenia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreSitio, usuario, contraseniaMaestra } = req.query;
    if (!nombreSitio || !usuario || !contraseniaMaestra) {
        return res.status(400).send('Faltan datos');
    }
    const resultado = yield (0, controlador_1.obtenercontrasenia)(nombreSitio, usuario, contraseniaMaestra);
    if (resultado.tipo === "exito") {
        res.status(200).send({ contrasenia: resultado.encontrado });
    }
    else if (resultado.tipo === "no_encontrado") {
        res.status(404).send('Cuenta no encontrada');
    }
    else {
        res.status(500).send(`Error: ${resultado.mensaje}`);
    }
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.initializeDb)(); // Inicializa la base de datos desde el archivo SQL
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}));
