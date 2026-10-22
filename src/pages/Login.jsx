import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    const response = await fetch('https://route-posts.routemisr.com/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userId', data.data.user._id)
      navigate('/')
    } else {
      setMessage(data.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

      <button type="submit">Login</button>

      {message && <p className="form-message">{message}</p>}
    </form>
  )
}

export default Login