/**
 * Generates high-contrast, Leica-grade architectural & grooming SVG data URI plates
 * strictly adhering to the 3-color identity (#05070B Jet Black, #0B1F3A Navy Blue, #FFFFFF Pure White).
 * Guarantees zero broken images, zero external network dependencies, and instant Retina rendering.
 */

export type VisualMotif =
  | 'philosophy-main'
  | 'philosophy-detail'
  | 'service-classic'
  | 'service-fade'
  | 'service-scissor'
  | 'service-styling'
  | 'service-beard'
  | 'service-complete'
  | 'gallery-low-drop-fade'
  | 'gallery-executive-contour'
  | 'gallery-textured-crop'
  | 'gallery-modern-quiff'
  | 'gallery-taper-slick'
  | 'gallery-mid-skin-fade'
  | 'gallery-scissor-flow'
  | 'gallery-architectural-pomp';

export function createEditorialPlate(
  motif: VisualMotif,
  codeLabel: string,
  title: string,
  subtitle: string
): string {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSub = subtitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeCode = codeLabel.replace(/&/g, '&amp;');

  let centerArtwork = '';

  switch (motif) {
    case 'philosophy-main':
      centerArtwork = `
        <!-- Studio Architectural Grid & Precision Shears Silhouette -->
        <g opacity="0.9">
          <circle cx="400" cy="460" r="240" fill="url(#navyGlow)" />
          <circle cx="400" cy="460" r="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1" />
          <circle cx="400" cy="460" r="135" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-dasharray="6 6" stroke-width="1" />
          <!-- Crossed Japanese Barber Shears -->
          <path d="M240 640 L530 250 L548 265 L265 655 Z" fill="url(#bladeGrad)" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.2" />
          <path d="M560 640 L270 250 L252 265 L535 655 Z" fill="url(#bladeGradDark)" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.2" />
          <!-- Tension Pivot Screw -->
          <circle cx="400" cy="442" r="14" fill="#0B1F3A" stroke="#FFFFFF" stroke-width="2.5" />
          <circle cx="400" cy="442" r="4" fill="#FFFFFF" />
          <!-- Ergonomic Finger Rings -->
          <circle cx="235" cy="672" r="36" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-opacity="0.85" />
          <circle cx="565" cy="672" r="36" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-opacity="0.65" />
          <!-- Precision Caliper Lines -->
          <line x1="140" y1="442" x2="660" y2="442" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" />
          <line x1="400" y1="180" x2="400" y2="720" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1" />
        </g>
      `;
      break;

    case 'philosophy-detail':
      centerArtwork = `
        <!-- Clipper Blade Teeth & Micro-Calibration Geometry -->
        <g opacity="0.95">
          <rect x="190" y="300" width="420" height="320" fill="#05070B" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />
          <rect x="215" y="240" width="370" height="75" fill="url(#bladeGrad)" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1.5" />
          <!-- Clipper Teeth Array -->
          ${Array.from({ length: 19 })
            .map(
              (_, i) =>
                `<rect x="${227 + i * 18.5}" y="195" width="9" height="50" fill="#FFFFFF" fill-opacity="${
                  0.45 + (i % 2) * 0.35
                }" />`
            )
            .join('')}
          <!-- Geometric Vent Slots -->
          <rect x="250" y="370" width="300" height="22" fill="#0B1F3A" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" />
          <rect x="250" y="415" width="300" height="22" fill="#0B1F3A" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" />
          <circle cx="400" cy="525" r="42" fill="#0B1F3A" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="2" />
          <circle cx="400" cy="525" r="14" fill="#FFFFFF" />
        </g>
      `;
      break;

    case 'service-classic':
    case 'gallery-executive-contour':
    case 'gallery-taper-slick':
      centerArtwork = `
        <!-- Classic Side-Part & Cranial Proportion Study -->
        <g>
          <circle cx="400" cy="440" r="220" fill="url(#navyGlow)" />
          <!-- Cranial Profile Silhouette -->
          <path d="M250 660 C250 540 245 420 270 330 C300 240 400 215 485 245 C545 268 575 340 560 430 C548 505 555 585 520 660" fill="#05070B" stroke="#FFFFFF" stroke-width="2.2" stroke-opacity="0.85" />
          <!-- Natural Part Line & Flow Vectors -->
          <path d="M295 315 Q415 335 535 295" fill="none" stroke="#FFFFFF" stroke-width="3" />
          <path d="M285 350 Q415 375 548 340" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.5" />
          <path d="M275 385 Q415 415 552 385" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.2" />
          <!-- Precision Taper Zone -->
          <rect x="210" y="290" width="380" height="260" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-dasharray="4 4" />
        </g>
      `;
      break;

    case 'service-fade':
    case 'gallery-low-drop-fade':
    case 'gallery-mid-skin-fade':
      centerArtwork = `
        <!-- Modern Skin Fade Gradient & Transition Harmonics -->
        <g>
          <defs>
            <linearGradient id="fadeSpectrum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.92" />
              <stop offset="45%" stop-color="#0B1F3A" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#05070B" stop-opacity="0.95" />
            </linearGradient>
          </defs>
          <!-- Fade Contour Rings -->
          <rect x="210" y="220" width="380" height="440" fill="url(#fadeSpectrum)" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.5" />
          <!-- Drop Fade Curve Lines -->
          <path d="M210 340 C310 340 450 385 590 435" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M210 410 C310 410 450 455 590 505" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="8 6" />
          <path d="M210 480 C310 480 450 525 590 575" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1" />
          <!-- Millimeter Calibration Marks -->
          <text x="230" y="325" fill="#05070B" font-family="monospace" font-size="15" font-weight="700">3.0 MM — CROWN</text>
          <text x="230" y="395" fill="#FFFFFF" font-family="monospace" font-size="15" font-weight="600">1.5 MM — MID BLEND</text>
          <text x="230" y="465" fill="#FFFFFF" fill-opacity="0.75" font-family="monospace" font-size="15">0.0 MM — ZERO TAPER</text>
        </g>
      `;
      break;

    case 'service-scissor':
    case 'gallery-scissor-flow':
    case 'gallery-textured-crop':
      centerArtwork = `
        <!-- Scissor Over Comb Structural Sectioning -->
        <g>
          <circle cx="400" cy="450" r="215" fill="url(#navyGlow)" />
          <!-- Geometric Layering Planes -->
          <polygon points="400,210 590,360 520,610 280,610 210,360" fill="#05070B" fill-opacity="0.8" stroke="#FFFFFF" stroke-opacity="0.65" stroke-width="1.8" />
          <polygon points="400,255 545,375 490,575 310,575 255,375" fill="#0B1F3A" fill-opacity="0.55" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.2" />
          <line x1="400" y1="210" x2="400" y2="610" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.2" />
          <line x1="210" y1="360" x2="590" y2="360" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.2" />
          <line x1="280" y1="610" x2="520" y2="290" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="5 5" />
          <circle cx="400" cy="360" r="8" fill="#FFFFFF" />
        </g>
      `;
      break;

    case 'service-styling':
    case 'gallery-modern-quiff':
    case 'gallery-architectural-pomp':
      centerArtwork = `
        <!-- Dynamic Volume & Architectural Pompadour / Quiff Flow -->
        <g>
          <circle cx="400" cy="450" r="230" fill="url(#navyGlow)" />
          ${Array.from({ length: 14 })
            .map((_, i) => {
              const offset = i * 16;
              return `<path d="M ${220 + offset * 0.4} ${610 - offset * 0.6} C ${
                280 + offset
              } ${240 - i * 4}, ${480 - offset * 0.3} ${260 + i * 8}, ${580 - offset * 0.2} ${
                520 + i * 5
              }" fill="none" stroke="#FFFFFF" stroke-opacity="${0.18 + (i / 14) * 0.72}" stroke-width="${
                1 + (i % 3) * 0.6
              }" />`;
            })
            .join('')}
        </g>
      `;
      break;

    case 'service-beard':
      centerArtwork = `
        <!-- Mandibular Jawline & Beard Geometry -->
        <g>
          <circle cx="400" cy="450" r="210" fill="url(#navyGlow)" />
          <!-- Jawline & Cheek Razor Line -->
          <path d="M230 330 L265 535 L400 645 L535 535 L570 330" fill="#05070B" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M245 360 Q325 455 400 455 Q475 455 555 360" fill="#0B1F3A" stroke="#FFFFFF" stroke-opacity="0.75" stroke-width="1.8" />
          <!-- Straight Razor Blade Motif -->
          <rect x="275" y="255" width="250" height="36" rx="3" fill="url(#bladeGrad)" stroke="#FFFFFF" stroke-width="1.5" />
          <circle cx="505" cy="273" r="6" fill="#05070B" stroke="#FFFFFF" stroke-width="1.5" />
        </g>
      `;
      break;

    case 'service-complete':
    default:
      centerArtwork = `
        <!-- Complete Grooming Emblem & Precision Compass -->
        <g>
          <circle cx="400" cy="450" r="225" fill="url(#navyGlow)" />
          <circle cx="400" cy="450" r="185" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="1.8" />
          <circle cx="400" cy="450" r="145" fill="#05070B" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1" />
          <rect x="305" y="355" width="190" height="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="1.5" transform="rotate(45 400 450)" />
          <rect x="305" y="355" width="190" height="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.2" />
          <circle cx="400" cy="450" r="28" fill="#0B1F3A" stroke="#FFFFFF" stroke-width="2" />
        </g>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 960" width="800" height="960">
    <defs>
      <linearGradient id="bgCanvas" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#05070B" />
        <stop offset="55%" stop-color="#0B1F3A" />
        <stop offset="100%" stop-color="#05070B" />
      </linearGradient>
      <radialGradient id="navyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0B1F3A" stop-opacity="0.95" />
        <stop offset="70%" stop-color="#0B1F3A" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#05070B" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#0B1F3A" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.65" />
      </linearGradient>
      <linearGradient id="bladeGradDark" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6" />
        <stop offset="60%" stop-color="#05070B" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#0B1F3A" stop-opacity="0.85" />
      </linearGradient>
    </defs>

    <!-- Base Canvas -->
    <rect width="800" height="960" fill="url(#bgCanvas)" />

    <!-- Editorial Frame Border -->
    <rect x="32" y="32" width="736" height="896" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1" />
    <line x1="32" y1="112" x2="768" y2="112" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1" />
    <line x1="32" y1="780" x2="768" y2="780" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1" />

    <!-- Top Metadata Header -->
    <text x="60" y="78" fill="#FFFFFF" fill-opacity="0.7" font-family="monospace" font-size="15" letter-spacing="3">${safeCode}</text>
    <text x="740" y="78" fill="#FFFFFF" fill-opacity="0.45" font-family="monospace" font-size="13" text-anchor="end" letter-spacing="2">MALANG STUDIO EDITION</text>

    <!-- Center Architectural Artwork -->
    ${centerArtwork}

    <!-- Bottom Caption Block -->
    <text x="60" y="838" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="1">${safeTitle}</text>
    <text x="60" y="874" fill="#FFFFFF" fill-opacity="0.6" font-family="sans-serif" font-size="16" letter-spacing="0.5">${safeSub}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
