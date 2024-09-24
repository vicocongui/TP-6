"use client";

import { useState, useEffect } from "react";
import { consultarListado } from "./utils"; // Importamos la función de consultarListado
import PopUpAgregar from "../components/Login";
import { useRouter } from "next/navigation"; // Hook para redireccionar

const RESPUESTA_INICIAL = { mensaje: "" };

function Home() {
  const [claveMaestra, setClaveMaestra] = useState<string | null>(null);
  const [formulario, setFormulario] = useState(RESPUESTA_INICIAL);
  const [listadoCuentas, setListadoCuentas] = useState<any[]>([]); // Estado para el listado de cuentas
  const router = useRouter(); // Hook para la redirección

  // Efecto para cargar el listado de cuentas después de ingresar la clave maestra
  useEffect(() => {
    const cargarListado = async () => {
      if (claveMaestra) {
        try {
          const cuentas = await consultarListado(claveMaestra); // Consulta el listado de cuentas
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
  }, [claveMaestra]); // Se ejecuta cuando cambia la claveMaestra

  // Si no hay clave maestra, mostramos el modal de login
  if (!claveMaestra) {
    return <PopUpAgregar setClaveMaestra={setClaveMaestra} />;
  }

  // Funciones para redirigir a las rutas de actualizar, agregar y borrar
  const redirigirAActualizar = () => router.push("/actualizar");
  const redirigirAAgregar = () => router.push("/agregar");
  const redirigirABorrar = () => router.push("/borrar");

  return (
    <div className="bg-stone-200 rounded p-8">
      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Todas tus
        </span>{" "}
        Cuentas
      </h1>

      {formulario.mensaje && (
        <div role="alert" className="alert alert-info">
          <span>{formulario.mensaje}</span>
        </div>
      )}

      {/* Mostramos el listado de cuentas con la contraseña desencriptada */}
      <ul className="mb-4">
        {listadoCuentas.map((cuenta, index) => (
          <li key={index} className="text-black dark:text-white  mb-2">
            <strong>Usuario:</strong> {cuenta.usuario} <br />
            <strong>Nombre Web:</strong> {cuenta.nombreWeb} <br />
            <strong>Contraseña:</strong> {cuenta.contrasenia}{" "}
            {/* Contraseña desencriptada */}
          </li>
        ))}
      </ul>

      {/* Botones para acciones */}
      <div className="flex gap-4">
        <button className="btn btn-primary" onClick={redirigirAActualizar}>
          Actualizar
        </button>
        <button className="btn btn-secondary" onClick={redirigirAAgregar}>
          Agregar
        </button>
        <button className="btn btn-danger" onClick={redirigirABorrar}>
          Borrar
        </button>
      </div>
    </div>
  );
}

export default Home;
