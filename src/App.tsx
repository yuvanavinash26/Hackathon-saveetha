import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Bed, Activity, ShieldAlert, AlertCircle, Bell, 
  Sparkles, Search, Sliders, ChevronRight, CheckCircle, Volume2, 
  Settings as SettingsIcon, Info, HeartPulse, LogOut, Map, X
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
import DigitalTwinMap from './components/DigitalTwinMap';
import DynamicIslandNav from './components/DynamicIslandNav';

export default function App() {
  // Navigation & Platform View Toggle
  const [isOnPlatform, setIsOnPlatform] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'twinMap' | 'alerts' | 'analytics' | 'copilot' | 'settings'>('dashboard');
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  
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
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans transition-all duration-300">
      
      {/* If current view is the public landing portal */}
      {!isOnPlatform ? (
        <LandingPage onEnterPlatform={() => setIsOnPlatform(true)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          
          {/* Dynamic Island / Notch Navigation with high-end glass theme */}
          <DynamicIslandNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isNavOpen={isNavOpen}
            setIsNavOpen={setIsNavOpen}
            setIsOnPlatform={setIsOnPlatform}
            totalPatientsCount={totalPatientsCount}
            criticalCount={criticalCount}
            hospitalStress={hospitalStress}
            alertsCount={alerts.filter(a => !a.isAcknowledged).length}
          />

          {/* Core Applet Board Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8">
            
            {/* Real-time Ward telemetry Overview Indicators */}
            {activeTab !== 'settings' && (
              <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-3 shadow-xs">
                  <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl text-red-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-mono">Monitored Profiles</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{totalPatientsCount}</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-3 shadow-xs">
                  <div className="bg-red-50 border border-red-105 p-2.5 rounded-xl text-red-500">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-mono">Critical Cohorts</span>
                    <span className="text-xl font-bold font-mono text-red-600 animate-pulse">{criticalCount}</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-3 shadow-xs">
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-emerald-600">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-mono">Vitals Free Beds</span>
                    <span className="text-xl font-bold font-mono text-emerald-600">{availableBedsCount}</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-3 shadow-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-mono">Physicians active</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{onDutyDoctorsCount}</span>
                  </div>
                </div>

                {/* Metric 5: Hospital Stress Index */}
                <div className={`col-span-2 md:col-span-1 border p-4 rounded-2xl flex items-center space-x-3 shadow-xs ${getStressColor(hospitalStress)}`}>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-250">
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
            
            {/* Active Workspace Close & Navigation Breadcrumb header when not on main triage dashboard */}
            {activeTab !== 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-red-100/80 px-6 py-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-red-50/10 to-transparent"
                id="active-tab-navigation-header"
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className="bg-red-50 p-2.5 rounded-xl border border-red-100/50 text-red-650">
                    <Activity className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase bg-red-100/70 text-red-700 px-2.5 py-0.5 rounded font-black tracking-wider">
                        Active Workspace
                      </span>
                      <span className="text-slate-300 font-bold">/</span>
                      <span className="text-[11px] font-mono text-slate-550 uppercase tracking-widest font-black">
                        {activeTab === 'patients' ? 'Patients Cohort Database' :
                         activeTab === 'twinMap' ? 'Digital Floor Matrix Map' :
                         activeTab === 'alerts' ? 'Live Trigger Alerts Portal' :
                         activeTab === 'analytics' ? 'Clinical Prognosis Charts' :
                         activeTab === 'copilot' ? 'AI+ Clinical Copilot Core' :
                         activeTab === 'settings' ? 'Model Custom Thresholds' : activeTab}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-none">
                      {activeTab === 'patients' ? 'View and query continuous real-time ICU heart pulse maps' :
                       activeTab === 'twinMap' ? 'Locate room occupancy coordinates and doctor movement corridors' :
                       activeTab === 'alerts' ? 'Silence and acknowledge red clinical alarms' :
                       activeTab === 'analytics' ? 'Verify historical load indexes and vital stress lines' :
                       activeTab === 'copilot' ? 'Interact with care automation diagnostic algorithms' :
                       activeTab === 'settings' ? 'Adjust limits for automated safety trigger triggers' : 'Platform options hub'}
                    </p>
                  </div>
                </div>
                
                <button
                  id="tab-dismiss-and-return-btn"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-200 hover:shadow-lg cursor-pointer uppercase tracking-wider flex items-center justify-center space-x-2 shrink-0 border border-red-500/10"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                  <span>Close & Go Back to Dashboard</span>
                </button>
              </motion.div>
            )}
            
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
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="patients-search-input"
                      type="text"
                      placeholder="Search patient, room, or clinical diagnosis..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 p-3 pl-11 rounded-xl border border-slate-200 focus:border-red-500/85 text-xs focus:outline-none transition-all placeholder-slate-450 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-xl">
                    <span className="self-center text-[10px] text-slate-500 font-mono uppercase px-2">Filter status:</span>
                    {(['All', 'Critical', 'High Risk', 'Observation', 'Stable'] as const).map((status) => (
                      <button
                        key={status}
                        id={`filter-btn-${status.replace(' ', '')}`}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          statusFilter === status 
                            ? 'bg-red-600 text-white shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
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

                    let cardColor = 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm';
                    let alertDot = 'bg-emerald-500';
                    if (isCrit) {
                      cardColor = 'border-red-200 bg-red-50/20 hover:border-red-400 hover:shadow-xs';
                      alertDot = 'bg-red-500 animate-pulse';
                    } else if (isHigh) {
                      cardColor = 'border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:shadow-xs';
                      alertDot = 'bg-amber-500';
                    } else if (isObs) {
                      cardColor = 'border-yellow-200 bg-yellow-45/10 hover:border-yellow-450 hover:shadow-xs';
                      alertDot = 'bg-yellow-500';
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
                              <span className="text-[10px] text-slate-500 font-mono uppercase font-semibold">ROOM {pt.roomNumber}</span>
                              <h4 className="text-base font-black text-slate-900 group-hover:text-red-650 transition-colors mt-0.5">{pt.name}</h4>
                            </div>
                            <span className={`h-2 w-2 rounded-full ${alertDot}`} />
                          </div>

                          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">
                            {pt.age}y/o • {pt.gender} • Diagnosis: <span className="text-slate-600 normal-case italic block truncate">{pt.primaryDiagnosis}</span>
                          </div>
                        </div>

                        {/* Mid Row Patient vital parameters readout */}
                        <div className="grid grid-cols-4 gap-1.5 py-4 my-2 border-y border-slate-100 text-center font-mono">
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-bold">HR</span>
                            <span className={`text-xs font-bold ${pt.heartRate > 110 || pt.heartRate < 50 ? 'text-red-500 font-extrabold' : 'text-slate-700'}`}>{pt.heartRate}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-bold">SpO₂</span>
                            <span className={`text-xs font-bold ${pt.spO2 < 91 ? 'text-red-500 font-extrabold' : 'text-slate-700'}`}>{pt.spO2}%</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-bold">BP</span>
                            <span className="text-[10px] font-bold text-slate-700 truncate block max-w-full">{pt.bloodPressure}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-slate-400 uppercase font-bold">Risk</span>
                            <span className={`text-xs font-bold ${pt.riskScore >= 75 ? 'text-red-500' : 'text-slate-700'}`}>{pt.riskScore}%</span>
                          </div>
                        </div>

                        {/* Lower Row Prognosis summary */}
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex justify-between text-[9px] font-mono leading-none">
                            <span className="text-slate-500 uppercase">ESTIMATED WINDOW:</span>
                            <span className={`font-black ${isCrit ? 'text-red-500' : 'text-slate-750'}`}>{pt.timeUntilDeterioration}</span>
                          </div>
                          <div className="flex justify-between text-[9px] font-mono leading-none pt-1">
                            <span className="text-slate-500 uppercase">FORECAST SLOPE:</span>
                            <span className="text-red-600 font-bold">{pt.predictedFutureRisk}% Risk</span>
                          </div>
                        </div>

                        {/* View twin prompt indicator */}
                        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-450 hover:text-red-650 select-none border-t border-slate-100 pt-2.5">
                          <span className="font-mono uppercase tracking-widest text-[9px]">Active telemetry twin</span>
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
                  <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No ICU patients match your specific inquiries.</p>
                  </div>
                )}

              </div>
            )}

            {/* TAB: DIGITAL TWIN SIMULATION */}
            {activeTab === 'twinMap' && (
              <DigitalTwinMap />
            )}

            {/* TAB: ALERTS CENTER */}
            {activeTab === 'alerts' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-xs space-y-6">
                <div>
                  <h3 className="text-slate-900 font-bold text-base flex items-center space-x-2">
                    <span>Clinical Alert Event Center</span>
                    <span className="text-[10px] font-mono bg-slate-50 border border-slate-200 text-red-500 px-2 py-0.5 rounded-md">Realtime Telemetry Stream</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Continuous list of active vitals breaches, sorted strictly by chronological timestamps</p>
                </div>

                <div className="space-y-4">
                  {alerts.map((al) => (
                    <div 
                      key={al.id} 
                      className={`p-4 rounded-2xl border transition-all ${
                        al.isAcknowledged 
                          ? 'bg-slate-50/50 border-slate-200 opacity-60' 
                          : al.severity === 'Extreme' 
                            ? 'bg-red-50/20 border-red-200 [box-shadow:0_0_15px_rgba(239,68,68,0.03)]' 
                            : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            al.isAcknowledged ? 'bg-slate-100 text-slate-400' : 'bg-red-100 text-red-500 animate-pulse'
                          }`}>
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-800 text-sm">{al.patientName}</span>
                              <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-100 p-1 border border-slate-200 rounded">ROOM {al.roomNumber}</span>
                            </div>
                            <p className="text-slate-700 font-mono text-[11px] mt-1">
                              Anomoly: <strong className="text-red-500">{al.vitalsValue || al.type}</strong> • severity: <span className="font-semibold">{al.severity}</span>
                            </p>
                            <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                              <strong className="text-slate-700 font-semibold subtitle">Suggested Triage Response: </strong> 
                              {al.suggestedResponse}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 self-end sm:self-auto w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="font-mono text-[10px] text-slate-505">{al.timestamp}</span>
                          
                          {al.isAcknowledged ? (
                            <span className="inline-flex items-center space-x-1.5 py-1 px-2.5 bg-slate-105 text-emerald-600 text-[10px] font-mono uppercase rounded border border-emerald-250">
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Acknowledged</span>
                            </span>
                          ) : (
                            <button
                              id={`ack-btn-${al.id}`}
                              onClick={() => handleAcknowledgeAlert(al.id)}
                              className="px-4 py-2 bg-white border border-slate-200 hover:border-red-500 text-red-650 hover:text-red-700 text-[10px] font-mono uppercase rounded-lg transition-all"
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
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-8 text-slate-800">
                <div>
                  <h3 className="text-slate-900 font-bold text-base">Predictive Model Alarm Parameters</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Adjust computed risk bounds and system telemetry configurations</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left block sliders */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                        <span>CRITICAL TACHYCARDIA LIMIT:</span>
                        <span className="text-red-655 font-bold">{alertThresholdHr} bpm</span>
                      </div>
                      <input
                        id="threshold-hr-slider"
                        type="range"
                        min="90"
                        max="140"
                        value={alertThresholdHr}
                        onChange={(e) => setAlertThresholdHr(Number(e.target.value))}
                        className="w-full accent-red-600 text-red-500"
                      />
                      <p className="text-[10px] text-slate-450 mt-1 leading-normal">
                        Heart rate indexes exceeding this limit trigger automated cardiac risk notifications to the emergency priority queues.
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                        <span>MINIMUM SAFE OXYGENATION LIMIT (SpO₂):</span>
                        <span className="text-red-655 font-bold">{alertThresholdSpO2}%</span>
                      </div>
                      <input
                        id="threshold-spo2-slider"
                        type="range"
                        min="82"
                        max="95"
                        value={alertThresholdSpO2}
                        onChange={(e) => setAlertThresholdSpO2(Number(e.target.value))}
                        className="w-full accent-red-600 text-red-500"
                      />
                      <p className="text-[10px] text-slate-450 mt-1 leading-normal">
                        Continuous patient oxygen levels settling below this percentile automatically classify profiles as high-hazard distress.
                      </p>
                    </div>
                  </div>

                  {/* Right block toggles */}
                  <div className="space-y-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="text-slate-800 font-semibold text-xs tracking-wider uppercase font-mono">Telemetry Action Modisms</h4>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-700">Telemetry Bedside Audio Alarm</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Trigger local audible speaker sweeps for red alarms.</div>
                      </div>
                      <button
                        id="setting-toggle-alarm"
                        onClick={() => setIsAudioAlarmsEnabled(!isAudioAlarmsEnabled)}
                        className={`text-[10px] tracking-wide font-bold font-mono uppercase border px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isAudioAlarmsEnabled 
                            ? 'bg-red-50 border-red-200 text-red-600' 
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {isAudioAlarmsEnabled ? 'Sweeps active' : 'Sweeps muted'}
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-slate-700">Automate Next-of-Kin Mail Updates</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Instantly dispatch secure status digests on stable patients.</div>
                      </div>
                      <button
                        id="setting-toggle-nok"
                        onClick={() => setIsAutoFamilyUpdate(!isAutoFamilyUpdate)}
                        className={`text-[10px] tracking-wide font-bold font-mono uppercase border px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isAutoFamilyUpdate 
                            ? 'bg-red-50 border-red-150 text-red-600' 
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {isAutoFamilyUpdate ? 'Sync enabled' : 'Sync disabled'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accuracy Disclaimer */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-xs flex items-start space-x-3 text-slate-500 leading-normal">
                  <Info className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Safety Warning:</strong> Under clinical testing protocol laws, any algorithmic prognostics representing cardiac distress or respiratory arrest require strict hands-on manual verification by medical specialists prior to medical drug interventions or therapy allocations.
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* Core Footer */}
          <footer className="border-t border-slate-200 bg-white py-5 px-6 mt-16 text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
              <p>© 2026 CARESYNC AI+ Clinical Command Center. HIPAA Secure telemetry pipeline active.</p>
              <div className="flex items-center space-x-4 mt-3 md:mt-0">
                <span className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block" />
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
