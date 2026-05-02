import React from 'react';
import axios from 'axios';
import { Card, Badge, Btn, Icon, formatSize, formatDate } from './UI';

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  name: { fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 },
  date: { fontSize: 11, color: 'var(--muted)', marginTop: 2, fontFamily: 'var(--mono)' },
  row: { display: 'flex', gap: 12, fontSize: 12, color: 'var(--muted)', marginBottom: 12 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  val: { fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)' },
  actions: { display: 'flex', gap: 6 }
};

async function downloadFile(id, name) {
  const res = await axios.get(`http://localhost:5000/api/videos/${id}/download`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `compressed_${name}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function VideoCard({ video, onDelete }) {
  const pct = video.compressedSize ? Math.round(((video.originalSize - video.compressedSize) / video.originalSize) * 100) : 0;
  const statusColor = { done: 'var(--success)', error: 'var(--error)', processing: 'var(--accent)' };

  return (
    <Card>
      <div style={s.header}>
        <div>
          <div style={s.name} title={video.originalName}>{video.originalName}</div>
          <div style={s.date}>{formatDate(video.createdAt)}</div>
        </div>
        <Badge color={statusColor[video.status]}>{video.status}</Badge>
      </div>

      <div style={s.row}>
        <div style={s.stat}><span>Original</span><span style={s.val}>{formatSize(video.originalSize)}</span></div>
        <div style={s.stat}><span>→</span></div>
        <div style={s.stat}><span>Compressed</span><span style={{ ...s.val, color: 'var(--success)' }}>{video.compressedSize ? formatSize(video.compressedSize) : '—'}</span></div>
        {pct > 0 && <div style={s.stat}><span>Saved</span><span style={{ ...s.val, color: 'var(--success)' }}>{pct}%</span></div>}
      </div>

      <div style={s.actions}>
        {video.status === 'done' && (
          <Btn onClick={() => downloadFile(video._id, video.originalName)} variant="success" style={{ fontSize: 12, padding: '6px 12px' }}>
            <Icon name="download" size={13} /> Download
          </Btn>
        )}
        <Btn onClick={() => onDelete(video._id)} variant="danger" style={{ fontSize: 12, padding: '6px 12px' }}>
          <Icon name="trash" size={13} /> Delete
        </Btn>
      </div>
    </Card>
  );
}
