import React from 'react';

/**
 * Icon — thin SVG icons (Lucide style). No emoji.
 *
 * Props:
 *   name   — icon name (see paths below)
 *   size   — number (default 22)
 *   color  — CSS color (default 'currentColor')
 *   stroke — stroke width (default 1.8)
 *   bold   — use thicker stroke (2.2)
 *   filled — fill the icon solid (ignores stroke)
 *   style  — additional wrapper style
 *   ...    — spread onto <svg>
 */
const Icon = ({ name, size = 22, color = 'currentColor', stroke = 1.8, bold, filled, style, ...rest }) => {
  const s = size;
  const c = s / 2;
  const sw = bold ? 2.2 : stroke;
  const fill = filled ? color : 'none';
  const useStroke = filled ? 'none' : color;

  const p = (extras = {}) => ({
    fill,
    stroke: useStroke,
    strokeWidth: sw,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ...extras,
  });

  const paths = {
    dashboard: (
      <>
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" {...p()} />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" {...p()} />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" {...p()} />
        <rect x="14" y="14" width="6.5" height="6.5" rx="1.2" {...p()} />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.3" {...p()} />
        <path d="M3 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" {...p()} />
        <circle cx="18.5" cy="9" r="2.7" {...p()} />
        <path d="M21 19.5c0-2.2-1.5-4-3.5-4.8" {...p()} />
      </>
    ),
    attendance: (
      <>
        <circle cx={c} cy={c} r={c - 3.5} {...p()} />
        <polyline points={`${c},${c * 0.45} ${c},${c} ${c * 1.42},${c}`} {...p()} />
      </>
    ),
    leaves: (
      <>
        <path d="M5.5 19.5c4-14 15-14 13 0" {...p()} />
        <line x1="12" y1="12.5" x2="12" y2="2.5" {...p()} />
        <line x1="12" y1="12.5" x2="6.8" y2="7" {...p()} />
      </>
    ),
    payroll: (
      <>
        <rect x="3.5" y="5" width="17" height="14" rx="2" {...p()} />
        <line x1="3.5" y1="10.5" x2="20.5" y2="10.5" {...p()} />
        <circle cx={c} cy={c} r="2.8" {...p()} />
      </>
    ),
    performance: <polyline points="3,19.5 7,12 11,15 15,7 19,13 21,9" {...p()} />,

    logout: (
      <>
        <path d="M8.5 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5" {...p()} />
        <polyline points="16,7.5 21,12.5 16,17.5" {...p()} />
        <line x1="21" y1="12.5" x2="9" y2="12.5" {...p()} />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" {...p()} />
        <line x1="14.8" y1="14.8" x2="20.5" y2="20.5" {...p()} />
      </>
    ),
    filter: <polygon points="3,4 20.5,4 13,12 13,21 11,21 11,12" {...p()} />,
    plus: (
      <>
        <line x1={c} y1="5" x2={c} y2={s - 5} {...p()} />
        <line x1="5" y1={c} x2={s - 5} y2={c} {...p()} />
      </>
    ),
    edit: (
      <>
        <path d="M11.5 4.5H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5" {...p()} />
        <path d="M18.5 3a2.12 2.12 0 0 1 3 3L12 15.5l-4 1 1-4z" {...p()} />
      </>
    ),
    trash: (
      <>
        <polyline points="3,7 5,7 21,7" {...p()} />
        <path d="M19 7l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7" {...p()} />
        <line x1="10" y1="12" x2="10" y2="17" {...p()} />
        <line x1="14" y1="12" x2="14" y2="17" {...p()} />
        <path d="M9 3.5h6v3H9z" {...p()} />
      </>
    ),
    check:  <polyline points="4.5,13 9.5,18 19.5,6.5" {...p()} />,
    close:  (
      <>
        <line x1="5.5" y1="5.5" x2="18.5" y2="18.5" {...p()} />
        <line x1="18.5" y1="5.5" x2="5.5" y2="18.5" {...p()} />
      </>
    ),
    download: (
      <>
        <path d="M12 3.5v11" {...p()} />
        <polyline points="7,8.5 12,13.5 17,8.5" {...p()} />
        <path d="M3.5 17v1.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V17" {...p()} />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="14.5" rx="2" {...p()} />
        <line x1="3.5" y1="10.5" x2="20.5" y2="10.5" {...p()} />
        <line x1="8.5" y1="2.5" x2="8.5" y2="6.5" {...p()} />
        <line x1="15.5" y1="2.5" x2="15.5" y2="6.5" {...p()} />
      </>
    ),
    user: (
      <>
        <circle cx={c} cy={c * 0.55} r={c * 0.42} {...p()} />
        <path d={`M${c * 0.1} ${s * 0.9} C${c * 0.1} ${c * 0.75} ${c * 0.5} ${c * 0.4} ${c} ${c * 0.4} S${c * 1.9} ${c * 0.75} ${c * 1.9} ${s * 0.9}`} {...p()} />
      </>
    ),
    chevronRight: <polyline points="9,5.5 16,12.5 9,19.5" {...p()} />,
    chevronDown:  <polyline points="5.5,9 12.5,16 19.5,9" {...p()} />,
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...p()} />
        <polyline points="3.5,6 12,12.5 20.5,6" {...p()} />
      </>
    ),
    clock: (
      <>
        <circle cx={c} cy={c} r={c - 3.5} {...p()} />
        <polyline points={`${c},${c * 0.45} ${c},${c} ${c * 1.42},${c}`} {...p()} />
      </>
    ),
    bell: (
      <>
        <path d="M18.5 9.5A6 6 0 0 0 5.5 9.5c0 7-2.5 9-2.5 9h18s-2.5-2-2.5-9" {...p()} />
        <path d="M14 21a2 2 0 0 1-3.4 0" {...p()} />
      </>
    ),
    eye: (
      <>
        <path d="M1.5 12s3.7-7.5 10.5-7.5S22.5 12 22.5 12s-3.7 7.5-10.5 7.5S1.5 12 1.5 12z" {...p()} />
        <circle cx="12" cy="12" r="3.2" {...p()} />
      </>
    ),
    eyeOff: (
      <>
        <path d="M18 18A10 10 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5-6" {...p()} />
        <path d="M9.9 4.3A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.7 4" {...p()} />
        <line x1="1" y1="1" x2="23" y2="23" {...p()} />
      </>
    ),
    refresh: (
      <>
        <polyline points="2.5,4.5 2.5,10 8,10" {...p()} />
        <path d="M3.8 15.5a8.5 8.5 0 1 0 2.2-7L2.5 10" {...p()} />
      </>
    ),
    export: (
      <>
        <path d="M4 14v5a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-5" {...p()} />
        <polyline points="8,9.5 12,5.5 16,9.5" {...p()} />
        <line x1="12" y1="5.5" x2="12" y2="15.5" {...p()} />
      </>
    ),

    /* ── bottom-nav icons ── */
    home: (
      <>
        <path d="M3.5 12L12 3.5 20.5 12" {...p()} />
        <path d="M9.5 20.5V12.5h5v8" {...p()} />
      </>
    ),
    briefcase: (
      <>
        <rect x="3.5" y="7.5" width="17" height="11" rx="2" {...p()} />
        <path d="M8.5 7.5V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" {...p()} />
      </>
    ),
    document: (
      <>
        <path d="M14.5 3H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" {...p()} />
        <polyline points="14.5,3 14.5,9 20.5,9" {...p()} />
      </>
    ),
    credit: (
      <>
        <rect x="1.5" y="5" width="21" height="14" rx="2" {...p()} />
        <line x1="1.5" y1="10" x2="22.5" y2="10" {...p()} />
      </>
    ),
    star: (
      <polygon
        points="12,2.5 15,8.5 21.5,9.5 17,14.5 18.3,21 12,18 5.7,21 7,14.5 2.5,9.5 9,8.5"
        {...p()}
      />
    ),
    exclamation: (
      <>
        <circle cx={c} cy={c} r={c - 3} {...p()} />
        <line x1={c} y1={c * 0.58} x2={c} y2={c * 1.25} {...p()} />
        <line x1={c} y1={c * 1.55} x2={c} y2={c * 1.78} {...p()} />
      </>
    ),
    chart: <polyline points="3,20 8,14 12,17 16,10 20,13 21,11" {...p()} />,
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ display: 'block', flexShrink: 0, ...style }}
      {...rest}
    >
      {paths[name] || null}
    </svg>
  );
};

export default Icon;
