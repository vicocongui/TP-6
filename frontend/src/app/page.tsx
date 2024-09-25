"use client";

import { useState, useEffect } from "react";
import { consultarListado } from "./utils"; // Importamos la función de consultarListado
import PopUpAgregar from "../components/Login";
import { useRouter } from "next/navigation"; // Hook para redireccionar

const RESPUESTA_INICIAL = { mensaje: "" };
const ELEMENTOS_POR_PAGINA = 6; // Define cuántos elementos mostrar por página

function Home() {
  const [claveMaestra, setClaveMaestra] = useState<string | null>(null);
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);
  const [listadoCuentas, setListadoCuentas] = useState<any[]>([]);
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const router = useRouter(); // Hook para la redirección

  const totalPaginas = Math.ceil(listadoCuentas.length / ELEMENTOS_POR_PAGINA);

  // Efecto para cargar el listado de cuentas después de ingresar la clave maestra
  useEffect(() => {
    const cargarListado = async () => {
      if (claveMaestra) {
        try {
          const cuentas = await consultarListado(claveMaestra);
          setListadoCuentas(cuentas);
        } catch (error) {
          if (error instanceof Error) {
            setFormulario({
              mensaje: `Error al cargar el listado: ${error.message}`,
            });
          } else {
            setFormulario({
              mensaje: "Error desconocido al cargar el listado.",
            });
          }
        }
      }
    };

    cargarListado();
  }, [claveMaestra]);

  // Si no hay clave maestra, mostramos el modal de login
  if (!claveMaestra) {
    return <PopUpAgregar setClaveMaestra={setClaveMaestra} />;
  }

  // Funciones para redirigir a las rutas de actualizar, agregar y borrar
  const redirigirAActualizar = () => router.push("/actualizar");
  const redirigirAAgregar = () => router.push("/agregar");
  const redirigirABorrar = () => router.push("/borrar");

  // Calcular los elementos a mostrar según la página actual
  const indiceInicial = (paginaActual - 1) * ELEMENTOS_POR_PAGINA;
  const elementosActuales = listadoCuentas.slice(
    indiceInicial,
    indiceInicial + ELEMENTOS_POR_PAGINA
  );

  // Funciones para cambiar de página
  const cambiarPagina = (pagina: number) => {
    if (pagina > 0 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return (
    <div className="p-8">
      {/* Contenedor con flex para alinear el título y los botones */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Todas tus
          </span>{" "}
          Cuentas
        </h1>

        {/* Botones alineados a la derecha */}
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={redirigirAAgregar}
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
          </button>
          <button
            className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded"
            onClick={redirigirAActualizar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"
              />
            </svg>
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={redirigirABorrar}
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
          </button>
        </div>
      </div>

      {formulario.mensaje && (
        <div role="alert" className="alert alert-info">
          <span>{formulario.mensaje}</span>
        </div>
      )}

      {/* Usamos grid responsive para el listado de cuentas */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {elementosActuales.map((cuenta, index) => (
          <li
            key={index}
            className="text-black border-gray-300 bg-gray-100 rounded border dark:text-white p-8 mb-2"
            style={{ wordBreak: "break-word" }}
          >
            <strong>Usuario:</strong> {cuenta.usuario} <br />
            <strong>Nombre Web:</strong> {cuenta.nombreWeb} <br />
            <strong>Contraseña:</strong> {cuenta.contrasenia}
          </li>
        ))}
      </ul>

      {/* Paginador */}
      <div className="join mt-4 flex justify-center">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
          <button
            key={numero}
            className={`join-item btn ${
              numero === paginaActual ? "btn-active bg-sky-400" : ""
            }`}
            onClick={() => cambiarPagina(numero)}
          >
            {numero}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
