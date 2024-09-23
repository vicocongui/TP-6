"use client";

import { useState } from "react";
import { agregarCuenta } from "./utils"; // Usamos la función de agregarCuenta desde utils

const RESPUESTA_INICIAL = { mensaje: "" };

function Home() {
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nombreUsuario = formData.get("usuario")?.toString();
    const nombreCuenta = formData.get("nombreWeb")?.toString();

    if (!nombreUsuario || !nombreCuenta) {
      setFormulario({ mensaje: "Falta el nombre de la cuenta o del usuario!" });
    } else {
      try {
        const respuesta = await agregarCuenta(nombreUsuario, nombreCuenta); // Llamada al backend sin claveMaestra
        setFormulario({
          mensaje: `Cuenta agregada con éxito: ${respuesta.usuario}`,
        });
      } catch (error) {
        // Manejo explícito de errores de tipo `unknown`
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al agregar la cuenta: ${error.message}`,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al agregar la cuenta.",
          });
        }
      }
    }
  };

  return (
    <div className="bg-zinc-950 rounded p-8">
      <h2 className="text-2xl font-bold mb-5">Agregar Cuenta</h2>
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
        <button className="btn btn-primary m-1" type="submit">
          Agregar
        </button>
      </form>
    </div>
  );
}

export default Home;
