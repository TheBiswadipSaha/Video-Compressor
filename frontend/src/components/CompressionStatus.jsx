import React from 'react';
import { ProgressBar, Btn, Card, Icon, formatSize } from './UI';
import axios from 'axios';

const s = {
  title: { fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 },
  stat: { display: 'flex', gap: 12, marginTop: 16 },
  statItem: { flex: 1, background: 'var(--bg)', borderRadius: 8, padding: 12, textAlign: 'center' },
  statVal: { fontSize: 18, fontWeight: 800, fontFamily: 'var(--mono)' },
  statLabel: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  actions: { display: 'flex', gap: 8, marginTop: 16 }
};

async function downloadFile(id, name) {
  try {
    const res = await axios.get(`http://localhost:5000/api/videos/${id}/download`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${name}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert('Download failed: ' + err.message);
  }
}

export default function CompressionStatus({ status, progress, uploadProgress, video, error, onReset }) {
  if (status === 'idle') return null;

  const saved = video?.compressedSize ? video.originalSize - video.compressedSize : 0;
  const pct = video?.compressedSize ? Math.round((saved / video.originalSize) * 100) : 0;

  return (
    <Card>
      <p style={s.title}>
        {status === 'uploading' && '⬆ Uploading...'}
        {status === 'compressing' && '⚙ Compressing...'}
        {status === 'done' && '✓ Done!'}
        {status === 'error' && '✗ Error'}
      </p>

      {status === 'uploading' && (
        <div>
          <div style={s.row}><span>Upload progress</span><span style={{ fontFamily: 'var(--mono)' }}>{uploadProgress}%</span></div>
          <ProgressBar value={uploadProgress} />
        </div>
      )}

      {status === 'compressing' && (
        <div>
          <div style={s.row}><span>Compression progress</span><span style={{ fontFamily: 'var(--mono)' }}>{progress}%</span></div>
          <ProgressBar value={progress} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>This may take a while for large videos...</p>
        </div>
      )}

      {status === 'done' && video && (
        <div>
          <div style={s.stat}>
            <div style={s.statItem}><div style={s.statVal}>{formatSize(video.originalSize)}</div><div style={s.statLabel}>Original</div></div>
            <div style={s.statItem}><div style={{ ...s.statVal, color: 'var(--success)' }}>{formatSize(video.compressedSize)}</div><div style={s.statLabel}>Compressed</div></div>
            <div style={s.statItem}><div style={{ ...s.statVal, color: 'var(--success)' }}>{pct}%</div><div style={s.statLabel}>Saved</div></div>
          </div>
          <div style={s.actions}>
            <Btn onClick={() => downloadFile(video._id, video.originalName)} variant="success">
              <Icon name="download" /> Download
            </Btn>
            <Btn onClick={onReset} variant="ghost"><Icon name="compress" /> Compress Another</Btn>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div>
          <p style={{ color: 'var(--error)', marginBottom: 12, fontSize: 14 }}>{error || 'Compression failed'}</p>
          <Btn onClick={onReset} variant="ghost"><Icon name="x" /> Try Again</Btn>
        </div>
      )}
    </Card>
  );
}
