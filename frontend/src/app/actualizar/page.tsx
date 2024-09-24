"use client";

import { useState } from "react";
import { actualizarCuenta } from "../utils";

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
        const respuesta = await actualizarCuenta(nombreUsuario, nombreCuenta);
        setFormulario({
          mensaje: `Cuenta actualizada con éxito`,
        });
      } catch (error) {
        // Manejo explícito de errores de tipo `unknown`
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al actualizar la cuenta: ${error.message}`,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al actualizar la cuenta.",
          });
        }
      }
    }
  };

  return (
    <div className="bg-zinc-950 rounded p-8">
      <h2 className="text-2xl font-bold mb-5">Actualizar Cuenta</h2>
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
          Actualizar
        </button>
      </form>
    </div>
  );
}

export default Home;
