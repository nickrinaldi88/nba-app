import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Blog.css';

const BlogPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/blog/${postId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setError('Post not found.'); setLoading(false); });
  }, [postId]);

  const handleDelete = async () => {
    const password = prompt('Enter admin password to delete this post:');
    if (!password) return;
    setDeleting(true);

    const login = await fetch(`${process.env.REACT_APP_URL}/blog/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!login.ok) {
      alert(login.status === 429 ? 'Too many attempts. Try again in 15 minutes.' : 'Incorrect password.');
      setDeleting(false);
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_URL}/blog/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      navigate('/blog');
    } else {
      alert('Incorrect password.');
      setDeleting(false);
    }
  };

  if (loading) return <p className="blog-message">Loading...</p>;
  if (error)   return <div className="blog-message"><p>{error}</p><Link to="/blog">Back to Blog</Link></div>;

  return (
    <article className="blog-post-container">
      <Link to="/blog" className="blog-back-link">← Back to Blog</Link>
      <h1 className="blog-post-title">{post.title}</h1>
      <p className="blog-post-date">
        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <div className="blog-post-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      <button className="blog-delete-btn" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete Post'}
      </button>
    </article>
  );
};

export default BlogPost;
