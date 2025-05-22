import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export function EditarResidente() {
  const lenguajesIniciales = {
    JavaScript: false,
    Python: false,
    'C++': false,
    Java: false,
    PHP: false,
    HTML: false,
    CSS: false,
    Dart: false,
  }

  const navigate = useNavigate()
  const { id } = useParams()

  const formInicial = {
    nombre: '',
    apellido: '',
    genero: '',
    fecha_nacimiento: '',
    telefono: '',
    correo_electronico: '',
    instituto_procedencia: '',
    carrera: '',
    lenguajes_programacion: { ...lenguajesIniciales },
    notas: '',
  }

  const [form, setForm] = useState(formInicial)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    axios
      .get(`http://localhost:3030/api/residentes/${id}`)
      .then((res) => {
        const data = res.data
        setForm({
          ...formInicial,
          ...data,
          lenguajes_programacion: {
            ...lenguajesIniciales,
            ...data.lenguajes_programacion,
          },
        })
      })
      .catch((err) => {
        alert('No se pudo cargar el residente')
        console.error(err)
        navigate('/')
      })
  }, [id])

  const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

  function validarTelefono(tel) {
    return /^\d{10}$/.test(tel)
  }

  function validarFecha(fecha) {
    if (!fecha) return false
    const hoy = new Date()
    const fechaInput = new Date(fecha)
    return fechaInput <= hoy
  }

  function validarCorreo(email) {
    // Regex simple para email válido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  function validarLenguajes(lenguajes) {
    return Object.values(lenguajes).some(Boolean)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target

    if (name in form.lenguajes_programacion) {
      setForm((prev) => ({
        ...prev,
        lenguajes_programacion: {
          ...prev.lenguajes_programacion,
          [name]: checked,
        },
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}

    // Nombre y apellido
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    else if (!soloLetrasRegex.test(form.nombre))
      newErrors.nombre = 'El nombre solo puede contener letras y espacios'

    if (!form.apellido.trim()) newErrors.apellido = 'El apellido es requerido'
    else if (!soloLetrasRegex.test(form.apellido))
      newErrors.apellido = 'El apellido solo puede contener letras y espacios'

    // Género
    if (!form.genero) newErrors.genero = 'Selecciona un género'

    // Fecha de nacimiento
    if (!form.fecha_nacimiento) newErrors.fecha_nacimiento = 'Fecha de nacimiento es requerida'
    else if (!validarFecha(form.fecha_nacimiento))
      newErrors.fecha_nacimiento = 'Fecha inválida o mayor al día de hoy'

    // Teléfono
    if (!form.telefono.trim()) newErrors.telefono = 'Teléfono es requerido'
    else if (!validarTelefono(form.telefono))
      newErrors.telefono = 'Teléfono debe tener 10 dígitos'

    // Correo electrónico
    if (!form.correo_electronico.trim()) newErrors.correo_electronico = 'Correo es requerido'
    else if (!validarCorreo(form.correo_electronico))
      newErrors.correo_electronico = 'Correo inválido'

    // Instituto procedencia
    if (!form.instituto_procedencia.trim())
      newErrors.instituto_procedencia = 'Instituto es requerido'

    // Carrera
    if (!form.carrera) newErrors.carrera = 'Selecciona una carrera'

    // Lenguajes de programación
    if (!validarLenguajes(form.lenguajes_programacion))
      newErrors.lenguajes_programacion = 'Selecciona al menos un lenguaje de programación'

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      axios
        .patch(`http://localhost:3030/api/residentes/${id}`, form)
        .then(() => {
          alert('Residente actualizado correctamente')
          navigate('/')
        })
        .catch((error) => {
          console.error('Error al actualizar:', error.response?.data)
          alert('Error al actualizar: ' + (error.response?.data?.message || error.message))
        })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Editar Residente</h2>

        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        {/* Apellido */}
        <div className="mb-4">
          <label htmlFor="apellido" className="block font-medium mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.apellido ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
        </div>

        {/* Género */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Género</label>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="genero"
              value="masculino"
              checked={form.genero === 'masculino'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Masculino</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="genero"
              value="femenino"
              checked={form.genero === 'femenino'}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">Femenino</span>
          </label>
          {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
        </div>

        {/* Fecha de nacimiento */}
        <div className="mb-4">
          <label htmlFor="fecha_nacimiento" className="block font-medium mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            max={new Date().toISOString().split('T')[0]}
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fecha_nacimiento && (
            <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="block font-medium mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            maxLength={10}
            placeholder="10 dígitos"
            value={form.telefono}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.telefono ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
        </div>

        {/* Correo electrónico */}
        <div className="mb-4">
          <label htmlFor="correo_electronico" className="block font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo_electronico"
            name="correo_electronico"
            value={form.correo_electronico}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.correo_electronico ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.correo_electronico && (
            <p className="text-red-500 text-sm mt-1">{errors.correo_electronico}</p>
          )}
        </div>

        {/* Instituto procedencia */}
        <div className="mb-4">
          <label htmlFor="instituto_procedencia" className="block font-medium mb-1">
            Instituto de procedencia
          </label>
          <input
            type="text"
            id="instituto_procedencia"
            name="instituto_procedencia"
            value={form.instituto_procedencia}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.instituto_procedencia ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.instituto_procedencia && (
            <p className="text-red-500 text-sm mt-1">{errors.instituto_procedencia}</p>
          )}
        </div>

        {/* Carrera */}
        <div className="mb-4">
          <label htmlFor="carrera" className="block font-medium mb-1">
            Carrera
          </label>
          <select
            id="carrera"
            name="carrera"
            value={form.carrera}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.carrera ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione una carrera</option>
            <option value="ISC">Ingeniería en Sistemas Computacionales</option>
            <option value="II">Ingeniería Industrial</option>
            <option value="IM">Ingeniería Mecatrónica</option>
            <option value="IE">Ingeniería en Electrónica</option>
            {/* agrega las demás opciones que necesites */}
          </select>
          {errors.carrera && <p className="text-red-500 text-sm mt-1">{errors.carrera}</p>}
        </div>

        {/* Lenguajes de programación */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Lenguajes de programación</label>
          <div className="grid grid-cols-2 gap-2 max-w-md">
            {Object.keys(form.lenguajes_programacion).map((lang) => (
              <label key={lang} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={lang}
                  checked={form.lenguajes_programacion[lang]}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{lang}</span>
              </label>
            ))}
          </div>
          {errors.lenguajes_programacion && (
            <p className="text-red-500 text-sm mt-1">{errors.lenguajes_programacion}</p>
          )}
        </div>

        {/* Notas */}
        <div className="mb-4">
          <label htmlFor="notas" className="block font-medium mb-1">
            Notas
          </label>
          <textarea
            id="notas"
            name="notas"
            value={form.notas}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </form>
    </div>
  )
}
