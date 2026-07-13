import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BOOKING_API_URL = 'https://abi-project-bbw-brotherbehindwheels.onrender.com/api/Booking/create'; // ✏️ fix typo: was /api/ooking/create

const services = [
  { id: 'essential', label: 'Essential Car Wash', group: 'Car Wash' },
  { id: 'premium', label: 'Premium Car Wash', group: 'Car Wash' },
  { id: 'platinum', label: 'Platinum Car Wash', group: 'Car Wash' },
  { id: 'exterior-detailing', label: 'Exterior Detailing', group: 'Detailing Services' },
  { id: 'interior-detailing', label: 'Interior Detailing', group: 'Detailing Services' },
  { id: 'full-detailing', label: 'Full Detailing', group: 'Detailing Services' },
  { id: 'others', label: 'Others / Add-Ons', group: 'Others' },
];

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold tracking-widest uppercase text-black/60">
      {label}
    </label>
    {children}
    {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
  </div>
);

const inputCls = (errors, key) =>
  `w-full bg-black/5 border ${
    errors[key] ? 'border-red-400' : 'border-black/15'
  } rounded-xl px-4 py-3 text-black text-sm placeholder-black/30 focus:outline-none focus:border-black/50 transition-colors`;

const BookingModal = ({ onClose }) => {
  const overlayRef = useRef(null);
  const boxRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    service: '',
    note: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(boxRef.current, {
      opacity: 0, y: 30, scale: 0.97, duration: 0.2, onComplete: onClose,
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.service) e.service = 'Please select a service';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    setServerError('');

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      service: form.service,
      note: form.note.trim(),
    };

    try {
      const response = await fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // handle non-JSON responses safely
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        // backend returned non-JSON (e.g. HTML error page)
        if (!response.ok) {
          setServerError(`Server error (${response.status}). Check your backend is running on port 5678.`);
          return;
        }
      }

      if (!response.ok) {
        setServerError(data.message || data.error || `Error ${response.status}: Booking failed.`);
        return;
      }

      setSubmitted(true);

    } catch (err) {
      if (err.message.includes('fetch')) {
        setServerError('Cannot connect to server. Make sure your backend is running on http://localhost:5678');
      } else {
        setServerError(`Unexpected error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={boxRef}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#FACC15' }}
      >
        {submitted ? (
          <div className="p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-yellow-400 text-3xl font-black">
              ✓
            </div>
            <h3 className="text-3xl font-black text-black tracking-tighter">
              Booking Received!
            </h3>
            <p className="text-black/60 text-sm max-w-xs leading-relaxed">
              Thanks <span className="font-bold">{form.name}</span>! We will confirm
              your appointment shortly on{' '}
              <span className="font-bold">+91 {form.phone}</span>.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-8 py-3 bg-black text-yellow-400 text-xs font-black tracking-widest uppercase rounded-full hover:bg-zinc-900 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-black/50 text-xs font-bold tracking-[0.35em] uppercase mb-1">
                  Get Started
                </p>
                <h3 className="text-3xl font-black text-black tracking-tighter leading-tight">
                  Book Your<br />Car Care
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-black/60 transition-colors text-lg leading-none mt-1"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Full Name" error={errors.name}>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    setErrors((er) => ({ ...er, name: '' }));
                  }}
                  className={inputCls(errors, 'name')}
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50 text-sm font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }));
                      setErrors((er) => ({ ...er, phone: '' }));
                    }}
                    className={`${inputCls(errors, 'phone')} pl-12`}
                  />
                </div>
              </Field>

              <Field label="Service Address" error={errors.address}>
                <textarea
                  rows={2}
                  placeholder="Flat / Building, Street, Area, City"
                  value={form.address}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, address: e.target.value }));
                    setErrors((er) => ({ ...er, address: '' }));
                  }}
                  className={`${inputCls(errors, 'address')} resize-none`}
                />
              </Field>

              <Field label="Service Required" error={errors.service}>
                <div
                  className={`flex flex-wrap gap-2 p-3 bg-black/5 border ${
                    errors.service ? 'border-red-400' : 'border-black/15'
                  } rounded-xl`}
                >
                  {services.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => {
                        setForm((f) => ({ ...f, service: s.id }));
                        setErrors((er) => ({ ...er, service: '' }));
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                        form.service === s.id
                          ? 'bg-black text-yellow-400 shadow-md scale-105'
                          : 'bg-black/10 text-black/60 hover:bg-black/20'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Additional Notes (optional)">
                <input
                  type="text"
                  placeholder="Any specific requests or car details…"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className={inputCls(errors, 'note')}
                />
              </Field>

              {serverError && (
                <div className="bg-red-100 border border-red-300 rounded-xl px-4 py-3">
                  <p className="text-red-700 text-xs font-semibold text-center leading-relaxed">
                     {serverError}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-2 w-full py-4 bg-black text-yellow-400 text-sm font-black tracking-widest uppercase rounded-full hover:bg-zinc-900 active:scale-95 transition-all duration-200 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving Booking...
                  </span>
                ) : (
                  'Confirm Booking →'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CTA = () => {
  const sectionRef = useRef(null);
  const btnRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.cta-animate'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);

    gsap.to(btnRef.current, {
      scale: 1.04, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="relative overflow-hidden py-32 px-6 bg-yellow-400"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 60% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="cta-animate text-black/50 text-xs font-bold tracking-[0.4em] uppercase mb-5">
            Ready to Start?
          </p>
          <h2 className="cta-animate text-5xl md:text-7xl font-black text-black tracking-tighter leading-none mb-6">
            Book Your<br />Car Care
          </h2>
          <p className="cta-animate text-black/60 text-lg font-light max-w-lg mx-auto mb-10">
            Premium mobile car care, delivered wherever you are & professional
            car detailing at your doorstep.
          </p>
          <div className="cta-animate">
            <button
              ref={btnRef}
              onClick={() => setShowForm(true)}
              className="inline-block px-12 py-5 bg-black text-yellow-400 text-sm font-black tracking-widest uppercase rounded-full hover:bg-zinc-900 transition-colors duration-300 shadow-2xl cursor-pointer"
            >
              Book Now →
            </button>
          </div>
        </div>
      </section>

      {showForm && <BookingModal onClose={() => setShowForm(false)} />}
    </>
  );
};

export default CTA;