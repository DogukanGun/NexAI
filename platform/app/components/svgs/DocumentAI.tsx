export const DocumentAI = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main document shape */}
    <rect
      x="100"
      y="50"
      width="200"
      height="300"
      rx="10"
      stroke="url(#docGradient)"
      strokeWidth="2"
      fill="none"
    />

    {/* Document lines */}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <line
        key={i}
        x1="120"
        y1={100 + i * 40}
        x2="280"
        y2={100 + i * 40}
        stroke="url(#docGradient)"
        strokeWidth="2"
        opacity={1 - i * 0.1}
      >
        <animate
          attributeName="x2"
          values="120;280;120"
          dur={`${3 + i}s`}
          repeatCount="indefinite"
        />
      </line>
    ))}

    {/* Animated scanning line */}
    <line
      x1="100"
      y1="0"
      x2="300"
      y2="0"
      stroke="url(#scanGradient)"
      strokeWidth="4"
      opacity="0.5"
    >
      <animateMotion
        path="M 0 50 L 0 350 L 0 50"
        dur="3s"
        repeatCount="indefinite"
      />
    </line>

    {/* Corner decorations */}
    {[
      "M90 40 L110 40 L110 60",
      "M290 40 L310 40 L310 60",
      "M90 360 L110 360 L110 340",
      "M290 360 L310 360 L310 340"
    ].map((d, i) => (
      <path
        key={i}
        d={d}
        stroke="url(#docGradient)"
        strokeWidth="2"
        fill="none"
      />
    ))}

    {/* Gradients */}
    <defs>
      <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
        <stop offset="50%" stopColor="#EC4899" stopOpacity="1" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
); 