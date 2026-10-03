// Hand-drawn-style inline SVG illustrations — academy/school themed, pastel palette.
// Kept as simple flat shapes so they stay crisp at any size with no external assets.

// Refined "professor owl" mark — a slimmer silhouette, deep navy/plum body with
// gold accents (matching the site's own purple/gold palette), a sharp confident
// gaze instead of giant round eyes, so it reads as a mature academic mascot
// rather than a children's-book character.
function owlMascotSVG() {
  return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="owlBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4B4376"/>
        <stop offset="100%" stop-color="#2E2A4D"/>
      </linearGradient>
      <linearGradient id="owlWing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#5B4D8A"/>
        <stop offset="100%" stop-color="#3B3355"/>
      </linearGradient>
      <linearGradient id="owlChest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF6DC"/>
        <stop offset="100%" stop-color="#FFE9B0"/>
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="207" rx="50" ry="8" fill="#00000018"/>
    <ellipse cx="82" cy="193" rx="10" ry="6" fill="#E8B64A"/>
    <ellipse cx="118" cy="193" rx="10" ry="6" fill="#E8B64A"/>

    <path d="M46,102 Q22,142 46,186 Q61,160 58,122 Z" fill="url(#owlWing)"/>
    <path d="M154,102 Q178,142 154,186 Q139,160 142,122 Z" fill="url(#owlWing)"/>

    <ellipse cx="100" cy="120" rx="58" ry="78" fill="url(#owlBody)"/>
    <ellipse cx="100" cy="138" rx="34" ry="52" fill="url(#owlChest)"/>
    <path d="M84,112 Q100,120 116,112" stroke="#E8C97A" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M82,132 Q100,142 118,132" stroke="#E8C97A" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M84,152 Q100,162 116,152" stroke="#E8C97A" stroke-width="2" fill="none" opacity="0.6"/>

    <ellipse cx="100" cy="92" rx="52" ry="46" fill="url(#owlBody)"/>
    <ellipse cx="78" cy="90" rx="20" ry="22" fill="#F5F1FF"/>
    <ellipse cx="122" cy="90" rx="20" ry="22" fill="#F5F1FF"/>
    <circle cx="80" cy="92" r="7.5" fill="#211C3B"/>
    <circle cx="120" cy="92" r="7.5" fill="#211C3B"/>
    <circle cx="82.5" cy="89" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="122.5" cy="89" r="2" fill="#fff" opacity="0.9"/>
    <path d="M62,72 L92,78" stroke="#E8B64A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M138,72 L108,78" stroke="#E8B64A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M93,104 L107,104 L100,118 Z" fill="#E8B64A"/>

    <g>
      <rect x="58" y="34" width="84" height="9" rx="3" fill="url(#owlWing)"/>
      <polygon points="100,12 158,38 100,50 42,38" fill="#5B4D8A"/>
      <circle cx="100" cy="38" r="4.5" fill="#2E2A4D"/>
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
