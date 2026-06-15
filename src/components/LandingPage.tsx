import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, ShieldAlert, Cpu, Award, Users, HeartPulse, 
  Map, MessageSquarePlus, Milestone, HelpCircle, PhoneCall, Mail, ArrowRight 
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: () => void;
}

export default function LandingPage({ onEnterPlatform }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/15 via-cyan-950/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 -right-64 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-cyan-950/50 backdrop-blur-md bg-slate-950/80 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-sans font-bold tracking-wider text-xl bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                CARESYNC <span className="text-cyan-400 font-extrabold text-2xl">AI+</span>
              </span>
            </div>
          </div>
          <button 
            id="lnd-btn-join"
            onClick={onEnterPlatform}
            className="relative overflow-hidden group bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center space-x-2"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 py-1.5 px-3 bg-cyan-900/40 border border-cyan-800/60 rounded-full text-cyan-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
            <HeartPulse className="h-3.5 w-3.5" />
            <span>Next-Gen Response Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Predict. Prioritize.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Save Critical Lives.
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-xl">
            CARESYNC AI+ is an advanced, production-scale Critical Patient Monitoring & Decision-Support system. It empowers hospital ICUs with automated deterioration forecasts, real-time clinical triage, and interactive medical copilot recommendations.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              id="hero-launch-btn"
              onClick={onEnterPlatform}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-base font-extrabold rounded-2xl shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.55)] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <span>Enter Clinical Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#features-sec"
              className="px-8 py-4 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-white rounded-2xl transition-all duration-300 text-base font-semibold flex items-center justify-center"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Futuristic Illustration & Visualizer container */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="absolute -inset-0 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
          
          <div className="relative w-full max-w-[400px] aspect-square rounded-3xl bg-slate-900/60 border border-cyan-500/25 p-8 backdrop-blur-md shadow-[0_10px_50px_rgba(6,182,212,0.15)] flex flex-col justify-between overflow-hidden group">
            {/* HUD Scanline */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 animate-bounce" />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-cyan-400 font-mono tracking-widest">SYSTEM MONITORING</p>
                <h4 className="text-lg font-bold text-white">ICU UNIT 4-A</h4>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-mono tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                AI ACTIVE
              </span>
            </div>

            {/* Simulated Live Heart Waveform */}
            <div className="my-6 relative py-4 border-y border-cyan-950/60">
              <svg viewBox="0 0 300 80" className="w-full h-24 stroke-cyan-400 stroke-[2.5] fill-none">
                <path d="M 0,40 L 30,40 L 40,25 L 45,55 L 50,40 L 90,40 L 98,10 L 106,70 L 114,40 L 140,40 L 148,45 L 153,35 L 158,40 L 210,40 L 218,5 L 226,75 L 234,40 L 270,40 L 280,30 L 285,50 L 290,40 L 300,40" />
              </svg>
              <div className="absolute top-1 right-2 text-[10px] font-mono text-cyan-400/60">BP: 118/75</div>
            </div>

            {/* Tech stats on widget card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Predictive Index</p>
                <p className="text-xl font-bold text-cyan-400">98.4%</p>
              </div>
              <div className="bg-slate-950/50 border border-slate-800/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Telemetry Latency</p>
                <p className="text-xl font-bold text-cyan-400">0.02s</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics */}
      <section className="bg-slate-900/50 border-y border-slate-900 px-6 py-12 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-cyan-950/50 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">1,240 +</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Critical Beds Monitored Daily</p>
          </div>
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-cyan-950/50 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">842</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Potential Code Blues Averted</p>
          </div>
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-cyan-950/50 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">96.8 %</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">AI Early Warning Accuracy</p>
          </div>
          <div className="bg-slate-950/40 p-6 rounded-2xl border border-cyan-950/50 text-center flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">&lt; 15m</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Response Notification Time</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-sec" className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Advanced System Architecture</h2>
          <p className="text-slate-400">
            Engineered with deep learning heuristics that track real-time systemic vital anomalies to catch patient deterioration hours before threshold alarms sound.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Automated Risk Prioritizer</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dynamically ranks patients on a unified Priority Queue using risk metrics that merge age, vital trends, and shock indexes, giving ICU physicians clear clinical triage guidance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Code Blue Prognostics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Provides constant predictive oversight targeting acute respiratory arrests or cardiac arrests, returning high-confidence alarm estimations and explicit suggested drug interventions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <Map className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Room Health Heatmaps</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visualizes actual floor plans or room layouts indicating stable, high risk, and critical statuses. Enhances overall situational awareness for nursing charge shifts at a single glance.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <MessageSquarePlus className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Medical Copilot</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Contains a highly capable natural language assistant trained to break down complex clinical indicators, describe why a patient is critical, and output clinical treatment steps.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="Patient Digital Twin">Digital Patient Twins</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Each clinical patient profile aggregates continuous historical vitals charts, predictive deterioration trajectories, and automated family communication summaries.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-5">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ICU Resource Intelligence</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Evaluates bed limits across sub-specialties, lists active intensivist staff levels, and highlights smart inter-unit patients transfers based on severity of disease indexes.
            </p>
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="bg-slate-900/30 border-y border-slate-900/60 py-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 py-1 px-3 bg-indigo-900/40 border border-indigo-800/60 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Milestone className="h-3 w-3" />
              <span>CARESYNC Roadmap</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Next Horizons & AI Safety</h2>
            <p className="text-slate-400 leading-relaxed">
              Our ultimate objective is a closed-loop critical care framework. We are actively conducting laboratory studies focused on federated patient learning models, multi-modal clinical telemetry integration, and zero-bias ethical decision structures.
            </p>
            <ul className="space-y-3">
              {[
                "Generative EHR transcription integrated with bedside voice capture",
                "Wearable telemetry integration supporting ambulatory continuous monitoring",
                "Federated cross-hospital anonymized anomaly mapping models",
                "Clinically safe, FDA-aligned explainable algorithmic frameworks"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                  <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-tr from-slate-900 to-slate-950 p-[1px] rounded-3xl border border-slate-800/80">
            <div className="bg-slate-950/80 p-8 rounded-3xl space-y-6">
              <h4 className="text-white font-bold text-lg">Platform Accuracy Milestone</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>SEPSIS DETECTION (6H ADVANCE)</span>
                    <span className="text-cyan-400">97.2%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full" style={{ width: '97.2%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>ACUTE RESPIRATORY EVENT EXPECTANCY</span>
                    <span className="text-cyan-400">94.8%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full" style={{ width: '94.8%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Resource Allocation Efficiency Index</span>
                    <span className="text-cyan-400">89.4%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full" style={{ width: '89.4%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Intelligent Clinical Minds</h2>
          <p className="text-slate-400">
            Designed and supervised by an expert taskforce of machine learning experts, clinical cardiologists, and ICU nursing directors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Evelyn Carter",
              role: "Chief Clinical Officer",
              cert: "MD, Board-Certified Intensivist",
              bg: "Formerly ICU Director at Mayo Clinic"
            },
            {
              name: "Prof. Kenneth Zhao",
              role: "Director of Medical AI",
              cert: "PhD, Biomedical Informatics",
              bg: "Lead Author on Explainable Deep Clinical Forecasts"
            },
            {
              name: "Nicolette Finch, MSN",
              role: "EHR Integration Director",
              cert: "RN, Critical Care Informatics",
              bg: "12+ Years Supervising High-Acuity ICU Nursing Staff"
            }
          ].map((member, i) => (
            <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 text-center space-y-3">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl font-bold">
                {member.name.split(' ').slice(1).join(' ')[0] || 'M'}
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{member.name}</h4>
                <p className="text-cyan-400 text-xs font-mono">{member.role}</p>
                <p className="text-slate-400 text-xs mt-1 italic">{member.cert}</p>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800/60 pt-3">
                {member.bg}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-900/60 border-t border-slate-900 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white">System Inquiry & Partnerships</h2>
            <p className="text-slate-400">
              Inquire regarding hospital-wide licensing, on-premise HIPAA-compliant model training, or API sandbox credentials. Our team is available for live technology pilot demonstrations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300">
                <HelpCircle className="h-5 w-5 text-cyan-400" />
                <span>Frequently Asked Questions & Docs Portal</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <PhoneCall className="h-5 w-5 text-cyan-400" />
                <span>+1 (800) CARESYNC-AI</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="h-5 w-5 text-cyan-400" />
                <span>clinical-support@caresync.ai</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold mb-4 text-base">Request Demo / Technical Briefing</h4>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("CARESYNC Sandbox Briefing Request Received. A clinical systems engineer will contact you in 24 hours."); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">First Name</label>
                  <input required type="text" className="w-full bg-slate-900 rounded-lg p-2.5 text-xs text-white border border-slate-850 focus:border-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">Hospital Name</label>
                  <input required type="text" className="w-full bg-slate-900 rounded-lg p-2.5 text-xs text-white border border-slate-850 focus:border-cyan-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">Work Email</label>
                <input required type="email" placeholder="you@hospital.org" className="w-full bg-slate-900 rounded-lg p-2.5 text-xs text-white border border-slate-850 focus:border-cyan-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-mono">Message / Clinical Use-Case</label>
                <textarea rows={2} placeholder="Explain your monitoring requirements..." className="w-full bg-slate-900 rounded-lg p-2.5 text-xs text-white border border-slate-850 focus:border-cyan-500 focus:outline-none resize-none" />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 rounded-xl hover:bg-cyan-400 transition-all text-xs tracking-wider uppercase"
              >
                Submit Demo Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-cyan-950/40 bg-slate-950 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs">
          <p>© 2026 CARESYNC AI+ Technologies Corp. Under Clinical Testing Protocols. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 tracking-wider">SECURE HIPAA-COMPLIANT AES-256 PIPELINES</p>
        </div>
      </footer>
    </div>
  );
}
