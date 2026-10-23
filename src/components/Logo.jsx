const SIZES = {
  sm: { box: 30, icon: 16 },
  md: { box: 38, icon: 20 },
  lg: { box: 46, icon: 24 },
}

/**
 * The Plant Leaf Disease Detection System leaf mark, always placed directly in front of the
 * project title. Used consistently on the login page, sidebar, dashboard
 * header, and analysis page.
 */
export default function Logo({ size = 'md', title = 'Plant Leaf Disease Detection System', subtitle, className = '' }) {
  const { box, icon } = SIZES[size] || SIZES.md
  return (
    <span className={`logo ${className}`}>
      <span className="logo__mark" style={{ width: box, height: box }}>
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20c0-9 6-15 16-15 0 9-6 15-16 15Z"
            fill="none"
            stroke="#EEF3E7"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M4.6 19.4C6.5 13 10.5 9 17 6.6" stroke="#EEF3E7" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
        </svg>
      </span>
      <span className="logo__text">
        <span className="logo__title">{title}</span>
        {subtitle && <span className="logo__subtitle">{subtitle}</span>}
      </span>
    </span>
  )
}
