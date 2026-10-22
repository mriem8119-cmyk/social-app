
import { useState } from 'react'

function ChangePassword() {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
  })
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const token = localStorage.getItem('token')

    const response = await fetch('https://route-posts.routemisr.com/users/change-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
      }
      setFormData({ password: '', newPassword: '' })
      setIsError(false)
      setMessage('Password changed successfully')
    } else {
      setIsError(true)
      setMessage(data.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>

      <label htmlFor="password">Current password</label>
      <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

      <label htmlFor="newPassword">New password</label>
      <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} />

      <button type="submit">Change password</button>

      {message && <p className={isError ? 'form-message' : 'form-success'}>{message}</p>}
    </form>
  )
}

export default ChangePassword