import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2.8, suffix: 's', label: '0 – 100 km/h', decimals: 1 },
  { value: 340, suffix: '', label: 'Top Speed km/h', decimals: 0 },
  { value: 1050, suffix: '', label: 'Horsepower', decimals: 0 },
  { value: 1200, suffix: 'Nm', label: 'Peak Torque', decimals: 0 },
];

function useCountUp(target, decimals, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, step);
    return () => clearInterval(timer);
  }, [active, target]);
  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
}

const StatCard = ({ stat, active }) => {
  const count = useCountUp(stat.value, stat.decimals, active);
  return (
    <div className="text-center group">
      <div className="text-6xl md:text-8xl font-black text-yellow-400 leading-none tracking-tighter tabular-nums">
        {count}<span className="text-white/30 text-4xl md:text-5xl">{stat.suffix}</span>
      </div>
      <div className="mt-4 text-white/40 text-xs font-bold tracking-[0.3em] uppercase">{stat.label}</div>
    </div>
  );
};

const Performance = () => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => setActive(true),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="performance" ref={sectionRef} className="relative bg-black py-32 px-6 overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(234,179,8,1) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-yellow-400 text-xs font-bold tracking-[0.4em] uppercase mb-4">Raw Numbers</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            Performance <span className="text-yellow-400">Stats.</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="relative">
              {/* Separator line */}
              {i > 0 && (
                <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-px h-16 bg-white/10" />
              )}
              <StatCard stat={stat} active={active} />
            </div>
          ))}
        </div>

        {/* Yellow accent line */}
        <div className="mt-20 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-yellow-400/30 text-xs tracking-widest uppercase">Verified Performance Data</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </div>
    </section>
  );
};

export default Performance;