"use client";

import { useState } from "react";
import { consultarListado } from "./utils"; // Usamos la función de agregarCuenta desde utils


const RESPUESTA_INICIAL = { mensaje: "" };

function Home() {
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const secretKey= formData.get("clave")?.toString();


    if (secretKey != "alagrandelepusecuca") {
      setFormulario({ mensaje: "Falta el nombre de la cuenta o del usuario!" });
    } else {
      try {
        const respuesta = await consultarListado(secretKey); // Llamada al backend sin claveMaestra
        setFormulario({
          mensaje: `holiss`,
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
      <h2 className="text-2xl font-bold mb-5">Agregar contraseña secreta</h2>
      {formulario.mensaje && (
        <div role="alert" className="alert alert-info">
          <span>{formulario.mensaje}</span>
        </div>
      )}
      <form onSubmit={enviarFormulario}>
        <input
          name="clave"
          placeholder="constrasenia secrettaaa..."
          type="text"
          className="input input-bordered w-full m-1 max-w-xs"
          required
        />
        <button className="btn btn-primary m-1" type="submit">
          ingresa
        </button>
      </form>
    </div>
  );
}

export default Home;
