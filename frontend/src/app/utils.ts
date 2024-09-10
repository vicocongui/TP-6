import { Cuenta } from "./Modelo";
/* const cuentas: Cuenta[] = [
    { usuario: "jdoe", contrasenia: "Password123!", nombreWeb: "google.com" },
    { usuario: "asmith", contrasenia: "SecurePass456!", nombreWeb: "facebook.com" },
    { usuario: "mjones", contrasenia: "Passw0rd!", nombreWeb: "amazon.com" },
    { usuario: "lbrown", contrasenia: "MyP@ssw0rd", nombreWeb: "twitter.com" },
    { usuario: "kwhite", contrasenia: "P@ssword1234", nombreWeb: "instagram.com" },
    { usuario: "tclark", contrasenia: "Password!567", nombreWeb: "linkedin.com" },
    { usuario: "sdavis", contrasenia: "123SecurePass", nombreWeb: "github.com" },
    { usuario: "rwalker", contrasenia: "S3cureP@ss!", nombreWeb: "netflix.com" },
    { usuario: "jyoung", contrasenia: "Pass1234!", nombreWeb: "reddit.com" },
    { usuario: "hking", contrasenia: "MySecureP@ss", nombreWeb: "youtube.com" },
]; */
// utils.ts
export async function api<T>(url: string): Promise<T> {
   const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}${url}`; //tira error porque no anda :)
    const response = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }//,;
    })
    if (!response.ok) {
        throw new Error(response.statusText);
    } 
    return await (response.json() as Promise<T>);
    //return await Promise.resolve(cuentas as unknown as Promise<T>);
}

export async function traerListado(clave: string){
    desencriptarBase(clave);

     fetch(`${process.env.NEXT_PUBLIC_URL_API}/v1/listado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }//,
        //body: JSON.stringify(data)
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

    encriptarBase(clave);
}
export interface AgregarCuentaParams { 
    nombreWeb: string,
    usuario: string,
    claveMaestra: string
};
export interface AgregarCuentaRespuesta { mensaje: string }

export async function agregarCuenta(params: AgregarCuentaParams): Promise<AgregarCuentaRespuesta> {
    desencriptarBase(params.claveMaestra)
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}/v1/listado/add-account`;

    const response = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });
    
    encriptarBase(params.claveMaestra)

    if (!response.ok) {
        var body = await response.text();
        return { mensaje: `Error agregando cuenta: ${body}` };
    }
    else {
        var cuenta = await (response.json() as Promise<Cuenta>);
        return { mensaje: `Cuenta ${cuenta.usuario} en ${cuenta.nombreWeb} agregada con exito!` };
    }
}

export async function desencriptarBase(clave:string):Promise<number> {
    //const data = { 'clave' : 'alagrandelepusecuca'};
    console.log(clave)

    const data = { 'clave' : clave}
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/descifrar`, {
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
        return 200;

    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('error al desencriptar la base');
        return 400;

    });        return 200;

}



export async function encriptarBase(clave:string):Promise<number>{
    
     //const data = { 'clave' : 'alagrandelepusecuca'};
     console.log(clave)
     const data = { 'clave' : clave}

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/admin/cifrar`, {
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

    return 200;

}

export async function actualizarClave(params: AgregarCuentaParams): Promise<AgregarCuentaRespuesta> {
    desencriptarBase(params.claveMaestra)
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API}/v1/usuario/update`;

    const response = await fetch(urlCompleta, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });
    
    encriptarBase(params.claveMaestra)

    if (!response.ok) {
        var body = await response.text();
        return { mensaje: `Error actualizando clave ${body}` };
    }
    else {
        var cuenta = await (response.json() as Promise<Cuenta>);
        return { mensaje: `Clave actualizada con exito!` };
    }
}
/*
funcion agregar cuenta
para eso encripto y desencripto la base

pasar en onclick(update)a la llamanda desde html pasar parametros que se necesitan devuelve exito 200
*/