import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

export function Residentes() {
    const navigate = useNavigate()
  const [residentes, setResidentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedResidente, setSelectedResidente] = useState(null)

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
// function handleDelete(id) {
//   const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este residente? Esta acción no se puede deshacer.');

//   if (confirmDelete) {
//     axios.delete(`http://localhost:3030/api/residentes/${id}`)
//       .then(() => {
//         setResidentes(prev => prev.filter(r => r.id !== id))
//         alert('Residente eliminado correctamente.')
//       })
//       .catch(error => {
//         console.error('Error al eliminar residente:', error)
//         alert('Hubo un error al intentar eliminar al residente.')
//       })
//   }
// }
function handleDelete(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    backdrop: true,
    customClass: {
      popup: 'rounded-xl'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://localhost:3030/api/residentes/${id}`)
        .then(() => {
          setResidentes(prev => prev.filter(r => r.id !== id))

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Residente eliminado correctamente',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#f0fdf4',
            iconColor: '#16a34a',
            customClass: {
              popup: 'rounded-lg shadow-lg'
            },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        })
        .catch(error => {
          console.error('Error al eliminar residente:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el residente.',
            confirmButtonColor: '#e3342f',
            customClass: {
              popup: 'rounded-xl'
            }
          })
        })
    }
  })
}


  function openModal(residente) {
    setSelectedResidente(residente)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedResidente(null)
  }

  if (loading) return <p className="text-center mt-8">Cargando residentes...</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Residentes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-700 border-b border-gray-300">ID</th>
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
              residentes.map((r) => (
                <tr
                  key={r.id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <td className="py-3 px-6 border-b border-gray-200">{r.id}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{r.nombre}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{r.apellido}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{r.correo_electronico}</td>
                  <td className="py-3 px-6 border-b border-gray-200 text-center space-x-2">
                    <button
                      title="Visualizar"
                      onClick={() => openModal(r)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                        title="Editar"
                        onClick={() => navigate(`/editar/${r.id}`)}
                        className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                        >
                        <FontAwesomeIcon icon={faEdit} />
                        </button>

                    <button
                        title="Borrar"
                        onClick={() => handleDelete(r.id)}
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

      {/* Modal */}
      {modalOpen && selectedResidente && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={closeModal}
              title="Cerrar"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedResidente.nombre} {selectedResidente.apellido}
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto */}
              <img
                src={selectedResidente.foto && selectedResidente.foto.startsWith('http') 
                    ? selectedResidente.foto 
                    : `http://localhost:3030${selectedResidente.foto || ''}`
                }
                alt={`${selectedResidente.nombre} ${selectedResidente.apellido}`}
                className="w-40 h-40 object-cover rounded-md"
                />

              {/* Info */}
              <div className="flex-1 space-y-2 text-gray-700">
                <p><strong>Género:</strong> {selectedResidente.genero}</p>
                <p><strong>Fecha de nacimiento:</strong> {selectedResidente.fecha_nacimiento}</p>
                <p><strong>Teléfono:</strong> {selectedResidente.telefono}</p>
                <p><strong>Correo electrónico:</strong> {selectedResidente.correo_electronico}</p>
                <p><strong>Instituto de procedencia:</strong> {selectedResidente.instituto_procedencia}</p>
                <p><strong>Carrera:</strong> {selectedResidente.carrera}</p>

                <div>
                  <strong>Lenguajes de programación:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {selectedResidente.lenguajes_programacion &&
                    Object.entries(selectedResidente.lenguajes_programacion).map(([lang, knows]) => (
                        knows ? <li key={lang}>{lang}</li> : null
                    ))}
                  </ul>
                </div>

                <p><strong>Notas:</strong> {selectedResidente.notas}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <br></br>
      <button
        onClick={() => navigate('/agregar')}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
  Agregar nuevo residente
</button>
<br></br>
        {/* <button
        onClick={() => navigate('/imagen')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Subir Imagen
        </button> */}
    </div>
  )
}
