import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Our Work', id: 'our-work' },
  { label: 'Contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ brandName, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrolledRef = useRef(false);

  // Zero-re-render rAF-throttled scroll handler + IntersectionObserver for active section
  useEffect(() => {
    let ticking = false;

    const updateScrollMetrics = () => {
      const y = window.scrollY;
      const isNowScrolled = y > 28;
      if (isNowScrolled !== scrolledRef.current) {
        scrolledRef.current = isNowScrolled;
        setScrolled(isNowScrolled);
      }

      if (progressBarRef.current) {
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollMetrics);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollMetrics();

    // IntersectionObserver for section tracking (zero layout thrashing during scroll)
    const sectionIds = [
      'home',
      'about',
      'services',
      'studio-3d',
      'our-work',
      'booking',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const mapped =
              id === 'studio-3d'
                ? 'services'
                : id === 'booking'
                ? 'contact'
                : id;
            setActiveSection(mapped);
          }
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled || mobileMenuOpen
          ? 'bg-[#0B1F3A]/96 border-b border-white/15 py-3.5 shadow-[0_10px_28px_rgba(5,7,11,0.75)]'
          : 'bg-transparent border-b border-white/10 py-5'
      }`}
    >
      {/* Compositor-Only Direct DOM Scroll Progress Hairline (Zero React Re-Renders) */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/80 origin-left pointer-events-none will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Custom Shield, Barber Shears & Flash Crest */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="group inline-flex items-center gap-3 font-display text-base sm:text-lg font-extrabold tracking-wider text-white whitespace-nowrap shrink-0 transition-transform duration-200 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="relative flex items-center justify-center w-10 h-10 bg-[#05070B] border border-white/25 group-hover:border-white transition-colors duration-200">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110"
            >
              <path
                d="M32 4L56 12.5V31C56 45.8 45.6 56.4 32 60C18.4 56.4 8 45.8 8 31V12.5L32 4Z"
                fill="#0B1F3A"
                stroke="currentColor"
                strokeWidth="2.8"
              />
              <path
                d="M19 42L43 15C45 17 45.2 20 43.2 22.4L23 43.5Z"
                fill="currentColor"
              />
              <path
                d="M45 42L21 15C19 17 18.8 20 20.8 22.4L41 43.5Z"
                fill="currentColor"
                fillOpacity="0.88"
              />
              <path
                d="M33.5 11L26.5 24H32.5L29.5 36L38.5 21.5H32.2L33.5 11Z"
                fill="#05070B"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle
                cx="20.5"
                cy="45.5"
                r="5"
                fill="#05070B"
                stroke="currentColor"
                strokeWidth="2.6"
              />
              <circle
                cx="43.5"
                cy="45.5"
                r="5"
                fill="#05070B"
                stroke="currentColor"
                strokeWidth="2.6"
              />
            </svg>
          </span>
          <span className="tracking-wider uppercase">{brandName}</span>
        </a>

        {/* Zone 2: 5 Clean Single-Line Text Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white group ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 bottom-0 h-[1.5px] bg-white transition-transform duration-200 origin-left w-full ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Accessible Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#booking"
            onClick={(e) => handleLinkClick(e, 'booking')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold tracking-widest uppercase bg-white text-[#05070B] hover:bg-white/90 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Booking
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-white border border-white/20 bg-[#05070B]/80 hover:bg-[#0B1F3A] transition-colors focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#05070B] border-b border-white/15 px-5 pt-4 pb-6">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
            {[
              ...NAV_ITEMS,
              { label: '3D Barber Studio', id: 'studio-3d' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleLinkClick(e, item.id)}
                className="py-3.5 px-2 text-base font-medium text-white/85 hover:text-white border-b border-white/10 flex items-center justify-between transition-colors"
              >
                <span>{item.label}</span>
                <span className="font-mono-tabular text-xs text-white/45">→</span>
              </a>
            ))}
            <div className="pt-4">
              <a
                href="#booking"
                onClick={(e) => handleLinkClick(e, 'booking')}
                className="w-full inline-flex items-center justify-center py-3.5 px-6 text-xs font-bold tracking-widest uppercase bg-white text-[#05070B] hover:bg-white/90 transition-colors"
              >
                Book Your Session
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
