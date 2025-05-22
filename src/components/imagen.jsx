import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export function SubirImagen() {
  const [imagen, setImagen] = useState(null)
  const [id, setId] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [vistaPrevia, setVistaPrevia] = useState(null)

  const navigate = useNavigate() 

  const handleFileChange = (e) => {
    const archivo = e.target.files[0]
    setImagen(archivo)
    if (archivo) {
      setVistaPrevia(URL.createObjectURL(archivo))
    } else {
      setVistaPrevia(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imagen || !id) {
      setMensaje('Selecciona una imagen y proporciona un ID.')
      return
    }

    const formData = new FormData()
    formData.append('imagen', imagen)
    formData.append('id', id)

    try {
      setSubiendo(true)
      const response = await axios.post('http://localhost:3030/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setMensaje(`Imagen subida correctamente: ${response.data.data.foto}`)
    } catch (error) {
      console.error(error)
      setMensaje('Error al subir la imagen.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Subir una Imagen</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <input
          type="number"
          placeholder="ID del residente"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        {vistaPrevia && (
          <div className="mb-4">
            <img
              src={vistaPrevia}
              alt="Vista previa"
              className="max-w-full h-auto border rounded"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={subiendo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mr-2"
        >
          {subiendo ? 'Subiendo...' : 'Subir Imagen'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/')} 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Regresar
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </div>
  )
}
