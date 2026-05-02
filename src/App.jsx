import { useState, useEffect, useRef } from "react";

const PRICING = [
  { guests: 1, price: 500 }, { guests: 2, price: 500 },
  { guests: 3, price: 600 }, { guests: 4, price: 800 },
  { guests: 5, price: 1000 }, { guests: 6, price: 1100 },
  { guests: 7, price: 1300 }, { guests: 8, price: 1400 },
  { guests: 9, price: 1500 }, { guests: 10, price: 1500 },
];

const FAQS = [
  { q: "How far is Atithi Niwas from Khandoba Temple?", a: "We are just 2km from the sacred Khandoba Temple — a quick 5-minute auto ride or a 20-minute spiritual walk." },
  { q: "Can we accommodate large pilgrim groups?", a: "Yes! Our spacious room comfortably accommodates up to 10 guests. Perfect for families and pilgrim groups visiting the temple." },
  { q: "What amenities are included?", a: "Attached bathroom with 24/7 hot water, ceiling fan, TV, private balcony, free WiFi, free parking, and home-cooked Maharashtrian meals on request." },
  { q: "How does the advance payment work?", a: "You pay 50% advance online via Razorpay (fully secure). The remaining 50% is collected at the property upon arrival — no hidden charges." },
  { q: "How do I reach Jejuri from Pune?", a: "Jejuri is just 50km from Pune — 1.5 hours by road. Regular MSRTC buses run every hour from Pune Swargate bus stand. We can also arrange pickup on request." },
  { q: "Is food available at the property?", a: "Yes! We serve authentic Maharashtrian breakfast (poha, misal, chai) and dinner. Both vegetarian and non-vegetarian options available on request." },
  { q: "What is the cancellation policy?", a: "Free cancellation up to 7 days before check-in. Cancellations within 7 days forfeit the advance. We understand emergencies — please call us." },
  { q: "Why choose Atithi Niwas over hotels?", a: "We offer the warmth of a home, not a hotel. Personal service, home-cooked food, local insights, and authentic hospitality — at a fraction of hotel prices." },
];

const AMENITIES = [
  { icon: "🛁", title: "Hot Water 24/7", desc: "Never a cold shower — ever" },
  { icon: "📶", title: "Free WiFi", desc: "High-speed internet throughout" },
  { icon: "🌿", title: "Private Balcony", desc: "Peaceful views, fresh air" },
  { icon: "🅿️", title: "Free Parking", desc: "Safe parking on premises" },
  { icon: "📺", title: "LED Television", desc: "Entertainment in your room" },
  { icon: "🍽️", title: "Home-Cooked Meals", desc: "Authentic Maharashtrian food" },
  { icon: "🚿", title: "Attached Bathroom", desc: "Private, clean, well-maintained" },
  { icon: "🌬️", title: "Ceiling Fan", desc: "Stay cool and comfortable" },
  { icon: "👨‍👩‍👧‍👦", title: "Up to 10 Guests", desc: "Perfect for groups & families" },
  { icon: "🕉️", title: "Temple Proximity", desc: "Just 2km from Khandoba Temple" },
];

export default function App() {
  const [nav, setNav] = useState(false);
  const [section, setSection] = useState("home");
  const [guests, setGuests] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const heroRef = useRef(null);

  const price = PRICING.find(p => p.guests === guests)?.price || 500;
  const nights = checkIn && checkOut ? Math.max(0, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;
  const total = nights * price;
  const advance = Math.round(total * 0.5);
  const remaining = total - advance;
  const valid = checkIn && checkOut && nights > 0 && name && email && phone;

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true }));
      });
    }, { threshold: 0.1 });
    document.querySelectorAll("[data-animate]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [section]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const pay = () => {
    if (!valid) return;
    setShowModal(true);
  };

  const initRazorpay = () => {
    const opts = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: advance * 100,
      currency: "INR",
      name: "Atithi Niwas",
      description: `${nights} night(s) · ${guests} guest(s)`,
      prefill: { name, email, contact: phone },
      notes: { checkIn, checkOut, guests, total, advance, remaining, note },
      theme: { color: "#C8860A" },
      handler: (r) => {
        setShowModal(false);
        alert(`✅ Booking Confirmed!\nPayment ID: ${r.razorpay_payment_id}\nConfirmation sent to ${email}`);
      },
    };
    if (window.Razorpay) new window.Razorpay(opts).open();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={styles.root}>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Josefin+Sans:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{font-family:'Josefin Sans',sans-serif;background:#0a0704;color:#f5ede0;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#0a0704;}
        ::-webkit-scrollbar-thumb{background:#C8860A;border-radius:2px;}
        input,textarea,select{font-family:'Josefin Sans',sans-serif;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1) sepia(1) saturate(5) hue-rotate(5deg);cursor:pointer;}

        .fade-up{opacity:0;transform:translateY(40px);transition:all 0.8s cubic-bezier(.16,1,.3,1);}
        .fade-up.visible{opacity:1;transform:translateY(0);}
        .fade-in{opacity:0;transition:opacity 0.8s ease;}
        .fade-in.visible{opacity:1;}

        .nav-link{position:relative;letter-spacing:0.15em;font-size:11px;font-weight:500;cursor:pointer;color:#c4a882;transition:color 0.3s;text-transform:uppercase;}
        .nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#C8860A;transition:width 0.3s;}
        .nav-link:hover,.nav-link.active{color:#f5ede0;}
        .nav-link:hover::after,.nav-link.active::after{width:100%;}

        .btn-gold{background:linear-gradient(135deg,#C8860A,#e8a020,#C8860A);background-size:200%;color:#0a0704;border:none;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;transition:all 0.4s;position:relative;overflow:hidden;}
        .btn-gold:hover{background-position:right center;transform:translateY(-2px);box-shadow:0 8px 30px rgba(200,134,10,0.4);}
        .btn-gold:disabled{background:linear-gradient(135deg,#555,#666);color:#999;cursor:not-allowed;transform:none;box-shadow:none;}

        .btn-outline{background:transparent;color:#C8860A;border:1px solid #C8860A;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;transition:all 0.3s;}
        .btn-outline:hover{background:#C8860A;color:#0a0704;}

        .guest-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid #3a2d1f;background:transparent;color:#c4a882;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:13px;font-weight:500;transition:all 0.3s;display:flex;align-items:center;justify-content:center;}
        .guest-btn:hover,.guest-btn.active{border-color:#C8860A;background:#C8860A;color:#0a0704;}

        .input-field{width:100%;background:transparent;border:none;border-bottom:1px solid #3a2d1f;padding:10px 0;color:#f5ede0;font-family:'Josefin Sans',sans-serif;font-size:13px;letter-spacing:0.05em;transition:border-color 0.3s;outline:none;}
        .input-field:focus{border-bottom-color:#C8860A;}
        .input-field::placeholder{color:#5a4a3a;font-size:12px;letter-spacing:0.1em;}

        .faq-item{border-bottom:1px solid #1e1610;transition:all 0.3s;}
        .faq-item:hover{border-bottom-color:#3a2d1f;}

        .amenity-card{background:rgba(255,255,255,0.02);border:1px solid #1e1610;padding:24px;transition:all 0.4s;position:relative;overflow:hidden;}
        .amenity-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(200,134,10,0.05),transparent);opacity:0;transition:opacity 0.4s;}
        .amenity-card:hover{border-color:#C8860A40;transform:translateY(-4px);}
        .amenity-card:hover::before{opacity:1;}

        .ornament{color:#C8860A;letter-spacing:0.3em;font-size:10px;text-transform:uppercase;font-family:'Josefin Sans',sans-serif;font-weight:300;}

        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}};
        @keyframes shimmer{0%{background-position:-200%;}100%{background-position:200%;}};
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}};
        @keyframes spin-slow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}};

        .hero-ornament{animation:float 6s ease-in-out infinite;}
        .shimmer{background:linear-gradient(90deg,#C8860A 0%,#f5d98b 50%,#C8860A 100%);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite;}

        @media(max-width:768px){
          .hero-title{font-size:clamp(42px,12vw,80px) !important;}
          .grid-2{grid-template-columns:1fr !important;}
          .grid-3{grid-template-columns:1fr 1fr !important;}
          .hide-mobile{display:none !important;}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px",
        background: scrollY > 80 ? "rgba(10,7,4,0.95)" : "transparent",
        backdropFilter: scrollY > 80 ? "blur(20px)" : "none",
        borderBottom: scrollY > 80 ? "1px solid #1e1610" : "none",
        height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, background: "linear-gradient(135deg,#C8860A,#e8a020)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, color: "#0a0704",
          }}>अ</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, letterSpacing: "0.05em", color: "#f5ede0", lineHeight: 1 }}>Atithi Niwas</div>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#C8860A", textTransform: "uppercase", marginTop: 2 }}>Jejuri · Maharashtra</div>
          </div>
        </div>

        <div className="hide-mobile" style={{ display: "flex", gap: 40 }}>
          {["home", "amenities", "faq", "contact"].map(s => (
            <span key={s} className={`nav-link ${section === s ? "active" : ""}`} onClick={() => setSection(s)}>
              {s === "home" ? "Book Now" : s}
            </span>
          ))}
        </div>

        <button className="btn-gold hide-mobile" onClick={() => setSection("home")}
          style={{ padding: "10px 24px", fontSize: 10, borderRadius: 0 }}>
          Reserve Now
        </button>

        <button onClick={() => setNav(!nav)} style={{ display: "none", background: "none", border: "none", color: "#C8860A", cursor: "pointer", fontSize: 22 }}
          className="show-mobile">☰</button>
      </nav>

      {/* ── MAIN CONTENT ── */}
      {section === "home" && (
        <>
          {/* HERO */}
          <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
            {/* Background */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 30% 50%, #1a0e05 0%, #0a0704 60%)",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8860A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            {/* Decorative circle */}
            <div style={{
              position: "absolute", right: "-10%", top: "50%", transform: "translateY(-50%)",
              width: 600, height: 600, borderRadius: "50%",
              border: "1px solid rgba(200,134,10,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }} className="hide-mobile">
              <div style={{ width: 480, height: 480, borderRadius: "50%", border: "1px solid rgba(200,134,10,0.08)" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "1px solid rgba(200,134,10,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 120, opacity: 0.06, fontFamily: "serif" }}>🕉</div>
                </div>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 48px 80px", width: "100%" }}>
              <div style={{ maxWidth: 680 }}>
                <div className="ornament" style={{ marginBottom: 24 }}>
                  ✦ &nbsp; Sacred Hospitality &nbsp; ✦
                </div>

                <h1 className="hero-title shimmer" style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(56px,8vw,96px)",
                  fontWeight: 300, lineHeight: 1.05,
                  letterSpacing: "-0.02em", marginBottom: 8,
                }}>
                  Atithi Niwas
                </h1>

                <h2 style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(20px,3vw,32px)",
                  fontWeight: 300, color: "#c4a882",
                  fontStyle: "italic", marginBottom: 32, lineHeight: 1.3,
                }}>
                  Where Every Guest is God
                </h2>

                <p style={{ fontSize: 13, lineHeight: 1.9, color: "#8a7060", letterSpacing: "0.05em", maxWidth: 480, marginBottom: 48 }}>
                  A heritage homestay nestled in the sacred town of Jejuri, Maharashtra — just 2km from the divine Khandoba Temple. Experience authentic Maharashtrian hospitality.
                </p>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 64 }}>
                  <button className="btn-gold" onClick={() => document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" })}
                    style={{ padding: "16px 36px", fontSize: 11, borderRadius: 0 }}>
                    Book Your Stay
                  </button>
                  <button className="btn-outline" onClick={() => setSection("amenities")}
                    style={{ padding: "16px 36px", fontSize: 11, borderRadius: 0 }}>
                    Explore Amenities
                  </button>
                </div>

                <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
                  {[["2km", "From Temple"], ["10", "Max Guests"], ["₹500", "Starting/Night"], ["24/7", "Hot Water"]].map(([val, lbl]) => (
                    <div key={lbl}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 500, color: "#C8860A", lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", marginTop: 4 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#3a2d1f", textTransform: "uppercase", marginBottom: 8 }}>Scroll</div>
              <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,#C8860A,transparent)", margin: "0 auto", animation: "pulse 2s ease-in-out infinite" }} />
            </div>
          </section>

          {/* PRICING STRIP */}
          <div style={{ background: "#0f0904", borderTop: "1px solid #1e1610", borderBottom: "1px solid #1e1610", padding: "20px 48px", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 64, whiteSpace: "nowrap" }}>
              {PRICING.map(({ guests: g, price: p }) => (
                <div key={g} style={{ display: "flex", alignItems: "baseline", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.15em" }}>{g === 1 ? "1-2" : g} {g === 1 ? "GUESTS" : "GUESTS"}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#C8860A", fontWeight: 500 }}>₹{p}</span>
                  <span style={{ fontSize: 10, color: "#3a2d1f" }}>/night</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING FORM */}
          <section id="booking-form" style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div className="ornament" style={{ marginBottom: 16 }}>✦ &nbsp; Reserve Your Stay &nbsp; ✦</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 400, color: "#f5ede0", letterSpacing: "-0.02em" }}>
                Book Your Sacred Retreat
              </h2>
            </div>

            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {/* Left: Form */}
              <div style={{ background: "#0f0904", border: "1px solid #1e1610", padding: "48px" }}>
                {/* Guests */}
                <div style={{ marginBottom: 40 }}>
                  <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8860A", textTransform: "uppercase", display: "block", marginBottom: 16 }}>Number of Guests</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} className={`guest-btn ${guests === n ? "active" : ""}`} onClick={() => setGuests(n)}>{n}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#C8860A", letterSpacing: "0.05em" }}>
                    ₹{price}/night for {guests} guest{guests > 1 ? "s" : ""}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Check-in</label>
                    <input type="date" className="input-field" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Check-out</label>
                    <input type="date" className="input-field" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)} />
                  </div>
                </div>

                {nights > 0 && (
                  <div style={{ marginBottom: 32, padding: "12px 16px", background: "rgba(200,134,10,0.06)", borderLeft: "2px solid #C8860A", fontSize: 12, color: "#c4a882", letterSpacing: "0.05em" }}>
                    {nights} night{nights > 1 ? "s" : ""} selected
                  </div>
                )}

                {/* Personal details */}
                <div style={{ display: "grid", gap: 28, marginBottom: 40 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name</label>
                    <input className="input-field" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email Address</label>
                    <input type="email" className="input-field" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Mobile Number</label>
                    <input type="tel" className="input-field" placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Special Requests</label>
                    <textarea className="input-field" placeholder="Any special requirements..." rows={3} value={note} onChange={e => setNote(e.target.value)} style={{ resize: "none" }} />
                  </div>
                </div>

                <button className="btn-gold" disabled={!valid} onClick={pay}
                  style={{ width: "100%", padding: "18px", fontSize: 11, borderRadius: 0 }}>
                  {valid ? "Proceed to Payment →" : "Fill All Details to Continue"}
                </button>

                <p style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#3a2d1f", letterSpacing: "0.1em" }}>
                  🔒 Secured by Razorpay · 256-bit SSL encryption
                </p>
              </div>

              {/* Right: Price Summary */}
              <div style={{ background: "linear-gradient(160deg,#120b04,#0a0704)", border: "1px solid #1e1610", borderLeft: "none", padding: "48px", display: "flex", flexDirection: "column" }}>
                <div className="ornament" style={{ marginBottom: 32 }}>Price Breakdown</div>

                {nights > 0 ? (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 56, fontWeight: 300, color: "#f5ede0", lineHeight: 1, marginBottom: 4 }}>
                        ₹{total.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.15em", marginBottom: 40 }}>
                        Total for {nights} night{nights > 1 ? "s" : ""} · {guests} guest{guests > 1 ? "s" : ""}
                      </div>

                      <div style={{ borderTop: "1px solid #1e1610", paddingTop: 32, marginBottom: 32 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                          <span style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.1em" }}>₹{price} × {nights} night{nights > 1 ? "s" : ""}</span>
                          <span style={{ fontSize: 13, color: "#c4a882" }}>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ background: "rgba(200,134,10,0.08)", border: "1px solid rgba(200,134,10,0.2)", padding: "20px 24px", marginBottom: 16 }}>
                          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8860A", textTransform: "uppercase", marginBottom: 6 }}>Pay Now (50%)</div>
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: "#C8860A", fontWeight: 500 }}>₹{advance.toLocaleString("en-IN")}</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e1610", padding: "16px 24px" }}>
                          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a4a3a", textTransform: "uppercase", marginBottom: 4 }}>Pay at Property</div>
                          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#8a7060" }}>₹{remaining.toLocaleString("en-IN")}</div>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid #1e1610", paddingTop: 32 }}>
                        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#3a2d1f", textTransform: "uppercase", marginBottom: 16 }}>Included in Your Stay</div>
                        {["Spacious Double Room", "Attached Private Bathroom", "24/7 Hot Water", "Free WiFi & Parking", "Private Balcony", "Home-Cooked Meals (On Request)"].map(item => (
                          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <div style={{ width: 4, height: 4, background: "#C8860A", borderRadius: "50%", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.05em" }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 40, padding: "20px 24px", border: "1px solid #1e1610", background: "rgba(255,255,255,0.01)" }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#3a2d1f", textTransform: "uppercase", marginBottom: 8 }}>Check-in · Check-out</div>
                      <div style={{ fontSize: 12, color: "#8a7060" }}>1:00 PM · 11:00 AM</div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 80, opacity: 0.08 }}>🕉</div>
                    <div style={{ fontSize: 12, color: "#3a2d1f", letterSpacing: "0.1em", textAlign: "center" }}>Select your dates to see<br />the full price breakdown</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ABOUT STRIP */}
          <section style={{ background: "#0f0904", borderTop: "1px solid #1e1610", borderBottom: "1px solid #1e1610", padding: "80px 48px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2px 1fr 2px 1fr", gap: 48, alignItems: "start" }} className="grid-3-custom">
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: "#C8860A", marginBottom: 8, fontStyle: "italic" }}>The Spirit of Atithi</div>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em" }}>
                  In Sanskrit, <em style={{ color: "#8a7060" }}>"Atithi Devo Bhava"</em> means "Guest is God." This ancient wisdom guides every aspect of our hospitality — from the warmth of our welcome to the cleanliness of our rooms.
                </p>
              </div>
              <div style={{ background: "#1e1610", alignSelf: "stretch" }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: "#C8860A", marginBottom: 8, fontStyle: "italic" }}>Sacred Location</div>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em" }}>
                  Jejuri is Maharashtra's most beloved pilgrim town, home to the revered Khandoba Temple perched atop a hill. Our homestay is your perfect base — close enough to hear the temple bells.
                </p>
              </div>
              <div style={{ background: "#1e1610", alignSelf: "stretch" }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: "#C8860A", marginBottom: 8, fontStyle: "italic" }}>Your Home Away</div>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em" }}>
                  Unlike impersonal hotels, we offer genuine home hospitality. A spacious room for up to 10, home-cooked Maharashtrian meals, and a family that treats you as their own.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── AMENITIES ── */}
      {section === "amenities" && (
        <section style={{ minHeight: "100vh", padding: "140px 48px 100px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="ornament" style={{ marginBottom: 16 }}>✦ &nbsp; What We Offer &nbsp; ✦</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 400, color: "#f5ede0" }}>
              Comfort & Convenience
            </h2>
            <p style={{ fontSize: 12, color: "#5a4a3a", letterSpacing: "0.08em", marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
              Everything you need for a comfortable, memorable stay in Jejuri
            </p>
          </div>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 80 }}>
            {AMENITIES.map(({ icon, title, desc }) => (
              <div key={title} className="amenity-card">
                <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#f5ede0", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.05em", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Room details */}
          <div style={{ background: "#0f0904", border: "1px solid #1e1610", padding: "48px" }}>
            <div className="ornament" style={{ marginBottom: 24 }}>✦ &nbsp; The Room &nbsp; ✦</div>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "#f5ede0", marginBottom: 20 }}>
                  Spacious Double Room
                </h3>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em", marginBottom: 24 }}>
                  Our beautifully appointed room offers generous space for up to 10 guests — perfect for families, pilgrim groups, and friends travelling together. Every corner is maintained with meticulous cleanliness.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Spacious · Airy · Clean", "Private Balcony with peaceful views", "Attached bathroom, never shared", "Quality mattress and bedding included"].map(f => (
                    <div key={f} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ color: "#C8860A", fontSize: 10 }}>✦</div>
                      <span style={{ fontSize: 12, color: "#8a7060", letterSpacing: "0.05em" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "#f5ede0", marginBottom: 20 }}>
                  Dining & Meals
                </h3>
                <p style={{ fontSize: 12, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em", marginBottom: 24 }}>
                  Taste the authentic flavours of Maharashtra with our home-cooked meals prepared fresh daily. Nothing compares to the warmth of food made with love.
                </p>
                <div style={{ display: "grid", gap: 16 }}>
                  {[["Breakfast", "Poha, Upma, Misal, Idli, Tea/Coffee"], ["Dinner", "Rice, Dal, Sabji, Roti, Salad, Pickle"], ["Special Diet", "Vegetarian & Non-veg on request"]].map(([meal, items]) => (
                    <div key={meal} style={{ borderLeft: "2px solid #C8860A", paddingLeft: 16 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C8860A", textTransform: "uppercase", marginBottom: 4 }}>{meal}</div>
                      <div style={{ fontSize: 11, color: "#5a4a3a", letterSpacing: "0.04em" }}>{items}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {section === "faq" && (
        <section style={{ minHeight: "100vh", padding: "140px 48px 100px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="ornament" style={{ marginBottom: 16 }}>✦ &nbsp; Common Questions &nbsp; ✦</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 400, color: "#f5ede0" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((item, i) => (
              <div key={i} className="faq-item">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", padding: "28px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: faqOpen === i ? "#C8860A" : "#f5ede0", fontWeight: 400, lineHeight: 1.3 }}>
                    {item.q}
                  </span>
                  <span style={{ color: "#C8860A", fontSize: 18, flexShrink: 0, marginTop: 2, transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ paddingBottom: 28, paddingRight: 40 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.9, color: "#5a4a3a", letterSpacing: "0.04em", borderLeft: "2px solid #C8860A", paddingLeft: 20 }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64, background: "linear-gradient(135deg,#0f0904,#120b04)", border: "1px solid #1e1610", padding: "40px 48px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5ede0", marginBottom: 12 }}>Still have questions?</div>
            <p style={{ fontSize: 12, color: "#5a4a3a", letterSpacing: "0.08em", marginBottom: 28 }}>Our family is available around the clock to help you</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+918793365792" className="btn-gold" style={{ padding: "12px 28px", fontSize: 10, borderRadius: 0, textDecoration: "none", display: "inline-block" }}>
                📞 Call Us
              </a>
              <a href="mailto:atithi.niwas.jejuri@gmail.com" className="btn-outline" style={{ padding: "12px 28px", fontSize: 10, borderRadius: 0, textDecoration: "none", display: "inline-block" }}>
                ✉ Email Us
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      {section === "contact" && (
        <section style={{ minHeight: "100vh", padding: "140px 48px 100px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="ornament" style={{ marginBottom: 16 }}>✦ &nbsp; Find Us &nbsp; ✦</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(36px,5vw,56px)", fontWeight: 400, color: "#f5ede0" }}>
              Get in Touch
            </h2>
          </div>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div style={{ background: "#0f0904", border: "1px solid #1e1610", padding: "48px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
                {[
                  { icon: "📞", label: "Phone", value: "+91 87933 65792", sub: "Available 24/7", href: "tel:+918793365792" },
                  { icon: "✉️", label: "Email", value: "atithi.niwas.jejuri@gmail.com", sub: "Response within 2 hours", href: "mailto:atithi.niwas.jejuri@gmail.com" },
                  { icon: "📍", label: "Address", value: "Near Khandoba Temple", sub: "Jejuri, Maharashtra 412110", href: null },
                  { icon: "🕐", label: "Check-in · Check-out", value: "1:00 PM · 11:00 AM", sub: "Early check-in on request", href: null },
                ].map(({ icon, label, value, sub, href }) => (
                  <div key={label} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, background: "rgba(200,134,10,0.08)", border: "1px solid rgba(200,134,10,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#C8860A", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      {href ? (
                        <a href={href} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#f5ede0", textDecoration: "none", display: "block" }}>{value}</a>
                      ) : (
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "#f5ede0" }}>{value}</div>
                      )}
                      <div style={{ fontSize: 11, color: "#3a2d1f", letterSpacing: "0.05em", marginTop: 2 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(160deg,#1a0e05,#0a0704)", border: "1px solid #1e1610", borderLeft: "none", padding: "48px" }}>
              <div className="ornament" style={{ marginBottom: 32 }}>✦ &nbsp; How to Reach &nbsp; ✦</div>

              {[
                { from: "From Pune", route: "50km · 1.5 hours", detail: "Regular MSRTC buses from Swargate Bus Stand every hour. Cab/auto available." },
                { from: "From Mumbai", route: "200km · 3.5 hours", detail: "Drive via Pune–Solapur Highway. Mumbai to Pune Expressway, then National Highway 965." },
                { from: "From Jejuri Town", route: "2km · 5 minutes", detail: "Auto-rickshaw or walking distance from the main town square and bus stop." },
              ].map(({ from, route, detail }) => (
                <div key={from} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #1e1610" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#f5ede0" }}>{from}</span>
                    <span style={{ fontSize: 10, color: "#C8860A", letterSpacing: "0.15em" }}>{route}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#3a2d1f", letterSpacing: "0.04em", lineHeight: 1.7 }}>{detail}</p>
                </div>
              ))}

              <button className="btn-gold" onClick={() => window.open("https://maps.google.com/maps?q=Jejuri+Khandoba+Temple", "_blank")}
                style={{ width: "100%", padding: "16px", fontSize: 10, borderRadius: 0 }}>
                Open in Google Maps →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050302", borderTop: "1px solid #1e1610", padding: "60px 48px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#C8860A,#e8a020)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "serif", fontWeight: 700, color: "#0a0704" }}>अ</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: "#f5ede0" }}>Atithi Niwas</div>
              </div>
              <p style={{ fontSize: 11, color: "#3a2d1f", letterSpacing: "0.08em", maxWidth: 280, lineHeight: 1.8 }}>
                Sacred hospitality in the heart of Jejuri, Maharashtra. Where every guest is treated as God.
              </p>
            </div>

            <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#C8860A", textTransform: "uppercase", marginBottom: 16 }}>Navigate</div>
                {["Book Now", "Amenities", "FAQ", "Contact"].map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <span onClick={() => setSection(l === "Book Now" ? "home" : l.toLowerCase())}
                      style={{ fontSize: 12, color: "#3a2d1f", letterSpacing: "0.05em", cursor: "pointer", transition: "color 0.3s" }}
                      onMouseEnter={e => e.target.style.color = "#C8860A"}
                      onMouseLeave={e => e.target.style.color = "#3a2d1f"}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#C8860A", textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
                <div style={{ fontSize: 12, color: "#3a2d1f", letterSpacing: "0.04em", lineHeight: 2 }}>
                  <div>+91 87933 65792</div>
                  <div>atithi.niwas.jejuri</div>
                  <div>@gmail.com</div>
                  <div style={{ marginTop: 8 }}>Jejuri, MH 412110</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1e1610", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 10, color: "#1e1610", letterSpacing: "0.1em" }}>
              © 2024 Atithi Niwas · Jejuri · Maharashtra · All Rights Reserved
            </div>
            <div style={{ fontSize: 9, color: "#1e1610", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Homestay Jejuri · Stay Near Khandoba Temple · Budget Accommodation Maharashtra
            </div>
          </div>
        </div>
      </footer>

      {/* ── PAYMENT MODAL ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#0f0904", border: "1px solid #C8860A40", padding: "48px", maxWidth: 480, width: "100%", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#5a4a3a", cursor: "pointer", fontSize: 20 }}>✕</button>

            <div className="ornament" style={{ marginBottom: 16 }}>✦ &nbsp; Confirm Booking &nbsp; ✦</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "#f5ede0", marginBottom: 32 }}>Review & Pay</h3>

            <div style={{ background: "rgba(200,134,10,0.04)", border: "1px solid #1e1610", padding: "24px", marginBottom: 24 }}>
              {[
                ["Guest", name],
                ["Check-in", checkIn],
                ["Check-out", checkOut],
                ["Guests", guests],
                ["Total Fare", `₹${total.toLocaleString("en-IN")}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1e1610" }}>
                  <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#5a4a3a", textTransform: "uppercase" }}>{k}</span>
                  <span style={{ fontSize: 13, color: "#c4a882", fontFamily: "'Cormorant Garamond',serif" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#C8860A", textTransform: "uppercase" }}>Pay Now (50%)</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: "#C8860A" }}>₹{advance.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button className="btn-gold" onClick={initRazorpay} style={{ width: "100%", padding: "18px", fontSize: 11, borderRadius: 0, marginBottom: 12 }}>
              Pay ₹{advance.toLocaleString("en-IN")} via Razorpay →
            </button>
            <button className="btn-outline" onClick={() => setShowModal(false)} style={{ width: "100%", padding: "14px", fontSize: 10, borderRadius: 0 }}>
              Cancel
            </button>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 10, color: "#1e1610", letterSpacing: "0.1em" }}>
              🔒 256-bit SSL encryption · PCI DSS compliant
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#0a0704" },
};
