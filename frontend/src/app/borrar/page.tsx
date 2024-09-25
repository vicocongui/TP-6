"use client";

import { useState } from "react";
import { borrarCuenta } from "../utils"; // Importamos la función para borrar cuenta

const RESPUESTA_INICIAL = { mensaje: "", success: false };

function BorrarCuenta() {
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nombreUsuario = formData.get("usuario")?.toString();
    const nombreCuenta = formData.get("nombreWeb")?.toString();
    const claveSecreta = formData.get("clave")?.toString();

    if (!nombreUsuario || !nombreCuenta || !claveSecreta) {
      setFormulario({
        mensaje:
          "Falta el nombre de la cuenta, del usuario o la clave secreta!",
        success: false,
      });
    } else {
      try {
        const respuesta = await borrarCuenta(
          claveSecreta!,
          nombreUsuario,
          nombreCuenta
        );
        setFormulario({
          mensaje: `Cuenta ${nombreCuenta} del usuario ${nombreUsuario} eliminada con éxito.`,
          success: true,
        });
        setTimeout(() => {
          setFormulario(RESPUESTA_INICIAL); // Limpiar el mensaje después de unos segundos
        }, 3000); // La alerta desaparecerá después de 3 segundos
      } catch (error) {
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al borrar la cuenta: ${error.message}`,
            success: false,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al borrar la cuenta.",
            success: false,
          });
        }
      }
    }
  };

  return (
    <div className="p-5 relative">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-sky-400 mb-5 pb-8">
          Borrar
        </span>{" "}
        Cuenta
      </h1>

      <form onSubmit={enviarFormulario}>
        <div className="mt-2">
          {/* Sección Nombre del Usuario */}
          <div className="flex flex-col md:flex-row border-gray-200 pt-8 mb-4">
            <div className="flex-1 flex flex-col md:flex-row">
              <div className="w-full flex-1 mx-2">
                <div className="my-2 p-1 bg-white flex border border-gray-200 rounded">
                  <input
                    name="usuario"
                    placeholder="Nombre del usuario..."
                    type="text"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="w-full flex-1 mx-2">
                <div className="my-2 p-1 bg-white flex border border-gray-200 rounded">
                  <input
                    name="nombreWeb"
                    placeholder="Nombre del sitio web..."
                    type="text"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="w-full flex-1 mx-2">
                <div className="my-2 p-1 bg-white flex border border-gray-200 rounded">
                  <input
                    name="clave"
                    placeholder="Clave secreta..."
                    type="password"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Botón de borrar con icono y color personalizado */}
              <div className="w-auto flex items-center mx-2">
                <button
                  className="btn flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Borrar
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      fill="currentColor"
                      d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Alerta debajo de los labels */}
          {formulario.success && (
            <div
              role="alert"
              className="alert alert-success flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-100 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                />
              </svg>
              <span>Cuenta eliminada con éxito!</span>
            </div>
          )}

          {!formulario.success && formulario.mensaje && (
            <div
              role="alert"
              className="alert alert-error flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-100"
            >
              <span>{formulario.mensaje}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default BorrarCuenta;
