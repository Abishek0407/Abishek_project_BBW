import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);


// Frame-based text stages
const textStages = [
  {
    range: [1, 40],
    heading: '01.Perfection in \n Every Detail',
    sub: 'Premium mobile detailing - concours-levelfinish,deliver to your driveway.',
  },
  {
    range: [41, 100],
    heading: '02.Paint Correction &\n Ceramic Coating',
    sub: 'Multi-stage machine polish remove swirls,then a 9H ceramic sheild locks in mirror gloss for years',
  },
  {
    range: [101, 160],
    heading: '03.Wheel & Caliper \nRefinement',
    sub: 'Iron decontamination,ph-neutral cleansing,and a hydrophobic seal _every spoke restored',
  },
  {
    range: [161, 220],
    heading: '04.Interior\nRejuvenation',
    sub: 'Hot extraction,leather condition and odor neutralization_cabin restored to factory feel',
  },
  {
    range: [221, 240],
    heading: '05.Ready When \n You Are',
    sub: 'Book a session below _we bring water, power and the studio to you',
    cta: true,
  },
];

const Hero = () => {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const textRef      = useRef(null);
  const headingRef   = useRef(null);
  const subRef       = useRef(null);
  const ctaRef       = useRef(null);
  const accentRef    = useRef(null);

  const [loaded, setLoaded]               = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [stageIdx, setStageIdx]           = useState(0);
  const [showCta, setShowCta]             = useState(false);

  const imagesRef    = useRef([]);
  const frameTracker = useRef({ frame: 1 });
  const prevStageIdx = useRef(0);

  // ─── Preload ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const images = [];
    let loadedCount = 0;
    const totalFrames = 240;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const n = String(i).padStart(3, '0');
      img.src = new URL(`../assets/carframe/ezgif-frame-${n}.jpg`, import.meta.url).href;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // ─── Canvas render ───────────────────────────────────────────────────────────
  const render = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const idx = Math.max(0, Math.min(239, Math.floor(frameIndex) - 1));
    const img = imagesRef.current[idx];
    if (!img) return;

    // object-cover: scale up to fill full canvas, cropping edges
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };

  // ─── Text crossfade helper ───────────────────────────────────────────────────
  const animateTextOut = (cb) => {
    gsap.to([headingRef.current, subRef.current, accentRef.current], {
      opacity: 0, x: -30, filter: 'blur(6px)',
      duration: 0.35, ease: 'power2.in',
      onComplete: cb,
    });
    if (ctaRef.current) gsap.to(ctaRef.current, { opacity: 0, y: 10, duration: 0.25 });
  };

  const animateTextIn = (showButton) => {
    gsap.fromTo(
      [headingRef.current, subRef.current, accentRef.current],
      { opacity: 0, x: -40, filter: 'blur(8px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.08 }
    );
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: showButton ? 1 : 0, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
      );
    }
  };

  // ─── Stage switcher driven by frame progress ─────────────────────────────────
  const updateStage = (frame) => {
    const newIdx = textStages.findIndex(s => frame >= s.range[0] && frame <= s.range[1]);
    if (newIdx === -1 || newIdx === prevStageIdx.current) return;

    prevStageIdx.current = newIdx;
    const stage = textStages[newIdx];
    const hasCta = !!stage.cta;

    animateTextOut(() => {
      setStageIdx(newIdx);
      setShowCta(hasCta);
      // Let React render then animate in
      requestAnimationFrame(() => animateTextIn(hasCta));
    });
  };

  // ─── Sync canvas pixel size with its CSS display size ───────────────────────
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width  = Math.round(rect.width);
        canvas.height = Math.round(rect.height);
        render(frameTracker.current.frame);
      }
    };

    // Use ResizeObserver for accurate post-layout dimensions
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize(); // initial

    return () => ro.disconnect();
  }, [loaded]);

  // ─── Entry text animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    gsap.fromTo(textRef.current,
      { opacity: 1, x: -60 },
      { opacity: 2, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
    );
    animateTextIn(false);
  }, [loaded]);

  // ─── GSAP scroll + pinning ───────────────────────────────────────────────────
  useGSAP(() => {
    if (!loaded) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      render(frameTracker.current.frame);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=500%',
        scrub: 0.5,
        pin: true,
      }
    });

    tl.to(frameTracker.current, {
      frame: 240,
      ease: 'none',
      duration: 240,
      onUpdate: () => {
        const f = Math.floor(frameTracker.current.frame);
        render(f);
        
        updateStage(f);
      }
    }, 0);

    // Subtle canvas zoom
    tl.to(canvasRef.current, { scale: 1.08, ease: 'none', duration: 240 }, 0);

    return () => window.removeEventListener('resize', handleResize);
  }, { dependencies: [loaded], scope: containerRef });

  const stage = textStages[stageIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/*  Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-6">
          <div className="w-12 h-12 border-2 border-white/10 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-yellow-400 text-xs uppercase tracking-[0.4em]">
            Loading {loadingProgress}%
          </p>
          <div className="w-48 h-px bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-yellow-400 transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Fullscreen canvas background  */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/*  LEFT: Text Overlay*/}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex flex-col justify-center
                   px-8 md:px-20 lg:px-28 pt-20 opacity-0 pointer-events-none"
      >
        {/* Yellow vertical accent bar */}
        <div className="hidden md:block absolute left-10 top-1/2 -translate-y-1/2 w-0.5 h-32 bg-yellow-400 rounded-full" />

        {/* Tag */}
        <p ref={accentRef} className="text-yellow-400 text-xs font-bold tracking-[0.4em] uppercase mb-5">
          BROTHERS BEHIND WHEELS
        </p>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-5 whitespace-pre-line drop-shadow-2xl"
        >
          {stage.heading}
        </h1>

        {/* Yellow underline accent */}
        <div className="w-16 h-0.5 bg-yellow-400 mb-5" />

        {/* Subtext */}
        <p
          ref={subRef}
          className="text-white/110 text-sm md:text-base font-light tracking-widest uppercase mb-10 max-w-xs"
        >
          {stage.sub}
        </p>

        {/* CTA — visible only at final stage */}
        <div ref={ctaRef} className="opacity-0 pointer-events-auto">
          <a
            href="#garage"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-yellow-400 text-black text-xs font-black tracking-widest uppercase rounded-full hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
          >
            Explore Now <span className="text-lg leading-none">→</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-8 md:left-20 lg:left-28 flex items-center gap-3">
          <div className="w-6 h-6 border border-yellow-400/40 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white-400 text-xs">↓</span>
          </div>
          <span className="text-/20 text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;