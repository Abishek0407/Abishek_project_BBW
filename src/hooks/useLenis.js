import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // ── 1. Create Lenis instance ────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,          // Inertia duration in seconds (higher = silkier)
      easing: (t) =>          // Custom cubic easing for a premium feel
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // ── 2. Bridge Lenis → GSAP ScrollTrigger proxy ──────────────────────────
    // ScrollTrigger reads scroll position through this proxy so all pinned
    // sections, scrub timelines, and scroll-based triggers remain frame-perfect.
    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // Lenis controls the scroll — tell GSAP to use fixed/pinned positioning
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    // ── 3. Shared RAF via GSAP ticker ───────────────────────────────────────
    // One requestAnimationFrame loop drives both Lenis AND GSAP — no frame
    // doubling, maximum throughput.
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // Disable lag-smoothing for consistent 60fps

    // ── 4. Refresh ScrollTrigger after proxy is configured ───────────────────
    ScrollTrigger.refresh();

    // ── 5. Cleanup ────────────────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return lenisRef;
}