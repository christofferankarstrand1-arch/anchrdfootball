const Logo = ({ size = 'default' }) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-sm' },
    default: { container: 'w-12 h-12', text: 'text-base' },
    large: { container: 'w-16 h-16', text: 'text-lg' }
  }

  const currentSize = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <svg
        className={currentSize.container}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Football field */}
        <rect x="10" y="20" width="80" height="60" rx="4" stroke="#1B4332" strokeWidth="3" fill="none" />
        
        {/* Center line */}
        <line x1="50" y1="20" x2="50" y2="80" stroke="#1B4332" strokeWidth="2" />
        
        {/* Center circle */}
        <circle cx="50" cy="50" r="12" stroke="#1B4332" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="2" fill="#1B4332" />
        
        {/* Anchor */}
        <g transform="translate(50, 35)">
          {/* Anchor ring */}
          <circle cx="0" cy="0" r="4" stroke="#1B4332" strokeWidth="2.5" fill="none" />
          
          {/* Anchor shaft */}
          <line x1="0" y1="4" x2="0" y2="35" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Anchor arms */}
          <path
            d="M -8 28 L 0 35 L 8 28"
            stroke="#1B4332"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Anchor flukes */}
          <circle cx="-8" cy="28" r="3" fill="#1B4332" />
          <circle cx="8" cy="28" r="3" fill="#1B4332" />
        </g>
      </svg>
      <div className="flex flex-col">
        <span className={`font-bold text-[#1B4332] leading-tight ${currentSize.text}`}>
          ANCHRD
        </span>
        <span className={`text-[#52796F] leading-tight ${currentSize.text === 'text-lg' ? 'text-base' : 'text-xs'}`}>
          LEAGUE
        </span>
      </div>
    </div>
  )
}

export default Logo
