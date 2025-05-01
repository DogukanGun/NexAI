export const InterviewAI = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Face outline */}
    <path
      d="M200 100 C 280 100, 300 180, 300 240 C 300 300, 260 340, 200 340 C 140 340, 100 300, 100 240 C 100 180, 120 100, 200 100"
      stroke="url(#interviewGradient)"
      strokeWidth="2"
      fill="none"
    />

    {/* Brain network */}
    {[
      "M150 180 Q 200 140, 250 180",
      "M140 220 Q 200 180, 260 220",
      "M130 260 Q 200 220, 270 260"
    ].map((d, i) => (
      <path
        key={i}
        d={d}
        stroke="url(#interviewGradient)"
        strokeWidth="1"
        fill="none"
      >
        <animate
          attributeName="d"
          values={`${d};${d.replace(/Q \d+ \d+,/, 'Q 200 160,')};${d}`}
          dur={`${2 + i}s`}
          repeatCount="indefinite"
        />
      </path>
    ))}

    {/* Scanning effect */}
    <rect
      x="100"
      y="140"
      width="200"
      height="4"
      fill="url(#scanGradient)"
      opacity="0.5"
    >
      <animateMotion
        path="M 0 0 L 0 200 L 0 0"
        dur="3s"
        repeatCount="indefinite"
      />
    </rect>

    {/* Data points */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle
        key={i}
        cx={140 + i * 24}
        cy={160 + (i % 2) * 30}
        r="3"
        fill="url(#interviewGradient)"
      >
        <animate
          attributeName="opacity"
          values="1;0.2;1"
          dur={`${1 + i * 0.5}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}

    {/* Analysis lines */}
    <g opacity="0.5">
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1="320"
          y1={180 + i * 40}
          x2="380"
          y2={180 + i * 40}
          stroke="url(#interviewGradient)"
          strokeWidth="2"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="x2"
            values="320;380;320"
            dur={`${2 + i}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
    </g>

    {/* Gradients */}
    <defs>
      <linearGradient id="interviewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
        <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
        <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
); 