import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

export function Residentes() {
  const [residentes, setResidentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3030/api/residentes') 
      .then(response => {
        setResidentes(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error al cargar residentes:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-center mt-8">Cargando residentes...</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Residentes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-700 border-b border-gray-300">Nombre</th>
              <th className="py-3 px-6 text-left font-medium text-gray-700 border-b border-gray-300">Apellido</th>
              <th className="py-3 px-6 text-left font-medium text-gray-700 border-b border-gray-300">Correo</th>
              <th className="py-3 px-6 text-center font-medium text-gray-700 border-b border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {residentes.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">No hay residentes.</td>
              </tr>
            ) : (
              residentes.map(({ id, nombre, apellido, correo_electronico }) => (
                <tr
                  key={id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="py-3 px-6 border-b border-gray-200">{nombre}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{apellido}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{correo_electronico}</td>
                  <td className="py-3 px-6 border-b border-gray-200 text-center space-x-2">
                    <button
                      title="Visualizar"
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      title="Editar"
                      className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      title="Borrar"
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
