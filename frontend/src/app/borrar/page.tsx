"use client";

import { useState } from "react";
import { borrarCuenta } from "../utils"; // Importamos la función para borrar cuenta

const RESPUESTA_INICIAL = { mensaje: "" };

function BorrarCuenta() {
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nombreUsuario = formData.get("usuario")?.toString();
    const nombreCuenta = formData.get("nombreWeb")?.toString();
    const claveSecreta = formData.get("clave")?.toString();

    if (!nombreUsuario || !nombreCuenta) {
      setFormulario({ mensaje: "Falta el nombre de la cuenta o del usuario!" });
    } else {
      try {
        // Llamamos a la función que borra la cuenta en utils
        const respuesta = await borrarCuenta(
          claveSecreta!,
          nombreUsuario,
          nombreCuenta
        );
        setFormulario({
          mensaje: `Cuenta ${nombreCuenta} del usuario ${nombreUsuario} eliminada con éxito.`,
        });
      } catch (error) {
        // Manejo explícito de errores de tipo `unknown`
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al borrar la cuenta: ${error.message}`,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al borrar la cuenta.",
          });
        }
      }
    }
  };

  return (
    <div className="bg-zinc-950 rounded p-8">
      <h2 className="text-2xl font-bold mb-5">Borrar Cuenta</h2>
      {formulario.mensaje && (
        <div role="alert" className="alert alert-info">
          <span>{formulario.mensaje}</span>
        </div>
      )}
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
        <input
          name="clave"
          placeholder="Clave secreta..."
          type="password"
          className="input input-bordered w-full m-1 max-w-xs"
          required
        />
        <button className="btn btn-danger m-1" type="submit">
          Borrar
        </button>
      </form>
    </div>
  );
}

export default BorrarCuenta;
