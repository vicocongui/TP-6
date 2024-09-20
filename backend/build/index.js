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
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
require("./generatedb");
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Endpoint para descifrar la base de datos
/* app.post("/admin/descifrar", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        await descifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos descifrada con éxito." });
    } catch (error) {
        console.error('Error al descifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al descifrar la base de datos' });
    }
}); */
// Endpoint para cifrar la base de datos
/* app.post("/admin/cifrar", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (!clave) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        await cifrarBaseDeDatos(clave);
        res.status(200).send({ message: "Base de datos cifrada con éxito." });
    } catch (error) {
        console.error('Error al cifrar la base de datos:', error);
        res.status(500).send({ error: 'Error al cifrar la base de datos' });
    }
}); */
// Mostrar toda la información del usuario que lo solicita.
/* app.post("/v1/listado", async (req: Request, res: Response) => {
    const { clave } = req.body;
    if (clave != process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria' });
    }
    try {
        //const listado = await consultarListado();
        res.send(await consultarListado(clave));
    } catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
}); */
app.post("/v1/listado", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clave } = req.body;
    if (!clave || clave !== process.env.SECRETKEY) {
        return res.status(400).send({ error: 'La clave es obligatoria o incorrecta' });
    }
    try {
        const listado = yield (0, Modelo_1.consultarListado)(clave); // Llama a la función actualizada
        res.send(listado);
    }
    catch (error) {
        console.error("Error al consultar el listado de cuentas", error);
        res.status(500).send({ error: 'Error al consultar el listado de cuentas' });
    }
}));
// Crear la cuenta que requiere el usuario-----------------------------
/* app.post("/v1/listado/add-account", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    try {
        if (!usuario || !nombreWeb) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios' });
        }
        const nuevaCuenta = await agregarCuenta(usuario, generarContraseniaSegura(), nombreWeb);
        res.status(201).send(nuevaCuenta);
    } catch (error) {
        console.error('Error al agregar la cuenta:', error);
        res.status(500).send({ error: 'Error al agregar la cuenta' });
    }
}); */
// Actualizar la contraseña------------------------
/* app.put("/v1/usuario/update", async (req: Request, res: Response) => {
    const { usuario, nombreWeb } = req.body;
    if (!usuario || !nombreWeb) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }
    try {
        await actualizarCuenta(nombreWeb, usuario, generarContraseniaSegura());
        res.status(200).send({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).send({ error: 'Error al actualizar la cuenta' });
    }
}); */
app.listen(port, () => {
    console.log(`[server]: Servidor iniciado en http://localhost:${port}`);
});
