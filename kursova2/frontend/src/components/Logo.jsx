// Логотип Litera: фірмова іконка-книга + текстовий знак
function Logo({ size = 28, textClass = 'text-xl' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <defs>
          <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill="url(#logoBg)" />
        <path
          d="M13 19c5.5-2.6 11-2.6 19 1 8-3.6 13.5-3.6 19-1v27c-5.5-2.6-11-2.6-19 1-8-3.6-13.5-3.6-19-1V19Z"
          fill="#ffffff" fillOpacity="0.96"
        />
        <path d="M32 21v27" stroke="#ea580c" strokeWidth="2.4" strokeLinecap="round" />
        <path
          d="M18 26c3.2-1.1 6.4-1.1 9.6.4M18 33c3.2-1.1 6.4-1.1 9.6.4M36.4 26.4c3.2-1.5 6.4-1.5 9.6-.4M36.4 33.4c3.2-1.5 6.4-1.5 9.6-.4"
          stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" fill="none"
        />
        <path d="M40 12h8v15l-4-3-4 3V12Z" fill="#0ea5e9" />
      </svg>
      <span className={`font-bold gradient-text tracking-tight ${textClass}`}>Litera</span>
    </span>
  );
}

export default Logo;
