import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: 'var(--color-bg)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="container">
        <div className="py-12 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col items-center md:items-start gap-3">
            <img
              src="/logo.png"
              alt="The Finance Room"
              className="h-7 w-auto"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
            />
            <p className="text-[11px] tracking-[0.16em] uppercase text-cream-dim">
              The room you were never told about. Now open.
            </p>
          </div>

          <div
            className="flex items-center gap-3 text-[11px] tracking-[0.14em] uppercase"
            style={{ color: 'rgba(242,239,232,0.3)' }}
          >
            <span>Live sessions</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>By application only</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/thefinanceroom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.1em] uppercase text-cream-dim hover:text-amber transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/thefinanceroom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.1em] uppercase text-cream-dim hover:text-amber transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div
          className="py-4 border-t text-center"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <p className="text-[10px] tracking-[0.12em]" style={{ color: 'rgba(242,239,232,0.2)' }}>
            © 2026 The Finance Room
          </p>
        </div>
      </div>
    </footer>
  )
}
