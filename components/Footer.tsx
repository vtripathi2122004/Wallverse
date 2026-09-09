export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg)]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <p>
          Photography & Editing by <span className="font-semibold text-white tracking-wide">Varun Tripathi</span> 
          {' '}(<a href="https://instagram.com/oneis2one" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 transition-colors">@oneis2one</a>)
        </p>
        <p className="text-xs tracking-wider uppercase opacity-75">
          Engineered & Maintained by <span className="font-semibold text-white">Deepesh</span>
        </p>
      </div>
    </footer>
  );
}
