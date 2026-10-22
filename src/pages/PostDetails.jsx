
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function PostDetails() {
  const { postId } = useParams()
  const userId = localStorage.getItem('userId')

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  async function getPost() {
    const token = localStorage.getItem('token')

    const response = await fetch(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (data.success) {
      setPost(data.data.post)
    }
  }

  async function getComments() {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const data = await response.json()

    if (data.success) {
      setComments(data.data.comments)
    }
  }

  useEffect(() => {
    getPost()
    getComments()
  }, [])

  async function handleCreateComment(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('content', content)

    const response = await fetch(`https://route-posts.routemisr.com/posts/${postId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setContent('')
      getComments()
    }
  }

  function startEdit(comment) {
    setEditingId(comment._id)
    setEditContent(comment.content)
  }

  async function handleUpdateComment(commentId) {
    const token = localStorage.getItem('token')

    const formData = new FormData()
    formData.append('content', editContent)

    const response = await fetch(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    )

    if (response.ok) {
      setEditingId(null)
      getComments()
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('Delete this comment?')) return

    const token = localStorage.getItem('token')

    const response = await fetch(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (response.ok) {
      getComments()
    }
  }

  return (
    <div>
      {post && (
        <article className="post-card">
          <div className="post-header">
            <img className="avatar" src={post.user.photo} alt={post.user.name} />
            <div>
              <h3 className="post-author">{post.user.name}</h3>
              <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <p className="post-body">{post.body}</p>
          <div className="post-stats">
            <span>{post.likesCount} Likes · {comments.length} Comments</span>
          </div>
        </article>
      )}

      <form onSubmit={handleCreateComment}>
        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="row-between">
          <span></span>
          <button type="submit">Comment</button>
        </div>
      </form>

      <h3 className="comments-title">Comments ({comments.length})</h3>

      {comments.map((comment) => {
        const creator = comment.user || comment.commentCreator

        return (
          <div className="comment" key={comment._id}>
            <img className="avatar avatar-sm" src={creator?.photo} alt={creator?.name} />

            <div className="comment-bubble">
              <div className="comment-author">{creator?.name}</div>

              {editingId === comment._id ? (
                <div className="edit-box">
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="row">
                    <button onClick={() => handleUpdateComment(comment._id)}>Save</button>
                    <button className="btn-light" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}

              {creator?._id === userId && editingId !== comment._id && (
                <div className="comment-actions">
                  <button className="btn-light" onClick={() => startEdit(comment)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PostDetails