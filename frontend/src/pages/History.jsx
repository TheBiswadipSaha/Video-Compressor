import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import VideoCard from '../components/VideoCard';
import { Icon } from '../components/UI';
import { getAllVideos, deleteVideo } from '../utils/api';

const s = {
  page: { maxWidth: 800, margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' },
  count: { fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  empty: { textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' },
  emptyIcon: { marginBottom: 12, opacity: 0.3 }
};

export default function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const { data } = await getAllVideos(); setVideos(data); }
    catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      setVideos(v => v.filter(x => x._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>History</h1>
        {videos.length > 0 && <span style={s.count}>{videos.length} video{videos.length !== 1 ? 's' : ''}</span>}
      </div>

      {loading ? <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading...</p> :
        videos.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}><Icon name="video" size={48} /></div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No videos yet</p>
            <p style={{ fontSize: 14 }}>Compress your first video to see it here</p>
          </div>
        ) : (
          <div style={s.grid}>
            {videos.map(v => <VideoCard key={v._id} video={v} onDelete={handleDelete} />)}
          </div>
        )
      }
    </div>
  );
}
