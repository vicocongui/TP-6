"use client";

import { useState } from "react";
import { consultarListado } from "./utils"; // Importamos la función de consultarListado
import PopUpAgregar from "../components/Login"; // Importamos el componente de login

const RESPUESTA_INICIAL = { mensaje: "" };

function Home() {
  // Estados para la clave maestra y el formulario
  const [claveMaestra, setClaveMaestra] = useState<string | null>(null);
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const secretKey = formData.get("clave")?.toString();

    if (secretKey !== process.env.SECRETKEY) {
      setFormulario({ mensaje: "Clave incorrecta!" });
    } else {
      try {
        const respuesta = await consultarListado(secretKey!);
        setFormulario({
          mensaje: `Clave ingresada correctamente.`,
        });
      } catch (error) {
        // Manejo explícito de errores de tipo `unknown`
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Contraseña incorrecta :c`,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al consultar el listado.",
          });
        }
      }
    }
  };

  // Si no hay clave maestra, mostramos el modal de login
  if (!claveMaestra) {
    return <PopUpAgregar setClaveMaestra={setClaveMaestra} />;
  }

  // Si ya hay clave maestra, mostramos el contenido de la app
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
          placeholder="Ingresa tu contraseña secreta..."
          type="text"
          className="input input-bordered w-full m-1 max-w-xs"
          required
        />
        <button className="btn btn-primary m-1" type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Home;
