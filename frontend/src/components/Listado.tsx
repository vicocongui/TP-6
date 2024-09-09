// Listado.tsx
import { Cuenta } from "../app/Modelo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

export interface ListadoProps { //info que necesita el componente para funcionar
    //cuenta: Cuenta[],
    listado: Cuenta, //clave maestra
    //claveMaestra: string
}



export default function Listado(props: ListadoProps ) {
    const [passwordView, setPasswordView] = useState(false);
    const toggleView = () => setPasswordView(!passwordView);
    
    return (
        <div className="bg-neutral shadow-xl">
            <div className="flex justify-between">
                <h3 className="font-bold text-2xl m-4">{props.listado.usuario}</h3>
                <button onClick={toggleView} className="btn btn-sm btn-circle btn-ghost">
                    <FontAwesomeIcon icon={passwordView ? faEyeSlash : faEye} /> 
                </button>
            </div>
            <p className="mb-5 text-2xl center text-center">{props.listado.nombreWeb}</p>
            {/* <p className={`${passwordView ? '' : 'hidden'} mb-10 text-2xl center text-center`}>{props.listado.contrasenia}</p> */}

      {passwordView ? (
        <p className="mb-5 text-2xl text-center">{props.listado.contrasenia}</p>
        
    ) : (
        <p className="mb-5 text-2xl text-center">**********</p>
        
      )
      
      }
      <button className="btn bg-gray-900  justify-center m-4 btn-sm  btn-ghost"> Actualizar </button>
        </div>
    )
}