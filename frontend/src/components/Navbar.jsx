import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './UI';

const s = {
  nav: { background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 },
  logoAccent: { color: 'var(--accent)' },
  links: { display: 'flex', gap: 4 },
  link: (active) => ({ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: active ? 'var(--accent)' : 'var(--muted)', background: active ? 'var(--accent)22' : 'transparent', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' })
};

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={s.nav}>
      <Link to="/" style={s.logo}>
        <Icon name="compress" size={20} />
        Video<span style={s.logoAccent}>Press</span>
      </Link>
      <div style={s.links}>
        <Link to="/" style={s.link(pathname === '/')}>
          <Icon name="upload" size={14} /> Compress
        </Link>
        <Link to="/history" style={s.link(pathname === '/history')}>
          <Icon name="history" size={14} /> History
        </Link>
      </div>
    </nav>
  );
}
