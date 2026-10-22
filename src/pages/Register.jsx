
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    dateOfBirth: '',
    gender: 'male',
    password: '',
    rePassword: '',
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

    const response = await fetch('https://route-posts.routemisr.com/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {
      navigate('/login')
    } else {
      setMessage(data.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />

      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

      <label htmlFor="dateOfBirth">Date of birth</label>
      <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

      <label htmlFor="gender">Gender</label>
      <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

      <label htmlFor="rePassword">Confirm password</label>
      <input type="password" id="rePassword" name="rePassword" value={formData.rePassword} onChange={handleChange} />

      <button type="submit">Sign up</button>

      {message && <p className="form-message">{message}</p>}
    </form>
  )
}

export default Register