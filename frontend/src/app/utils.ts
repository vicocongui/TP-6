import axios from 'axios';

// Tipos para la respuesta de agregarCuenta y actualizarCuenta
interface Cuenta {
    usuario: string;
    nombreWeb: string;
    contrasenia: string;
}

// Función para agregar una cuenta (POST)
export const agregarCuenta = async (usuario: string, nombreWeb: string): Promise<Cuenta> => {
    try {
        const response = await axios.post<Cuenta>('http://localhost:5000/v1/listado/add-account', {
            usuario,
            nombreWeb,
        });
        return response.data;
    } catch (error) {
        console.error('Error al agregar la cuenta:', error);
        throw new Error('No se pudo agregar la cuenta');
    }
};

// Función para consultar el listado de cuentas (POST)
export const consultarListado = async (clave: string): Promise<Cuenta[]> => {
    try {
        const response = await axios.post<Cuenta[]>('http://localhost:5000/v1/listado', { clave });
        return response.data;
    } catch (error) {
        console.error('Error al consultar el listado:', error);
        throw new Error('No se pudo consultar el listado de cuentas');
    }
};

// Función para actualizar una cuenta (PUT)
export const actualizarCuenta = async (usuario: string, nombreWeb: string): Promise<Cuenta> => {
    try {
        const response = await axios.put<Cuenta>('http://localhost:5000/v1/usuario/update', {
            usuario,
            nombreWeb,
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la cuenta:', error);
        throw new Error('No se pudo actualizar la cuenta');
    }
};
