"use client"

export const FutureVisualization = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transform-gpu"
  >
    {/* Background grid */}
    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path
        d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="url(#gridGradient)"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </pattern>
    <rect width="800" height="400" fill="url(#grid)" opacity="0.5">
      <animate
        attributeName="opacity"
        values="0.3;0.5;0.3"
        dur="4s"
        repeatCount="indefinite"
      />
    </rect>

    {/* Central orb */}
    <circle cx="400" cy="200" r="50" fill="url(#orbGradient)" opacity="0.8">
      <animate
        attributeName="r"
        values="50;55;50"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>
    
    {/* Rotating rings */}
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={0.6 - i * 0.15}>
        <circle
          cx="400"
          cy="200"
          r={80 + i * 40}
          stroke="url(#ringGradient)"
          strokeWidth="1"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 400 200`}
            to={`360 400 200`}
            dur={`${10 + i * 5}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    ))}

    {/* Data nodes */}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i * Math.PI * 2) / 6;
      const x = 400 + Math.cos(angle) * 150;
      const y = 200 + Math.sin(angle) * 150;
      
      return (
        <g key={i}>
          {/* Connection line */}
          <line
            x1="400"
            y1="200"
            x2={x}
            y2={y}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="strokeDashoffset"
              values="0;8"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
          
          {/* Node */}
          <circle
            cx={x}
            cy={y}
            r="10"
            fill="url(#nodeGradient)"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur={`${2 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>

          {/* Pulse effect */}
          <circle
            cx={x}
            cy={y}
            r="10"
            stroke="url(#pulseGradient)"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="r"
              values="10;20;10"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur={`${3 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      );
    })}

    {/* Floating particles */}
    {[...Array(12)].map((_, i) => (
      <circle
        key={i}
        r="2"
        fill="url(#particleGradient)"
        opacity="0.6"
      >
        <animateMotion
          path={`M${400 + Math.cos(i * 30) * 100},${200 + Math.sin(i * 30) * 100} a100,100 0 1,${i % 2} -200,0 a100,100 0 1,${i % 2} 200,0`}
          dur={`${10 + i}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}

    {/* Gradients */}
    <defs>
      <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
      </linearGradient>
      
      <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </radialGradient>

      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>

      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>

      <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </radialGradient>

      <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
      </linearGradient>

      <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
); 