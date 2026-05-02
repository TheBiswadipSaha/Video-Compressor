import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DropZone from '../components/DropZone';
import SizeInput from '../components/SizeInput';
import CompressionStatus from '../components/CompressionStatus';
import { Btn, Card, Icon } from '../components/UI';
import { useCompression } from '../hooks/useCompression';

const s = {
  page: { maxWidth: 600, margin: '0 auto', padding: '40px 20px' },
  hero: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 42, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 12 },
  accent: { color: 'var(--accent)' },
  sub: { fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--muted)' }
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [targetSize, setTargetSize] = useState('');
  const { status, progress, uploadProgress, video, error, compress, reset } = useCompression();

  const isActive = status !== 'idle';

  const handleSubmit = () => {
    if (!file) return toast.error('Please select a video');
    if (!targetSize || isNaN(targetSize) || Number(targetSize) <= 0) return toast.error('Enter a valid target size');
    const origMB = file.size / (1024 * 1024);
    if (Number(targetSize) >= origMB) return toast.error(`Target must be less than original (${origMB.toFixed(1)} MB)`);
    compress(file, targetSize);
  };

  const handleReset = () => { reset(); setFile(null); setTargetSize(''); };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.title}>Compress<br /><span style={s.accent}>Videos Precisely</span></h1>
        <p style={s.sub}>Set your exact target file size in MB.<br />We'll compress it without wrecking the quality.</p>
      </div>

      {!isActive ? (
        <Card>
          <div style={s.form}>
            <DropZone file={file} onFile={setFile} />
            <SizeInput value={targetSize} onChange={setTargetSize} originalSize={file?.size} />
            <Btn onClick={handleSubmit} disabled={!file || !targetSize} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              <Icon name="compress" /> Compress Video
            </Btn>
          </div>
          <p style={s.footer}>Uses FFmpeg locally · No third-party APIs · 100% free</p>
        </Card>
      ) : (
        <CompressionStatus status={status} progress={progress} uploadProgress={uploadProgress} video={video} error={error} onReset={handleReset} />
      )}
    </div>
  );
}
