"use client";

import { useState } from "react";
import { actualizarCuenta } from "../utils"; // Importamos desde utils

const RESPUESTA_INICIAL = { mensaje: "", success: false };

function Home() {
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);

  const enviarFormulario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nombreUsuario = formData.get("usuario")?.toString();
    const nombreCuenta = formData.get("nombreWeb")?.toString();

    if (!nombreUsuario || !nombreCuenta) {
      setFormulario({
        mensaje: "Falta el nombre de la cuenta o del usuario!",
        success: false,
      });
    } else {
      try {
        const respuesta = await actualizarCuenta(nombreUsuario, nombreCuenta);
        setFormulario({
          mensaje: `Cuenta actualizada con éxito`,
          success: true,
        });
        setTimeout(() => {
          setFormulario(RESPUESTA_INICIAL); // Limpiar el mensaje después de unos segundos
        }, 3000); // La alerta desaparecerá después de 3 segundos
      } catch (error) {
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al actualizar la cuenta: ${error.message}`,
            success: false,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al actualizar la cuenta.",
            success: false,
          });
        }
      }
    }
  };

  return (
    <div className="p-5 relative">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 mb-5 pb-8">
          Actualizar
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
                    placeholder="Usuario..."
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
              {/* Botón de actualizar con icono y color personalizado */}
              <div className="w-auto flex items-center mx-2">
                <button
                  className="btn flex items-center bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Actualizar
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
                className="h-6 w-6 shrink-0 stroke-current mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Cuenta actualizada con éxito!</span>
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

export default Home;
