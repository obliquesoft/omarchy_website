// The malleable homepage. The page itself is the live
// omarchy.org homepage, untouched. This module layers the whole idea on top:
// a five-second dissolve into a community theme, and a StumbleUpon-inspired bar (never called that on screen)
// that names the theme, credits its maker, carries the motto, and lets anyone
// describe a new theme in a sentence. Dismiss the bar and clicking the ASCII
// mark brings it back. The copy never changes; only the clothes do.

const DISSOLVE_DELAY_MS = 5000;
const LOADER_TEXT = 'loading malleable homepage';

const THEMES = [
  {
    id: 'default',
    name: 'We can fix everything',
    nod: 'every missing app, every incompatibility, every paper cut',
    submitter: { label: '@leemcalilly', url: 'https://github.com/leemcalilly' },
  },
  {
    id: 'radiant-baby',
    name: 'Radiant Baby',
    nod: 'for the man who made subway walls dance',
    submitter: { label: '@subwaychalk', url: '#' },
  },
  {
    id: 'city-of-the-future',
    name: 'City of the Future',
    nod: 'a big beautiful tomorrow, now boarding',
    submitter: { label: '@monorail_pilot', url: '#' },
  },
  {
    id: 'azteca-86',
    name: "Azteca '86",
    nod: 'the summer the whole world wore stripes',
    submitter: null,
  },
  {
    id: 'milano-81',
    name: "Milano '81",
    nod: 'a bookshelf that refused to behave',
    submitter: { label: '@terrazzo', url: '#' },
  },
  {
    id: 'player-one-85',
    name: "Player One '85",
    nod: 'blow on the cartridge and try again',
    submitter: { label: '@second_quarter', url: '#' },
  },
  {
    id: 'basildon',
    name: 'Basildon',
    nod: 'synth-pop from an Essex new town',
    submitter: null,
  },
  {
    id: 'paperclip-85',
    name: "Paperclip '85",
    nod: 'a mullet, duct tape, and one good idea',
    submitter: null,
  },
  {
    id: 'breadbin-82',
    name: "Breadbin '82",
    nod: 'load "*",8,1',
    submitter: { label: '@peek_and_poke', url: '#' },
  },
  {
    id: 'boy-wonder-89',
    name: "Boy Wonder '89",
    nod: 'sixteen, with a stethoscope and a modem',
    submitter: null,
  },
  {
    id: 'touch-of-grey-87',
    name: "Touch of Grey '87",
    nod: 'the dancing bears went a little gray',
    submitter: { label: '@ripple_effect', url: '#' },
  },
  {
    id: 'on-belay-88',
    name: "On Belay '88",
    nod: 'the baby stuck the landing',
    submitter: { label: '@synchilla', url: '#' },
  },
  {
    id: 'hot-dog-84',
    name: "Hot Dog '84",
    nod: 'last one down buys the cocoa',
    submitter: { label: '@mogul_maniac', url: '#' },
  },
  {
    id: 'castle-rock-86',
    name: "Castle Rock '86",
    nod: 'four friends walking the tracks',
    submitter: { label: '@traindodger', url: '#' },
  },
  {
    id: 'nantahala-83',
    name: "Nantahala '83",
    nod: "paddling patton's run",
    submitter: { label: '@eddy_out', url: '#' },
  },
];

const LOGO_SVG = `<svg fill="none" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path clip-rule="evenodd" d="m1200 1200h-480v-80h400v-1040h-479.996v160h-400v720h720v-720h-80v-80h159.996v880h-400v160h-640v-1200h1200zm-1120-80h480v-80h-400l.004-400h-80.004zm0-560h80.004v-400h400v-80h-480.004z" fill="currentColor" fill-rule="evenodd"/></svg>`;

// Scenery: each theme brings its own artwork — decorative pieces placed in
// the page gutters, behind the content. The copy never moves; the world
// around it changes. Everything is inline SVG animated from themes.css.
const SCENERY = {
  'radiant-baby': `
    <span class="msc msc--wiggle" style="left:3vw; top:9vh; width:12em;">
      <svg viewBox="0 0 110 110" fill="none" stroke="#ff5252" stroke-width="7" stroke-linecap="round">
        <circle cx="55" cy="22" r="10" fill="#ff5252" stroke="none"/>
        <path d="M55 34 L55 62 M55 42 L32 30 M55 42 L78 30 M55 62 L36 92 M55 62 L74 92"/>
        <path d="M20 12 L13 5 M90 12 L97 5 M12 55 L3 55 M98 55 L107 55" stroke-width="5"/>
      </svg>
    </span>
    <span class="msc msc--wiggle-late" style="right:3vw; top:9vh; width:11em;">
      <svg viewBox="0 0 110 110" fill="none" stroke="#ffd100" stroke-width="7" stroke-linecap="round">
        <circle cx="55" cy="22" r="10" fill="#ffd100" stroke="none"/>
        <path d="M55 34 L55 62 M55 44 L34 56 M55 44 L76 32 M55 62 L38 94 M55 62 L72 94"/>
        <path d="M20 12 L13 5 M90 12 L97 5 M12 55 L3 55 M98 55 L107 55" stroke-width="5"/>
      </svg>
    </span>
    <span class="msc msc--pulse" style="left:7vw; top:32vh; width:6em;">
      <svg viewBox="0 0 100 110" fill="none" stroke="#5291ff" stroke-width="7" stroke-linecap="round">
        <path d="M50 92 C22 70 16 48 30 36 C40 28 48 34 50 42 C52 34 60 28 70 36 C84 48 78 70 50 92 Z"/>
        <path d="M50 18 L50 8 M24 26 L17 19 M76 26 L83 19" stroke-width="5"/>
      </svg>
    </span>
    <span class="msc msc--wiggle" style="right:7vw; top:33vh; width:8em;">
      <svg viewBox="0 0 130 90" fill="none" stroke="#fafafa" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 42 L18 26 L30 36 L96 36 L112 20 L112 42 L104 50 L104 76 M88 50 L88 76 M48 50 L48 76 M32 50 L32 76 M30 36 L30 50 L104 50"/>
        <path d="M118 12 L124 4 M124 24 L132 20" stroke-width="5"/>
      </svg>
    </span>`,

  'city-of-the-future': `
    <span class="msc" style="left:0; right:0; bottom:0; width:100%;">
      <svg viewBox="0 0 1000 240" preserveAspectRatio="none" fill="none" stroke="rgba(72,219,200,0.5)" stroke-width="1.5">
        <path d="M0 30 H1000 M0 48 H1000 M0 74 H1000 M0 110 H1000 M0 158 H1000 M0 220 H1000"/>
        <path d="M500 30 L500 240 M470 30 L360 240 M440 30 L200 240 M410 30 L20 240 M380 30 L-200 240 M530 30 L640 240 M560 30 L800 240 M590 30 L980 240 M620 30 L1200 240"/>
      </svg>
    </span>
    <span class="msc msc--spin-slow" style="left:3vw; top:7vh; width:12em;">
      <svg viewBox="0 0 120 120" fill="none" stroke="#c9c4f2" stroke-width="1.5">
        <circle cx="60" cy="60" r="52"/>
        <path d="M12 40 H108 M8 60 H112 M12 80 H108 M40 12 V108 M60 8 V112 M80 12 V108"/>
        <path d="M22 22 L98 98 M98 22 L22 98 M60 8 L108 60 L60 112 L12 60 Z"/>
      </svg>
    </span>
    <span class="msc msc--rise" style="right:3vw; top:7vh; width:13em;">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="#ffb042"/>
        <g fill="rgb(21,17,52)">
          <rect x="0" y="66" width="120" height="5"/>
          <rect x="0" y="78" width="120" height="7"/>
          <rect x="0" y="92" width="120" height="9"/>
          <rect x="0" y="108" width="120" height="12"/>
        </g>
      </svg>
    </span>
    <span class="msc msc--glide" style="left:0; top:38vh; width:14em;">
      <svg viewBox="0 0 200 40" fill="none">
        <rect x="10" y="10" width="180" height="16" rx="8" fill="#c9c4f2"/>
        <rect x="26" y="14" width="20" height="8" rx="3" fill="#151134"/>
        <rect x="56" y="14" width="20" height="8" rx="3" fill="#151134"/>
        <rect x="86" y="14" width="20" height="8" rx="3" fill="#151134"/>
        <rect x="116" y="14" width="20" height="8" rx="3" fill="#151134"/>
        <path d="M0 34 H200" stroke="#48dbc8" stroke-width="3"/>
      </svg>
    </span>
    <span class="msc msc--twinkle" style="left:14vw; top:26vh; width:2em;">
      <svg viewBox="0 0 40 40" stroke="#48dbc8" stroke-width="3" stroke-linecap="round"><path d="M20 4 V36 M4 20 H36"/></svg>
    </span>
    <span class="msc msc--twinkle-late" style="right:14vw; top:30vh; width:1.5em;">
      <svg viewBox="0 0 40 40" stroke="#ff7ab2" stroke-width="3" stroke-linecap="round"><path d="M20 4 V36 M4 20 H36"/></svg>
    </span>`,

  'azteca-86': `
    <span class="msc msc--spin-slow" style="right:3vw; top:8vh; width:11em;">
      <svg viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="52" stroke="#1b5e20" stroke-width="10" stroke-dasharray="24 12"/>
        <circle cx="60" cy="60" r="34" stroke="#c63c22" stroke-width="10" stroke-dasharray="16 10"/>
        <circle cx="60" cy="60" r="18" stroke="#e69600" stroke-width="10" stroke-dasharray="9 7"/>
        <circle cx="60" cy="60" r="5" fill="#26221a"/>
      </svg>
    </span>
    <span class="msc msc--roll" style="left:4vw; top:22vh; width:9em;">
      <svg viewBox="0 0 120 120">
        <clipPath id="azteca-ball"><circle cx="60" cy="60" r="52"/></clipPath>
        <circle cx="60" cy="60" r="52" fill="#fdf8ec"/>
        <g clip-path="url(#azteca-ball)">
          <path id="azteca-patch" d="M42 -10 L78 -10 L84 10 L60 22 L36 10 Z" fill="#26221a"/>
          <use href="#azteca-patch" transform="rotate(72 60 60)"/>
          <use href="#azteca-patch" transform="rotate(144 60 60)"/>
          <use href="#azteca-patch" transform="rotate(216 60 60)"/>
          <use href="#azteca-patch" transform="rotate(288 60 60)"/>
        </g>
        <path d="M60 41 L78 54 L71 75 L49 75 L42 54 Z" fill="#26221a"/>
        <g stroke="#26221a" stroke-width="4">
          <path id="azteca-seam" d="M60 41 L60 22"/>
          <use href="#azteca-seam" transform="rotate(72 60 60)"/>
          <use href="#azteca-seam" transform="rotate(144 60 60)"/>
          <use href="#azteca-seam" transform="rotate(216 60 60)"/>
          <use href="#azteca-seam" transform="rotate(288 60 60)"/>
        </g>
        <circle cx="60" cy="60" r="52" fill="none" stroke="#26221a" stroke-width="5"/>
      </svg>
    </span>
    <span class="msc" style="left:0; top:0; bottom:0; width:1.6em; background:repeating-linear-gradient(to bottom, #1b5e20 0 4em, #c63c22 4em 8em, #e69600 8em 12em, #26221a 12em 16em);"></span>
    <span class="msc" style="right:0; top:0; bottom:0; width:1.6em; background:repeating-linear-gradient(to bottom, #26221a 0 4em, #e69600 4em 8em, #c63c22 8em 12em, #1b5e20 12em 16em);"></span>`,

  'milano-81': `
    <span class="msc msc--bob" style="left:3vw; top:8vh; width:10em;">
      <svg viewBox="0 0 120 50" fill="none" stroke="#ec407a" stroke-width="9" stroke-linecap="round">
        <path d="M6 42 L26 10 L46 42 L66 10 L86 42 L106 10"/>
      </svg>
    </span>
    <span class="msc msc--bob-late" style="right:3vw; top:8vh; width:9em;">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="#00afb5"/>
        <path d="M14 36 H86 M10 54 H90 M18 72 H82" stroke="#f8f4ee" stroke-width="7"/>
      </svg>
    </span>
    <span class="msc msc--spin-slow" style="left:7vw; top:30vh; width:6em;">
      <svg viewBox="0 0 100 100"><path d="M50 8 L94 88 L6 88 Z" fill="#ffc400"/></svg>
    </span>
    <span class="msc msc--bob" style="right:5vw; top:33vh; width:9em;">
      <svg viewBox="0 0 140 40" fill="none" stroke="#18181c" stroke-width="7" stroke-linecap="round">
        <path d="M6 20 Q23 -8 40 20 Q57 48 74 20 Q91 -8 108 20 Q125 48 134 20"/>
      </svg>
    </span>`,

  'player-one-85': `
    <span class="msc msc--hop" style="left:4vw; top:9vh; width:8em;">
      <svg viewBox="0 0 110 80" shape-rendering="crispEdges" fill="#b8f818">
        <rect x="20" y="0" width="10" height="10"/><rect x="80" y="0" width="10" height="10"/>
        <rect x="30" y="10" width="10" height="10"/><rect x="70" y="10" width="10" height="10"/>
        <rect x="20" y="20" width="70" height="10"/>
        <rect x="10" y="30" width="20" height="10"/><rect x="40" y="30" width="30" height="10"/><rect x="80" y="30" width="20" height="10"/>
        <rect x="0" y="40" width="110" height="10"/>
        <rect x="0" y="50" width="10" height="10"/><rect x="20" y="50" width="70" height="10"/><rect x="100" y="50" width="10" height="10"/>
        <rect x="0" y="60" width="10" height="10"/><rect x="20" y="60" width="10" height="10"/><rect x="80" y="60" width="10" height="10"/><rect x="100" y="60" width="10" height="10"/>
        <rect x="30" y="70" width="20" height="10"/><rect x="60" y="70" width="20" height="10"/>
      </svg>
    </span>
    <span class="msc msc--pulse" style="right:5vw; top:11vh; width:4em;">
      <svg viewBox="0 0 70 60" shape-rendering="crispEdges" fill="#d82800">
        <rect x="10" y="0" width="20" height="10"/><rect x="40" y="0" width="20" height="10"/>
        <rect x="0" y="10" width="70" height="20"/>
        <rect x="10" y="30" width="50" height="10"/>
        <rect x="20" y="40" width="30" height="10"/>
        <rect x="30" y="50" width="10" height="10"/>
      </svg>
    </span>
    <span class="msc msc--hop-late" style="right:9vw; top:28vh; width:4.5em;">
      <svg viewBox="0 0 60 60" shape-rendering="crispEdges">
        <rect x="0" y="0" width="60" height="60" fill="#fc9838"/>
        <rect x="4" y="4" width="4" height="4" fill="#181818"/><rect x="52" y="4" width="4" height="4" fill="#181818"/>
        <rect x="4" y="52" width="4" height="4" fill="#181818"/><rect x="52" y="52" width="4" height="4" fill="#181818"/>
        <g fill="#fff8e8">
          <rect x="20" y="12" width="20" height="6"/><rect x="14" y="18" width="8" height="8"/><rect x="38" y="18" width="8" height="8"/>
          <rect x="34" y="26" width="8" height="6"/><rect x="26" y="30" width="8" height="8"/><rect x="26" y="44" width="8" height="6"/>
        </g>
      </svg>
    </span>
    <span class="msc msc--bob" style="left:4vw; top:30vh; width:13em;">
      <svg viewBox="0 0 200 90">
        <rect x="0" y="0" width="200" height="90" rx="6" fill="#d8d8d8"/>
        <rect x="0" y="0" width="200" height="14" rx="6" fill="#181818"/>
        <rect x="0" y="76" width="200" height="14" rx="6" fill="#181818"/>
        <rect x="30" y="24" width="14" height="42" fill="#181818"/>
        <rect x="16" y="38" width="42" height="14" fill="#181818"/>
        <rect x="72" y="52" width="52" height="18" rx="4" fill="#b0b0b0"/>
        <rect x="78" y="58" width="16" height="7" fill="#181818"/>
        <rect x="102" y="58" width="16" height="7" fill="#181818"/>
        <circle cx="150" cy="58" r="12" fill="#d82800"/>
        <circle cx="182" cy="58" r="12" fill="#d82800"/>
      </svg>
    </span>`,

  'basildon': `
    <span class="msc" style="left:0; right:0; bottom:14vh; width:100%;">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none" stroke="#ff3b3b" stroke-width="3">
        <path class="msc__wave" d="M0 40 Q50 0 100 40 Q150 80 200 40 Q250 0 300 40 Q350 80 400 40 Q450 0 500 40 Q550 80 600 40 Q650 0 700 40 Q750 80 800 40 Q850 0 900 40 Q950 80 1000 40 Q1050 0 1100 40 Q1150 80 1200 40" stroke-dasharray="16 10"/>
      </svg>
    </span>
    <span class="msc" style="right:4vw; top:10vh; width:7em;">
      <svg viewBox="0 0 120 90" fill="#38383e">
        <rect class="msc__vu" x="0" y="10" width="16" height="80"/>
        <rect class="msc__vu msc__vu--2" x="26" y="10" width="16" height="80"/>
        <rect class="msc__vu msc__vu--3" x="52" y="10" width="16" height="80" fill="#ff3b3b"/>
        <rect class="msc__vu msc__vu--4" x="78" y="10" width="16" height="80"/>
        <rect class="msc__vu msc__vu--5" x="104" y="10" width="16" height="80"/>
      </svg>
    </span>
    <span class="msc" style="left:3vw; top:10vh; width:13em;">
      <svg viewBox="0 0 220 110">
        <rect x="0" y="0" width="220" height="110" rx="6" fill="#26262c"/>
        <circle cx="24" cy="22" r="10" fill="none" stroke="#e2e2e8" stroke-width="3"/>
        <circle cx="56" cy="22" r="10" fill="none" stroke="#e2e2e8" stroke-width="3"/>
        <circle cx="88" cy="22" r="10" fill="none" stroke="#ff3b3b" stroke-width="3"/>
        <path d="M24 22 L24 14 M56 22 L62 16 M88 22 L94 22" stroke="#e2e2e8" stroke-width="3"/>
        <rect x="120" y="10" width="88" height="24" rx="3" fill="#101014"/>
        <rect class="msc__vu" x="126" y="14" width="6" height="16" fill="#ff3b3b"/>
        <rect class="msc__vu msc__vu--2" x="136" y="14" width="6" height="16" fill="#ff3b3b"/>
        <rect class="msc__vu msc__vu--3" x="146" y="14" width="6" height="16" fill="#ff3b3b"/>
        <rect x="10" y="44" width="200" height="56" fill="#f4f4f8"/>
        <g fill="#101014">
          <rect x="10" y="44" width="2" height="56"/><rect x="38" y="44" width="2" height="56"/><rect x="66" y="44" width="2" height="56"/><rect x="94" y="44" width="2" height="56"/><rect x="122" y="44" width="2" height="56"/><rect x="150" y="44" width="2" height="56"/><rect x="178" y="44" width="2" height="56"/><rect x="208" y="44" width="2" height="56"/>
          <rect x="30" y="44" width="14" height="34"/><rect x="58" y="44" width="14" height="34"/><rect x="114" y="44" width="14" height="34"/><rect x="142" y="44" width="14" height="34"/><rect x="170" y="44" width="14" height="34"/>
        </g>
      </svg>
    </span>`,

  'breadbin-82': `
    <span class="msc msc--c64-text" style="left:2em; top:10vh;">**** OMARCHY 64 BASIC V2 ****<br>64K RAM SYSTEM  38911 BASIC BYTES FREE<br>READY.<br><span class="msc__block">▮</span></span>
    <span class="msc" style="right:4vw; top:24vh; width:8em;">
      <svg viewBox="0 0 110 100">
        <path d="M60 10 A40 40 0 1 0 60 90 L60 68 A22 22 0 1 1 60 32 Z" fill="#a598df"/>
        <path d="M64 32 H106 L90 50 L106 68 H64 Z" fill="#e04a3f"/>
      </svg>
    </span>
    <span class="msc msc--c64-text" style="right:4vw; top:44vh;">RUN<br><span class="msc__block">▮</span></span>`,

  'boy-wonder-89': `
    <span class="msc" style="left:0; right:0; top:8vh; width:100%;">
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" fill="none" stroke="#55ff55" stroke-width="4">
        <path class="msc__ekg" d="M0 40 H340 L360 40 L372 14 L384 66 L396 34 L408 40 H760 L780 40 L792 14 L804 66 L816 34 L828 40 H1200" stroke-dasharray="1200" />
      </svg>
    </span>
    <span class="msc msc--dos-cursor" style="left:2em; top:24vh;">C:\\JOURNAL&gt;<span class="msc__block">▮</span></span>
    <span class="msc msc--dos-cursor msc--dos-typing" style="left:2em; top:28vh;">▆▆▆▆ ▆▆ ▆▆▆▆▆▆ ▆▆▆ ▆▆▆▆ ▆ ▆▆▆▆▆ ▆▆▆▆▆▆</span>
    <span class="msc msc--pulse" style="right:4vw; top:22vh; width:6em;">
      <svg viewBox="0 0 80 80">
        <rect x="28" y="6" width="24" height="68" fill="#ff5555"/>
        <rect x="6" y="28" width="68" height="24" fill="#ff5555"/>
      </svg>
    </span>
    <span class="msc msc--bob" style="right:5vw; top:40vh; width:7em;">
      <svg viewBox="0 0 130 70">
        <rect x="0" y="0" width="130" height="70" rx="10" fill="#c8c8d8"/>
        <rect x="12" y="16" width="70" height="26" rx="4" fill="#183818"/>
        <rect x="18" y="24" width="44" height="10" fill="#55ff55"/>
        <circle cx="105" cy="29" r="9" fill="#8888a0"/>
        <rect x="12" y="52" width="106" height="8" rx="4" fill="#8888a0"/>
      </svg>
    </span>`,

  'touch-of-grey-87': `
    <span class="msc msc--spin-slow" style="right:3vw; top:7vh; width:11em;">
      <svg viewBox="0 0 120 120">
        <clipPath id="grey-skull"><circle cx="60" cy="60" r="50"/></clipPath>
        <g clip-path="url(#grey-skull)">
          <rect x="0" y="0" width="60" height="120" fill="#e04a3f"/>
          <rect x="60" y="0" width="60" height="120" fill="#3f6fe0"/>
          <path d="M78 0 L50 52 L70 52 L42 120 L54 64 L34 64 L62 0 Z" fill="#f4f4f4"/>
        </g>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#f4f4f4" stroke-width="7"/>
      </svg>
    </span>
    <span class="msc msc--bob" style="left:3vw; top:8vh; width:8em;">
      <svg viewBox="0 0 100 120" fill="#e69600">
        <circle cx="35" cy="26" r="14"/>
        <circle cx="24" cy="13" r="5"/>
        <circle cx="47" cy="13" r="5"/>
        <path d="M28 38 C10 46 8 70 18 84 L10 108 L26 108 L32 88 L46 88 L54 108 L70 108 L58 80 C68 66 60 44 44 38 Z"/>
        <path d="M52 46 L78 30 M18 52 L2 38" stroke="#e69600" stroke-width="9" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="msc msc--bob-late" style="left:8vw; top:30vh; width:7em;">
      <svg viewBox="0 0 100 120" fill="#3fa652">
        <circle cx="55" cy="26" r="14"/>
        <circle cx="44" cy="13" r="5"/>
        <circle cx="67" cy="13" r="5"/>
        <path d="M48 38 C30 46 28 70 38 84 L30 108 L46 108 L52 88 L66 88 L74 108 L90 108 L78 80 C88 66 80 44 64 38 Z"/>
        <path d="M72 46 L96 32 M38 52 L22 38" stroke="#3fa652" stroke-width="9" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="msc msc--pulse" style="right:8vw; top:32vh; width:5em;">
      <svg viewBox="0 0 60 100" fill="#f2d13d"><path d="M38 0 L10 52 L28 52 L14 100 L52 40 L32 40 L52 0 Z"/></svg>
    </span>`,

  'paperclip-85': `
    <span class="msc msc--sway" style="right:5vw; top:8vh; width:6.5em;">
      <svg viewBox="0 0 60 140" fill="none" stroke="#c0c5ca" stroke-width="8" stroke-linecap="round">
        <path d="M30 10 C44 10 50 18 50 30 V100 C50 116 40 126 28 126 C16 126 8 116 8 102 V40 C8 30 14 24 22 24 C30 24 36 30 36 40 V96"/>
      </svg>
    </span>
    <span class="msc" style="left:0; top:10vh; width:11em;">
      <svg viewBox="0 0 160 120" fill="rgba(150,155,160,0.4)">
        <rect x="-30" y="40" width="200" height="26" transform="rotate(24 80 60)"/>
        <rect x="-30" y="40" width="200" height="26" transform="rotate(-18 80 60)"/>
      </svg>
    </span>
    <span class="msc msc--spin-slow" style="left:5vw; top:22vh; width:8em;">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="56" fill="#9a9fa4"/>
        <circle cx="60" cy="60" r="30" fill="#26282a"/>
        <circle cx="60" cy="60" r="56" fill="none" stroke="#7d8287" stroke-width="4" stroke-dasharray="10 8"/>
      </svg>
    </span>
    <span class="msc msc--bob-late" style="right:8vw; top:30vh; width:9em;">
      <svg viewBox="0 0 160 70">
        <rect x="0" y="20" width="110" height="40" rx="10" fill="#d33a2c"/>
        <path d="M104 34 L156 12 L158 20 L108 44 Z" fill="#c0c5ca"/>
        <circle cx="16" cy="40" r="5" fill="#f4f4f4"/>
      </svg>
    </span>
    <span class="msc msc--twinkle" style="left:7vw; top:40vh; width:4em;">
      <svg viewBox="0 0 80 60" fill="none" stroke="#ff6f00" stroke-width="6" stroke-linecap="round">
        <path d="M6 30 L26 30 L38 10 L50 50 L60 30 L74 30"/>
      </svg>
    </span>
    <span class="msc msc--drive" style="left:0; top:30vh; width:15em;">
      <svg viewBox="0 0 240 120">
        <g fill="#9aa0a6" opacity="0.7">
          <circle cx="10" cy="92" r="8"/><circle cx="24" cy="98" r="10"/><circle cx="0" cy="100" r="7"/>
        </g>
        <circle cx="30" cy="62" r="15" fill="#1c1c1c"/>
        <circle cx="30" cy="62" r="6" fill="#5a5a5a"/>
        <path d="M82 52 L82 20 Q84 14 90 14 L106 14" stroke="#1c1c1c" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="103" cy="26" r="9" fill="#e8b48c"/>
        <path d="M94 22 Q103 12 112 22 L112 30 L108 30 L108 24 Z" fill="#8a5a2c"/>
        <rect x="93" y="24" width="6" height="16" rx="3" fill="#8a5a2c"/>
        <rect x="95" y="35" width="17" height="18" rx="4" fill="#b5651d"/>
        <path d="M110 40 L124 42" stroke="#b5651d" stroke-width="5" stroke-linecap="round"/>
        <circle cx="127" cy="42" r="6" fill="none" stroke="#1c1c1c" stroke-width="3"/>
        <path d="M40 52 L124 52 L128 40 L136 40 L140 52 L192 52 L192 86 L40 86 Z" fill="#7a6a4a"/>
        <rect x="130" y="22" width="7" height="30" fill="#3a3a3a"/>
        <rect x="137" y="24" width="5" height="26" fill="#cfe3ea"/>
        <rect x="188" y="56" width="16" height="28" rx="2" fill="#5e5340"/>
        <path d="M190 60 V80 M195 60 V80 M200 60 V80" stroke="#2e2820" stroke-width="2"/>
        <circle cx="198" cy="66" r="4" fill="#f2d13d"/>
        <path d="M52 86 A18 18 0 0 1 88 86 Z M136 86 A18 18 0 0 1 172 86 Z" fill="#5e5340"/>
        <circle cx="70" cy="90" r="18" fill="#1c1c1c"/>
        <circle cx="70" cy="90" r="7" fill="#8a8f94"/>
        <circle cx="154" cy="90" r="18" fill="#1c1c1c"/>
        <circle cx="154" cy="90" r="7" fill="#8a8f94"/>
      </svg>
    </span>`,

  'on-belay-88': `
    <span class="msc msc--bob" style="left:16vw; right:16vw; top:9vh;">
      <svg viewBox="0 0 600 130" fill="none">
        <path d="M20 122 Q300 -14 580 122" stroke="#d22838" stroke-width="4" stroke-dasharray="10 10"/>
        <g>
          <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" path="M20 122 Q300 -14 580 122"/>
          <rect x="-23" y="-8" width="46" height="17" rx="8" fill="#b03a9c"/>
          <circle cx="-29" cy="-8" r="10" fill="#b03a9c"/>
          <circle cx="-30" cy="-2" r="7" fill="#e8b48c"/>
          <circle cx="25" cy="-8" r="5" fill="#f4f4f4"/>
          <circle cx="27" cy="6" r="5" fill="#f4f4f4"/>
          <path d="M-13 10 L-19 20 M3 10 L1 20" stroke="#b03a9c" stroke-width="5" stroke-linecap="round"/>
        </g>
      </svg>
    </span>
    <span class="msc" style="left:2vw; top:14vh; width:12em;">
      <svg viewBox="0 0 140 190">
        <path d="M0 190 L4 132 Q36 106 78 122 L116 134 L140 154 L140 190 Z" fill="#d9b98c"/>
        <path d="M4 132 Q36 106 78 122 L74 190 L0 190 Z" fill="#c9a878"/>
        <rect x="52" y="58" width="20" height="32" rx="5" fill="#1c2440"/>
        <path d="M56 122 L64 94 M74 122 L72 96" stroke="#2c3a8c" stroke-width="9" stroke-linecap="round"/>
        <path d="M68 96 L84 62" stroke="#d22838" stroke-width="15" stroke-linecap="round"/>
        <path d="M86 62 L114 34 M86 66 L120 48" stroke="#d22838" stroke-width="8" stroke-linecap="round"/>
        <circle cx="117" cy="32" r="4" fill="#e8b48c"/>
        <circle cx="123" cy="46" r="4" fill="#e8b48c"/>
        <circle cx="93" cy="48" r="10" fill="#e8b48c"/>
        <path d="M84 44 Q92 34 102 44" stroke="#3a2a1c" stroke-width="6" stroke-linecap="round" fill="none"/>
        <rect x="48" y="118" width="14" height="8" rx="3" fill="#f4f4f4"/>
        <rect x="68" y="118" width="14" height="8" rx="3" fill="#f4f4f4"/>
      </svg>
    </span>
    <span class="msc" style="right:2vw; top:14vh; width:12em;">
      <svg viewBox="0 0 140 190">
        <path d="M140 190 L136 132 Q104 106 62 122 L24 134 L0 154 L0 190 Z" fill="#d9b98c"/>
        <path d="M136 132 Q104 106 62 122 L66 190 L140 190 Z" fill="#c9a878"/>
        <path d="M84 122 L76 94 M66 122 L68 96" stroke="#e8b48c" stroke-width="8" stroke-linecap="round"/>
        <rect x="62" y="88" width="22" height="12" rx="5" fill="#e88ca8"/>
        <path d="M72 92 L56 62" stroke="#d22838" stroke-width="15" stroke-linecap="round"/>
        <path d="M54 62 L26 34 M54 66 L20 48" stroke="#d22838" stroke-width="8" stroke-linecap="round"/>
        <circle cx="23" cy="32" r="4" fill="#e8b48c"/>
        <circle cx="17" cy="46" r="4" fill="#e8b48c"/>
        <circle cx="47" cy="48" r="10" fill="#e8b48c"/>
        <path d="M38 44 Q46 34 56 44" stroke="#3a2a1c" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="58" cy="38" r="5" fill="#3a2a1c"/>
        <rect x="78" y="118" width="14" height="8" rx="3" fill="#f4f4f4"/>
        <rect x="58" y="118" width="14" height="8" rx="3" fill="#f4f4f4"/>
      </svg>
    </span>
    <span class="msc msc--bob-late" style="left:10vw; top:30vh; width:6em;">
      <svg viewBox="0 0 100 40" fill="#ffffff" opacity="0.85"><ellipse cx="30" cy="26" rx="26" ry="12"/><ellipse cx="58" cy="20" rx="22" ry="11"/><ellipse cx="78" cy="28" rx="18" ry="9"/></svg>
    </span>`,

  'hot-dog-84': `
    <span class="msc" style="left:0; right:0; bottom:0; width:100%;">
      <svg viewBox="0 0 1000 300" preserveAspectRatio="none">
        <path d="M0 300 L0 160 L180 60 L320 190 L470 90 L640 220 L820 120 L1000 240 L1000 300 Z" fill="#ffffff"/>
        <path d="M180 60 L320 190 L240 190 Z" fill="#cfe3f2"/>
        <path d="M470 90 L640 220 L540 220 Z" fill="#cfe3f2"/>
        <path d="M820 120 L1000 240 L900 240 Z" fill="#cfe3f2"/>
      </svg>
    </span>
    <span class="msc msc--ski-run" style="right:5vw; top:8vh; width:11em;">
      <svg viewBox="0 0 150 150" fill="none">
        <path d="M12 118 L112 94 M18 132 L118 108" stroke="#00c8d7" stroke-width="6" stroke-linecap="round"/>
        <path d="M60 106 L56 84 L74 70" stroke="#ff2d95" stroke-width="10" stroke-linecap="round"/>
        <path d="M74 70 L92 46" stroke="#8a2be2" stroke-width="14" stroke-linecap="round"/>
        <path d="M90 52 L116 62 M88 48 L66 40" stroke="#ff2d95" stroke-width="7" stroke-linecap="round"/>
        <path d="M118 62 L136 30 M64 40 L46 12" stroke="#9aa4ae" stroke-width="3" stroke-linecap="round"/>
        <circle cx="98" cy="34" r="10" fill="#e8b48c"/>
        <rect x="87" y="27" width="21" height="7" rx="3" fill="#00c8d7"/>
        <path d="M104 24 Q112 18 118 26" stroke="#f2d13d" stroke-width="5" stroke-linecap="round"/>
        <g fill="#ffffff"><circle cx="14" cy="126" r="7"/><circle cx="26" cy="136" r="9"/><circle cx="8" cy="140" r="6"/></g>
      </svg>
    </span>
    <span class="msc" style="left:5vw; top:12vh; width:3em;">
      <svg viewBox="0 0 40 90"><path d="M8 6 L8 84" stroke="#8a8f94" stroke-width="4"/><path d="M8 8 L36 16 L8 26 Z" fill="#ff2d95"/></svg>
    </span>
    <span class="msc" style="left:11vw; top:30vh; width:3em;">
      <svg viewBox="0 0 40 90"><path d="M8 6 L8 84" stroke="#8a8f94" stroke-width="4"/><path d="M8 8 L36 16 L8 26 Z" fill="#00c8d7"/></svg>
    </span>
    <span class="msc msc--pulse" style="left:3vw; top:12vh; width:4em;">
      <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="18" fill="#f2d13d"/><path d="M30 4 V12 M30 48 V56 M4 30 H12 M48 30 H56 M11 11 L17 17 M43 43 L49 49 M49 11 L43 17 M17 43 L11 49" stroke="#f2d13d" stroke-width="4" stroke-linecap="round"/></svg>
    </span>`,

  'castle-rock-86': `
    <span class="msc" style="left:0; right:0; bottom:0; width:100%;">
      <svg viewBox="0 0 1000 260" preserveAspectRatio="none">
        <ellipse cx="500" cy="262" rx="700" ry="70" fill="#3a2620"/>
        <g stroke="#1a1216" fill="none">
          <path d="M470 60 L330 260 M530 60 L670 260" stroke-width="7"/>
          <path d="M452 96 H548 M430 136 H570 M400 184 H600 M362 240 H638" stroke-width="9"/>
        </g>
        <g fill="#1a1216">
          <path d="M488 22 L492 60 L497 60 L501 22 Z"/>
          <circle cx="494" cy="14" r="7"/>
          <path d="M486 30 L478 44 M502 30 L510 44" stroke="#1a1216" stroke-width="4" stroke-linecap="round"/>
          <path d="M462 34 L465 66 L470 66 L473 34 Z"/>
          <circle cx="467" cy="26" r="6"/>
          <path d="M460 40 L446 30" stroke="#1a1216" stroke-width="4" stroke-linecap="round"/>
          <path d="M524 30 L527 64 L532 64 L535 30 Z"/>
          <circle cx="529" cy="21" r="6"/>
          <path d="M536 36 L546 48" stroke="#1a1216" stroke-width="4" stroke-linecap="round"/>
          <path d="M550 40 L552 68 L557 68 L560 40 Z"/>
          <circle cx="555" cy="32" r="5"/>
        </g>
        <g stroke="#1a1216" stroke-width="5">
          <path d="M120 260 L120 120 M92 138 H148 M98 156 H142"/>
          <path d="M880 260 L880 100 M852 120 H908 M858 138 H902"/>
        </g>
      </svg>
    </span>
    <span class="msc" style="right:6vw; top:8vh; width:9em;">
      <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#e0803c"/><circle cx="60" cy="60" r="44" fill="none" stroke="#f5a55c" stroke-width="6"/></svg>
    </span>
    <span class="msc" style="left:0; right:0; top:24vh; width:100%;">
      <svg viewBox="0 0 1000 60" preserveAspectRatio="none" stroke="#1a1216" fill="none">
        <path d="M0 12 H1000 M0 18 H1000" stroke-width="5"/>
        <path d="M20 18 L50 58 M80 18 L50 58 M80 18 L110 58 M140 18 L110 58 M140 18 L170 58 M200 18 L170 58 M200 18 L230 58 M260 18 L230 58 M260 18 L290 58 M320 18 L290 58 M320 18 L350 58 M380 18 L350 58 M380 18 L410 58 M440 18 L410 58 M440 18 L470 58 M500 18 L470 58 M500 18 L530 58 M560 18 L530 58 M560 18 L590 58 M620 18 L590 58 M620 18 L650 58 M680 18 L650 58 M680 18 L710 58 M740 18 L710 58 M740 18 L770 58 M800 18 L770 58 M800 18 L830 58 M860 18 L830 58 M860 18 L890 58 M920 18 L890 58 M920 18 L950 58 M980 18 L950 58" stroke-width="4"/>
      </svg>
    </span>
    <span class="msc msc--chase" style="left:0; top:17vh; width:26em;">
      <svg viewBox="0 0 420 100" fill="#1a1216">
        <path d="M28 46 L32 70 L26 92 L32 92 L40 72 L46 92 L52 92 L48 68 L44 46 Z"/>
        <circle cx="37" cy="38" r="8"/>
        <path d="M30 52 L16 44 M44 52 L58 40" stroke="#1a1216" stroke-width="5" stroke-linecap="round"/>
        <path d="M84 42 L88 66 L80 90 L86 90 L96 68 L102 90 L108 90 L102 64 L100 42 Z"/>
        <circle cx="93" cy="34" r="8"/>
        <path d="M86 48 L72 36 M100 48 L114 44" stroke="#1a1216" stroke-width="5" stroke-linecap="round"/>
        <rect x="180" y="34" width="150" height="40" rx="6"/>
        <rect x="316" y="16" width="44" height="58" rx="4"/>
        <rect x="326" y="26" width="24" height="18" rx="3" fill="#e0803c"/>
        <rect x="196" y="10" width="16" height="28" rx="3"/>
        <rect x="240" y="22" width="12" height="14" rx="3"/>
        <path d="M180 74 L158 92 L180 92 Z"/>
        <rect x="360" y="40" width="56" height="34" rx="4"/>
        <circle cx="206" cy="86" r="12"/><circle cx="242" cy="86" r="12"/><circle cx="288" cy="86" r="14"/><circle cx="330" cy="86" r="14"/><circle cx="378" cy="88" r="10"/><circle cx="404" cy="88" r="10"/>
        <g fill="#8a7a6e" opacity="0.8">
          <circle cx="196" cy="6" r="7"/><circle cx="178" cy="2" r="9"/><circle cx="156" cy="0" r="11"/>
        </g>
      </svg>
    </span>
    <span class="msc msc--twinkle" style="left:8vw; top:14vh; width:0.8em;"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#ffb74d"/></svg></span>
    <span class="msc msc--twinkle-late" style="left:14vw; top:28vh; width:0.6em;"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#ffb74d"/></svg></span>
    <span class="msc msc--twinkle" style="left:4vw; top:34vh; width:0.7em;"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#ffb74d"/></svg></span>
    <span class="msc msc--twinkle-late" style="right:16vw; top:20vh; width:0.5em;"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#ffb74d"/></svg></span>`,

  'nantahala-83': `
    <span class="msc" style="left:0; right:0; bottom:0; width:100%;">
      <svg viewBox="0 0 1000 320" preserveAspectRatio="none">
        <rect x="0" y="40" width="1000" height="280" fill="#2a6a74"/>
        <rect x="0" y="120" width="1000" height="200" fill="#245e68"/>
        <rect x="0" y="210" width="1000" height="110" fill="#1e525c"/>
        <g stroke="#eaf6f4" stroke-width="5" fill="none" stroke-linecap="round">
          <path class="msc__wave" d="M0 72 Q40 60 80 72 Q120 84 160 72 Q200 60 240 72 Q280 84 320 72 Q360 60 400 72 Q440 84 480 72 Q520 60 560 72 Q600 84 640 72 Q680 60 720 72 Q760 84 800 72 Q840 60 880 72 Q920 84 960 72 Q980 67 1000 72" stroke-dasharray="14 10"/>
          <path class="msc__wave" d="M0 150 Q50 136 100 150 Q150 164 200 150 Q250 136 300 150 Q350 164 400 150 Q450 136 500 150 Q550 164 600 150 Q650 136 700 150 Q750 164 800 150 Q850 136 900 150 Q950 164 1000 150" stroke-dasharray="18 12"/>
          <path d="M120 110 Q160 98 200 110 M520 120 Q560 108 600 120 M820 104 Q860 92 900 104"/>
          <path d="M60 250 Q110 236 160 250 M400 268 Q450 254 500 268 M700 240 Q750 226 800 240 M880 284 Q930 270 980 284"/>
        </g>
        <ellipse cx="320" cy="216" rx="52" ry="20" fill="#5e6a6e"/>
        <ellipse cx="330" cy="208" rx="30" ry="10" fill="#7a888c"/>
        <ellipse cx="780" cy="288" rx="64" ry="22" fill="#54626a"/>
        <g fill="#eaf6f4">
          <circle cx="268" cy="212" r="6"/><circle cx="256" cy="220" r="5"/><circle cx="372" cy="220" r="6"/>
          <circle cx="716" cy="286" r="6"/><circle cx="846" cy="290" r="5"/>
        </g>
      </svg>
    </span>
    <span class="msc msc--paddle" style="left:0; top:18vh; width:17em;">
      <svg viewBox="0 0 260 130" fill="none">
        <circle cx="52" cy="34" r="9" fill="#e8b48c"/>
        <path d="M44 28 Q52 20 60 28" stroke="#3a2a1c" stroke-width="5" stroke-linecap="round"/>
        <path d="M52 44 L52 66" stroke="#c03a5c" stroke-width="13" stroke-linecap="round"/>
        <rect x="42" y="46" width="20" height="16" rx="4" fill="#ff7f2a"/>
        <path d="M58 50 L40 30 M46 52 L30 40" stroke="#c03a5c" stroke-width="6" stroke-linecap="round"/>
        <path d="M36 24 L12 88" stroke="#c99b5f" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="10" cy="94" rx="7" ry="14" fill="#c99b5f"/>
        <circle cx="130" cy="52" r="7" fill="#e8b48c"/>
        <path d="M121 50 A9 9 0 0 1 139 50" fill="#f2d13d"/>
        <rect x="122" y="60" width="16" height="13" rx="4" fill="#ff7f2a"/>
        <path d="M122 62 L112 50 M138 62 L148 50" stroke="#e8b48c" stroke-width="5" stroke-linecap="round"/>
        <circle cx="206" cy="30" r="9" fill="#e8b48c"/>
        <path d="M198 24 Q206 16 214 24" stroke="#5a3a20" stroke-width="5" stroke-linecap="round"/>
        <path d="M206 40 L206 64" stroke="#2c5a8c" stroke-width="13" stroke-linecap="round"/>
        <rect x="196" y="42" width="20" height="16" rx="4" fill="#ff7f2a"/>
        <path d="M212 46 L232 32 M216 50 L240 44" stroke="#2c5a8c" stroke-width="6" stroke-linecap="round"/>
        <path d="M236 28 L252 90" stroke="#c99b5f" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="253" cy="96" rx="7" ry="14" fill="#c99b5f"/>
        <path d="M12 74 Q130 100 248 72 L236 96 Q130 116 26 94 Z" fill="#3fa652"/>
        <path d="M12 74 Q130 100 248 72" stroke="#2c7a3c" stroke-width="5"/>
        <g fill="#eaf6f0">
          <circle cx="14" cy="102" r="6"/><circle cx="26" cy="110" r="8"/><circle cx="6" cy="112" r="5"/>
          <circle cx="246" cy="104" r="6"/><circle cx="234" cy="112" r="8"/><circle cx="254" cy="114" r="5"/>
        </g>
      </svg>
    </span>
    <span class="msc msc--pulse" style="left:6vw; top:7vh; width:3.5em;">
      <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="16" fill="#f2d13d" opacity="0.9"/></svg>
    </span>
    <span class="msc msc--twinkle" style="right:8vw; top:12vh; width:5em;">
      <svg viewBox="0 0 90 40" fill="none" stroke="#eaf6f4" stroke-width="5" stroke-linecap="round">
        <path d="M6 30 Q26 16 46 30 Q66 44 84 30"/>
      </svg>
    </span>`,

  generated: `
    <span class="msc msc--bob" style="left:5vw; top:10vh; width:3em;"><svg viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" fill="var(--color-terminal-cyan)" opacity="0.7"/></svg></span>
    <span class="msc msc--bob-late" style="right:6vw; top:12vh; width:2.5em;"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="var(--color-green)" opacity="0.7"/></svg></span>
    <span class="msc msc--spin-slow" style="left:8vw; top:30vh; width:3em;"><svg viewBox="0 0 40 40"><path d="M20 2 L38 38 L2 38 Z" fill="var(--color-turquoise)" opacity="0.7"/></svg></span>
    <span class="msc msc--bob" style="right:9vw; top:32vh; width:2em;"><svg viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" fill="var(--color-terminal-blue)" opacity="0.6" transform="rotate(45 20 20)"/></svg></span>`,
};

const BUILD_LINES = [
  'reading your one sentence very closely',
  'mixing pigments',
  'consulting the omarchs',
  'arguing about the exact shade',
  'vibing responsibly',
  'naming it',
];

let current = THEMES[0];
let bar, loader, drawer, scenery, styleSheet;
let dissolved = false;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// The wasm laser etch draws the mark in the default palette. The first time
// the page changes clothes, hand the mark back to the themable <pre>.
function retireLogoCanvas() {
  const holder = document.querySelector('.pre__wte');
  if (holder) holder.remove();
  const pre = document.querySelector('.pre');
  pre?.classList.remove('pre--live');
  pre?.classList.add('pre--static');
}

function applyTheme(theme, { fade = true } = {}) {
  current = theme;
  retireLogoCanvas();
  const html = document.documentElement;
  if (fade && !prefersReducedMotion()) {
    html.classList.add('malleable-theming');
    window.setTimeout(() => html.classList.remove('malleable-theming'), 1000);
  }
  if (theme.id === 'default') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', theme.id);
  }
  renderScenery(theme);
  renderAttribution();
}

function renderScenery(theme) {
  const art = SCENERY[theme.id]
    ?? (theme.id.startsWith('generated-') ? SCENERY.generated : '');
  scenery.innerHTML = art;
  // Restart the entrance fade for the fresh artwork.
  scenery.classList.remove('malleable-scenery--in');
  void scenery.offsetWidth;
  scenery.classList.add('malleable-scenery--in');
}

function randomTheme() {
  const pool = THEMES.filter((theme) => theme.id !== current.id);
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderAttribution() {
  const target = bar.querySelector('.malleable-bar__theme');
  const who = current.submitter
    ? `<a href="${current.submitter.url}">${current.submitter.label}</a>`
    : 'anonymous';
  target.innerHTML =
    `theme: <span class="malleable-bar__name">${current.name}</span> ` +
    `<span class="malleable-bar__nod">— ${current.nod}</span> · submitted by ${who}`;
  if (document.documentElement.classList.contains('malleable-bar-open')) {
    measureBar();
  }
}

function measureBar() {
  document.documentElement.style.setProperty(
    '--malleable-bar-height',
    `${bar.offsetHeight}px`,
  );
}

function openBar() {
  document.documentElement.classList.add('malleable-bar-open');
  measureBar();
}

function closeBar() {
  document.documentElement.classList.remove('malleable-bar-open');
  closeDrawer();
}

function openDrawer() {
  measureBar();
  document.documentElement.classList.add('malleable-drawer-open');
  drawer.querySelector('textarea')?.focus();
}

function closeDrawer() {
  document.documentElement.classList.remove('malleable-drawer-open');
}

// --- the loader chip -------------------------------------------------------

function showLoader(text) {
  loader.querySelector('.malleable-loader__text').textContent = text;
  loader.classList.add('malleable-loader--visible');
}

function hideLoader() {
  loader.classList.remove('malleable-loader--visible');
}

function typeLoader(text) {
  return new Promise((resolve) => {
    const target = loader.querySelector('.malleable-loader__text');
    target.textContent = '';
    loader.classList.add('malleable-loader--visible');
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      target.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(tick);
        resolve();
      }
    }, prefersReducedMotion() ? 0 : 45);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// --- the opening move ------------------------------------------------------

// The reskin and the bar arrive together: one moment where the homepage
// admits what it really is.
async function dissolve() {
  if (dissolved) return;
  dissolved = true;
  await typeLoader(`${LOADER_TEXT}...`);
  await wait(700);
  hideLoader();
  applyTheme(randomTheme());
  openBar();
}

// --- the submit flow, live -------------------------------------------------

// The page embeds generated themes and the submissions switch as JSON.
let pageData = { generated: [], submissions_closed: false };
let pendingClaim = null;

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
}

function themeCss(id, palette) {
  const lines = Object.entries(palette)
    .map(([key, value]) => `--rgb-${key}: ${value};`)
    .join('\n      ');
  return `html[data-theme="${id}"] {\n      ${lines}\n    }\n`;
}

// Server themes become regular THEMES entries wearing the generated scenery.
function adoptGeneratedTheme(record) {
  const theme = {
    id: `generated-${record.id}`,
    dbId: record.id,
    name: record.name,
    nod: record.nod,
    submitter: record.submitter
      ? { label: record.submitter.label, url: record.submitter.url ?? '#' }
      : null,
  };
  styleSheet.textContent += themeCss(theme.id, record.palette);
  THEMES.push(theme);
  return theme;
}

function loadPageData() {
  const island = document.getElementById('malleable-data');
  if (!island) return;
  try {
    pageData = JSON.parse(island.textContent);
  } catch {
    return;
  }
  for (const record of pageData.generated ?? []) {
    adoptGeneratedTheme(record);
  }
}

async function requestTheme(description) {
  const response = await fetch('/themes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken() },
    body: JSON.stringify({ description }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? 'that one did not take — try another sentence');
  }
  return body;
}

async function runSubmit() {
  const textarea = drawer.querySelector('textarea');
  const description = textarea.value.trim();
  const status = drawer.querySelector('.malleable-drawer__status');
  if (description === '') {
    status.textContent = '> it only takes a sentence';
    return;
  }
  if (pageData.submissions_closed) {
    status.textContent = '> the generation cap is reached — the seed themes are still all yours';
    return;
  }

  const button = drawer.querySelector('.malleable-drawer__build');
  button.disabled = true;

  // The staged lines play while the model really works; whichever finishes
  // last decides when the reveal happens.
  const request = requestTheme(description);
  request.catch(() => {});
  for (const [index, line] of BUILD_LINES.entries()) {
    const blocks = '▓'.repeat(index + 1) + '░'.repeat(BUILD_LINES.length - index - 1);
    status.textContent = `> ${line}... ${blocks}`;
    await wait(prefersReducedMotion() ? 0 : 650);
  }

  try {
    const body = await request;
    const theme = adoptGeneratedTheme(body.theme);
    pendingClaim = { dbId: body.theme.id, token: body.claim_token };
    applyTheme(theme);
    status.textContent = `> done. it's called ${theme.name} — and you're wearing it.`;
    drawer.classList.add('malleable-drawer--claim');
  } catch (error) {
    status.textContent = `> ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

async function claimTheme() {
  const name = drawer.querySelector('.malleable-claim-name').value.trim();
  const github = drawer.querySelector('.malleable-claim-github').value.trim();
  const x = drawer.querySelector('.malleable-claim-x').value.trim();
  const status = drawer.querySelector('.malleable-drawer__status');

  if (pendingClaim && (name || github || x)) {
    try {
      const response = await fetch(`/themes/${pendingClaim.dbId}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken() },
        body: JSON.stringify({ claim_token: pendingClaim.token, name, github, x }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        status.textContent = `> ${body.error ?? 'that claim did not take'}`;
        return;
      }
      current.submitter = body.theme.submitter;
    } catch {
      status.textContent = '> that claim did not take — you can stay anonymous';
      return;
    }
  }
  pendingClaim = null;
  renderAttribution();
  resetDrawer();
  closeDrawer();
}

function resetDrawer() {
  drawer.classList.remove('malleable-drawer--claim');
  drawer.querySelector('textarea').value = '';
  drawer.querySelector('.malleable-drawer__status').textContent = '';
  for (const input of drawer.querySelectorAll('.malleable-drawer__identity input')) {
    input.value = '';
  }
}

// --- assembly --------------------------------------------------------------

function buildUi() {
  styleSheet = document.createElement('style');
  document.head.append(styleSheet);
  loadPageData();

  bar = document.createElement('div');
  bar.className = 'malleable-bar';
  bar.innerHTML = `
    <span class="malleable-bar__brand">${LOGO_SVG}<span class="malleable-bar__title">the malleable homepage.</span><span class="malleable-bar__motto">we can fix <del>some things</del> <ins>everything</ins></span></span>
    <span class="malleable-bar__theme"></span>
    <span class="malleable-bar__actions">
      <button class="malleable-bar__button" type="button" data-action="new-theme">↻ try a new theme</button>
      <button class="malleable-bar__button malleable-bar__button--quiet" type="button" data-action="submit">+ submit yours</button>
      <button class="malleable-bar__close" type="button" data-action="close" aria-label="Dismiss">✕</button>
    </span>
  `;

  loader = document.createElement('div');
  loader.className = 'malleable-loader';
  loader.innerHTML = `<span>> </span><span class="malleable-loader__text"></span><span class="malleable-loader__cursor">▌</span>`;

  drawer = document.createElement('div');
  drawer.className = 'malleable-drawer';
  drawer.innerHTML = `
    <div class="malleable-drawer__inner">
      <p class="malleable-drawer__prompt">describe your theme in a sentence. we'll build it, name it, and put it on.</p>
      <div class="malleable-drawer__row">
        <textarea rows="1" placeholder="a 1980s mall from a zombie movie"></textarea>
        <button class="malleable-bar__button malleable-drawer__build" type="button" data-action="build">build it</button>
      </div>
      <p class="malleable-drawer__status"></p>
      <div class="malleable-drawer__identity">
        <p class="malleable-drawer__prompt">want your name on it? all of this is optional.</p>
        <div class="malleable-drawer__row">
          <input class="malleable-claim-name" type="text" placeholder="name">
          <input class="malleable-claim-github" type="text" placeholder="github">
          <input class="malleable-claim-x" type="text" placeholder="x / twitter">
        </div>
        <div class="malleable-drawer__row">
          <button class="malleable-bar__button" type="button" data-action="claim">claim it</button>
          <button class="malleable-bar__button malleable-bar__button--quiet" type="button" data-action="anonymous">stay anonymous</button>
        </div>
      </div>
    </div>
  `;

  scenery = document.createElement('div');
  scenery.className = 'malleable-scenery';
  scenery.setAttribute('aria-hidden', 'true');

  document.body.append(scenery, bar, loader, drawer);
  renderAttribution();

  bar.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'new-theme') applyTheme(randomTheme());
    if (action === 'submit') {
      document.documentElement.classList.contains('malleable-drawer-open')
        ? closeDrawer()
        : openDrawer();
    }
    if (action === 'close') closeBar();
  });

  drawer.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'build') runSubmit();
    if (action === 'claim') claimTheme();
    if (action === 'anonymous') {
      resetDrawer();
      closeDrawer();
    }
  });

  drawer.querySelector('textarea').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      runSubmit();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
  });

  window.addEventListener('resize', () => {
    if (document.documentElement.classList.contains('malleable-bar-open')) {
      measureBar();
    }
  });

  // Dismissed the bar? The mark brings it back. The logo link goes nowhere
  // new anyway — it points at the page you are already on.
  document.querySelector('.pre a')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!dissolved) {
      dissolve();
    } else {
      openBar();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildUi();
  // ?theme=<id> jumps straight to one look with the bar open — used by the
  // QA index (themes.html) to check each theme one by one.
  const requested = new URLSearchParams(window.location.search).get('theme');
  const preset = THEMES.find((theme) => theme.id === requested);
  if (preset) {
    dissolved = true;
    applyTheme(preset, { fade: false });
    openBar();
  } else {
    window.setTimeout(dissolve, DISSOLVE_DELAY_MS);
  }
  // A console handle for demos: __malleable.wear('milano-81').
  window.__malleable = {
    themes: THEMES,
    wear(id) {
      const theme = THEMES.find((entry) => entry.id === id);
      if (theme) applyTheme(theme);
    },
  };
});
