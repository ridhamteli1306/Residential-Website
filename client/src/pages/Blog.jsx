import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Blog = () => {
    const { user } = useContext(AuthContext);

    // Initial dummy data
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Summer Community BBQ Success!',
            date: 'July 15, 2026',
            author: 'Sarah Jenkins (Manager)',
            content: 'Thank you to everyone who came out to our annual summer BBQ! It was wonderful to see so many neighbors connecting and enjoying the beautiful weather. A special shoutout to the grilling team!',
            tags: ['Events', 'Community']
        },
        {
            id: 2,
            title: 'New Recycling Guidelines',
            date: 'July 10, 2026',
            author: 'Admin',
            content: 'Please be advised that we have updated our recycling guidelines. Glass borders must now be separated. Check your email for the full PDF guide.',
            tags: ['Announcements', 'Green Living']
        },
        {
            id: 3,
            title: 'Tennis Court Resurfacing Complete',
            date: 'July 8, 2026',
            author: 'Admin',
            content: 'We are pleased to announce that the resurfacing of both tennis courts is now complete. The courts are open for play. Please wear appropriate non-marking shoes to protect the new surface.',
            tags: ['Maintenance', 'Sports']
        },
        {
            id: 4,
            title: 'Upcoming Yoga Classes at the Community Center',
            date: 'July 5, 2026',
            author: 'Sarah Jenkins (Manager)',
            content: 'Starting next week, we will be offering morning yoga classes at the Community Center every Tuesday and Thursday at 7:00 AM. Classes are suitable for all levels. Please bring your own mat.',
            tags: ['Events', 'Health']
        },
        {
            id: 5,
            title: 'Maintenance Schedule for August',
            date: 'July 1, 2026',
            author: 'Admin',
            content: 'The landscaping team will be performing quarterly deep-pruning and fertilization across all common areas throughout August. Please excuse any temporary noise or obstruction during this time.',
            tags: ['Announcements', 'Maintenance']
        }
    ]);

    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);

    const canPost = user && (user.role === 'superadmin' || user.role === 'manager');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) return;

        const post = {
            id: posts.length + 1,
            title: newPost.title,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            author: `${user.name} (${user.role === 'superadmin' ? 'Admin' : 'Manager'})`,
            content: newPost.content,
            tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '', tags: '' });
        setIsFormVisible(false);
    };

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Community Blog</h1>
                <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '800px', margin: '0 auto' }}>
                    Stay up to date with the latest news, announcements, and stories from Terrazas de Guacuco.
                </p>
            </div>

            {canPost && (
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    {!isFormVisible ? (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            + Write New Post
                        </button>
                    ) : (
                        <div style={{ backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px', maxWidth: '800px', margin: '0 auto', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary-color)' }}>New Blog Post</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                                    <input
                                        type="text"
                                        value={newPost.title}
                                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                        placeholder="Enter post title"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content</label>
                                    <textarea
                                        rows="5"
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                                        placeholder="Write your update here..."
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newPost.tags}
                                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                        placeholder="e.g. Events, Maintenance, News"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Publish Post
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsFormVisible(false)}
                                        style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
                {posts.map(post => (
                    <article key={post.id} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>{post.title}</h2>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                    <span>{post.date}</span> • <span style={{ color: 'var(--primary-color)' }}>{post.author}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {post.tags && post.tags.map((tag, idx) => (
                                    <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#e0f2fe', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '999px' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                            {post.content}
                        </p>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;
