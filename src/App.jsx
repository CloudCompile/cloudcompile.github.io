import { useState, useMemo, useCallback, useRef } from 'react'
import { FLAGS } from './data/flags.js'

const ALL_PLATFORMS = ['ChromeOS', 'Mac', 'Win', 'Linux', 'Android']

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function FlagCard({ flag, query, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('#' + flag.id).then(() => {
      setCopied(true)
      onCopy('#' + flag.id)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [flag.id, onCopy])

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-name">{highlight(flag.name, query)}</span>
      </div>
      <p className="card-desc">{highlight(flag.desc, query)}</p>
      <div className="card-footer">
        <button
          className={`card-id${copied ? ' copied' : ''}`}
          onClick={handleCopy}
          title="Click to copy flag ID"
        >
          <span>#{flag.id}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {copied
              ? <><polyline points="20 6 9 17 4 12"/></>
              : <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>
            }
          </svg>
        </button>
        <div className="platforms">
          {flag.platforms.map(p => (
            <span key={p} className={`platform-tag ${p}`}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('All')
  const [toast, setToast] = useState({ show: false, text: '' })
  const toastTimer = useRef(null)
  const inputRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return FLAGS.filter(f => {
      if (platform !== 'All' && !f.platforms.includes(platform)) return false
      if (!q) return true
      return (
        f.name.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
      )
    })
  }, [query, platform])

  const showToast = useCallback((text) => {
    setToast({ show: true, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2000)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">⚑</div>
            <div>
              <div className="logo-text">FlagRef</div>
              <div className="logo-sub">chrome://flags reference</div>
            </div>
          </div>
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Search flags, descriptions, or IDs…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); inputRef.current?.focus() }}>✕</button>
            )}
          </div>
          <span className="count-badge">{filtered.length} / {FLAGS.length}</span>
        </div>
      </header>

      <div className="filters">
        <div className="filters-inner">
          <span className="filter-label">Platform</span>
          {['All', ...ALL_PLATFORMS].map((p, i) => (
            <button
              key={p}
              className={`filter-btn${platform === p ? ' active' : ''}`}
              onClick={() => setPlatform(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <main className="main">
        {filtered.length === 0 ? (
          <div className="empty">
            <h3>No flags found</h3>
            <p>Try a different search term or clear the platform filter.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map(f => (
              <FlagCard key={f.id} flag={f} query={query} onCopy={showToast} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        {FLAGS.length} Chrome flags documented · Chrome 147 · Click any flag ID to copy it
      </footer>

      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Copied {toast.text}
      </div>
    </div>
  )
}
