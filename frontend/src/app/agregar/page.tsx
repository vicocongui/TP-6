"use client";

import { useState } from "react";
import { agregarCuenta } from "../utils"; // Importamos desde utils

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
        const respuesta = await agregarCuenta(nombreUsuario, nombreCuenta);
        setFormulario({
          mensaje: `Cuenta agregada con éxito`,
          success: true,
        });
        setTimeout(() => {
          setFormulario(RESPUESTA_INICIAL); // Limpiar el mensaje después de unos segundos
        }, 3000); // La alerta desaparecerá después de 3 segundos
      } catch (error) {
        if (error instanceof Error) {
          setFormulario({
            mensaje: `Error al agregar la cuenta: ${error.message}`,
            success: false,
          });
        } else {
          setFormulario({
            mensaje: "Error desconocido al agregar la cuenta.",
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
          Agregar
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
              {/* Botón de enviar con icono y color personalizado */}
              <div className="w-auto flex items-center mx-2">
                <button
                  className="btn flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Agregar
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
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
                  d="M11 13v3q0 .425.288.713T12 17t.713-.288T13 16v-3h3q.425 0 .713-.288T17 12t-.288-.712T16 11h-3V8q0-.425-.288-.712T12 7t-.712.288T11 8v3H8q-.425 0-.712.288T7 12t.288.713T8 13zm1 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
                />
              </svg>
              <span>Cuenta agregada con éxito!</span>
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
