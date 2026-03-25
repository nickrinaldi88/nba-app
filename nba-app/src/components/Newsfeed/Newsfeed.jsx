import { useEffect, useState } from 'react';
import './Newsfeed.css';

function formatCount(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/news/`)
      .then(res => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setError('Could not load news right now.');
        setLoading(false);
      });
  }, []);

  if (loading) return <NewsFeedSkeleton />;
  if (error)   return <p className="news-message">{error}</p>;
  if (!posts.length) return <p className="news-message">No posts found.</p>;

  return (
    <div className="news-feed">
      <h2 className="news-heading">Latest NBA News</h2>
      <ul className="news-list">
        {posts.map((post, i) => (
          <li key={i} className="news-item">
            <span className="news-source news-source--reddit">Reddit</span>
            <a href={post.url} target="_blank" rel="noreferrer" className="news-title">
              {post.title}
            </a>
            <div className="news-meta">
              <span>▲ {formatCount(post.upvotes)}</span>
              <span>💬 {formatCount(post.comments)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const NewsFeedSkeleton = () => (
  <div className="news-feed">
    <div className="skeleton skeleton-news-heading" />
    <ul className="news-list">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="news-item">
          <div className="skeleton skeleton-news-badge" />
          <div className="skeleton skeleton-news-title" />
          <div className="skeleton skeleton-news-meta" />
        </li>
      ))}
    </ul>
  </div>
);

export default NewsFeed;
