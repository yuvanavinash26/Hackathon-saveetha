import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Users, Bell, Sparkles, Settings as SettingsIcon, Map, 
  ChevronRight, LogOut, Info, ShieldAlert, Cpu, Orbit, Sliders, Play, Move
} from 'lucide-react';

interface DynamicIslandNavProps {
  activeTab: 'dashboard' | 'patients' | 'twinMap' | 'alerts' | 'analytics' | 'copilot' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'patients' | 'twinMap' | 'alerts' | 'analytics' | 'copilot' | 'settings') => void;
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
  setIsOnPlatform: (onPlatform: boolean) => void;
  totalPatientsCount: number;
  criticalCount: number;
  hospitalStress: number;
  alertsCount: number;
}

export default function DynamicIslandNav({
  activeTab,
  setActiveTab,
  isNavOpen,
  setIsNavOpen,
  setIsOnPlatform,
  totalPatientsCount,
  criticalCount,
  hospitalStress,
  alertsCount
}: DynamicIslandNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  interface TabConfig {
    readonly id: 'dashboard' | 'patients' | 'twinMap' | 'alerts' | 'analytics' | 'copilot' | 'settings';
    readonly label: string;
    readonly desc: string;
    readonly icon: React.ComponentType<any>;
    readonly color: string;
    readonly badge?: number;
  }

  // Tabs configured with neat descriptions for the premium card layout
  const navigationTabs: TabConfig[] = [
    { 
      id: 'dashboard', 
      label: 'Triage Center', 
      desc: 'Live beds and workflow monitor', 
      icon: Activity, 
      color: 'text-red-600 bg-red-50 border-red-105' 
    },
    { 
      id: 'patients', 
      label: 'Patients Database', 
      desc: `Track cohort records (${totalPatientsCount})`, 
      icon: Users, 
      color: 'text-red-700 bg-red-50 border-red-200' 
    },
    { 
      id: 'twinMap', 
      label: 'Digital Twin Sim', 
      desc: 'Interactive spatial flow simulation', 
      icon: Map, 
      color: 'text-rose-600 bg-rose-50 border-rose-100' 
    },
    { 
      id: 'alerts', 
      label: 'Alerts Center', 
      desc: `${alertsCount} pending active telemetry flags`, 
      icon: Bell, 
      color: 'text-red-600 bg-red-50 border-red-105',
      badge: alertsCount 
    },
    { 
      id: 'analytics', 
      label: 'Insights Ledger', 
      desc: 'Prognostic deterioration charts', 
      icon: Orbit, 
      color: 'text-rose-600 bg-rose-50 border-rose-100' 
    },
    { 
      id: 'copilot', 
      label: 'AI Copilot Chat', 
      desc: 'Continuous context assistant', 
      icon: Sparkles, 
      color: 'text-red-650 bg-red-50 border-red-105' 
    },
    { 
      id: 'settings', 
      label: 'System Config', 
      desc: 'Adjust alert parameters & audio limits', 
      icon: SettingsIcon, 
      color: 'text-slate-600 bg-slate-100 border-slate-200' 
    },
  ];

  const handleIslandClick = (e: React.MouseEvent) => {
    // If we click the pill while closed, open it!
    if (!isNavOpen) {
      setIsNavOpen(true);
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col items-end bg-transparent pointer-events-none max-w-[95vw]"
      id="caresync-dynamic-island-container"
    >
      {/* Outer bounds holder with Hover action: opens on mouse enter, collapses instantly on mouse leave */}
      <motion.div
        ref={containerRef}
        layout
        onTouchStart={() => {
          if (!isNavOpen) setIsNavOpen(true);
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!isNavOpen) {
            setIsNavOpen(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isNavOpen) {
            setIsNavOpen(false);
          }
        }}
        onClick={handleIslandClick}
        className={`pointer-events-auto select-none transition-shadow ${
          isNavOpen 
            ? 'w-[400px] max-w-[92vw] p-5 rounded-2xl shadow-2xl border border-red-100/90 bg-white/95 backdrop-blur-xl' 
            : 'w-[360px] h-[52px] px-4 rounded-full border border-red-200/60 bg-white/90 backdrop-blur-md hover:border-red-400/80 cursor-pointer shadow-md'
        } flex flex-col justify-center items-center`}
        id="caresync-dynamic-island-main-pill"
        style={{
          boxShadow: isNavOpen 
            ? '0 20px 45px -12px rgba(220, 38, 38, 0.12), 0 0 0 1px rgba(220, 38, 38, 0.05)' 
            : '0 8px 24px -10px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(220, 38, 38, 0.05)',
          cursor: isNavOpen ? 'default' : 'pointer'
        }}
      >
        <AnimatePresence mode="wait">
          {!isNavOpen ? (
            /* COLLAPSED SINGLE SIDE NOTCH PILL: Displays active state in top-corner */
            <motion.div 
              key="collapsed-island"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex items-center justify-between font-sans h-full"
            >
              {/* Left Side Status Light + Brand */}
              <div className="flex items-center space-x-2 shrink-0">
                <div className="relative">
                  <span className="absolute -inset-1 rounded-full bg-red-400/40 animate-ping" />
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-[11px] tracking-widest text-slate-900 leading-tight">
                    CARE<span className="text-red-650">SYNC</span>
                  </span>
                  <span className="text-[6.5px] font-mono text-red-600/75 block tracking-widest leading-none">ACTIVE HUD</span>
                </div>
              </div>

              {/* Center status and active track indicator */}
              <div className="text-[10px] text-slate-700 flex items-center space-x-1.5 overflow-hidden truncate px-1 max-w-[150px]">
                <span className="text-slate-300 font-bold shrink-0">|</span>
                <span className="text-red-650 text-[8.5px] font-mono tracking-wider font-extrabold px-1 rounded bg-red-50 border border-red-100 uppercase shrink-0">
                  {activeTab === 'dashboard' ? 'Triage' :
                   activeTab === 'patients' ? 'Cohort' :
                   activeTab === 'twinMap' ? 'Sim' :
                   activeTab === 'alerts' ? 'Alerts' :
                   activeTab === 'analytics' ? 'Insights' :
                   activeTab === 'copilot' ? 'Copilot' : 'Config'}
                </span>
              </div>

              {/* Right indicators & Hover instruction cues */}
              <div className="flex items-center space-x-2 shrink-0 text-slate-650">
                {criticalCount > 0 ? (
                  <div className="flex items-center space-x-1 font-mono text-[8.5px] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-rose-600 font-extrabold animate-pulse">
                    <span>CRIT: {criticalCount}</span>
                  </div>
                ) : (
                  <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                    SAFE
                  </span>
                )}
                
                {/* Visual arrow indicator cue to slide down list */}
                <span className="text-[9px] font-mono text-slate-400">Hover</span>
              </div>
            </motion.div>
          ) : (
            /* EXPANDED STACKED LIST VIEW: Elements load in vertically one-by-one */
            <motion.div
              key="expanded-island"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col gap-3.5 text-slate-800"
              onClick={(e) => {
                // Prevent collapsing when clicking inside the panel
                e.stopPropagation();
              }}
            >
              {/* Corner Header */}
              <div className="flex items-center justify-between border-b border-red-50 pb-2.5 w-full">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-tr from-red-600 to-rose-600 p-1.5 rounded-lg text-white shadow-sm">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold tracking-tight text-xs text-slate-905">
                      CARESYNC <span className="text-red-650 font-black">AI+</span>
                    </h2>
                    <span className="text-[8px] text-slate-400 font-mono tracking-wider block font-bold">CLINICAL OPERATIONAL RAIL</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[8.5px] font-mono">
                  <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-205 text-slate-600 rounded">
                    STRESS: <strong className="text-red-650">{hospitalStress}%</strong>
                  </span>
                </div>
              </div>

              {/* Sequential / Staggered Dropdown List container */}
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                <span className="block text-[8px] font-mono tracking-widest text-slate-400 uppercase">Available Hub Workspaces:</span>
                
                <motion.div 
                  className="space-y-1.5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {navigationTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <motion.button
                        key={tab.id}
                        id={`tab-btn-${tab.id}`}
                        variants={{
                          hidden: { opacity: 0, x: 25 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                          isActive 
                            ? 'bg-gradient-to-r from-red-50 to-rose-50/40 border-red-400 text-slate-900 shadow-xs' 
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-red-300 text-slate-800'
                        } cursor-pointer group`}
                      >
                        <div className={`p-1.5 rounded-lg border shrink-0 ${tab.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11.5px] font-bold tracking-tight text-slate-900 group-hover:text-red-655 truncate">
                              {tab.label}
                            </span>
                            
                            {/* Visual pill badges for tabs */}
                            {tab.badge !== undefined && tab.badge > 0 ? (
                              <span className="h-4 min-w-[16px] px-1 rounded-full text-[8.5px] font-mono font-black bg-red-500 text-white flex items-center justify-center animate-pulse">
                                {tab.badge}
                              </span>
                            ) : isActive ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            ) : null}
                          </div>
                          <p className="text-[8.5px] text-slate-440 truncate mt-0.5 leading-none">
                            {tab.desc}
                          </p>
                        </div>
                      </motion.button>
                     );
                  })}
                </motion.div>
              </div>

              {/* Bottom handle strip for closing with swipe drag cues */}
              <div className="flex items-center justify-between pt-2 border-t border-red-50 text-[9.5px]">
                <div className="flex items-center space-x-1.5 text-slate-450 font-mono text-[8px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                  <span>WIDESCREEN EHR TRANSMITTING</span>
                </div>

                <button
                  onClick={() => setIsNavOpen(false)}
                  className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[9px] font-bold font-mono rounded-full cursor-pointer uppercase tracking-wider transition-all border border-slate-200"
                >
                  <span>Collapse Menu</span>
                  <ChevronRight className="h-3 w-3 transform -rotate-90 text-red-500" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
