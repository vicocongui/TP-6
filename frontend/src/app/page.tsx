"use client";

import { useState } from "react";
import {
  AgregarCuentaParams,
  AgregarCuentaRespuesta,
  agregarCuenta,
} from "./utils";

const RESPUESTA_INICIAL = { mensaje: "" };

function Home() {
  // Estado para manejar la respuesta del formulario
  const [formulario, setFormulario] =
    useState<AgregarCuentaRespuesta>(RESPUESTA_INICIAL);

  // La función que se llama al enviar el formulario
  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevenir el comportamiento predeterminado del formulario (refrescar la página)
    event.preventDefault();

    // Recoger los datos del formulario
    const formData = new FormData(event.currentTarget);
    const nombreUsuario = formData.get("usuario")?.toString();
    const nombreCuenta = formData.get("nombreWeb")?.toString();

    // Validar que los campos requeridos no estén vacíos
    if (!nombreUsuario || !nombreCuenta) {
      setFormulario({ mensaje: "Falta el nombre de la cuenta o del usuario!" });
    } else {
      // Definir los parámetros para la API
      const params: AgregarCuentaParams = {
        claveMaestra: "alagrandelepusecuca",
        usuario: nombreUsuario,
        nombreWeb: nombreCuenta,
      };

      // Llamar a la función agregarCuenta y manejar la respuesta
      try {
        const respuesta = await agregarCuenta(params);
        setFormulario(respuesta);
      } catch (error) {
        setFormulario({ mensaje: `Error al agregar la cuenta: ${error}` });
      }
    }
  };

  // Componente JSX
  return (
    <div className="bg-zinc-950 rounded p-8">
      <h2 className="text-2xl font-bold mb-5">Agregar Cuenta</h2>

      {/* Mostrar mensaje de éxito o error */}
      {formulario.mensaje && (
        <div role="alert" className="alert alert-info">
          <span>{formulario.mensaje}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={enviarFormulario}>
        <input
          name="usuario"
          placeholder="Nombre del usuario..."
          type="text"
          className="input input-bordered w-full m-1 max-w-xs"
          required
        />
        <input
          name="nombreWeb"
          placeholder="Nombre de la web..."
          type="text"
          className="input input-bordered w-full m-1 max-w-xs"
          required
        />
        <button className="btn btn-primary m-1" type="submit">
          Agregar
        </button>
      </form>
    </div>
  );
}

export default Home;
