import { Cuenta } from "./Modelo";

export async function api<T>(url: string): Promise<T> {
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}${url}`;
    const response = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json() as Promise<T>;
}

export async function traerListado(clave: string) {
    await desencriptarBase(clave);

    fetch(`${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}/v1/listado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('Base desencriptada con éxito');
    })
    .catch((error) => {
        console.error('Error:', error);
        console.log('Error al desencriptar la base');
    });

    await encriptarBase(clave);
}

export interface AgregarCuentaParams { 
    nombreWeb: string,
    usuario: string,
    claveMaestra: string
};

export interface AgregarCuentaRespuesta { 
    mensaje: string 
}

export async function agregarCuenta(params: AgregarCuentaParams): Promise<AgregarCuentaRespuesta> {
    await desencriptarBase(params.claveMaestra);
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}/v1/listado/add-account`;

    const response = await fetch(urlCompleta, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });
    
    await encriptarBase(params.claveMaestra);

    if (!response.ok) {
        const body = await response.text();
        return { mensaje: `Error agregando cuenta: ${body}` };
    } else {
        const cuenta = await response.json() as Cuenta;
        return { mensaje: `Cuenta ${cuenta.usuario} en ${cuenta.nombreWeb} agregada con éxito!` };
    }
}

export async function desencriptarBase(clave: string): Promise<number> {
    const data = { 'clave': clave };
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}/admin/descifrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error('Error al desencriptar la base');
        return 400;
    }
    
    console.log('Éxito al desencriptar la base');
    return 200;
}

export async function encriptarBase(clave: string): Promise<number> {
    const data = { 'clave': clave };
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}/admin/cifrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error('Error al encriptar la base');
        return 400;
    }
    
    console.log('Éxito al encriptar la base');
    return 200;
}

export async function actualizarClave(params: AgregarCuentaParams): Promise<AgregarCuentaRespuesta> {
    await desencriptarBase(params.claveMaestra);
    const urlCompleta = `${process.env.NEXT_PUBLIC_URL_API || 'http://localhost:5000'}/v1/usuario/update`;

    const response = await fetch(urlCompleta, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });
    
    await encriptarBase(params.claveMaestra);

    if (!response.ok) {
        const body = await response.text();
        return { mensaje: `Error actualizando clave: ${body}` };
    } else {
        return { mensaje: `Clave actualizada con éxito!` };
    }
}
