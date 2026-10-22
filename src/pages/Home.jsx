

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [posts, setPosts] = useState([])
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editBody, setEditBody] = useState('')

  const userId = localStorage.getItem('userId')

  async function getPosts() {
    const token = localStorage.getItem('token')

    const response = await fetch('https://route-posts.routemisr.com/posts', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (data.success) {
      setPosts(data.data.posts)
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('body', body)
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch('https://route-posts.routemisr.com/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      e.target.reset()
      setBody('')
      setImage(null)
      getPosts()
    }
  }

  function startEdit(post) {
    setEditingId(post._id)
    setEditBody(post.body)
  }

  async function handleUpdate(postId) {
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('body', editBody)

    const response = await fetch(`https://route-posts.routemisr.com/posts/${postId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (response.ok) {
      setEditingId(null)
      getPosts()
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm('Delete this post?')) return

    const token = localStorage.getItem('token')

    const response = await fetch(`https://route-posts.routemisr.com/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      getPosts()
    }
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <textarea
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="row-between">
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">Post</button>
        </div>
      </form>

      {posts.map((post) => (
        <article className="post-card" key={post._id}>
          <div className="post-header">
            <img className="avatar" src={post.user.photo} alt={post.user.name} />
            <div>
              <h3 className="post-author">{post.user.name}</h3>
              <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {editingId === post._id ? (
            <div className="edit-box">
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
              <div className="row">
                <button onClick={() => handleUpdate(post._id)}>Save</button>
                <button className="btn-light" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <p className="post-body">{post.body}</p>
          )}

          <div className="post-stats">
            <span>{post.likesCount} Likes · {post.commentsCount} Comments</span>
            <Link to={`/posts/${post._id}`}>View details</Link>
          </div>

          {post.user._id === userId && editingId !== post._id && (
            <div className="post-actions">
              <button className="btn-light" onClick={() => startEdit(post)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

export default Home