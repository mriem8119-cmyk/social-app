
import { useEffect, useState } from 'react'

function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getProfile() {
      const token = localStorage.getItem('token')

      const response = await fetch('https://route-posts.routemisr.com/users/profile-data', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
      }
    }

    getProfile()
  }, [])

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div className="profile-card">
      <img className="profile-avatar" src={user.photo} alt={user.name} />
      <h2>{user.name}</h2>
      <p className="post-date">@{user.username}</p>
      <p>{user.email}</p>

      <div className="profile-stats">
        <div>
          <strong>{user.followersCount}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{user.followingCount}</strong>
          <span>Following</span>
        </div>
      </div>
    </div>
  )
}

export default Profile