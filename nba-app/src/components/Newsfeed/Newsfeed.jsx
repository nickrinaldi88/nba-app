import React, { useEffect, useState } from 'react';
import './Newsfeed.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Reddit and Twitter posts in parallel
    Promise.all([
      fetch('http://127.0.0.1:5000/news/').then(res => res.json()),
      fetch('http://127.0.0.1:5000/news/').then(res => res.json())
    ])
      .then(([redditPosts, twitterPosts]) => {
        const formattedReddit = redditPosts.map(post => ({
          type: 'Reddit',
          title: post.title,
          url: post.url,
          upvotes: post.upvotes,
          comments: post.comments,
          date: new Date().toISOString() // Fake timestamp for now
        }));

        const formattedTwitter = twitterPosts.map(tweet => ({
          type: 'Twitter',
          title: tweet.content,
          url: tweet.url,
          upvotes: tweet.likes,
          comments: tweet.retweets,
          date: tweet.date
        }));

        const combined = [...formattedReddit, ...formattedTwitter];

        // Optional: Sort by upvotes or date
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setPosts(combined);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading news...</p>;
  if (!posts.length) return <p>No news found.</p>;

  return (
    <div className="news-feed">
      <h2>📰 Latest NBA News</h2>
      <ul>
        {posts.map((post, i) => (
          <li key={i} className="news-item">
            <a href={post.url} target="_blank" rel="noreferrer">
              {post.title}
            </a>
            <p className="meta">
              {post.type === 'Reddit' ? '📕 Reddit' : '🐦 Twitter'} • 🔺 {post.upvotes} • 💬 {post.comments}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed;
