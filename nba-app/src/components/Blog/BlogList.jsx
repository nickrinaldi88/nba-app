import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (seconds < 60)    return 'just now';
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/blog/`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => { setError('Could not load posts.'); setLoading(false); });
  }, []);

  if (loading) return <p className="blog-message">Loading posts...</p>;
  if (error)   return <p className="blog-message">{error}</p>;

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1 className="blog-list-title">The Mob Report</h1>
        <Link to="/blog/new" className="blog-write-btn">+ Write Post</Link>
      </div>

      {posts.length === 0 ? (
        <p className="blog-message">No posts yet. <Link to="/blog/new">Write the first one.</Link></p>
      ) : (
        <ul className="blog-list">
          {posts.map(post => (
            <li key={post.id} className="blog-card">
              <Link to={`/blog/${post.id}`} className="blog-card-title">{post.title}</Link>
              <p className="blog-card-preview">
                {post.content.slice(0, 160)}{post.content.length > 160 ? '…' : ''}
              </p>
              <span className="blog-card-date">{timeAgo(post.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
