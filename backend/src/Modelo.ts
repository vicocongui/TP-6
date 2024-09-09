import * as fs from 'fs';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import  sqlite3  from 'sqlite3';
import { open } from 'sqlite';


export interface Cuenta {
    usuario : string;
    contrasenia : string;
    nombreWeb : string;
}

/*export interface SitioWeb{
    nombre: string;
    cuentas: Cuenta[];
}*/ //hicimos modificaciones en el modelado ya que nos pareció redundante hacer otra interface únicamente para asociar la cuenta del usuario con el nombre del sitio web

const secretKey = 'alagrandelepusecuca';


// Defino el tipo de retorno para indicar si la contraseña fue encontrada (Para evitar devolver null)
type ResultadoBusquedaContrasenia<T> =
        | { tipo: "exito", encontrado: T }
        | { tipo: "no_encontrado" }

function formatearResultado<T>(resultado: ResultadoBusquedaContrasenia<T>): string {
        if (resultado.tipo === "exito")
            return `Se encontro a ${resultado.encontrado}`;
        else
            return `No se encontro nada`;
}

async function abrirConexion() {
    return open({
        filename: 'db.sqlite',
        driver: sqlite3.Database
    })
}

//  CRUD
/*
export async function cifrarBaseDeDatos(clave: string = secretKey) {
    const contenido = fs.readFileSync('db.sqlite', 'utf8');
    const contenidoCifrado = CryptoJS.AES.encrypt(contenido, clave).toString();
    fs.writeFileSync('db.encrypted', contenidoCifrado);
    fs.unlinkSync('db.sqlite'); // Asegura que el archivo sin cifrar no permanezca
}


export async function descifrarBaseDeDatos(clave: string = secretKey) {
    const contenidoCifrado = fs.readFileSync('db.encrypted', 'utf8');
    const bytes = CryptoJS.AES.decrypt(contenidoCifrado, clave);
    const contenidoDescifrado = bytes.toString(CryptoJS.enc.Utf8);
    fs.writeFileSync('db.sqlite', contenidoDescifrado);
}*/


export async function agregarCuenta(usuario: string, contrasenia: string, nombreWeb: string): Promise<Cuenta> {
    const db = await abrirConexion(); // Asegúrate de que esta función maneja correctamente la conexión.

    // Utilizar sentencias preparadas para prevenir inyección SQL
    const query = `INSERT INTO Cuenta (usuario, contrasenia, nombreWeb) VALUES (?, ?, ?)`;
    await db.run(query, [usuario, contrasenia, nombreWeb]); // Usar parámetros en lugar de interpolación directa

    db.close(); // No olvides cerrar la conexión
    return { usuario, contrasenia, nombreWeb };
}

export async function consultarListado(): Promise<Cuenta[]> {
    // Arma un Listado que contiene todas las ciudades en la base de datos
    const db = await abrirConexion();
    //descifrarBaseDeDatos(process.env.SECRETKEY);
    const cuentas: Cuenta[] = await db.all<Cuenta[]>('SELECT * FROM Cuenta');
    //cifrarBaseDeDatos(process.env.SECRETKEY);
    console.log(cuentas);
    return cuentas;
}

export async function actualizarCuenta(nombreWeb: string, usuario: string, nuevaContrasenia: string): Promise<void> {
     // Buscamos el sitio web en nuestra base de datos
    // Si el sitio web existe y la cuenta también,
    // actualizamos la contraseña de esa cuenta.
    // Si no se encuentra el sitio web o la cuenta, no se realiza ninguna acción.
    // No es necesario devolver ningún valor explícito.    
    const db = await abrirConexion();
        
        const query = `UPDATE Cuenta SET contrasenia = ? WHERE nombreWeb = ? AND usuario = ?`;
        await db.run(query, [usuario, nuevaContrasenia, nombreWeb]);
        
        db.close();
    }

/* BORRAR CUENTA  
export async function borrarCuenta(nombreWeb: string, usuario: string): Promise<void> {
// Encontramos el índice del sitio web en nuestra base de datos
    // Si se encuentra el sitio web,
    // buscamos la cuenta dentro de ese sitio y la eliminamos.
    // Si no se encuentra el sitio web o la cuenta, no se realiza ninguna acción.
    // No es necesario devolver ningún valor explícito.
}*/

//ENCRIPTACION DB

export async function encriptarArchivo(rutaArchivo: string, contrasenia_maestra: string): Promise<void> {
    try {
        // Leer el contenido del archivo
        const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

        // Cifrar el contenido del archivo utilizando AES
        const contenidoCifrado = CryptoJS.AES.encrypt(contenido, contrasenia_maestra).toString();

        // Escribir el contenido cifrado en el mismo archivo
        fs.writeFileSync(rutaArchivo, contenidoCifrado);

        console.log(`Archivo encriptado correctamente: ${rutaArchivo}`);
    } catch (error) {
        console.error('Error al encriptar el archivo:', error);
    }
}

// DESENCRIPTAR DB CON CONTRASEÑA MAESTRA async?
export async function obtenerContrasenia(nombreWeb: string, usuario: string, contraseniaMaestra: string): Promise<ResultadoBusquedaContrasenia<string>> {
    // Desencriptar la base de datos utilizando la contraseña maestra
    // Buscar el sitio web en la base de datos
    // Buscar la cuenta dentro del sitio web
    // Devolver la contraseña si se encuentra, de lo contrario, devolver null
    try{

    }catch (error){
        
    }
    return { tipo: "no_encontrado" }; // Devuelve "no encontrado" cuando no se encuentra
}
//Encriptar archivo de base de datos de forma segura


// Ejemplo de uso
const rutaArchivo = 'archivo.txt';
const contraseniaMaestra = 'mi_contrasenia_maestra';

// Desencriptar la base de datos antes de acceder a las contraseñas
// Ejemplo de cómo obtener la contraseña de una cuenta específica
/*const contraseniaCuenta = obtenerContrasenia('Ejemplo', 'usuario1', contraseniaMaestra);
if (contraseniaCuenta) {
    console.log(`La contraseña de la cuenta es: ${contraseniaCuenta}`);
} else {
    console.log('La cuenta no se encuentra o la contraseña maestra es incorrecta.');
}*/

//generar contraseña segura
export const generarContraseniaSegura = (): string => {
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

//mostrar un listado de cuentas

export async function mostrarListadoCuentas(contraseniaMaestra: string): Promise<void> {
        // Leer y desencriptar la base de datos utilizando la contraseña maestra
        const contenidoCifrado = fs.readFileSync(rutaArchivo, 'utf-8');
        const contenidoDesencriptado = CryptoJS.AES.decrypt(contenidoCifrado, contraseniaMaestra).toString(CryptoJS.enc.Utf8);
        //AYUDA
        //const baseDatos: SitioWeb[] = JSON.parse(contenidoDesencriptado);

        // Mostrar listado de cuentas por sitio web
        // Manejar errores al mostrar el listado de cuentas
}

function mostrarContrasenia(usuario: string, contraseniaMaestra: string): ResultadoBusquedaContrasenia<string> {
    try {
        // Leer y desencriptar la base de datos utilizando la contraseña maestra
        const contenidoCifrado = fs.readFileSync(rutaArchivo, 'utf-8');
        const contenidoDesencriptado = CryptoJS.AES.decrypt(contenidoCifrado, contraseniaMaestra).toString(CryptoJS.enc.Utf8);
        //AYUDA
        //const baseDatos: SitioWeb[] = JSON.parse(contenidoDesencriptado);

        // Buscar la contraseña del usuario en todos los sitios web
        // Devolver la contraseña encontrada o "no encontrado" si no se encuentra
        
        //AYUDA
        return /*contraseniaEncontrada ? { tipo: "exito", encontrado: /*contraseniaEncontrada } : */{ tipo: "no_encontrado" };

    } catch (error) {
        console.error('Error al mostrar la contraseña:', error);
        return { tipo: "no_encontrado" }; // Devuelve "no encontrado" en caso de error
    }
}

//have i been pwoned?
async function verificarContraseniaComprometida(contrasenia: string): Promise<boolean> {
    try {
        // Definir el nombre de tu aplicación para el encabezado del usuario
        const nombreAplicacion = "SecurePassManager";

        // Llamar a la API de Have I Been Pwned
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/pwnedpassword/${contrasenia}`, {
            headers: {
                'user-agent': nombreAplicacion
            }
        });

        // Verificar si la contraseña está comprometida
        return response.status === 200;
    } catch (error) {
        console.error('Error al verificar la contraseña comprometida:', error);
        return false; // En caso de error, asumimos que la contraseña no está comprometida
    }
}

//PARA EL FRONT
/*
async function addAccount() {

    const data = { 'usuario':"pepetest", 'nombreWeb':"instagram.com" };

    fetch('http://localhost:3000/v1/listado/add-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('Cuenta agregada con éxito');
    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('Error al agregar la cuenta');
    });
}

testPassword();*/


//PARA EL FRONT
/*
async function desencriptarBase() {
    const data = { 'clave' : 'alagrandelepusecuca'};

    fetch('http://18.191.113.110/admin/descifrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('base desencriptada con exito');
    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('error al desencriptar la base');
    });
}

desencriptarBase();*/
/*
function encriptarBase(){
    /*
     const data = { 'clave' : 'alagrandelepusecuca'};

    fetch('http://18.191.113.110/admin/cifrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('base encriptada con exito');
    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('error al encriptar la base');
    });

}

function probandoData(){
    desencriptarBase();

     fetch('http://18.191.113.110/v1/listado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('base encriptada con exito');
    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('error al encriptar la base');
    });

    encriptarBase();
}
*/

export async function test() {
    const data = { 'usuario':"pepetest", 'nombreWeb':"instagram.com" };
    return data;
}
