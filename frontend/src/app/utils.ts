import axios from 'axios';

// Tipos para la respuesta de las cuentas
interface Cuenta {
    usuario: string;
    nombreWeb: string;
    contrasenia: string;
}

// URL base del backend
const BASE_URL = 'http://18.221.157.177:3000/v1';

// Función para agregar una cuenta (POST)
export const agregarCuenta = async (usuario: string, nombreWeb: string): Promise<Cuenta> => {
    try {
        const response = await axios.post<Cuenta>(`${BASE_URL}/listado/add-account`, {
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
        const response = await axios.post<Cuenta[]>(`${BASE_URL}/listado`, { clave });
        return response.data;
    } catch (error) {
        console.error('Error al consultar el listado:', error);
        throw new Error('No se pudo consultar el listado de cuentas');
    }
};

// Función para actualizar una cuenta (PUT)
export const actualizarCuenta = async (usuario: string, nombreWeb: string): Promise<Cuenta> => {
    try {
        const response = await axios.put<Cuenta>(`${BASE_URL}/usuario/update`, {
            usuario,
            nombreWeb,
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la cuenta:', error);
        throw new Error('No se pudo actualizar la cuenta');
    }
};

// Función para borrar una cuenta (DELETE)
export const borrarCuenta = async (clave: string, usuario: string, nombreWeb: string): Promise<void> => {
    try {
        const response = await axios.delete(`${BASE_URL}/usuario/delete`, {
            data: { clave, usuario, nombreWeb },
        });
        if (response.status === 200) {
            console.log(`Cuenta ${usuario} en ${nombreWeb} eliminada con éxito.`);
        }
    } catch (error) {
        console.error('Error al borrar la cuenta:', error);
        throw new Error('No se pudo borrar la cuenta');
    }
};
