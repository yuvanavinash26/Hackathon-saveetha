import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Bed, Activity, ShieldAlert, AlertCircle, Bell, 
  Sparkles, Search, Sliders, ChevronRight, CheckCircle, Volume2, 
  Settings as SettingsIcon, Info, HeartPulse, LogOut 
} from 'lucide-react';

import { Patient, SimulatedAlert, BedAllocation, PatientStatus } from './types';
import { INITIAL_PATIENTS, INITIAL_ALERTS, BEDS_DATA } from './mockData';

// Component imports
import LandingPage from './components/LandingPage';
import PriorityQueue from './components/PriorityQueue';
import AICopilot from './components/AICopilot';
import PatientTwin from './components/PatientTwin';
import Heatmap from './components/Heatmap';
import Analytics from './components/Analytics';

export default function App() {
  // Navigation & Platform View Toggle
  const [isOnPlatform, setIsOnPlatform] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'alerts' | 'analytics' | 'copilot' | 'settings'>('dashboard');
  
  // Simulated State Database
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<SimulatedAlert[]>(INITIAL_ALERTS);
  const [beds, setBeds] = useState<BedAllocation[]>(BEDS_DATA);
  
  // Search & Filter state for Patients page
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | PatientStatus>('All');
  
  // Selected Patient for Digital Twin Overlay
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Settings Configuration State
  const [alertThresholdHr, setAlertThresholdHr] = useState<number>(115);
  const [alertThresholdSpO2, setAlertThresholdSpO2] = useState<number>(90);
  const [isAudioAlarmsEnabled, setIsAudioAlarmsEnabled] = useState<boolean>(true);
  const [isAutoFamilyUpdate, setIsAutoFamilyUpdate] = useState<boolean>(false);

  // Core Hospital Stress stats
  const [hospitalStress, setHospitalStress] = useState<number>(64);

  // 1. Dynamic Simulation Interval: slightly fluctuates vitals to make the dashboard feel "alive"
  useEffect(() => {
    if (!isOnPlatform) return;

    const interval = setInterval(() => {
      setPatients((prevPatients) => {
        return prevPatients.map((p) => {
          // Slight fluctuation calculations: -1 to +1 standard vitals variance
          const hrDelta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          const spDelta = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const tempDelta = Math.random() > 0.8 ? (Math.random() > 0.5 ? 0.1 : -0.1) : 0;
          
          let newHr = p.heartRate + hrDelta;
          let newSp = p.spO2 + spDelta;
          let newTemp = Math.round((p.temperature + tempDelta) * 10) / 10;

          // Clamping to sensible clinical boundaries
          if (newHr < 40) newHr = 40;
          if (newHr > 150) newHr = 150;
          if (newSp < 80) newSp = 80;
          if (newSp > 100) newSp = 100;
          if (newTemp < 35.5) newTemp = 35.5;
          if (newTemp > 41) newTemp = 41;

          // Recalculating risk core heuristics loosely based on vitals anomalies
          let newRisk = p.riskScore;
          if (newHr > alertThresholdHr || newSp < alertThresholdSpO2) {
            newRisk = Math.min(newRisk + 1, 98);
          } else {
            newRisk = Math.max(newRisk - 1, 10);
          }

          // Trigger dynamic alerts in simulation randomly if conditions worsen
          if (newHr > 125 && p.heartRate <= 125) {
            triggerNewAlert(p.id, p.name, p.roomNumber, 'Cardiac Risk', `Exteme Tachycardia: ${newHr} bpm`, `Assess ECG immediately, pre-alert telemetry specialists`);
          }
          if (newSp < 88 && p.spO2 >= 88) {
            triggerNewAlert(p.id, p.name, p.roomNumber, 'Oxygen Drop', `Severe Hypoxemia: ${newSp}%`, `Configure high flow nasal cannula immediately`);
          }

          // Append updated vitals entry to history timeline
          const historyCopy = [...p.history];
          if (historyCopy.length > 0) {
            const lastEntry = historyCopy[historyCopy.length - 1];
            // Cycle history tracking past 4 hours
            const newHistoryEntry = {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              heartRate: newHr,
              spO2: newSp,
              bloodPressure: p.bloodPressure,
              temperature: newTemp,
              respiratoryRate: p.respiratoryRate,
              riskScore: newRisk
            };
            historyCopy.push(newHistoryEntry);
            if (historyCopy.length > 5) {
              historyCopy.shift();
            }
          }

          return {
            ...p,
            heartRate: newHr,
            spO2: newSp,
            temperature: newTemp,
            riskScore: newRisk,
            history: historyCopy
          };
        });
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isOnPlatform, alertThresholdHr, alertThresholdSpO2]);

  // Helper trigger alerts
  const triggerNewAlert = (
    patientId: string, 
    patientName: string, 
    roomNumber: string, 
    type: any, 
    vitalsValue: string, 
    suggestedResponse: string
  ) => {
    const fresh: SimulatedAlert = {
      id: `alt-new-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      patientId,
      patientName,
      roomNumber,
      type,
      severity: 'Critical',
      vitalsValue,
      suggestedResponse,
      isAcknowledged: false
    };

    setAlerts(prev => [fresh, ...prev]);

    // Optional Audio Notification representation
    if (isAudioAlarmsEnabled) {
      // Small simulated console alert
      console.log(`[ALARM SYSTEM TRIGGERED] ${patientName} Room ${roomNumber} - ${type}: ${vitalsValue}`);
    }
  };

  // 2. Compute live ward statistics
  const totalPatientsCount = patients.length;
  const criticalCount = patients.filter(p => p.status === 'Critical' || p.riskScore >= 80).length;
  const availableBedsCount = beds.filter(b => b.status === 'Available').length;
  const onDutyDoctorsCount = 5; // Fixed roster

  // Re-calculate stress dynamically based on active alerts & high risk counts
  useEffect(() => {
    const unackedCount = alerts.filter(a => !a.isAcknowledged).length;
    const computedStress = Math.min(
      Math.max(40 + (criticalCount * 8) + (unackedCount * 5), 30), 
      98
    );
    setHospitalStress(computedStress);
  }, [patients, alerts, criticalCount]);

  // Handle nurse acknowledge alerts to reduce stress scores
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isAcknowledged: true } : a));
  };

  // Find selected patient details for Digital Twin matching
  const activeSelectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  // Render a responsive warning badge for stress index
  const getStressColor = (index: number) => {
    if (index >= 80) return 'text-red-400 border-red-500/30 bg-red-950/20';
    if (index >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
  };

  // Filtered patients list for Patients Database tab
  const filteredPatients = patients.filter(pt => {
    const matchesSearch = pt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pt.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pt.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : pt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      
      {/* If current view is the public landing portal */}
      {!isOnPlatform ? (
        <LandingPage onEnterPlatform={() => setIsOnPlatform(true)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          
          {/* Top Clinical Header */}
          <header className="border-b border-cyan-950/60 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Logo branding area */}
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsOnPlatform(false)}>
                <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Activity className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="font-bold tracking-wider text-lg bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                    CARESYNC <span className="text-cyan-400 font-extrabold text-xl">AI+</span>
                  </h1>
                  <span className="text-[9px] text-slate-550 font-mono block tracking-widest leading-none">SYSTEM MONITORING PLATFORM</span>
                </div>
              </div>

              {/* Navigation Menu Tabs */}
              <nav className="flex flex-wrap gap-1 bg-slate-950/60 border border-slate-850 p-1 rounded-xl">
                {[
                  { id: 'dashboard', label: 'Triage Center', icon: Activity },
                  { id: 'patients', label: 'Patients (20)', icon: Users },
                  { id: 'alerts', label: 'Alerts Center', icon: Bell, badge: alerts.filter(a => !a.isAcknowledged).length },
                  { id: 'analytics', label: 'Real-Time Insights', icon: Activity },
                  { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
                  { id: 'settings', label: 'Telemetry parameters', icon: SettingsIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-btn-${tab.id}`}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        isActive 
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_2px_10px_rgba(6,182,212,0.2)]' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={`inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[9px] font-mono font-bold leading-none ${
                          isActive ? 'bg-slate-950 text-cyan-400' : 'bg-red-500 text-slate-950 animate-pulse'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Exit & Signout controls */}
              <button 
                id="platform-exit-btn"
                onClick={() => setIsOnPlatform(false)}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/10 border border-transparent hover:border-red-950/20 px-3 py-2 rounded-xl transition-all self-start md:self-auto"
                title="Return to Public Portal"
              >
                <LogOut className="h-4 w-4" />
                <span>Return to Portal</span>
              </button>

            </div>
          </header>

          {/* Core Applet Board Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8">
            
            {/* Real-time Ward telemetry Overview Indicators */}
            {activeTab !== 'settings' && (
              <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="bg-cyan-950/50 border border-cyan-900 p-2.5 rounded-xl text-cyan-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-mono">Monitored Profiles</span>
                    <span className="text-xl font-bold font-mono text-white">{totalPatientsCount}</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="bg-red-950/50 border border-red-900 p-2.5 rounded-xl text-red-400">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-mono">Critical Cohorts</span>
                    <span className="text-xl font-bold font-mono text-red-400 animate-pulse">{criticalCount}</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="bg-emerald-950/50 border border-emerald-900 p-2.5 rounded-xl text-emerald-400">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-mono">Vitals Free Beds</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{availableBedsCount}</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center space-x-3">
                  <div className="bg-slate-800/40 border border-slate-750 p-2.5 rounded-xl text-slate-350">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-mono">Physicians active</span>
                    <span className="text-xl font-bold font-mono text-white">{onDutyDoctorsCount}</span>
                  </div>
                </div>

                {/* Metric 5: Hospital Stress Index */}
                <div className={`col-span-2 md:col-span-1 border p-4 rounded-2xl flex items-center space-x-3 ${getStressColor(hospitalStress)}`}>
                  <div className="p-2.5 rounded-xl bg-slate-950/40">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono opacity-80">Hospital Stress Score</span>
                    <span className="text-xl font-extrabold font-mono">{hospitalStress}</span>
                  </div>
                </div>

              </section>
            )}

            {/* TAB CONTENT DETERMINATORS */}
            
            {/* TAB: DASHBOARD TRIAGE CENTER */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Heatmap Area */}
                <Heatmap 
                  patients={patients} 
                  onSelectPatient={(id) => setSelectedPatientId(id)} 
                />

                {/* Main Double column: Priority Triage queue, resource intel, code blue prognosis */}
                <PriorityQueue 
                  patients={patients}
                  beds={beds}
                  onSelectPatient={(id) => setSelectedPatientId(id)}
                />
              </div>
            )}

            {/* TAB: PATIENTS DATABASE PANEL */}
            {activeTab === 'patients' && (
              <div className="space-y-6">
                
                {/* Search & Filter bar design */}
                <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-550" />
                    <input
                      id="patients-search-input"
                      type="text"
                      placeholder="Search patient, room, or clinical diagnosis..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 p-3 pl-11 rounded-xl border border-slate-850 focus:border-cyan-500/80 text-xs focus:outline-none transition-all placeholder-slate-550"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-slate-950/50 p-1 border border-slate-850/60 rounded-xl">
                    <span className="self-center text-[10px] text-slate-400 font-mono uppercase px-2">Filter status:</span>
                    {(['All', 'Critical', 'High Risk', 'Observation', 'Stable'] as const).map((status) => (
                      <button
                        key={status}
                        id={`filter-btn-${status.replace(' ', '')}`}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                          statusFilter === status 
                            ? 'bg-cyan-500 text-slate-950' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 20 Patients Grid List representing active monitoring tiles */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredPatients.map((pt) => {
                    
                    // Specific card indicators based on status
                    const isCrit = pt.status === 'Critical';
                    const isHigh = pt.status === 'High Risk';
                    const isObs = pt.status === 'Observation';

                    let cardColor = 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700';
                    let alertDot = 'bg-emerald-400';
                    if (isCrit) {
                      cardColor = 'border-red-950/70 bg-red-950/5 hover:border-red-500/35 [box-shadow:0_0_12px_rgba(239,68,68,0.04)]';
                      alertDot = 'bg-red-500 animate-pulse';
                    } else if (isHigh) {
                      cardColor = 'border-amber-950/70 bg-amber-950/5 hover:border-amber-500/35';
                      alertDot = 'bg-amber-500';
                    } else if (isObs) {
                      cardColor = 'border-yellow-950/50 bg-yellow-950/5 hover:border-yellow-600/30';
                      alertDot = 'bg-yellow-400';
                    }

                    return (
                      <div
                        key={pt.id}
                        id={`patient-tile-${pt.id}`}
                        onClick={() => setSelectedPatientId(pt.id)}
                        className={`border rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-[300px] transition-all relative group ${cardColor}`}
                      >
                        {/* Upper row */}
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">ROOM {pt.roomNumber}</span>
                              <h4 className="text-base font-black text-white group-hover:text-cyan-400 transition-colors mt-0.5">{pt.name}</h4>
                            </div>
                            <span className={`h-2 w-2 rounded-full ${alertDot}`} />
                          </div>

                          <div className="text-[10px] text-slate-450 mt-1 uppercase tracking-wider font-mono">
                            {pt.age}y/o • {pt.gender} • Diagnosis: <span className="text-slate-300 normal-case italic block truncate">{pt.primaryDiagnosis}</span>
                          </div>
                        </div>

                        {/* Mid Row Patient vital parameters readout */}
                        <div className="grid grid-cols-4 gap-1.5 py-4 my-2 border-y border-slate-850/60 text-center font-mono">
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase">HR</span>
                            <span className={`text-xs font-bold ${pt.heartRate > 110 || pt.heartRate < 50 ? 'text-red-400' : 'text-slate-155'}`}>{pt.heartRate}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase">SpO₂</span>
                            <span className={`text-xs font-bold ${pt.spO2 < 91 ? 'text-red-400 font-extrabold' : 'text-slate-155'}`}>{pt.spO2}%</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase">BP</span>
                            <span className="text-[10px] font-bold text-slate-155 truncate block max-w-full">{pt.bloodPressure}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-500 uppercase">Risk</span>
                            <span className={`text-xs font-bold ${pt.riskScore >= 75 ? 'text-red-400' : 'text-slate-155'}`}>{pt.riskScore}%</span>
                          </div>
                        </div>

                        {/* Lower Row Prognosis summary */}
                        <div className="space-y-1 bg-slate-950/50 p-2.5 rounded-xl border border-slate-850/60">
                          <div className="flex justify-between text-[9px] font-mono leading-none">
                            <span className="text-slate-400 uppercase">ESTIMATED WINDOW:</span>
                            <span className={`font-black ${isCrit ? 'text-red-400' : 'text-slate-200'}`}>{pt.timeUntilDeterioration}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-mono leading-none pt-1">
                            <span className="text-slate-400 uppercase">FORECAST SLOPE:</span>
                            <span className="text-cyan-400 font-bold">{pt.predictedFutureRisk}% Risk</span>
                          </div>
                        </div>

                        {/* View twin prompt indicator */}
                        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 hover:text-cyan-400 select-none border-t border-slate-850/40 pt-2.5">
                          <span className="font-mono uppercase tracking-widest">Active telemetry twin</span>
                          <span className="flex items-center space-x-0.5 font-bold">
                            <span>Open twin</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {filteredPatients.length === 0 && (
                  <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-2xl">
                    <Info className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No ICU patients match your specific inquiries.</p>
                  </div>
                )}

              </div>
            )}

            {/* TAB: ALERTS CENTER */}
            {activeTab === 'alerts' && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-xs space-y-6">
                <div>
                  <h3 className="text-white font-bold text-base flex items-center space-x-2">
                    <span>Clinical Alert Event Center</span>
                    <span className="text-[10px] font-mono bg-slate-950/80 border border-slate-800 text-red-400 px-2 py-0.5 rounded-md">Realtime Telemetry Stream</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Continuous list of active vitals breaches, sorted strictly by chronological timestamps</p>
                </div>

                <div className="space-y-4">
                  {alerts.map((al) => (
                    <div 
                      key={al.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        al.isAcknowledged 
                          ? 'bg-slate-950/20 border-slate-850 opacity-60' 
                          : al.severity === 'Extreme' 
                            ? 'bg-red-950/15 border-red-500/50 [box-shadow:0_0_15px_rgba(239,68,68,0.06)]' 
                            : 'bg-amber-950/10 border-amber-500/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            al.isAcknowledged ? 'bg-slate-900 text-slate-500' : 'bg-red-900/30 text-red-400 animate-pulse'
                          }`}>
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-200 text-sm">{al.patientName}</span>
                              <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-950 p-1 border border-slate-850 rounded">ROOM {al.roomNumber}</span>
                            </div>
                            <p className="text-slate-300 font-mono text-[11px] mt-1">
                              Anomoly: <strong className="text-red-400">{al.vitalsValue || al.type}</strong> • severity: <span className="font-semibold">{al.severity}</span>
                            </p>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                              <strong className="text-slate-300 font-semibold subtitle">Suggested Triage Response: </strong> 
                              {al.suggestedResponse}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 self-end sm:self-auto w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/40">
                          <span className="font-mono text-[10px] text-slate-400">{al.timestamp}</span>
                          
                          {al.isAcknowledged ? (
                            <span className="inline-flex items-center space-x-1.5 py-1 px-2.5 bg-slate-950 text-emerald-400 text-[10px] font-mono uppercase rounded border border-emerald-950/50">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Acknowledged</span>
                            </span>
                          ) : (
                            <button
                              id={`ack-btn-${al.id}`}
                              onClick={() => handleAcknowledgeAlert(al.id)}
                              className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 text-[10px] font-mono uppercase rounded-lg transition-all"
                            >
                              Silence / Acknowledge
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: REAL-TIME INSIGHT ANALYTICS */}
            {activeTab === 'analytics' && (
              <Analytics 
                patients={patients}
                alerts={alerts}
                beds={beds}
              />
            )}

            {/* TAB: AI MEDICAL COPILOT ASSISTANT */}
            {activeTab === 'copilot' && (
              <AICopilot 
                patients={patients}
                alerts={alerts}
                onSelectPatient={(id) => {
                  setSelectedPatientId(id);
                  setActiveTab('dashboard'); // Flip back to render Digital Twin
                }}
              />
            )}

            {/* TAB: SETTINGS & MODEL THRESHOLDS */}
            {activeTab === 'settings' && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-8">
                <div>
                  <h3 className="text-white font-bold text-base">Predictive Model Alarm Parameters</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Adjust computed risk bounds and system telemetry configurations</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left block sliders */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>CRITICAL TACHYCARDIA LIMIT:</span>
                        <span className="text-cyan-400 font-bold">{alertThresholdHr} bpm</span>
                      </div>
                      <input
                        id="threshold-hr-slider"
                        type="range"
                        min="90"
                        max="140"
                        value={alertThresholdHr}
                        onChange={(e) => setAlertThresholdHr(Number(e.target.value))}
                        className="w-full text-cyan-400"
                      />
                      <p className="text-[10px] text-slate-550 mt-1 leading-normal">
                        Heart rate indexes exceeding this limit trigger automated cardiac risk notifications to the emergency priority queues.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                        <span>MINIMUM SAFE OXYGENATION LIMIT (SpO₂):</span>
                        <span className="text-cyan-400 font-bold">{alertThresholdSpO2}%</span>
                      </div>
                      <input
                        id="threshold-spo2-slider"
                        type="range"
                        min="82"
                        max="95"
                        value={alertThresholdSpO2}
                        onChange={(e) => setAlertThresholdSpO2(Number(e.target.value))}
                        className="w-full text-cyan-400"
                      />
                      <p className="text-[10px] text-slate-550 mt-1 leading-normal">
                        Continuous patient oxygen levels settling below this percentile automatically classify profiles as high-hazard distress.
                      </p>
                    </div>
                  </div>

                  {/* Right block toggles */}
                  <div className="space-y-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
                    <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">Telemetry Action Modisms</h4>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-250">Telemetry Bedside Audio Alarm</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Trigger local audible speaker sweeps for red alarms.</div>
                      </div>
                      <button
                        id="setting-toggle-alarm"
                        onClick={() => setIsAudioAlarmsEnabled(!isAudioAlarmsEnabled)}
                        className={`text-[10px] tracking-wide font-bold font-mono uppercase border px-3 py-1.5 rounded-lg transition-all ${
                          isAudioAlarmsEnabled 
                            ? 'bg-red-950/40 border-red-900 text-red-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {isAudioAlarmsEnabled ? 'Sweeps active' : 'Sweeps muted'}
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-250">Automate Next-of-Kin Mail Updates</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Instantly dispatch secure status digests on stable patients.</div>
                      </div>
                      <button
                        id="setting-toggle-nok"
                        onClick={() => setIsAutoFamilyUpdate(!isAutoFamilyUpdate)}
                        className={`text-[10px] tracking-wide font-bold font-mono uppercase border px-3 py-1.5 rounded-lg transition-all ${
                          isAutoFamilyUpdate 
                            ? 'bg-cyan-950 border-cyan-850 text-cyan-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {isAutoFamilyUpdate ? 'Sync enabled' : 'Sync disabled'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accuracy Disclaimer */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl text-xs flex items-start space-x-3 text-slate-400 leading-normal">
                  <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Safety Warning:</strong> Under clinical testing protocol laws, any algorithmic prognostics representing cardiac distress or respiratory arrest require strict hands-on manual verification by medical specialists prior to medical drug interventions or therapy allocations.
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* Core Footer */}
          <footer className="border-t border-cyan-950/40 bg-slate-950 py-5 px-6 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
              <p>© 2026 CARESYNC AI+ Clinical Command Center. HIPAA Secure telemetry pipeline active.</p>
              <div className="flex items-center space-x-4 mt-3 md:mt-0">
                <span className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full inline-block" />
                  <span>Telemetry Live Sync</span>
                </span>
                <span>•</span>
                <span>Active Model: CareScale-2.8</span>
              </div>
            </div>
          </footer>

          {/* Digital Twin Modal Overlay */}
          {activeSelectedPatient && (
            <PatientTwin 
              patient={activeSelectedPatient} 
              onClose={() => setSelectedPatientId(null)} 
            />
          )}

        </div>
      )}

    </div>
  );
}
