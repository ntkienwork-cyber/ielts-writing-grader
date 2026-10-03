// Hand-drawn-style inline SVG illustrations — academy/school themed, pastel palette.
// Kept as simple flat shapes so they stay crisp at any size with no external assets.

// "Professor owl" mark — warm brown feathers with a cream belly and round
// wood-rimmed glasses for a kindly, approachable academic look; dark navy
// mortarboard with a yellow cord keeps it tied to the site's accent color.
function owlMascotSVG() {
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="owlBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9C6B3F"/>
        <stop offset="100%" stop-color="#6B4423"/>
      </linearGradient>
      <linearGradient id="owlWing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8B5E3C"/>
        <stop offset="100%" stop-color="#5A3A1E"/>
      </linearGradient>
      <linearGradient id="owlChest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF8E7"/>
        <stop offset="100%" stop-color="#F0DBAE"/>
      </linearGradient>
      <linearGradient id="owlCap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2A3B6B"/>
        <stop offset="100%" stop-color="#141B36"/>
      </linearGradient>
      <linearGradient id="owlGlasses" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#C8955B"/>
        <stop offset="100%" stop-color="#8B5A2B"/>
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="207" rx="50" ry="8" fill="#00000018"/>
    <ellipse cx="82" cy="193" rx="10" ry="6" fill="#DD9138"/>
    <ellipse cx="118" cy="193" rx="10" ry="6" fill="#DD9138"/>

    <path d="M46,102 Q22,142 46,186 Q61,160 58,122 Z" fill="url(#owlWing)"/>
    <path d="M154,102 Q178,142 154,186 Q139,160 142,122 Z" fill="url(#owlWing)"/>

    <ellipse cx="100" cy="120" rx="58" ry="78" fill="url(#owlBody)"/>
    <ellipse cx="100" cy="138" rx="34" ry="52" fill="url(#owlChest)"/>
    <path d="M84,112 Q100,120 116,112" stroke="#D9A857" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M82,132 Q100,142 118,132" stroke="#D9A857" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M84,152 Q100,162 116,152" stroke="#D9A857" stroke-width="2" fill="none" opacity="0.55"/>

    <ellipse cx="100" cy="92" rx="52" ry="46" fill="url(#owlBody)"/>
    <ellipse cx="78" cy="90" rx="20" ry="22" fill="#FFFBF2"/>
    <ellipse cx="122" cy="90" rx="20" ry="22" fill="#FFFBF2"/>
    <circle cx="80" cy="92" r="7.5" fill="#3B2414"/>
    <circle cx="120" cy="92" r="7.5" fill="#3B2414"/>
    <circle cx="82.5" cy="89" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="122.5" cy="89" r="2" fill="#fff" opacity="0.9"/>
    <path d="M62,76 Q77,65 94,74" stroke="#DD9138" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M138,76 Q123,65 106,74" stroke="#DD9138" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M93,104 L107,104 L100,118 Z" fill="#DD9138"/>

    <g stroke="url(#owlGlasses)" stroke-width="4.5" stroke-linecap="round" fill="#EAF6FF" fill-opacity="0.12">
      <circle cx="78" cy="92" r="24"/>
      <circle cx="122" cy="92" r="24"/>
      <path d="M101,90 Q100,94 99,90" fill="none"/>
      <path d="M54,88 L42,82" fill="none"/>
      <path d="M146,88 L158,82" fill="none"/>
    </g>
    <path d="M62,78 A24,24 0 0 1 66,74" stroke="#F0D9B8" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M106,78 A24,24 0 0 1 110,74" stroke="#F0D9B8" stroke-width="1.5" fill="none" opacity="0.5"/>

    <g>
      <rect x="58" y="34" width="84" height="9" rx="3" fill="url(#owlCap)"/>
      <polygon points="100,12 158,38 100,50 42,38" fill="url(#owlCap)"/>
      <circle cx="100" cy="38" r="4.5" fill="#FFD166"/>
      <line x1="148" y1="37" x2="148" y2="66" stroke="#FFD166" stroke-width="2.5"/>
      <circle cx="148" cy="70" r="5" fill="#FFD166"/>
    </g>
  </svg>`;
}

function booksIconSVG() {
  return `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="78" width="120" height="16" rx="4" fill="#FF9FC4"/>
    <rect x="28" y="60" width="104" height="16" rx="4" fill="#7FC7EA"/>
    <rect x="36" y="42" width="88" height="16" rx="4" fill="#FFE066"/>
    <circle cx="118" cy="34" r="14" fill="#9FDB8B"/>
    <path d="M110,34 Q118,22 126,34 Q118,29 110,34 Z" fill="#5CA85C"/>
  </svg>`;
}

function pencilPaperSVG() {
  return `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="14" width="80" height="100" rx="8" fill="#ffffff" stroke="#BEE3F8" stroke-width="4"/>
    <line x1="42" y1="36" x2="98" y2="36" stroke="#BEE3F8" stroke-width="5" stroke-linecap="round"/>
    <line x1="42" y1="52" x2="98" y2="52" stroke="#BEE3F8" stroke-width="5" stroke-linecap="round"/>
    <line x1="42" y1="68" x2="80" y2="68" stroke="#BEE3F8" stroke-width="5" stroke-linecap="round"/>
    <g transform="rotate(35 120 90)">
      <rect x="112" y="30" width="14" height="70" rx="4" fill="#FFE066"/>
      <polygon points="112,30 126,30 119,14" fill="#F6B26B"/>
      <rect x="112" y="92" width="14" height="10" fill="#3B3355"/>
    </g>
  </svg>`;
}

function trophySVG() {
  return `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="68" y="88" width="24" height="18" fill="#C9B6E4"/>
    <rect x="52" y="104" width="56" height="10" rx="4" fill="#B79CEB"/>
    <path d="M55,28 h50 v30 a25,25 0 0 1 -50,0 Z" fill="#FFE066"/>
    <path d="M55,33 C35,33 35,58 55,56" fill="none" stroke="#F6B26B" stroke-width="6" stroke-linecap="round"/>
    <path d="M105,33 C125,33 125,58 105,56" fill="none" stroke="#F6B26B" stroke-width="6" stroke-linecap="round"/>
    <circle cx="80" cy="43" r="12" fill="#FFF6D9"/>
  </svg>`;
}

function sparkleSVG() {
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20,0 L24,16 L40,20 L24,24 L20,40 L16,24 L0,20 L16,16 Z"/></svg>`;
}
