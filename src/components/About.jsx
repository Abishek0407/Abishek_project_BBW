import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const lines = [
    "Every wash is performed with precision.",
    "Every finish reflects quality.",
    "Your vehicle deserves more than a wash—it deserves professional detailing.",
    "Trusted service, premium products, exceptional results.",
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heading = contentRef.current.querySelector(".about-heading");
      const textLines = contentRef.current.querySelectorAll(".about-line");
      const extraText = contentRef.current.querySelector(".about-extra");
      const button = contentRef.current.querySelector(".about-button");

      gsap.set([heading, textLines, extraText, button], {
        opacity: 1,
      });

      gsap.from([heading, ...textLines, extraText, button], {
        opacity: 2,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black px-6 py-32"
    >
      {/* Always behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(234,179,8,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content always above background */}
      <div
        ref={contentRef}
        className="relative z-20 mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-2"
      >
        <div className="about-heading">
          <div className="flex items-start gap-5">
            <div className="mt-2 h-32 w-1 shrink-0 rounded-full bg-yellow-400" />

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
                About Mobile Detailing Services
              </p>

              <h2 className="text-5xl font-black leading-none tracking-tighter text-white md:text-7xl">
                Built
                <br />
                <span className="text-yellow-400">Beyond</span>
                <br />
                Shine
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {lines.map((line) => (
            <p
              key={line}
              className="about-line text-xl font-light leading-snug text-white/90 md:text-2xl"
            >
              {line}
            </p>
          ))}

          <div className="about-extra pt-4">
            <p className="max-w-md text-sm font-light leading-relaxed text-white/90">
              From daily drivers to luxury vehicles, we provide professional
              detailing solutions designed to restore, protect, and enhance
              your vehicle&apos;s appearance.
            </p>
          </div>

          <a
            href="#performance"
            className="about-button group mt-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-yellow-400"
          >
            <span>Discover Performance</span>
            <span className="h-px w-8 bg-yellow-400 transition-all duration-300 group-hover:w-16" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;