import React from 'react';

const s = {
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' },
  row: { display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg)' },
  input: { flex: 1, background: 'transparent', border: 'none', padding: '12px 16px', color: 'var(--text)', fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 500, outline: 'none' },
  unit: { padding: '12px 16px', background: 'var(--border)', color: 'var(--muted)', fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)' },
  hint: { fontSize: 12, color: 'var(--muted)', marginTop: 6 }
};

export default function SizeInput({ value, onChange, originalSize }) {
  const originalMB = originalSize ? (originalSize / (1024 * 1024)).toFixed(1) : null;
  return (
    <div>
      <label style={s.label}>Target Size</label>
      <div style={s.row}>
        <input type="number" min="1" step="1" placeholder="e.g. 10" value={value} onChange={e => onChange(e.target.value)} style={s.input} />
        <span style={s.unit}>MB</span>
      </div>
      {originalMB && <p style={s.hint}>Original: {originalMB} MB · Enter a number (e.g. 10 = compress to ~10 MB)</p>}
    </div>
  );
}
