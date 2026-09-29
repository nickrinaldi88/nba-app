import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Blog.css';

const BlogAdmin = () => {
  const navigate = useNavigate();
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const login = await fetch(`${process.env.REACT_APP_URL}/blog/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (login.status === 401) {
      setError('Incorrect password.');
      setSubmitting(false);
      return;
    }
    if (login.status === 429) {
      setError('Too many attempts. Try again in 15 minutes.');
      setSubmitting(false);
      return;
    }
    if (!login.ok) {
      setError('Blog admin is unavailable. Try again later.');
      setSubmitting(false);
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_URL}/blog/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      setError('Something went wrong. Try again.');
      setSubmitting(false);
      return;
    }

    const post = await res.json();
    navigate(`/blog/${post.id}`);
  };

  return (
    <div className="blog-admin-container">
      <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
      <h1 className="blog-admin-title">New Post</h1>

      <form className="blog-admin-form" onSubmit={handleSubmit}>
        <label className="blog-label">Title</label>
        <input
          className="blog-input"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label className="blog-label">Content <span className="blog-label-hint">(Markdown supported)</span></label>
        <textarea
          className="blog-textarea"
          placeholder="Write your post here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={18}
          required
        />

        <label className="blog-label">Admin Password</label>
        <input
          className="blog-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p className="blog-error">{error}</p>}

        <button className="blog-submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Publishing…' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogAdmin;
