import React, { useState } from "react";
import { consultarListado } from "../app/utils"; // Importamos la función para consultar el listado

interface agregarProps {
  setClaveMaestra: (clave: string) => void;
}

export default function PopUpAgregar(props: agregarProps) {
  const [clave, setClave] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ingresarAApp = async () => {
    try {
      // Llamamos a la función para consultar el listado de cuentas, pasando la clave
      const data = await consultarListado(clave);
      if (data.length > 0) {
        // Si la clave es correcta y retorna cuentas, guardamos la clave maestra
        props.setClaveMaestra(clave);
      } else {
        // Si no retorna cuentas, mostramos un mensaje de error
        setErrorMessage("Clave incorrecta");
      }
    } catch (error) {
      // Manejo de errores, mostrando un mensaje más claro al usuario
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage("Ocurrió un error desconocido.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div
        className="bg-white p-8 rounded-lg shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-black font-bold mb-4">Ingresar a App</h2>
        <p className="mb-4">Ingrese su clave maestra</p>
        <input
          type="text"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="mb-2 px-4 py-2 w-full bg-white border rounded"
          placeholder="********"
        />
        {errorMessage && <p className="text-red-500 pb-2">{errorMessage}</p>}
        <div className="flex">
          <button
            className="px-4 py-2 bg-gray-500 w-full text-white rounded"
            onClick={ingresarAApp}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}
