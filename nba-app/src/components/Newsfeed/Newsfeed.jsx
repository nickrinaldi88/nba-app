import { useEffect, useState } from 'react';
import './Newsfeed.css';

function formatCount(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

function timeAgo(utcSeconds) {
  if (!utcSeconds) return '';
  const seconds = Math.floor(Date.now() / 1000 - utcSeconds);
  if (seconds < 60)   return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('top'); // 'top' | 'new'

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

  const sorted = [...posts].sort((a, b) =>
    sort === 'top'
      ? b.upvotes - a.upvotes
      : b.created_utc - a.created_utc
  );

  if (loading) return <NewsFeedSkeleton />;
  if (error)   return <p className="news-message">{error}</p>;
  if (!posts.length) return <p className="news-message">No posts found.</p>;

  return (
    <div className="news-feed">
      <div className="news-toolbar">
        <h2 className="news-heading">Latest NBA News</h2>
        <div className="news-sort">
          <button
            className={`sort-btn ${sort === 'top' ? 'sort-btn--active' : ''}`}
            onClick={() => setSort('top')}
          >
            Top
          </button>
          <button
            className={`sort-btn ${sort === 'new' ? 'sort-btn--active' : ''}`}
            onClick={() => setSort('new')}
          >
            New
          </button>
        </div>
      </div>
      <ul className="news-list">
        {sorted.map((post, i) => (
          <li key={i} className="news-item">
            <div className="news-item-top">
              <span className="news-source news-source--reddit">Reddit</span>
              <span className="news-timestamp">{timeAgo(post.created_utc)}</span>
            </div>
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
