'use client';

import { useEffect, useState } from 'react';

export default function NexusLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;

    setIsSending(true);
    setSendStatus('idle');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '15f81d13-9ead-4922-8137-0230fd3d6f53',
          email: contactEmail,
          message: contactMessage,
          subject: 'New NEXUS Inquiry',
          from_name: 'NEXUS Landing Page'
        }),
      });

      if (res.ok) {
        setSendStatus('success');
        setContactEmail('');
        setContactMessage('');
      } else {
        setSendStatus('error');
      }
    } catch (err) {
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Add smooth scrolling to html
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Md. Mokammel Morshed",
    "alternateName": "Meheran",
    "url": "https://meheran.dev",
    "image": "https://meheran.dev/profile.jpg",
    "jobTitle": "Full Stack Developer & Productivity System Builder",
    "worksFor": {
      "@type": "Organization",
      "name": "UdyomX Org",
      "url": "https://udyomxorg.vercel.app"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Khulna University of Engineering & Technology",
      "alternateName": "KUET"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BD",
      "addressRegion": "Khulna Division"
    },
    "email": "mdmokammelmorshed@gmail.com",
    "sameAs": [
      "https://github.com/MkMeheran",
      "https://www.linkedin.com/in/mokammel-morshed-59108a366/",
      "https://meheran.dev",
      "https://udyomxorg.vercel.app",
      "https://www.facebook.com/Meheran216/",
      "https://datacamp.com/portfolio/mdmokammelmorshed",
      "https://spatialnode.net/meheran",
      "https://www.openstreetmap.org/user/MD%20MOKAMMEL%20MORSHED",
      "https://www.reddit.com/user/Meheran216/",
      "https://x.com/Meheran_3005"
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "NEXUS",
    "description": "NEXUS is a fully custom personal app built in Bangladesh. As an AI agent setup freelancer and n8n workflow developer, I build custom productivity systems, media vaults, and AI assistants. Contact Md. Mokammel Morshed for setup.",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Windows, Android",
    "author": {
      "@type": "Person",
      "name": "Md. Mokammel Morshed",
      "url": "https://meheran.dev"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD",
      "description": "Custom setup service — contact for pricing"
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#0e0d0b] text-[#f0ece4] font-sans selection:bg-[#f5a623]/30 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        /* Scanline Overlay */
        .scanlines::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px);
          pointer-events: none;
          z-index: 999;
        }

        .hero-grid {
          background-image:
            linear-gradient(#3a3630 1px, transparent 1px),
            linear-gradient(90deg, #3a3630 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.25;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
        }

        .hero-glow {
          background: radial-gradient(circle, rgba(245,166,35,.06) 0%, transparent 70%);
        }

        .contact-glow::before {
          content: '';
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,166,35,.04) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        @keyframes scrollPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        .scroll-pulse { animation: scrollPulse 2s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .6s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: .1s; }
        .delay-2 { animation-delay: .2s; }
        .delay-3 { animation-delay: .3s; }
        .delay-4 { animation-delay: .4s; }

        .nes-raised { box-shadow: inset -2px -2px 0px #0a0908, inset 2px 2px 0px #3d3a34; }
        .nes-pressed { box-shadow: inset 2px 2px 0px #0a0908, inset -1px -1px 0px #3d3a34; }
        
        .divider {
          border: none;
          border-top: 1px solid #3a3630;
          margin: 0;
        }
      `}} />

      <div className="scanlines">
        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-10 py-3.5 bg-[#0e0d0b]/85 backdrop-blur-md border-b border-[#3a3630]">
          <div className="flex items-center">
            <img src="/logo.png" alt="NEXUS" className="h-8 md:h-10 w-auto object-contain invert opacity-90 hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#1e1c18] border border-[#3a3630] px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></div>
              <span className="font-mono text-[9px] font-bold tracking-[0.1em] text-[#a89f92] uppercase">Available for 2 projects</span>
            </div>
            <a href="#contact" className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-[#a89f92] no-underline border border-[#3a3630] px-4 py-2 rounded transition-all duration-200 nes-raised hover:text-[#f5a623] hover:border-[#b87d1a]">
              Get in touch
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-[140px] pb-[80px] relative overflow-hidden">
          <div className="absolute inset-0 hero-grid"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          {/* Decorative Left */}
          <div className="hidden xl:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-6 opacity-40 pointer-events-none fade-up">
            <div className="w-[1px] h-24 bg-gradient-to-b from-transparent to-[#f5a623] mx-auto"></div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-[#f5a623] rotate-180" style={{ writingMode: 'vertical-rl' }}>
              SYS.INIT // 2026.1
            </div>
            <div className="flex flex-col gap-2 items-center mt-4">
              <div className="w-1.5 h-1.5 bg-[#f5a623] rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-[#6b6358] rounded-full"></div>
              <div className="w-1 h-1 bg-[#6b6358] rounded-full"></div>
            </div>
          </div>

          {/* Decorative Right */}
          <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-6 opacity-40 pointer-events-none fade-up delay-2">
            <div className="flex flex-col gap-2 items-center mb-4">
              <div className="w-1 h-1 bg-[#6b6358] rounded-full"></div>
              <div className="w-1 h-1 bg-[#6b6358] rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse"></div>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-[#34d399]" style={{ writingMode: 'vertical-rl' }}>
              SECURE CONNECTION
            </div>
            <div className="w-[1px] h-24 bg-gradient-to-t from-transparent to-[#34d399] mx-auto"></div>
          </div>

          <div className="inline-block font-mono text-[10px] tracking-[0.15em] uppercase text-[#f5a623] bg-[#f5a623]/[0.08] border border-[#f5a623]/25 px-3.5 py-1.5 rounded-sm mb-7 relative fade-up">
            Personal Productivity Infrastructure
          </div>

          <h1 className="font-mono font-bold text-[clamp(42px,8vw,96px)] tracking-[-0.02em] leading-[1.1] text-[#f0ece4] relative mb-8 fade-up delay-1 max-w-[1000px] mx-auto">
            ONE <span className="text-[#f5a623]">NEXUS.</span><br />
            ALL DEVICES.
          </h1>

          <p className="text-[clamp(16px,2.5vw,20px)] font-light text-[#a89f92] max-w-[600px] mx-auto mb-6 leading-[1.7] fade-up delay-2 relative z-10">
            I build custom personal apps that are 100% yours. No subscription. No vendor lock-in. Full source code delivered.
          </p>

          <p className="text-[14px] text-[#f5a623] italic max-w-[560px] mx-auto mb-12 fade-up delay-2 relative z-10">
            "NEXUS was originally built for my own daily workflow. You're not hiring someone to build something theoretical — you're getting a battle-tested system I use every single day."
          </p>

          <a href="#contact" className="inline-flex items-center gap-2.5 font-mono text-[13px] font-bold tracking-[0.1em] uppercase text-[#0e0d0b] bg-[#f5a623] border-2 border-[#c4851c] px-8 py-3.5 rounded no-underline transition-all duration-150 nes-raised hover:bg-[#f7b84a] hover:-translate-y-0.5 active:translate-y-[1px] fade-up delay-3 relative z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            Contact for pricing
          </a>

          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.12em] text-[#6b6358] uppercase flex flex-col items-center gap-2 fade-up delay-4">
            scroll
            <div className="w-[1px] h-[40px] bg-gradient-to-b from-[#6b6358] to-transparent scroll-pulse"></div>
          </div>
        </section>

        <hr className="divider" />

        {/* WHAT IS NEXUS */}
        <section id="about" className="py-[96px] px-6">
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-16 items-start">

            {/* Left Content Column */}
            <div className="flex-1 w-full">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">What is this</p>
              <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-4">Not an app.<br />An infrastructure.</h2>
              <p className="text-[17px] font-light text-[#a89f92] max-w-[520px] mb-10 leading-[1.75]">NEXUS is a personal productivity system that connects your Windows desktop and Android phone into one unified environment — built specifically for you.</p>

              <div className="bg-[#1e1c18] border-l-4 border-[#f5a623] p-6 mb-16 rounded-r-md">
                <h3 className="font-mono text-[15px] font-bold text-[#f5a623] mb-2 uppercase tracking-[0.05em]">Ownership Promise</h3>
                <p className="text-[15px] text-[#f0ece4] leading-[1.6]">You get the full source code. Your Supabase account. Your Google Drive. I just build — you own. Everything runs on your personal infrastructure.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-16 border border-[#3a3630] rounded-lg overflow-hidden bg-[#3a3630]">
                <div className="bg-[#161410] p-8 border border-[#3a3630] transition-colors duration-200 hover:bg-[#1e1c18]">
                  <div className="font-mono text-[11px] text-[#6b6358] tracking-[0.1em] mb-3">01</div>
                  <h3 className="font-mono text-[15px] font-bold mb-2 text-[#f0ece4]">Cross-device by default</h3>
                  <p className="text-[14px] text-[#a89f92] leading-[1.65]">Copy something on your phone, see it on Windows. Screenshot on mobile, available instantly on your web dashboard. No cables, no manual transfers.</p>
                </div>
                <div className="bg-[#161410] p-8 border border-[#3a3630] transition-colors duration-200 hover:bg-[#1e1c18]">
                  <div className="font-mono text-[11px] text-[#6b6358] tracking-[0.1em] mb-3">02</div>
                  <h3 className="font-mono text-[15px] font-bold mb-2 text-[#f0ece4]">Your data, your storage</h3>
                  <p className="text-[14px] text-[#a89f92] leading-[1.65]">Everything syncs to your own Google Drive account. No third-party storage. No subscription lock-in. You own every byte.</p>
                </div>
                <div className="bg-[#161410] p-8 border border-[#3a3630] transition-colors duration-200 hover:bg-[#1e1c18]">
                  <div className="font-mono text-[11px] text-[#6b6358] tracking-[0.1em] mb-3">03</div>
                  <h3 className="font-mono text-[15px] font-bold mb-2 text-[#f0ece4]">AI when you want it</h3>
                  <p className="text-[14px] text-[#a89f92] leading-[1.65]">Claw, the built-in AI assistant, activates only when you call it. No background monitoring. No idle API costs. You stay in control.</p>
                </div>
                <div className="bg-[#161410] p-8 border border-[#3a3630] transition-colors duration-200 hover:bg-[#1e1c18]">
                  <div className="font-mono text-[11px] text-[#6b6358] tracking-[0.1em] mb-3">04</div>
                  <h3 className="font-mono text-[15px] font-bold mb-2 text-[#f0ece4]">Private and encrypted</h3>
                  <p className="text-[14px] text-[#a89f92] leading-[1.65]">Sensitive notes live in a local AES-256 encrypted vault that never touches the cloud. Your secrets stay on your device only.</p>
                </div>
              </div>
            </div>

            {/* Right Video Column (Sticky on Desktop) */}
            <div className="hidden lg:flex w-full lg:w-[380px] xl:w-[420px] lg:sticky lg:top-[120px] flex-col items-center mt-12 lg:mt-0">
              <div className="text-center w-full">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">Live Demo</p>
                <h3 className="font-mono text-[clamp(24px,3vw,32px)] font-bold text-[#f0ece4] mb-8">See it in action</h3>

                <div className="max-w-[340px] mx-auto bg-[#0e0d0b] border-[8px] border-[#1e1c18] rounded-[36px] overflow-hidden nes-raised relative" style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
                  {/* iPhone style notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1e1c18] rounded-b-[16px] z-10 flex items-center justify-center">
                    <div className="w-12 h-1.5 bg-[#3a3630] rounded-full"></div>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '0px', paddingBottom: '177.778%' }}>
                    <iframe
                      allow="fullscreen"
                      allowFullScreen
                      loading="lazy"
                      src="https://streamable.com/e/7g09lx?muted=1"
                      style={{ border: 'none', width: '100%', height: '100%', position: 'absolute', left: '0px', top: '0px', overflow: 'hidden' }}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <hr className="divider" />

        {/* FEATURES */}
        <section id="features" className="py-[96px] px-6 bg-[#161410]">
          <div className="max-w-[1100px] mx-auto">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">What you get</p>
            <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-4">Everything in one place.</h2>
            <p className="text-[17px] font-light text-[#a89f92] max-w-[520px] leading-[1.75]">Ten integrated modules — each with its own purpose, each talking to the others.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-14 bg-[#3a3630] border border-[#3a3630] p-[2px] rounded-lg">

              {/* Feature 1 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f5a623] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#f5a623]">Clipboard Hub</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Real-time sync between all devices. 50-item history with smart type detection — URLs, code, addresses handled differently.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Real-time</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Search</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Pin clips</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#d946b8] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d946b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#d946b8]">Media Vault</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Screenshot on your phone — it lands in your cloud dashboard instantly. Browse, copy, download from anywhere. Powered by your Google Drive.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Google Drive</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Auto-upload</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Grid view</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#22d3ee] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#22d3ee]">File Transfer</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Drag a file from Windows — it's in your cloud. Generate a QR code, scan on mobile, done. No cable. No AirDrop. No third-party app.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">QR share</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Drag & drop</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Download queue</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#84cc16] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#84cc16]">Second Brain</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Capture ideas, quotes, and links instantly. Tag everything. Full-text search across all notes. Link notes to each other like a personal wiki.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Tags</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Full-text search</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Markdown</span>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#38bdf8] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#38bdf8]">Resource Library</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Save any link — YouTube, GitHub, articles — with categories. Browse your Google Drive files directly. Track ongoing courses with progress.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Saved links</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Drive browser</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Course tracker</span>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#fb923c] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#fb923c]">Focus Tracker</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Pomodoro timer synced across devices. Logs every session by subject. Weekly visual summary of exactly where your time went.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Pomodoro</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Cross-device sync</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Weekly chart</span>
                </div>
              </div>

              {/* Feature 7 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#a78bfa] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#a78bfa]">Personal Analytics</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Daily energy and sleep logs. Productivity score calculated from your real activity. Monthly charts built from your own data — no third-party tracking.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Productivity score</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Monthly charts</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Sleep log</span>
                </div>
              </div>

              {/* Feature 8 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f87171] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#f87171]">Personal Vault</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">AES-256 encrypted notes for passwords, IDs, and sensitive data. Password-locked. Never synced to any cloud. Local device only. Full JSON export anytime.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">AES-256</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Local only</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">JSON export</span>
                </div>
              </div>

              {/* Feature 9 */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#34d399] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#34d399]">Claw AI Assistant</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Knows your notes, clips, and stats — but only when you ask. No background monitoring. One hotkey away. On-demand, not always watching.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">On-demand only</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Hotkey trigger</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Context-aware</span>
                </div>
              </div>

              {/* Feature 10 (Competitor Research) */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#60a5fa] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#60a5fa]">AI Agent & Automation Setup</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">Custom AI agents and business automation. I setup OpenClaw, n8n workflows, Make.com automations, and custom AI chatbots tailored to your data. A robust alternative to Zapier.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">n8n / Make.com</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">OpenClaw</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Zapier Alt</span>
                </div>
              </div>

              {/* Feature 11 (Competitor Research) */}
              <div className="bg-[#0e0d0b] border border-[#3a3630] p-6 rounded-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-[4px] hover:border-[#5a5348] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e879f9] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                <div className="w-9 h-9 bg-[#1e1c18] border border-[#3a3630] rounded flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                </div>
                <div className="font-mono text-[13px] font-bold tracking-[0.05em] mb-2 text-[#e879f9]">Custom E-commerce Features</div>
                <div className="text-[13px] text-[#a89f92] leading-[1.6]">I build AI chatbots for Shopify, custom loyalty systems, robust inventory trackers, and bespoke product recommendation engines for your store.</div>
                <div className="flex flex-wrap gap-1 mt-3.5">
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">AI Chatbot</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Loyalty system</span>
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-[7px] py-[3px] bg-[#1e1c18] border border-[#3a3630] rounded-sm text-[#6b6358]">Inventory Tracker</span>
                </div>
              </div>

            </div>

            {/* Mobile/Tablet Video Section (Hidden on Desktop) */}
            <div className="lg:hidden mt-16 text-center">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">Live Demo</p>
              <h3 className="font-mono text-[clamp(24px,4vw,32px)] font-bold text-[#f0ece4] mb-8">See it in action</h3>

              <div className="max-w-[340px] mx-auto bg-[#0e0d0b] border-[8px] border-[#1e1c18] rounded-[36px] overflow-hidden nes-raised relative" style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}>
                {/* iPhone style notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1e1c18] rounded-b-[16px] z-10 flex items-center justify-center">
                  <div className="w-12 h-1.5 bg-[#3a3630] rounded-full"></div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '0px', paddingBottom: '177.778%' }}>
                  <iframe
                    allow="fullscreen"
                    allowFullScreen
                    loading="lazy"
                    src="https://streamable.com/e/7g09lx?muted=1"
                    style={{ border: 'none', width: '100%', height: '100%', position: 'absolute', left: '0px', top: '0px', overflow: 'hidden' }}
                  ></iframe>
                </div>
              </div>
            </div>

          </div>
        </section>

        <hr className="divider" />

        {/* HOW IT WORKS */}
        <section id="how" className="py-[96px] px-6">
          <div className="max-w-[1100px] mx-auto">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">How it works</p>
            <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-4">You describe it.<br />I build it.</h2>
            <p className="text-[17px] font-light text-[#a89f92] max-w-[520px] leading-[1.75]">NEXUS is a custom productivity system built by Md. Mokammel Morshed, developer from Bangladesh. This is a custom setup service — not a SaaS subscription. You get a system built and configured specifically for you.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[1px] mt-14 bg-[#3a3630] border border-[#3a3630] rounded-lg overflow-hidden">
              <div className="bg-[#0e0d0b] p-9 relative">
                <span className="block font-mono text-[48px] font-bold text-[#3a3630] leading-none mb-4">01</span>
                <h3 className="font-mono text-[14px] font-bold text-[#f5a623] mb-2.5 tracking-[0.05em] uppercase">You reach out</h3>
                <p className="text-[13px] text-[#a89f92] leading-[1.65]">Send me an email describing your devices, workflow, and what you want. We figure out the exact setup that works for you. <strong className="text-[#f0ece4] block mt-1">Timeline: 1-2 Days</strong></p>
              </div>
              <div className="bg-[#0e0d0b] p-9 relative">
                <span className="block font-mono text-[48px] font-bold text-[#3a3630] leading-none mb-4">02</span>
                <h3 className="font-mono text-[14px] font-bold text-[#f5a623] mb-2.5 tracking-[0.05em] uppercase">I build & configure</h3>
                <p className="text-[13px] text-[#a89f92] leading-[1.65]">I set up the full stack — Supabase, Google Drive integration, web dashboard, mobile app — tuned to your requirements. <strong className="text-[#f0ece4] block mt-1">Timeline: 1-2 Weeks</strong></p>
              </div>
              <div className="bg-[#0e0d0b] p-9 relative">
                <span className="block font-mono text-[48px] font-bold text-[#3a3630] leading-none mb-4">03</span>
                <h3 className="font-mono text-[14px] font-bold text-[#f5a623] mb-2.5 tracking-[0.05em] uppercase">You get the keys</h3>
                <p className="text-[13px] text-[#a89f92] leading-[1.65]">Your system, your accounts, your data. Full source code. You're never dependent on me to keep it running. <strong className="text-[#f0ece4] block mt-1">Delivery Day</strong></p>
              </div>
              <div className="bg-[#0e0d0b] p-9 relative">
                <span className="block font-mono text-[48px] font-bold text-[#3a3630] leading-none mb-4">04</span>
                <h3 className="font-mono text-[14px] font-bold text-[#f5a623] mb-2.5 tracking-[0.05em] uppercase">Ongoing if needed</h3>
                <p className="text-[13px] text-[#a89f92] leading-[1.65]">Need a new feature or a fix? I'm available. But the system is designed to run independently without any ongoing fees.</p>
              </div>
            </div>

            <div className="mt-16 max-w-[600px] mx-auto text-center border border-[#3a3630] p-6 rounded-lg bg-[#161410] nes-raised">
              <h3 className="font-mono text-[14px] font-bold text-[#f87171] mb-4 uppercase tracking-[0.05em]">What I will NOT do:</h3>
              <ul className="text-[14px] text-[#a89f92] text-left space-y-3 inline-block">
                <li className="flex items-center gap-3"><span className="text-[#f87171]">×</span> I don't use no-code tools for this.</li>
                <li className="flex items-center gap-3"><span className="text-[#f87171]">×</span> I don't use generic templates.</li>
                <li className="flex items-center gap-3"><span className="text-[#f87171]">×</span> I don't outsource my work.</li>
                <li className="flex items-center gap-3"><span className="text-[#f87171]">×</span> You talk directly to me.</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* FAQ */}
        <section id="faq" className="py-[96px] px-6">
          <div className="max-w-[800px] mx-auto">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3 text-center">Questions</p>
            <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-12 text-center">Frequently Asked</h2>

            <div className="space-y-4">
              <div className="bg-[#161410] border border-[#3a3630] p-6 rounded-lg transition-colors hover:bg-[#1e1c18]">
                <h3 className="font-mono font-bold text-[#f0ece4] mb-2">Will I get the source code?</h3>
                <p className="text-[#a89f92] text-[15px]">Yes, everything. You get the full Next.js/React codebase and Supabase SQL schema so you fully own it.</p>
              </div>

              <div className="bg-[#161410] border border-[#3a3630] p-6 rounded-lg transition-colors hover:bg-[#1e1c18]">
                <h3 className="font-mono font-bold text-[#f0ece4] mb-2">Will the system run without you?</h3>
                <p className="text-[#a89f92] text-[15px]">Yes. It runs entirely on your personal Vercel/Supabase and Google Drive accounts. It is entirely self-hosted.</p>
              </div>

              <div className="bg-[#161410] border border-[#3a3630] p-6 rounded-lg transition-colors hover:bg-[#1e1c18]">
                <h3 className="font-mono font-bold text-[#f0ece4] mb-2">Who handles maintenance?</h3>
                <p className="text-[#a89f92] text-[15px]">I build it to run flawlessly without maintenance. If you want new features later, you can hire me or any other developer since you have the source code.</p>
              </div>

              <div className="bg-[#161410] border border-[#3a3630] p-6 rounded-lg transition-colors hover:bg-[#1e1c18]">
                <h3 className="font-mono font-bold text-[#f0ece4] mb-2">What if my budget is low?</h3>
                <p className="text-[#a89f92] text-[15px]">Pricing depends heavily on which modules you want (e.g., only Notes, or only AI agent). Send me an email and we can figure out a package that fits.</p>
              </div>

              <div className="bg-[#161410] border border-[#3a3630] p-6 rounded-lg transition-colors hover:bg-[#1e1c18]">
                <h3 className="font-mono font-bold text-[#f0ece4] mb-2">I'm not tech-savvy, will this work for me?</h3>
                <p className="text-[#a89f92] text-[15px]">Absolutely. I will handle the complete setup from start to finish. You just login and use the product.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* STACK */}
        <section id="stack" className="py-[96px] px-6 bg-[#161410]">
          <div className="max-w-[1100px] mx-auto">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">Tech stack</p>
            <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-4">Built on solid foundations.</h2>
            <p className="text-[17px] font-light text-[#a89f92] max-w-[520px] leading-[1.75]">Every tool chosen for reliability, zero vendor lock-in, and long-term maintainability.</p>

            <div className="flex flex-wrap gap-2 mt-10">
              {['Next.js 14', 'React Native / Expo', 'Electron', 'Supabase', 'Google Drive API', 'Gemini AI', 'Tailwind CSS', 'Zustand', 'Recharts', 'Tesseract.js', 'Web Crypto API', 'WebSocket'].map(tech => (
                <span key={tech} className="font-mono text-[11px] font-bold tracking-[0.08em] px-3.5 py-2 bg-[#0e0d0b] border border-[#3a3630] rounded text-[#a89f92] nes-raised transition-all duration-150 hover:text-[#f0ece4] hover:border-[#5a5348] hover:-translate-y-px">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* CONTACT */}
        <section id="contact" className="py-[96px] px-6 text-center relative overflow-hidden contact-glow">
          <div className="max-w-[1100px] mx-auto relative z-10">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6b6358] mb-3">Get in touch</p>
            <h2 className="font-mono text-[clamp(28px,4vw,42px)] font-bold leading-[1.15] mb-4">Interested?<br />Let's talk.</h2>
            <p className="text-[17px] font-light text-[#a89f92] max-w-[520px] mx-auto leading-[1.75]">Pricing depends on scope and customisation. Send me a message describing your setup and what you need — I'll get back to you.</p>

            <div className="max-w-[560px] mx-auto mt-12 bg-[#161410] border border-[#3a3630] rounded-lg overflow-hidden nes-raised">
              <div className="bg-[#f5a623] px-5 py-2.5 flex items-center gap-2 border-b-2 border-[#c4851c]">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-black/20"></div>
                </div>
                <span className="font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-[#0e0d0b]">Contact</span>
              </div>
              <div className="p-8 text-left">
                {sendStatus === 'success' ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-[#1e1c18] border-2 border-[#34d399] rounded-full flex items-center justify-center mx-auto mb-4 text-[#34d399]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="font-mono text-[#f0ece4] font-bold text-lg mb-2">Message Sent</h3>
                    <p className="text-[#a89f92] text-sm">I'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                    <p className="text-[14px] text-[#a89f92] mb-2 leading-[1.7]">Describe your setup, your current workflow, and which modules interest you most.</p>
                    
                    <input 
                      type="email" 
                      required 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Your email address" 
                      className="bg-[#1e1c18] border border-[#3a3630] px-4 py-3 rounded text-[#f0ece4] font-mono text-[13px] focus:outline-none focus:border-[#f5a623] transition-colors placeholder:text-[#6b6358]"
                    />
                    
                    <textarea 
                      required 
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="I'm interested in..." 
                      rows={4} 
                      className="bg-[#1e1c18] border border-[#3a3630] px-4 py-3 rounded text-[#f0ece4] font-mono text-[13px] focus:outline-none focus:border-[#f5a623] transition-colors placeholder:text-[#6b6358] resize-none"
                    ></textarea>
                    
                    {sendStatus === 'error' && (
                      <p className="text-[#f87171] text-[12px] font-mono text-center">Failed to send. Please ensure EMAIL_APP_PASSWORD is set.</p>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="font-mono text-[13px] font-bold tracking-[0.1em] uppercase text-[#0e0d0b] bg-[#f5a623] border-2 border-[#c4851c] px-6 py-3.5 mt-2 rounded nes-raised transition-all hover:bg-[#f7b84a] active:translate-y-[1px] disabled:opacity-50 disabled:active:translate-y-0"
                    >
                      {isSending ? 'Sending...' : 'Send Message'}
                    </button>
                    
                    <p className="text-[11px] text-[#6b6358] mt-2 italic text-center">Pricing is discussed over email after understanding your requirements.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 border-t border-[#3a3630] flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="NEXUS" className="h-10 w-auto object-contain invert opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-mono text-[12px] text-[#6b6358] tracking-[0.05em] max-w-[280px] leading-relaxed">
              Personal productivity system. Custom-built by Md. Mokammel Morshed, developer from Bangladesh.
              <br />&copy; {new Date().getFullYear()} All rights reserved.
            </div>
          </div>

          <div className="flex flex-col gap-3 font-mono text-[12px] text-[#6b6358] tracking-[0.05em]">
            <a href="https://meheran.dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a623] transition-colors">Built by Md. Mokammel Morshed → meheran.dev</a>
            <a href="https://udyomxorg.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a623] transition-colors">Projects → udyomxorg.vercel.app</a>
            <a href="https://github.com/MkMeheran" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a623] transition-colors">GitHub → github.com/MkMeheran</a>
            <a href="https://linkedin.com/in/mokammel-morshed-59108a366" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5a623] transition-colors">LinkedIn → linkedin.com/in/mokammel-morshed-59108a366</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
