"use client"

import { useEffect, useState } from "react";
import { Cuenta } from "../Modelo";
import { AgregarCuentaParams, AgregarCuentaRespuesta, agregarCuenta } from "../utils";
import Link from 'next/link'

const RESPUESTA_INICIAL = { mensaje: "" };

export function Home() {
  // El estado del formulario
  const [formulario, setFormulario] = useState<AgregarCuentaRespuesta>(RESPUESTA_INICIAL);

  // La funcion que se llama al mandar el formulario
  const enviarFormulario = async (formData: FormData) => {
    const nombreUsuario = formData.get('usuario');
    const nombreCuenta = formData.get('nombreWeb');
    if (!nombreUsuario || !nombreCuenta) {
      setFormulario({ mensaje: "Falta el nombre de la Cuenta!" });
    }
    else {
      const params: AgregarCuentaParams = {
        claveMaestra: 'alagrandelepusecuca',
        usuario: nombreUsuario.toString(),
        nombreWeb: nombreCuenta.toString()
      };

      agregarCuenta(params)
        .then(setFormulario);
    }
  };


  // DOM
  return (
    < >
      {/* <Link href="/" className="btn" prefetch={true}>
        Volver al listado
      </Link> */}

<div className="bg-zinc-950 rounded p-8">
      <h2 className="text-2xl font-bold mb-5">Agregar Cuenta</h2>


     

      {formulario.mensaje != ""
        ? <div role="alert" className="alert alert-info">
          <span>{formulario?.mensaje}</span>
        </div>
        : ""
      }

      <form action={enviarFormulario} className="">
{/*         <input name="nombreCiudad" placeholder="Nombre de la ciudad...." type="text" className="input input-bordered w-full max-w-xs"></input>
 */}     <input name="usuario" placeholder="Nombre del usuario..." type="text" className="input input-bordered w-full m-1 max-w-xs" required />
        <input name="nombreWeb" placeholder="Nombre de la web..." type="text" className="input input-bordered w-full m-1 max-w-xs" required />
        <button className="btn btn-primary m-1 " type="submit">Agregar</button>
      </form>
      </div>
    </>
  );
}
