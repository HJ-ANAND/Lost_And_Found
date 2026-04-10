import React, { useState, useEffect } from "react";

const API_KEY = "PUT_YOUR_API_KEY"; // Ensure the user's backend handles this securely in prod

function Home() {
  const [formType, setFormType] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (description) console.log("Description updated:", description);
  }, [description]);

  const generateDescription = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Rewrite this into a proper, clear, and detailed ${formType} item description. Don't include formatting like markdown: ` + description }] }],
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("API Error:", data);
        return;
      }
      if (data.candidates?.length > 0)
        setDescription(data.candidates[0].content.parts[0].text);
      else alert("Failed to generate description.");
    } catch (e) {
      alert("Error generating description.");
    } finally {
      setLoading(false);
    }
  };

  const generateTitle = async () => {
    if (!description.trim()) {
      alert("Please write a description first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate a short, catchy, and clean title (max 6-8 words) for this ${formType} item description. Provide only the title, no quotes or extra text: ` + description }] }],
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("API Error:", data);
        return;
      }
      if (data.candidates?.length > 0)
        setTitle(data.candidates[0].content.parts[0].text);
      else alert("Failed to generate title.");
    } catch (e) {
      alert("Error generating title.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative font-sans text-slate-200 overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════
          HERO SECTION - PREMIUM DARK W3GRADS STYLE
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex items-center overflow-visible">
        {/* Background watermark text */}
        <span
          className="pointer-events-none select-none absolute font-black text-white/[0.015] leading-none tracking-tighter hidden lg:block"
          style={{ fontSize: "14rem", top: "5%", left: "-2%" }}
        >
          LOST
        </span>
        <span
          className="pointer-events-none select-none absolute font-black text-white/[0.015] leading-none tracking-tighter hidden lg:block"
          style={{
            fontSize: "14rem",
            bottom: "0%",
            right: "-2%",
          }}
        >
          FOUND
        </span>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 xl:px-12 flex flex-col lg:flex-row items-center border-[0px] border-red-500">
          
          {/* ── LEFT: Hero copy ── */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center pt-28 lg:pt-0 pb-16 lg:pb-0 shrink-0 lg:pr-10 z-20">
            {/* Animated Pill Badge */}
            <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-8 self-start shadow-[0_0_15px_rgba(45,212,191,0.15)] group hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300 tracking-wide group-hover:text-white transition-colors">
                AI-Powered Item Recovery
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-[1.1] mb-6 text-[3.5rem] lg:text-[4.5rem] drop-shadow-sm">
              Find What's <br />
              <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent text-glow">Lost.</span> Faster.
            </h1>

            <p className="text-lg text-slate-400 max-w-[480px] mb-10 leading-relaxed font-light">
              Experience the next generation of recovery. Our intelligent platform connects lost belongings with their owners securely and instantly.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => setFormType('lost')} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-full group bg-gradient-to-br from-teal-400 to-indigo-600 group-hover:from-teal-400 group-hover:to-indigo-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-teal-800 transition-all shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-1">
                <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-transparent rounded-full font-bold text-[16px] tracking-wide">
                  Report Lost 
                </span>
              </button>
              
              <button onClick={() => setFormType('found')} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-slate-300 rounded-full group bg-gradient-to-br from-slate-700 to-slate-800 group-hover:from-slate-600 group-hover:to-slate-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-slate-800 transition-all hover:-translate-y-1">
                <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-[#0a0f1c]/80 rounded-full font-bold text-[16px] tracking-wide group-hover:bg-opacity-0">
                  Report Found
                </span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl tracking-tight">96%</span>
                <span className="text-slate-500 text-sm font-medium">Match Rate</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl tracking-tight">12k+</span>
                <span className="text-slate-500 text-sm font-medium">Items Found</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl tracking-tight">&lt; 2hr</span>
                <span className="text-slate-500 text-sm font-medium">Avg. Recovery</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Abstract 3D Floating UI Elements ── */}
          <div className="hidden lg:flex relative flex-1 h-screen items-center justify-center z-10 perspective-[1000px]">
            {/* Main Center Image */}
            <div className="relative w-[340px] h-[460px] rounded-3xl glass-card p-4 animate-float border-[rgba(255,255,255,0.1)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-10deg) rotateX(5deg)' }}>
              <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent z-10 opacity-80 mix-blend-multiply"></div>
                <img src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=600&auto=format&fit=crop" alt="Premium Key" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-3 inline-block">Matched</span>
                  <h3 className="text-white font-bold text-xl drop-shadow-md">Car Keys</h3>
                  <p className="text-slate-300 text-sm font-medium flex items-center gap-1 mt-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg> Downtown Cafe</p>
                </div>
              </div>
            </div>

            {/* Top Left Floating Widget */}
            <div className="absolute top-[20%] left-[5%] glass-card p-4 rounded-2xl animate-float-slow z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Real-time Tracking</p>
                <p className="text-slate-400 text-xs">Updated 2 mins ago</p>
              </div>
            </div>

            {/* Bottom Right Floating Widget */}
            <div className="absolute bottom-[20%] right-[5%] glass-card p-4 rounded-2xl animate-float-delayed z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <p className="text-slate-300 text-xs font-semibold mb-2 uppercase tracking-widest">AI Confidence</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">98%</span>
                <span className="text-teal-400 text-sm font-bold mb-1 border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 rounded">High</span>
              </div>
            </div>
            
            {/* Secondary Image Card */}
            <div className="absolute top-[35%] right-[0%] w-[180px] h-[220px] rounded-2xl glass-card p-2 animate-float-delayed z-10 opacity-80" style={{ transform: 'rotate(15deg)' }}>
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop" alt="Wallet" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-indigo-900/40 mix-blend-overlay"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 xl:px-16 max-w-7xl mx-auto w-full relative z-10 pb-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">Capabilities</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Designed for speed, security, and precision.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 xl:gap-8">
          <div className="glass-card p-8 md:p-10 rounded-3xl hover:bg-white/[0.04] transition-all duration-300 group border border-white/5 hover:border-indigo-500/30">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 mb-8 group-hover:scale-110 transition-transform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-400" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Hyper-Local Mapping</h4>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Pinpoint exact drop locations with our integrated maps. Instantly see lost and found items within a custom radius of your current location.
            </p>
          </div>
          
          <div className="glass-card p-8 md:p-10 rounded-3xl hover:bg-white/[0.04] transition-all duration-300 group border border-white/5 hover:border-teal-500/30 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full group-hover:bg-teal-500/20 transition-colors"></div>
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/20 mb-8 group-hover:scale-110 transition-transform relative z-10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-teal-400" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3 relative z-10">AI Smart Matching</h4>
            <p className="text-slate-400 text-[15px] leading-relaxed relative z-10">
              Powered by advanced NLP models, our system cross-references item descriptions, metadata, and images to automatically suggest high-probability matches.
            </p>
          </div>
          
          <div className="glass-card p-8 md:p-10 rounded-3xl hover:bg-white/[0.04] transition-all duration-300 group border border-white/5 hover:border-purple-500/30">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 mb-8 group-hover:scale-110 transition-transform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Encrypted Messaging</h4>
            <p className="text-slate-400 text-[15px] leading-relaxed">
              Connect securely with the finder. We proxy all communications to ensure your personal contact information remains completely private and safe.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS - VERTICAL TIMELINE
      ══════════════════════════════════════════════════════ */}
      <section className="px-6 xl:px-16 max-w-5xl mx-auto w-full mb-28 relative z-10">
        <div className="glass-card rounded-[40px] p-10 md:p-16 border border-white/[0.05]">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Recovery <span className="font-light italic text-teal-400">Workflow</span>
            </h3>
          </div>
          
          <div className="relative border-l border-white/10 ml-6 md:ml-12 space-y-12 pb-4">
            
            <div className="relative pl-10 md:pl-16 group">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#030712] border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 group-hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">1. Register the Item</h4>
              <p className="text-slate-400 text-lg">Use our AI assistant to generate a precise description of the lost or found object, adding photos for maximum clarity.</p>
            </div>

            <div className="relative pl-10 md:pl-16 group">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#030712] border-2 border-teal-500 flex items-center justify-center group-hover:scale-125 group-hover:bg-teal-500 transition-all shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">2. Algorithmic Scan</h4>
              <p className="text-slate-400 text-lg">Our engine continuously analyzes the database, instantly notifying you if a high-confidence match is detected nearby.</p>
            </div>

            <div className="relative pl-10 md:pl-16 group">
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#030712] border-2 border-purple-500 flex items-center justify-center group-hover:scale-125 group-hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">3. Safe Handover</h4>
              <p className="text-slate-400 text-lg">Initiate a secure chat session to verify ownership and arrange a safe public meeting point for the return.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          AI REPORT MODAL (GLASSMORPHISM)
      ══════════════════════════════════════════════════════ */}
      {formType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl transition-all duration-300">
          <div className="relative w-full max-w-2xl glass-card rounded-[32px] box-border overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-float-slow">
            {/* Modal Glowing Borders */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50"></div>
            
            <div className="p-8 md:p-10 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                    {formType === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
                  </span>
                </h2>
                <button onClick={() => setFormType(null)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-slate-300 mb-3 tracking-wide uppercase">
                    {formType === 'lost' ? 'Description of lost item' : 'Description of found item'}
                  </label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full bg-[#0a0f1c]/80 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 focus:bg-[#0a0f1c] outline-none transition-all resize-none min-h-[140px] text-white placeholder-slate-600 shadow-inner" 
                    placeholder={formType === 'lost' ? "e.g. black leather wallet near the central library yesterday around 4 PM..." : "e.g. found a black leather wallet near the central library today..."} 
                  />
                  <button 
                    onClick={generateDescription} 
                    disabled={loading} 
                    className="mt-4 self-start bg-[#1f2937] border border-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-[#374151] hover:border-white/20 transition-all disabled:opacity-50 flex items-center gap-2 group shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Processing...</span>
                    ) : (
                      <>✨ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 group-hover:from-blue-200 group-hover:to-purple-200">Refine with AI</span></>
                    )}
                  </button>
                </div>

                <div className="flex flex-col pt-3">
                  <label className="text-sm font-bold text-slate-300 mb-3 tracking-wide uppercase">Optimized Title</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="flex-1 bg-[#0a0f1c]/80 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-[#0a0f1c] outline-none transition-all text-white placeholder-slate-600 font-medium text-lg shadow-inner" 
                      placeholder={formType === 'lost' ? "e.g. Lost Black Leather Wallet" : "e.g. Found Black Leather Wallet"} 
                    />
                    <button 
                      onClick={generateTitle} 
                      disabled={loading} 
                      className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-5 py-4 rounded-xl font-bold hover:bg-indigo-500/30 transition-all disabled:opacity-50"
                      title="Auto Generate Title"
                    >
                      {loading ? "..." : "💡 Auto"}
                    </button>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <button className="w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden text-lg font-bold text-white rounded-xl group bg-gradient-to-br from-teal-400 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    <span className="relative px-8 py-4 w-full bg-transparent rounded-xl transition-all">
                      Submit Record to Database
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
