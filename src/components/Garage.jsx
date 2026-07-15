import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hammer, ShoppingBag, Settings, Truck } from 'lucide-react';
import card1 from '../assets/garage_card_1.png';
import card2 from '../assets/garage_card_2.png';
import card3 from '../assets/garage_card_3.png';
import card4 from '../assets/addonImg.png';
import card5 from '../assets/Detaling.png';
import card6 from '../assets/membership.jpg';
import modalImgEssential from '../assets/card_image/final_essential1.png';
import modalImgSignature from '../assets/card_image/final_signature1.png';
import modalImgPlatinum from '../assets/card_image/final_platinum1.png';
import modalImgDetailing from '../assets/card_image/final_detaling.png';
import modalImgAddon from '../assets/card_image/final_addon.png';
import modalImgMembership from '../assets/card_image/final_membership.png';

gsap.registerPlugin(ScrollTrigger);

// ─── Modal content per card ───────────────────────────────────────────────────

const modalData = {
  0: {
    title: 'Essential Car Care',
    subtitle: 'Quick • Affordable • Professional',
    price: '₹999',
    originalPrice: '₹1299',
    duration: '45 to 50 minutes',
    color: '#FACC15',
    image: modalImgEssential,
    steps: [
      { num: 1, label: 'Exterior Foam Wash' },
      { num: 2, label: 'Interior Vacuum' },
      { num: 3, label: 'Dashboard Wipe' },
      { num: 4, label: 'Tyre Dressing' },
      { num: 5, label: 'Glass Cleaning' },
      { num: 6, label: 'Air Freshener' },
    ],
    perks: ['Quick & Efficient', 'Professional Finish', 'Affordable Price'],
  },
  1: {
    title: 'Signature Car Care',
    subtitle: 'Deep Clean • Engine Care • Complete Protection',
    price: '₹1499',
    originalPrice: '₹1799',
    duration: '1 to 1.5 hrs',
    color: '#FACC15',
    image: modalImgSignature,
    steps: [
      { num: 1, label: 'Pre Wash (Degreasing)' },
      { num: 2, label: 'Exterior Foam Wash' },
      { num: 3, label: 'Interior Vacuum' },
      { num: 4, label: 'Dashboard Wipe' },
      { num: 5, label: 'Tyre Dressing' },
      { num: 6, label: 'Glass Cleaning' },
      { num: 7, label: 'Air Freshener' },
      { num: 8, label: 'Engine Bay Cleaning' },
      { num: 9, label: 'Underbody Wash' },
      { num: 10, label: 'Dashboard & Door Pad Polish' },
      { num: 11, label: 'Exterior Trim Dressing' },
    ],
    perks: ['Deep Interior Clean', 'Engine Bay Care', 'Complete Protection'],
  },
  2: {
    title: 'Platinum Car Care',
    subtitle: 'Luxury • Detailing • Ultimate Shine',
    price: '₹2299',
    originalPrice: '₹2599',
    duration: '1.5 to 2 hrs',
    color: '#FACC15',
    image: modalImgPlatinum,
    steps: [
      { num: 1, label: 'Pre Wash (Degreasing)' },
      { num: 2, label: 'Exterior Foam Wash' },
      { num: 3, label: 'Interior Vacuum' },
      { num: 4, label: 'Engine Bay Cleaning' },
      { num: 5, label: 'Engine Bay Coating' },
      { num: 6, label: 'Underbody Wash' },
      { num: 7, label: 'Dashboard & Door Pad Polish' },
      { num: 8, label: 'Exterior Trim Dressing' },
      { num: 9, label: 'Tyre Polish' },
      { num: 10, label: 'Full Interior Polishing' },
      { num: 11, label: 'AC Deodorizer' },
      { num: 12, label: 'Exterior Wax Polish' },
      { num: 13, label: 'Headlight & Tail-Light Polishing' },
      { num: 14, label: 'Windshield Washer Fluid Top-Up' },
      { num: 15, label: 'Air Tag' },
    ],
    perks: ['Showroom Quality', 'Complete Inside & Out', 'Long Lasting Results'],
  },
  3: {
    title: 'Detailing Services',
    subtitle: 'Restore • Refresh • Showroom Finish',
    price: null,
    color: '#FACC15',
    image: modalImgDetailing,
    packages: [
      {
        num: '1',
        name: 'Exterior Detailing',
        price: '₹2799',
        tag: 'Paint Enhancement + Wax',
        features: [
          'Deep Exterior Cleaning',
          'Paint Enhancement',
          'Trim Dressing',
          'Tyre Shine',
          'Protective Wax Finish',
        ],
        desc: 'Deep exterior cleaning, paint enhancement, trim dressing, tyre shine, and protective wax finish.',
      },
      {
        num: '2',
        name: 'Interior Detailing',
        price: '₹2999',
        features: [
          'Deep Vacuuming',
          'Dashboard & Door-Pad Polishing',
          'Seat & Carpet Cleaning',
          'AC Deodorizing',
          'Interior Freshness',
        ],
        desc: 'Deep vacuuming, dashboard and door-pad polishing, seat and carpet cleaning, AC deodorizing, and interior freshness.',
      },
      {
        num: '3',
        name: 'Full Detailing',
        price: '₹4999',
        features: [
          'Exterior Paint Enhancement',
          'Wax Protection',
          'Interior Deep Cleaning',
          'Engine Bay Cleaning',
          'Tyre Polish',
          'Signature Finishing',
        ],
        desc: 'Complete inside-and-out detailing including exterior paint enhancement, wax protection, interior deep cleaning, engine bay cleaning, tyre polish, and signature finishing.',
      },
    ],
  },
  4: {
    title: 'Add-Ons',
    subtitle: 'Enhance • Protect • Go the Extra Mile',
    price: null,
    color: '#FACC15',
    image: modalImgAddon,
    addons: [
      { name: 'Ceramic Spray Coating', price: '₹999' },
      { name: 'Rat Spray', price: '₹999' },
      { name: 'Headlight Restoration', price: '₹599' },
      { name: 'Engine Bay Coating', price: '₹399' },
      { name: 'Glass Coating', price: '₹599' },
      { name: 'Pet Hair Removal', price: '₹499' },
      { name: 'Water Spot Removal', price: '₹1499' },
      { name: 'Scratch Removal (Minor/Panel)', price: '₹399' },
      { name: 'Wind Shield Water Repellent', price: '₹999' },
      { name: 'Odour Remover', price: '₹999' },
      { name: 'Interior Antibacterial Steam Cleaning & Sanitise', price: '₹699' },
      { name: 'Tar & Iron Remover', price: '₹1200' },
      { name: 'Roof Lining Cleaning', price: '₹999 – ₹1499' },
    ],
    perks: ['Enhance Appearance', 'Protect Your Car', 'Improve Comfort', 'Long Lasting Results'],
  },
  5: {
    title: 'Monthly Membership Plans',
    subtitle: 'Save More • Stay Ahead • Always Ready',
    price: null,
    color: '#FACC15',
    image: modalImgMembership,
    plans: [
      {
        name: 'Essential Care',
        price: '₹2499',
        period: '/month',
        highlight: '4 Basic Washes',
        features: [
          'Exterior Foam Wash',
          'Interior Vacuum',
          'Dashboard Wipe',
          'Tyre Dressing',
          'Glass Cleaning',
          'Air Freshener',
        ],
      },
      {
        name: 'Signature Care',
        price: '₹3999',
        period: '/month',
        highlight: '2 Signature + 1 Basic',
        features: [
          'Pre Wash (Degreasing)',
          'Exterior Foam Wash',
          'Interior Vacuum',
          'Dashboard Wipe',
          'Tyre Dressing',
          'Glass Cleaning',
          'Air Freshener',
        ],
      },
      {
        name: 'Platinum Care',
        price: '₹5999',
        period: '/month',
        highlight: '2 Signature + 1 Platinum',
        features: [
          'Pre Wash (Degreasing)',
          'Exterior Foam Wash',
          'Interior Vacuum',
          'Engine Bay Cleaning',
          'Underbody Wash',
          'Dashboard & Door Polish',
          'Tyre Polish',
          'Glass Cleaning',
          'Air Freshener',
          'Exterior Trim Dressing',
        ],
        badge: 'Best Value',
      },
    ],
    perks: ['Member Exclusive Pricing', 'Flexible & Convenient', 'Save More Every Month', 'Priority Booking'],
  },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ModalImage = ({ src, alt }) => {
  if (!src) return null;
  return (
    <div className="w-full rounded-xl overflow-hidden mb-6 bg-black">
      <img src={src} alt={alt} className="w-full h-auto object-contain" />
    </div>
  );
};

const WashModal = ({ data, onClose }) => (
  <div className="p-4 sm:p-6 md:p-8">
    <ModalImage src={data.image} alt={data.title} />
    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div>
        <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">{data.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{data.title}</h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-black text-yellow-400">{data.price}</span>
          {data.originalPrice && (
            <span className="text-white/90 text-base line-through">{data.originalPrice}</span>
          )}
          {data.duration && (
            <span className="text-white/90 text-xs">⏱ {data.duration}</span>
          )}
        </div>
      </div>
      <button onClick={onClose} className="text-white/90 hover:text-yellow-600 transition-colors text-2xl leading-none mt-1">✕</button>
    </div>

    {/* Steps grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
      {data.steps.map((s) => (
        <div key={s.num} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
          <span className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center shrink-0">
            {s.num}
          </span>
          <span className="text-white/90 text-xs font-medium leading-tight">{s.label}</span>
        </div>
      ))}
    </div>

    {/* Perks */}
    <div className="flex flex-wrap gap-2">
      {data.perks.map((p) => (
        <span key={p} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold rounded-full">
          {p}
        </span>
      ))}
    </div>
  </div>
);

const DetailingModal = ({ data, onClose }) => (
  <div className="p-4 sm:p-6 md:p-8">
    <ModalImage src={data.image} alt={data.title} />
    <div className="flex items-start justify-between mb-6">
      <div>
        <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">{data.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{data.title}</h2>
      </div>
      <button onClick={onClose} className="text-white/90 hover:text-yellow-400 transition-colors text-2xl leading-none mt-1">✕</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.packages.map((pkg) => (
        <div key={pkg.num} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-yellow-400 text-black text-sm font-black flex items-center justify-center shrink-0">{pkg.num}</span>
            <div>
              <p className="text-white font-bold text-sm">{pkg.name}</p>
              {pkg.tag && <p className="text-yellow-400/60 text-xs">{pkg.tag}</p>}
            </div>
            <span className="ml-auto text-yellow-400 font-black text-base">{pkg.price}</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {pkg.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/90 text-xs">
                <CheckIcon />{f}
              </li>
            ))}
          </ul>
          <p className="text-white/70 text-xs leading-relaxed border-t border-white/10 pt-3 mt-auto">{pkg.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const AddonModal = ({ data, onClose }) => (
  <div className="p-4 sm:p-6 md:p-8">
    <ModalImage src={data.image} alt={data.title} />
    <div className="flex items-start justify-between mb-6">
      <div>
        <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">{data.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{data.title}</h2>
      </div>
      <button onClick={onClose} className="text-white/90 hover:text-yellow-600 transition-colors text-2xl leading-none mt-1">✕</button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
      {data.addons.map((a) => (
        <div key={a.name} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-3">
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span className="text-white/90 text-sm font-medium">{a.name}</span>
          </div>
          <span className="text-yellow-400 font-black text-sm shrink-0">{a.price}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {data.perks.map((p) => (
        <span key={p} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold rounded-full">{p}</span>
      ))}
    </div>
  </div>
);

const MembershipModal = ({ data, onClose }) => (
  <div className="p-4 sm:p-6 md:p-8">
    <ModalImage src={data.image} alt={data.title} />
    <div className="flex items-start justify-between mb-6">
      <div>
        <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">{data.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{data.title}</h2>
      </div>
      <button onClick={onClose} className="text-white/90 hover:text-yellow-600 transition-colors text-2xl leading-none mt-1">✕</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {data.plans.map((plan) => (
        <div key={plan.name} className={`relative bg-white/5 border rounded-2xl p-5 flex flex-col gap-3 ${plan.badge ? 'border-yellow-400/60' : 'border-white/10'}`}>
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-black text-xs font-black rounded-full whitespace-nowrap">
              {plan.badge}
            </span>
          )}
          <div>
            <p className="text-white font-black text-base">{plan.name}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-yellow-400 font-black text-2xl">{plan.price}</span>
              <span className="text-white/90 text-xs">{plan.period}</span>
            </div>
            <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-400/15 text-yellow-400 text-xs font-bold rounded-full">
              {plan.highlight}
            </span>
          </div>
          <ul className="flex flex-col gap-1.5 mt-1">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/90 text-xs">
                <CheckIcon />{f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {data.perks.map((p) => (
        <span key={p} className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-bold rounded-full">{p}</span>
      ))}
    </div>
  </div>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────

const Modal = ({ cardIndex, onClose }) => {
  const data = modalData[cardIndex];
  if (!data) return null;

  const overlayRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 1}, {  duration: 0.25 });
    gsap.fromTo(boxRef.current, { opacity: 2, y: 40, scale: 0.97 }, {  y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {  duration: 0.2 });
    gsap.to(boxRef.current, {  y: 30, scale: 0.97, duration: 0.2, onComplete: onClose });
  };

  const renderContent = () => {
    if (cardIndex <= 2) return <WashModal data={data} onClose={handleClose} />;
    if (cardIndex === 3) return <DetailingModal data={data} onClose={handleClose} />;
    if (cardIndex === 4) return <AddonModal data={data} onClose={handleClose} />;
    if (cardIndex === 5) return <MembershipModal data={data} onClose={handleClose} />;
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={boxRef}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-white/10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#FACC15 transparent' }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

// ─── Quick links marquee data ──────────────────────────────────────────────────

const quickLinks = [
  { label: 'Body Shop', href: '#body-shop', icon: Hammer },
  { label: 'Car Accessories', href: '#car-accessories', icon: ShoppingBag },
  { label: 'General Service', href: '#general-service', icon: Settings },
  { label: 'Towing & Roadside Assistance', href: '#towing-&-roadside-assistance', icon: Truck },
];

// ─── Card data ────────────────────────────────────────────────────────────────

const cars = [
  {
    img: card1,
    title: 'Essential Car Care',
    tag: 'Quick • Affordable • Professional',
    desc: 'Give your vehicle the care it deserves with our Essential Care Wash. Includes exterior foam wash, interior vacuuming, dashboard cleaning, tyre dressing, glass cleaning, and air freshener. Perfect for maintaining a clean and fresh vehicle in under an hour.',
  },
  {
    img: card2,
    title: 'Signature Car Care',
    tag: 'Deep Clean • Engine Care • Complete Protection',
    desc: 'Upgrade your car cleaning experience with our Signature Care Wash. Features pre-wash degreasing, engine bay cleaning, underbody wash, dashboard polishing, exterior trim dressing, and more for a thorough inside-and-out refresh.',
  },
  {
    img: card3,
    title: 'Platinum Car Care',
    tag: 'Luxury • Detailing • Ultimate Shine',
    desc: 'Experience the highest level of vehicle care with our Platinum Care Wash. Includes full interior polishing, engine bay coating, AC deodorizing, exterior wax polish, headlight restoration, tyre polish, and signature finishing touches for showroom-quality results.',
  },
  {
    img: card5,
    title: 'Detailing Services',
    tag: 'Restore • Refresh • Showroom Finish',
    desc: 'Professional exterior detailing, interior detailing, and full detailing packages designed to restore your car\'s shine, comfort, and signature finish.',
  },
  {
    img: card4,
    title: 'Add-Ons',
    tag: 'Enhance • Protect • Go the Extra Mile',
    desc: 'Upgrade your car care with ceramic spray coating, glass protection, headlight restoration, scratch removal, sanitisation, odour removal, and more.',
  },
  {
    img: card6,
    title: 'Monthly Membership Plans',
    tag: 'Save More • Stay Ahead • Always Ready',
    desc: 'Choose Essential, Signature, or Platinum Care and enjoy scheduled washes every month with exclusive value for your vehicle.',
  },
];

// ─── Main Garage component ────────────────────────────────────────────────────

const Garage = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 1, y: 60 },
          {
            opacity: 2, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="garage" ref={sectionRef} className="bg-black py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <p className="text-yellow-400 text-xs font-bold tracking-[0.4em] uppercase mb-3">Our Garage</p>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                <span className="text-yellow-400">Services.</span>
              </h2>
            </div>
            <p className="text-white/90 text-sm max-w-xs leading-relaxed">
              Where convenience meets obsession.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {cars.map((car, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={car.img}
                    alt={car.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold tracking-widest uppercase rounded-full">
                    {car.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white text-xl font-bold tracking-tight mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {car.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">{car.desc}</p>

                  {/* View button — now functional */}
                  <button
                    onClick={() => setActiveModal(i)}
                    className="mt-4 flex items-center gap-2 text-yellow-400 text-xs font-bold tracking-widest uppercase opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:gap-3"
                  >
                    <span>View Details</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Bottom yellow line on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Marquee */}
        <div className="mt-16 sm:mt-24">
          <p className="text-center text-yellow-400 text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Explore More
          </p>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10" />
            <div className="flex w-max gap-4 sm:gap-6 marquee-track">
              {[...quickLinks, ...quickLinks].map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    style={{ width: '250px', height: '150px' }}
                    className="flex flex-col items-center justify-center gap-2 shrink-0 bg-zinc-900 border border-white/10 hover:border-yellow-400/50 rounded-2xl px-2 text-center transition-colors duration-300 group"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 shrink-0">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                    <span className="text-white/90 group-hover:text-yellow-400 text-[11px] leading-tight font-bold tracking-tight transition-colors duration-300">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bbwMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: bbwMarquee 22s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Modal */}
      {activeModal !== null && (
        <Modal cardIndex={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default Garage;