import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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
const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
const schema = yup.object().shape({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .matches(soloLetrasRegex, 'El nombre solo puede contener letras y espacios'),
  apellido: yup
    .string()
    .required('El apellido es requerido')
    .matches(soloLetrasRegex, 'El apellido solo puede contener letras y espacios'),
  genero: yup.string().required('Selecciona un género'),
   fecha_nacimiento: yup
    .string()
    .required('Fecha de nacimiento es requerida')
    .max(10, 'La fecha no debe tener más de 10 caracteres')
    .test(
      'fecha-valida',
      'Fecha inválida o mayor al día de hoy',
      value => {
        if (!value) return false
        const fechaInput = new Date(value)
        const hoy = new Date()
        return fechaInput <= hoy && value.length === 10
      }
    ),
  telefono: yup
    .string()
    .required('Teléfono es requerido')
    .matches(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
  correo_electronico: yup.string().required('Correo es requerido').email('Correo inválido'),
  instituto_procedencia: yup.string().required('Instituto es requerido'),
  carrera: yup.string().required('Selecciona una carrera'),
  lenguajes_programacion: yup.object().test(
    'checkLenguajes',
    'Selecciona al menos un lenguaje de programación',
    (value) => Object.values(value).some(Boolean)
  ),
  notas: yup.string(),
})


export function NuevoResidente() {
  const navigate = useNavigate()
  const [imagen, setImagen] = React.useState(null)
  const [vistaPrevia, setVistaPrevia] = React.useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      setVistaPrevia(URL.createObjectURL(file))
    }
  }
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
    },
    resolver: yupResolver(schema),
  })

const onSubmit = async (data) => {
  try {
    let fotoUrl = null;

    if (imagen instanceof File) {
      const formData = new FormData();
      formData.append('foto', imagen);

      const response = await axios.post('http://localhost:3030/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fotoUrl = `http://localhost:3030${response.data.url}`;
    }

    const residenteData = {
      ...data,
      lenguajes_programacion: JSON.stringify(data.lenguajes_programacion), 
      foto: fotoUrl,
    };
    console.log('Datos que se enviarán al backend:', residenteData);
    await axios.post('http://localhost:3030/api/residentes', residenteData);
    alert('Residente creado correctamente');
    navigate('/');
  } catch (error) {
  console.error('Error al crear residente:', error);
  if (error.response) {
    console.error('Respuesta del servidor:', error.response.data);
    alert('Error al crear residente: ' + (error.response.data.message || JSON.stringify(error.response.data)));
  } else {
    alert('Error al crear residente: ' + error.message);
  }
}
}

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block font-medium mb-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            {...register('nombre')}
            className={`w-full border rounded px-3 py-2 ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
        </div>

        {/* Apellido */}
        <div className="mb-4">
          <label htmlFor="apellido" className="block font-medium mb-1">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            {...register('apellido')}
            className={`w-full border rounded px-3 py-2 ${
              errors.apellido ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
        </div>

        

        {/* Género */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Género</label>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              value="masculino"
              {...register('genero')}
              className="form-radio"
            />
            <span className="ml-2">Masculino</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="femenino"
              {...register('genero')}
              className="form-radio"
            />
            <span className="ml-2">Femenino</span>
          </label>
          {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero.message}</p>}
        </div>

        {/* Fecha de nacimiento */}
        <div className="mb-4">
          <label htmlFor="fecha_nacimiento" className="block font-medium mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            max={new Date().toISOString().split('T')[0]}
            {...register('fecha_nacimiento')}
            className={`w-full border rounded px-3 py-2 ${
              errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fecha_nacimiento && (
            <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento.message}</p>
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
            maxLength={10}
            placeholder="10 dígitos"
            {...register('telefono')}
            className={`w-full border rounded px-3 py-2 ${
              errors.telefono ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
        </div>

        {/* Correo electrónico */}
        <div className="mb-4">
          <label htmlFor="correo_electronico" className="block font-medium mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="correo_electronico"
            {...register('correo_electronico')}
            className={`w-full border rounded px-3 py-2 ${
              errors.correo_electronico ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.correo_electronico && (
            <p className="text-red-500 text-sm mt-1">{errors.correo_electronico.message}</p>
          )}
        </div>
        
        {/* Subir Imagen */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Foto del residente</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Vista previa */}
        {vistaPrevia && (
          <div className="mb-4">
            <p className="text-sm mb-1">Vista previa:</p>
            <img
              src={vistaPrevia}
              alt="Vista previa"
              className="max-w-xs h-auto border rounded"
            />
          </div>
        )}


        {/* Instituto de procedencia */}
        <div className="mb-4">
          <label htmlFor="instituto_procedencia" className="block font-medium mb-1">
            Instituto de procedencia
          </label>
          <input
            type="text"
            id="instituto_procedencia"
            {...register('instituto_procedencia')}
            className={`w-full border rounded px-3 py-2 ${
              errors.instituto_procedencia ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.instituto_procedencia && (
            <p className="text-red-500 text-sm mt-1">{errors.instituto_procedencia.message}</p>
          )}
        </div>

        {/* Carrera */}
        <div className="mb-4">
          <label htmlFor="carrera" className="block font-medium mb-1">
            Carrera
          </label>
          <select
            id="carrera"
            {...register('carrera')}
            className={`w-full border rounded px-3 py-2 ${
              errors.carrera ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una carrera</option>
            <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
            <option value="Ingeniería en Software">Ingeniería en Software</option>
            <option value="Ingenieria en Tecnologías de la Información">
              Ingenieria en Tecnologías de la Información
            </option>
            <option value="Ingeniería en Computación">Ingeniería en Computación</option>
            <option value="Otra carrera">Otra carrera</option>
          </select>
          {errors.carrera && <p className="text-red-500 text-sm mt-1">{errors.carrera.message}</p>}
        </div>

        {/* Lenguajes de programación */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Lenguajes de programación</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.keys(lenguajesIniciales).map((lang) => (
              <label key={lang} className="inline-flex items-center">
                <Controller
                  name={`lenguajes_programacion.${lang}`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value}
                      className="form-checkbox"
                    />
                  )}
                />
                <span className="ml-2">{lang}</span>
              </label>
            ))}
          </div>
          {errors.lenguajes_programacion && (
            <p className="text-red-500 text-sm mt-1">{errors.lenguajes_programacion.message}</p>
          )}
        </div>

        {/* Notas */}
        <div className="mb-6">
          <label htmlFor="notas" className="block font-medium mb-1">
            Notas
          </label>
          <textarea
            id="notas"
            rows="4"
            {...register('notas')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Botón enviar */}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar residente
          </button>
        </div>

        {/* Botón volver */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white font-medium px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Volver a residentes
          </button>
        </div>
      </form>
    </div>
  )
}
