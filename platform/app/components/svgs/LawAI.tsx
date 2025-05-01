export const LawAI = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="200" cy="200" r="180" stroke="url(#lawGradient)" strokeWidth="2" strokeDasharray="4 4"/>
    <path
      d="M200 100 L300 250 L100 250 Z"
      stroke="url(#lawGradient)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="200" cy="160" r="30" stroke="url(#lawGradient)" strokeWidth="2" fill="none"/>
    <rect x="180" y="220" width="40" height="60" stroke="url(#lawGradient)" strokeWidth="2" fill="none"/>
    
    {/* Circuit-like patterns */}
    <path
      d="M120 280 L160 280 L160 300 L240 300 L240 280 L280 280"
      stroke="url(#lawGradient)"
      strokeWidth="1"
      fill="none"
    />
    
    {/* Animated pulse circles */}
    <circle cx="200" cy="200" r="150" stroke="url(#pulseGradient)" strokeWidth="1" opacity="0.5">
      <animate
        attributeName="r"
        values="150;170;150"
        dur="3s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.5;0;0.5"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Gradients */}
    <defs>
      <linearGradient id="lawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
      </linearGradient>
    </defs>
  </svg>
); 