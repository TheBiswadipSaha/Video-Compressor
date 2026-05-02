import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon, formatSize } from './UI';

const s = {
  zone: (active) => ({ border: `2px dashed ${active ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 16, padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: active ? 'var(--accent)08' : 'transparent' }),
  icon: { color: 'var(--accent)', marginBottom: 12, display: 'block' },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 6 },
  sub: { fontSize: 13, color: 'var(--muted)' },
  file: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--accent)11', border: '1px solid var(--accent)33', borderRadius: 10, marginTop: 12 },
  fileName: { flex: 1, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileSize: { fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }
};

export default function DropZone({ file, onFile }) {
  const onDrop = useCallback(files => files[0] && onFile(files[0]), [onFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/*': [] }, multiple: false });

  return (
    <div>
      <div {...getRootProps()} style={s.zone(isDragActive)}>
        <input {...getInputProps()} />
        <span style={s.icon}><Icon name="video" size={40} /></span>
        <p style={s.title}>{isDragActive ? 'Drop it!' : 'Drag & drop your video'}</p>
        <p style={s.sub}>or click to browse · MP4, AVI, MOV, MKV, WebM</p>
      </div>
      {file && (
        <div style={s.file}>
          <Icon name="video" size={16} />
          <span style={s.fileName}>{file.name}</span>
          <span style={s.fileSize}>{formatSize(file.size)}</span>
        </div>
      )}
    </div>
  );
}
