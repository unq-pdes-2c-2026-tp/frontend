import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getAgencies, registerUser } from '../api/ApiRequests'
import { USER_TYPE_MAP } from '../constants'
import '../styles/Register.css'

const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    agency: null,
    user_type: USER_TYPE_MAP.END_USER,
  })
  const [agencies, setAgencies] = useState([])
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(()=>{
    getAgencies().then((response)=>{
      setAgencies(response.data)
    })
  }, [])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    if (error) {
      setError('')
    }
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!data.name.trim() || !data.email.trim() || !data.password || !confirmPassword) {
      setError('Completá todos los campos para continuar')
      return
    }

    if (data.password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (data.user_type === USER_TYPE_MAP.AGENCY && !data.agency.trim()) {
      setError('Ingresá el nombre de la agencia')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        email: data.email.trim(),
        user_type: data.user_type,
        name: data.name.trim(),
        password: data.password,
        ...(data.user_type === USER_TYPE_MAP.AGENCY ? { agency: data.agency.trim() } : {}),
      }

      await registerUser(payload)
      navigate('/login')
    } catch (requestError) {
      const message = requestError.response?.data || 'Falló la conexión con el servidor'
      setError(typeof message === 'string' ? message : 'No se pudo registrar el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="register-page">
      <header className="register-topbar">
        <a className="register-brand" href="/login" aria-label="Comprá tu Viaje, inicio">
          <span className="register-brand-mark">CTV</span>
          <span>Comprá tu Viaje</span>
        </a>
        <span className="register-topbar-copy">Creá tu cuenta para empezar</span>
      </header>

      <section className="register-layout">
        <div className="register-intro">
          <p className="register-eyebrow">Unite a nuestra comunidad</p>
          <h1 data-testid="register-title" id="RegisterTitle">
            Registrate
          </h1>
          <p>Gracias a tu cuenta podés explorar viajes, guardar favoritos y gestionar tus reservas.</p>
        </div>

        <form className="Register-main register-card" onSubmit={handleSubmit}>
          <div data-testid="register-error" id="alertReg" className="alert alert-danger register-error" role="alert">
            {error}
          </div>

          <label htmlFor="RegisterNameInput">Nombre</label>
          <input
            data-testid="register-name"
            id="RegisterNameInput"
            name="name"
            className="registerInput"
            type="text"
            placeholder="Ingresá tu nombre"
            value={data.name}
            onChange={handleInputChange}
            autoComplete="name"
          />

          <label htmlFor="RegisterEmailInput">E-mail</label>
          <input
            data-testid="register-email"
            id="RegisterEmailInput"
            name="email"
            className="registerInput"
            placeholder="Ingresá tu e-mail"
            type="email"
            value={data.email}
            onChange={handleInputChange}
            autoComplete="email"
          />

          <label htmlFor="RegisterPassInput">Contraseña</label>
          <input
            data-testid="register-password"
            id="RegisterPassInput"
            name="password"
            className="registerInput"
            type="password"
            placeholder="Ingresá tu contraseña"
            value={data.password}
            onChange={handleInputChange}
            autoComplete="new-password"
          />

          <label htmlFor="RegisterConfirmPassInput">Repetir contraseña</label>
          <input
            id="RegisterConfirmPassInput"
            name="confirmPassword"
            className="registerInput"
            type="password"
            placeholder="Repetí tu contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
          />

          <label htmlFor="RegisterUserType">Tipo de usuario</label>
          <select
            id="RegisterUserType"
            name="user_type"
            className="registerInput register-select"
            value={data.user_type}
            onChange={handleInputChange}
          >
            <option value={USER_TYPE_MAP.END_USER}>Comprador</option>
            <option value={USER_TYPE_MAP.ADMIN}>Administrador</option>
            <option value={USER_TYPE_MAP.AGENCY}>Agencia</option>
          </select>

          {data.user_type === USER_TYPE_MAP.AGENCY && (
            <>
              <label htmlFor="RegisterAgencySelect">Selecciona una agencia</label>
              <select
            id="RegisterAgency"
            name="agency"
            className="registerInput register-select"
            value={data.agency}
            onChange={handleInputChange}
          >
            {agencies.map(agency => (<option value={agency.id}>{agency.name}</option>))}
          </select>

            </>
          )}

          <button
            data-testid="register-button"
            id="RegisterBtn"
            type="submit"
            className="register-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarme'}
          </button>

          <div className="register-login">
            ¿Ya tenés una cuenta? <button type="button" onClick={() => navigate('/login')}>Iniciar sesión</button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Register
