import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const engineSoundUrl = new URL('../assets/audio/dragon-studio-car-engine-372477.mp3', import.meta.url).href;

export function useSoundSync() {
  const engineSound = useRef(null);
  const played = useRef({ engine: false });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      engineSound.current = new Audio(engineSoundUrl);
      engineSound.current.preload = 'auto';
    }
  }, []);

  const checkFrame = (frame) => {
    if (!engineSound.current) return;
    if (frame > 10 && !played.current.engine) {
      engineSound.current.currentTime = 0;
      engineSound.current.volume = 0;
      engineSound.current.play().catch(() => {});
      gsap.to(engineSound.current, { volume: 0.6, duration: 2 });
      played.current.engine = true;
    } else if (frame <= 10 && played.current.engine) {
      engineSound.current.pause();
      played.current.engine = false;
    }
  };

  return checkFrame;
}