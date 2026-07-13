import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = ['Home', 'About', 'Garage', 'Contact'];

  useEffect(() => {
    // Fade down on page load
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-yellow-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-yellow-400 text-2xl font-black tracking-widest uppercase group-hover:text-white transition-colors duration-300">
            BROTHERS<span className="text-white group-hover:text-yellow-400 transition-colors duration-300">BEHIND WHEELS</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="relative text-white/70 hover:text-yellow-400 text-sm font-medium tracking-widest uppercase transition-colors duration-300 group"
              >
                {link}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="px-6 py-2.5 bg-yellow-400 text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Book Your Car Care
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-yellow-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-yellow-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-yellow-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <ul className="flex flex-col bg-black/95 backdrop-blur-md border-t border-yellow-400/10 px-6 py-4 gap-5">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-yellow-400 text-sm font-medium tracking-widest uppercase transition-colors duration-300"
              >
                {link}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-block px-6 py-2.5 bg-yellow-400 text-black text-xs font-bold tracking-widest uppercase rounded-full"
            >
              Get Your Car care
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;