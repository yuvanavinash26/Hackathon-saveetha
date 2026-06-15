import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Activity, Users, User, Play, ChevronRight, AlertTriangle, 
  MapPin, ShieldCheck, Zap, Info, Clock, CheckCircle2, TrendingUp, Sparkles,
  Radio, Wifi, Send, Smartphone, RefreshCw
} from 'lucide-react';

interface SimulationDetails {
  selectedDoctor: string;
  distance: string;
  responseTime: string;
  reason: string;
}

interface Doctor {
  id: string;
  name: string;
  role: string;
  gender: 'male' | 'female';
  x: number;
  y: number;
  status: 'Available' | 'Dispatched' | 'Treating' | 'Returning';
  assignment: string;
}

interface Patient {
  id: string;
  name: string;
  room: string;
  x: number;
  y: number;
  riskScore: number;
  status: 'Stable' | 'Observation' | 'Critical';
  gender: 'male' | 'female';
}

interface Room {
  id: string;
  name: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  currentOccupants: number;
  maxOccupants: number;
  color: string;
}

export default function DigitalTwinMap() {
  // 1. Defined Room Coordinates on our 800 x 420 cybernetic grid floor plan
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'wardA', name: 'Ward A', label: 'Ward A (General)', x: 60, y: 50, width: 180, height: 100, currentOccupants: 3, maxOccupants: 6, color: 'border-emerald-250 bg-emerald-50/15' },
    { id: 'icu', name: 'ICU', label: 'Intensive Care Unit', x: 310, y: 50, width: 180, height: 100, currentOccupants: 1, maxOccupants: 4, color: 'border-red-250 bg-red-50/15' },
    { id: 'wardB', name: 'Ward B', label: 'Ward B (Observation)', x: 560, y: 50, width: 180, height: 100, currentOccupants: 2, maxOccupants: 6, color: 'border-amber-250 bg-amber-50/15' },
    
    { id: 'er', name: 'Emergency Room', label: 'Trauma & Emergency', x: 60, y: 270, width: 180, height: 100, currentOccupants: 2, maxOccupants: 8, color: 'border-blue-250 bg-blue-50/15' },
    { id: 'ot', name: 'Operation Theatre', label: 'Operation Theatre', x: 560, y: 270, width: 180, height: 100, currentOccupants: 0, maxOccupants: 2, color: 'border-purple-250 bg-purple-50/15' },
    { id: 'lab', name: 'Laboratory', label: 'Diagnostic Lab', x: 310, y: 270, width: 180, height: 100, currentOccupants: 0, maxOccupants: 5, color: 'border-red-200 bg-red-50/15' },
  ]);

  // Main hallways are structured at X positions 150, 400, 650 with a horizontal corridor at Y=185
  const hallwayY = 185;

  // 2. Doctor States
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 'doc-1', name: 'Dr. Evelyn Carter', role: 'Intensivist Specialist', gender: 'female', x: 400, y: 270, status: 'Available', assignment: 'Lounge watch resting' },
    { id: 'doc-2', name: 'Dr. Ken Zhao', role: 'Cardiology Specialist', gender: 'male', x: 650, y: 270, status: 'Available', assignment: 'OT Standby' },
    { id: 'doc-3', name: 'Dr. Nico Finch', role: 'Trauma Director', gender: 'female', x: 150, y: 270, status: 'Available', assignment: 'ER rounds' },
  ]);

  // 3. Patients States
  const [patients, setPatients] = useState<Patient[]>([
    { id: 'pt-102', name: 'Clara Oswald', room: 'wardA', x: 100, y: 80, riskScore: 35, status: 'Stable', gender: 'female' },
    { id: 'pt-205', name: 'Arthur Pendragon', room: 'wardB', x: 620, y: 80, riskScore: 48, status: 'Observation', gender: 'male' },
    { id: 'pt-301', name: 'Rory Williams', room: 'er', x: 110, y: 310, riskScore: 55, status: 'Observation', gender: 'male' },
    { id: 'pt-402', name: 'Melody Pond', room: 'icu', x: 380, y: 80, riskScore: 82, status: 'Critical', gender: 'female' },
  ]);

  // 4. Alerts, AI Logs & Simulation Tickers
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // --- IoT Smartband Broadcasting Simulation States ---
  const [selectedIotDocId, setSelectedIotDocId] = useState<string>('doc-1');
  const [iotTemplateMsg, setIotTemplateMsg] = useState<string>('CRITICAL CODE RED: Cardiac Arrest in ICU Room 402. Prep crash cart!');
  const [vibePattern, setVibePattern] = useState<'single' | 'double' | 'continuous'>('double');
  const [isIotBroadcasting, setIsIotBroadcasting] = useState<boolean>(false);
  const [iotReceivedMsg, setIotReceivedMsg] = useState<string>('Awaiting telemetry signal...');
  const [iotStatus, setIotStatus] = useState<'idle' | 'transmitting' | 'vibrating' | 'acknowledged'>('idle');
  const [iotAckTimestamp, setIotAckTimestamp] = useState<string | null>(null);
  const [transmittedDocName, setTransmittedDocName] = useState<string>('Dr. Evelyn Carter');

  const broadcastIotSignal = () => {
    if (isIotBroadcasting) return;
    
    const targetDoc = doctors.find(d => d.id === selectedIotDocId) || doctors[0];
    setTransmittedDocName(targetDoc.name);
    setIsIotBroadcasting(true);
    setIotStatus('transmitting');
    setIotAckTimestamp(null);
    addLog(`IoT Broadcaster emitting 2.4GHz haptic radio burst to ${targetDoc.name}'s wristband.`, 'info');

    setTimeout(() => {
      setIsIotBroadcasting(false);
      setIotStatus('vibrating');
      setIotReceivedMsg(iotTemplateMsg);
      addLog(`Haptic feed acknowledged. ${targetDoc.name}'s smartband vibrating with pattern: ${vibePattern.toUpperCase()}`, 'critical');
      
      // Update doctor's current assignment to show they received smartband order
      setDoctors(prev => prev.map(d => d.id === targetDoc.id ? {
        ...d,
        assignment: 'IoT Alert Received'
      } : d));
    }, 1500);
  };

  const acknowledgeIotAlert = () => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setIotStatus('acknowledged');
    setIotAckTimestamp(timeStr);
    addLog(`Smartband Telemetry: ${transmittedDocName} clicked capacitive screen to ACKNOWLEDGE message. Transmission resolved.`, 'success');
    
    // Set doctor status or update map details
    const targetDoc = doctors.find(d => d.name === transmittedDocName);
    if (targetDoc) {
      setDoctors(prev => prev.map(d => d.id === targetDoc.id ? {
        ...d,
        assignment: 'Responding to IoT alert'
      } : d));
    }
  };

  const resetIotBroadcaster = () => {
    setIotReceivedMsg('Awaiting telemetry signal...');
    setIotStatus('idle');
    setIotAckTimestamp(null);
    setIsIotBroadcasting(false);
    addLog('Reset smartband broadcast interface to operational idle.', 'info');
  };
  const [eventLog, setEventLog] = useState<{ time: string; msg: string; type: 'info' | 'critical' | 'success' | 'ai' }[]>([
    { time: '10:52:14', msg: 'HIPAA digital twin floor correlation pipeline initialized.', type: 'info' },
    { time: '10:52:30', msg: 'System monitoring continuous patient telemetry matrices (4 profiles tracked).', type: 'info' },
  ]);

  const addLog = (msg: string, type: 'info' | 'critical' | 'success' | 'ai') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setEventLog(prev => [{ time: timeStr, msg, type }, ...prev].slice(0, 30));
  };

  // Live Dispatch Panel Stats
  const [dispatchDetails, setDispatchDetails] = useState<SimulationDetails | null>(null);

  // Animation coordinate paths
  const [doctorAnimationPath, setDoctorAnimationPath] = useState<{ x: number; y: number }[]>([]);
  const [animatingDocId, setAnimatingDocId] = useState<string | null>(null);

  // Patient movement coordinates
  const [patientAnimationPath, setPatientAnimationPath] = useState<{ x: number; y: number }[]>([]);
  const [animatingPatientId, setAnimatingPatientId] = useState<string | null>(null);

  // Helper: calculate Manhattan distance on our layout
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.floor(Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2));
  };

  // Helper: Build a pathway along corridors
  const determineRoute = (fromX: number, fromY: number, toX: number, toY: number) => {
    // 1. Walk from start point down/up to main horizontal corridor hallway (Y=185)
    // 2. Walk sideways along Y=185 to destination X channel
    // 3. Walk down/up from corridor Y=185 to destination point
    return [
      { x: fromX, y: fromY },
      { x: fromX, y: hallwayY },
      { x: toX, y: hallwayY },
      { x: toX, y: toY },
    ];
  };

  // Core Emergency Simulator trigger
  const runSimulationScenario = (scenarioType: 'CardioWardA' | 'HypoxicWardB') => {
    if (animatingDocId || animatingPatientId) return; // Prevent double dispatch

    if (scenarioType === 'CardioWardA') {
      setActiveScenario('CardioWardA');
      addLog('ALARM DETECTED: Sudden tachyarhythmia telemetry trigger in Ward A!', 'critical');
      
      // Update patient status to Critical
      setPatients(prev => prev.map(p => p.id === 'pt-102' ? { ...p, riskScore: 94, status: 'Critical' } : p));
      
      // AI reasoning sequence timeout
      setTimeout(() => {
        addLog('AI AGENT [CareScale-2.8]: Sepsis Risk score >90%. Searching for closest qualified intensivist...', 'ai');
        
        // Find nearest doctor to Ward A room channel (X=150, Y=80)
        let closestDoc = doctors[0];
        let minDistance = Infinity;
        
        doctors.forEach(doc => {
          if (doc.status === 'Available') {
            const dist = calculateDistance(doc.x, doc.y, 150, 80);
            if (dist < minDistance) {
              minDistance = dist;
              closestDoc = doc;
            }
          }
        });

        const estDistanceMeters = Math.round(minDistance * 0.8) + 'm';
        const etaText = (minDistance < 200 ? '45 seconds' : '1.8 mins');

        setDispatchDetails({
          selectedDoctor: closestDoc.name,
          distance: estDistanceMeters,
          responseTime: etaText,
          reason: `Specialist closest to Ward A corridor intersection (${estDistanceMeters} dynamic Manhattan displacement). Fully certified in clinical cardiology response standard protocols.`
        });

        addLog(`AI DECISION: Dispatched ${closestDoc.name} to Ward A. ETA: ${etaText}.`, 'success');

        // Draw path and start doctor animation
        const path = determineRoute(closestDoc.x, closestDoc.y, 150, 80);
        setDoctorAnimationPath(path);
        setAnimatingDocId(closestDoc.id);

        // Update Doctor status
        setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
          ...d, 
          status: 'Dispatched', 
          assignment: 'Urgent Dispatch - Clara Oswald' 
         } : d));

        // When doctor arrives at Patient (takes approx 4s for absolute translation animation)
        setTimeout(() => {
          addLog(`${closestDoc.name} reached Clara Oswald. Vitals correction maneuvers in-progress.`, 'info');
          
          setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
            ...d, 
            status: 'Treating',
            x: 150,
            y: 80,
            assignment: 'Correcting Tachyarhythmia' 
          } : d));

          // Vitals correct after 3.5 seconds
          setTimeout(() => {
            setPatients(prev => prev.map(p => p.id === 'pt-102' ? { ...p, riskScore: 32, status: 'Stable' } : p));
            addLog(`Clara Oswald telemetry indices normalized. Client status corrected to Stable.`, 'success');
            
            // Return doctor back to Lounge Y=270
            addLog(`${closestDoc.name} returning to designated watch lounge station.`, 'info');
            const returnRoute = determineRoute(150, 80, 400, 270);
            setDoctorAnimationPath(returnRoute);
            setAnimatingDocId(closestDoc.id);
            setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
              ...d, 
              status: 'Returning',
              assignment: 'Returning to station' 
            } : d));

            setTimeout(() => {
              setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
                ...d, 
                status: 'Available',
                x: 400,
                y: 270,
                assignment: 'Lounge watch resting' 
              } : d));
              setAnimatingDocId(null);
              setDoctorAnimationPath([]);
              setDispatchDetails(null);
              setActiveScenario(null);
              addLog(`Triage event Ward A resolved successfully.`, 'success');
            }, 4100);

          }, 3500);

        }, 4100);

      }, 1500);

    } else if (scenarioType === 'HypoxicWardB') {
      setActiveScenario('HypoxicWardB');
      addLog('ALARM DETECTED: Sudden Hypoxemic Crash index 88% in Ward B!', 'critical');
      
      // Update patient status to Critical
      setPatients(prev => prev.map(p => p.id === 'pt-205' ? { ...p, riskScore: 91, status: 'Critical' } : p));

      setTimeout(() => {
        addLog('AI AGENT [CareScale-2.8]: Oxygen telemetry trigger active. Searching for nearest available intensivist...', 'ai');
        
        // Find nearest doctor to Ward B room channel (X=650, Y=80) 
        let closestDoc = doctors[0];
        let minDistance = Infinity;
        
        doctors.forEach(doc => {
          if (doc.status === 'Available') {
            const dist = calculateDistance(doc.x, doc.y, 650, 80);
            if (dist < minDistance) {
              minDistance = dist;
              closestDoc = doc;
            }
          }
        });

        const estDistanceMeters = Math.round(minDistance * 0.8) + 'm';
        const etaText = (minDistance < 200 ? '30 seconds' : '1.4 mins');

        setDispatchDetails({
          selectedDoctor: closestDoc.name,
          distance: estDistanceMeters,
          responseTime: etaText,
          reason: `Specialist assigned to correct active Ward B hypoxia. Closest geographical trajectory node (${estDistanceMeters}).`
        });

        addLog(`AI DECISION: Dispatched ${closestDoc.name} to Ward B. ETA: ${etaText}.`, 'success');

        // Doctor walks to Ward B Room (650, 80)
        const path = determineRoute(closestDoc.x, closestDoc.y, 650, 80);
        setDoctorAnimationPath(path);
        setAnimatingDocId(closestDoc.id);

        setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
          ...d, 
          status: 'Dispatched', 
          assignment: 'Urgent Dispatch - Arthur Pendragon' 
        } : d));

        // When doctor arrives at Patient in Ward B
        setTimeout(() => {
          addLog(`${closestDoc.name} reached Arthur Pendragon. Oxygen flow titrate protocol initiated.`, 'info');
          
          setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
            ...d, 
            status: 'Treating',
            x: 650,
            y: 80,
            assignment: 'Correcting Hypoxia' 
          } : d));

          setTimeout(() => {
            // Patient needs immediate transfer to ICU
            addLog(`CRITICAL DETERMINATION: High Flow Nasal Cannula insufficient. ICU Level-4 suite transfer is REQUIRED!`, 'critical');
            
            // Check ICU occupancy and adjust!
            let icuRoom = rooms.find(r => r.id === 'icu')!;
            let wardBRoom = rooms.find(r => r.id === 'wardB')!;
            
            if (icuRoom.currentOccupants < icuRoom.maxOccupants) {
              addLog(`ICU Capacity confirmed space available (${icuRoom.currentOccupants}/${icuRoom.maxOccupants} beds used). Allocating suite...`, 'success');

              // Animate Patient to ICU Room (X=400, Y=80)
              addLog(`Animate patient Arthur Pendragon moving from Ward B to critical ICU suite...`, 'info');
              
              const patientPath = determineRoute(620, 80, 400, 80);
              setPatientAnimationPath(patientPath);
              setAnimatingPatientId('pt-205');

              // At the same time, doctor follows patient to ICU
              const docRoute = determineRoute(650, 80, 400, 80);
              setDoctorAnimationPath(docRoute);

              setTimeout(() => {
                // Patient arrives in ICU
                addLog('Arthur Pendragon has successfully entered ICU. Bed count updated.', 'success');
                setPatients(prev => prev.map(p => p.id === 'pt-205' ? { 
                  ...p, 
                  room: 'icu', 
                  x: 375, 
                  y: 90, 
                  riskScore: 68, 
                  status: 'Observation' 
                } : p));

                // Decrement ward B, increment ICU counts automatically!
                setRooms(prevRooms => prevRooms.map(r => {
                  if (r.id === 'icu') return { ...r, currentOccupants: r.currentOccupants + 1 };
                  if (r.id === 'wardB') return { ...r, currentOccupants: r.currentOccupants - 1 };
                  return r;
                }));

                setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
                  ...d, 
                  status: 'Treating',
                  x: 400,
                  y: 80,
                  assignment: 'Stabilizing ICU patient' 
                } : d));

                setAnimatingPatientId(null);
                setPatientAnimationPath([]);

                setTimeout(() => {
                  setPatients(prev => prev.map(p => p.id === 'pt-205' ? { ...p, riskScore: 41, status: 'Observation' } : p));
                  addLog(`Arthur Pendragon vitals stabilized safely in ICU Suite.`, 'success');
                  
                  // Return doctor lounge
                  addLog(`${closestDoc.name} returning to Watch Lounge station.`, 'info');
                  const returnRoute = determineRoute(400, 80, 400, 270);
                  setDoctorAnimationPath(returnRoute);
                  setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
                    ...d, 
                    status: 'Returning',
                    assignment: 'Returning to station' 
                  } : d));

                  setTimeout(() => {
                    setDoctors(prev => prev.map(d => d.id === closestDoc.id ? { 
                      ...d, 
                      status: 'Available',
                      x: 400,
                      y: 270,
                      assignment: 'Lounge watch resting' 
                    } : d));
                    setAnimatingDocId(null);
                    setDoctorAnimationPath([]);
                    setDispatchDetails(null);
                    setActiveScenario(null);
                    addLog(`ICU emergency and transfer simulation completed successfully.`, 'success');
                  }, 4100);

                }, 2500);

              }, 4100);

            } else {
              addLog(`ICU Capacity is completely full! Alerting trauma flight vectors for alternate facility transfer.`, 'critical');
              setDispatchDetails(null);
              setActiveScenario(null);
              setAnimatingDocId(null);
            }

          }, 3500);

        }, 4100);

      }, 1500);
    }
  };

  // 6. Reset Simulation
  const resetSimulationState = () => {
    setDoctors([
      { id: 'doc-1', name: 'Dr. Evelyn Carter', role: 'Intensivist Specialist', gender: 'female', x: 400, y: 270, status: 'Available', assignment: 'Lounge watch resting' },
      { id: 'doc-2', name: 'Dr. Ken Zhao', role: 'Cardiology Specialist', gender: 'male', x: 650, y: 270, status: 'Available', assignment: 'OT Standby' },
      { id: 'doc-3', name: 'Dr. Nico Finch', role: 'Trauma Director', gender: 'female', x: 150, y: 270, status: 'Available', assignment: 'ER rounds' },
    ]);
    setPatients([
      { id: 'pt-102', name: 'Clara Oswald', room: 'wardA', x: 100, y: 80, riskScore: 35, status: 'Stable', gender: 'female' },
      { id: 'pt-205', name: 'Arthur Pendragon', room: 'wardB', x: 620, y: 80, riskScore: 48, status: 'Observation', gender: 'male' },
      { id: 'pt-301', name: 'Rory Williams', room: 'er', x: 110, y: 310, riskScore: 55, status: 'Observation', gender: 'male' },
      { id: 'pt-402', name: 'Melody Pond', room: 'icu', x: 380, y: 80, riskScore: 82, status: 'Critical', gender: 'female' },
    ]);
    setRooms([
      { id: 'wardA', name: 'Ward A', label: 'Ward A (General)', x: 60, y: 50, width: 180, height: 100, currentOccupants: 3, maxOccupants: 6, color: 'border-emerald-250 bg-emerald-50/15' },
      { id: 'icu', name: 'ICU', label: 'Intensive Care Unit', x: 310, y: 50, width: 180, height: 100, currentOccupants: 1, maxOccupants: 4, color: 'border-red-255 bg-red-50/15' },
      { id: 'wardB', name: 'Ward B', label: 'Ward B (Observation)', x: 560, y: 50, width: 180, height: 100, currentOccupants: 2, maxOccupants: 6, color: 'border-amber-250 bg-amber-50/15' },
      
      { id: 'er', name: 'Emergency Room', label: 'Trauma & Emergency', x: 60, y: 270, width: 180, height: 100, currentOccupants: 2, maxOccupants: 8, color: 'border-blue-250 bg-blue-50/15' },
      { id: 'ot', name: 'Operation Theatre', label: 'Operation Theatre', x: 560, y: 270, width: 180, height: 100, currentOccupants: 0, maxOccupants: 2, color: 'border-purple-255 bg-purple-50/15' },
      { id: 'lab', name: 'Laboratory', label: 'Diagnostic Lab', x: 310, y: 270, width: 180, height: 100, currentOccupants: 0, maxOccupants: 5, color: 'border-red-200 bg-red-50/15' },
    ]);
    setAnimatingDocId(null);
    setAnimatingPatientId(null);
    setDoctorAnimationPath([]);
    setPatientAnimationPath([]);
    setDispatchDetails(null);
    setActiveScenario(null);
    addLog('Simulation dashboard reset completely to core state.', 'info');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden text-slate-800 animate-fade-in" id="hospital-twin-simulation">
      
      {/* Background dynamic mesh overlay */}
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-red-50/10 to-transparent pointer-events-none" />
      <div className="absolute -right-64 top-12 w-96 h-96 bg-red-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Primary Grid Layout for Cyber Operator Dashboard */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-6">
        
        {/* Left Side Column: Control Parameters & Future Scenarios Panel */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-600">
                <Network className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-slate-905 font-extrabold text-base tracking-tight uppercase font-sans">
                  Digital Twin Operations
                </h3>
                <p className="text-[10px] text-slate-500 font-bold tracking-wider">L4 GEOLOCAL CORRELATION MATRIX</p>
              </div>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed">
              Provides constant live visualization of the care workflow. Trigger AI scenario simulations to test response capabilities, path finding algorithms, and medical room level stress metrics.
            </p>

            <div className="space-y-3 pt-2">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">Trigger active scenarios:</span>
              
              <button
                id="sim-scenario-a-btn"
                onClick={() => runSimulationScenario('CardioWardA')}
                disabled={activeScenario !== null}
                className={`w-full p-4 h-24 rounded-xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                  activeScenario === 'CardioWardA' 
                    ? 'bg-red-50 border-red-305 text-red-900 shadow-sm font-bold' 
                    : 'bg-slate-50/50 border-slate-205 hover:border-red-400 text-slate-800 disabled:opacity-50'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold leading-normal font-sans group-hover:text-red-650">1. Cardiac Distress in Ward A</span>
                  <span className="text-[8px] font-mono bg-red-100 border border-red-200 px-1.5 py-0.5 rounded text-red-600 font-bold">ALERT</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">
                  Triggers Ward A vital crisis. Dispatches available doctor to correct tachycardia.
                </p>
              </button>

              <button
                id="sim-scenario-b-btn"
                onClick={() => runSimulationScenario('HypoxicWardB')}
                disabled={activeScenario !== null}
                className={`w-full p-4 h-24 rounded-xl border text-left flex flex-col justify-between transition-all group cursor-pointer ${
                  activeScenario === 'HypoxicWardB' 
                    ? 'bg-amber-55 border-amber-305 text-amber-900 shadow-sm font-bold' 
                    : 'bg-slate-50/50 border-slate-205 hover:border-red-400 text-slate-800 disabled:opacity-50'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold leading-normal font-sans group-hover:text-red-650">2. Hypoxia & ICU Transfer</span>
                  <span className="text-[8px] font-mono bg-red-105 border border-red-200 px-1.5 py-0.5 rounded text-red-600 font-bold">COMPLEX</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-medium">
                  Triggers Ward B hypoxemia. Dispatches doctor, triggers live patient transfer to ICU.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              id="sim-reset-all-btn"
              onClick={resetSimulationState}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:text-red-650 rounded-xl transition-all cursor-pointer"
            >
              Reset Floor Coordinates
            </button>
          </div>
        </div>

        {/* Center Canvas Column: SVG Blueprint interactive map */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl relative overflow-x-auto scrollbar-thin" style={{ minHeight: '430px' }}>
            
            {/* HUD Status Header overlay */}
            <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-600 uppercase font-bold">TELEMETRY GEOLOCAL ACTIVE</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 font-bold uppercase">
                SCALED HUD VIEWPORT: 800m × 420m
              </div>
            </div>

            {/* Core SVG Map & Coordinate space */}
            <div className="relative w-full aspect-[800/420] min-w-[700px] overflow-hidden select-none" style={{ height: '420px' }}>
              
              {/* Floor blueprint texture lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] opacity-100 pointer-events-none" />

              {/* DRAW ROOMS: Ward A, ICU, Ward B etc */}
              {rooms.map(room => {
                const isIcu = room.id === 'icu';
                const isEr = room.id === 'er';
                const hasCritical = patients.some(p => p.room === room.id && p.status === 'Critical');
                
                let borderGlow = room.color + ' border';
                if (hasCritical) {
                  borderGlow = 'border-red-500 bg-red-50 shadow-xs animate-pulse border-2';
                }

                return (
                  <div
                    key={room.id}
                    className={`absolute rounded-xl backdrop-blur-sm p-3 transition-all flex flex-col justify-between ${borderGlow}`}
                    style={{
                      left: `${room.x}px`,
                      top: `${room.y}px`,
                      width: `${room.width}px`,
                      height: `${room.height}px`
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[7px] font-mono text-slate-450 block uppercase font-bold">ROOM CODE: {room.id.toUpperCase()}</span>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{room.label}</h4>
                      </div>
                      <span className={`inline-flex items-center justify-center text-[7px] font-mono font-bold leading-none px-1.5 py-0.5 rounded ${
                        isIcu ? 'bg-red-50 text-red-650 border border-red-200' : 
                        isEr ? 'bg-blue-50 text-blue-650 border border-blue-200' :
                        'bg-slate-100 text-slate-700 border border-slate-205'
                      }`}>
                        OCCUPANCY: {room.currentOccupants}/{room.maxOccupants}
                      </span>
                    </div>

                    {/* Vitals Spark Waveform backdrop on room */}
                    <div className="h-6 opacity-30 relative overflow-hidden pointer-events-none">
                      <svg viewBox="0 0 100 20" className="w-full h-full stroke-red-650 stroke-1 fill-none">
                        <path d="M 0,10 L 20,10 L 25,2 L 30,18 L 35,10 L 60,10 L 65,3 L 70,17 L 75,10 L 100,10" />
                      </svg>
                    </div>
                  </div>
                );
              })}

              {/* HALLWAYS VISUAL CORRIDORS (SVG Lines rendering the pathways) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {/* Horizontal Hall Corridor at Y=185 */}
                <line x1="150" y1="185" x2="650" y2="185" className="stroke-slate-300 stroke-[5] stroke-dasharray-[5_5] opacity-80" />
                {/* Vertical Intersections */}
                <line x1="150" y1="100" x2="150" y2="270" className="stroke-slate-300 stroke-[5] stroke-dasharray-[5_5] opacity-80" />
                <line x1="400" y1="100" x2="400" y2="270" className="stroke-slate-300 stroke-[5] stroke-dasharray-[5_5] opacity-80" />
                <line x1="650" y1="100" x2="650" y2="270" className="stroke-slate-300 stroke-[5] stroke-dasharray-[5_5] opacity-80" />

                {/* ANIMATED ACTIVE ROUTE PATH IF EVENT DISPATCHED (Glowing Neon pathway stream) */}
                {doctorAnimationPath.length > 1 && (
                  <g>
                    <polyline
                      points={doctorAnimationPath.map(p => `${p.x},${p.y}`).join(' ')}
                      className="stroke-red-500 stroke-[3.5] stroke-dasharray-[10_10] fill-none"
                      style={{
                        strokeDasharray: '8',
                        animation: 'dashRoute 30s linear infinite'
                      }}
                    />
                    {/* Pulsing light source dot trailing the path */}
                    <circle cx={doctorAnimationPath[doctorAnimationPath.length - 1].x} cy={doctorAnimationPath[doctorAnimationPath.length - 1].y} r="5" className="fill-red-500 animate-ping" />
                  </g>
                )}

                {/* Patient transfer pathway */}
                {patientAnimationPath.length > 1 && (
                  <polyline
                    points={patientAnimationPath.map(p => `${p.x},${p.y}`).join(' ')}
                    className="stroke-rose-500 stroke-[3] stroke-dasharray-[6_6] fill-none"
                    style={{
                      strokeDasharray: '6',
                    }}
                  />
                )}
              </svg>

              {/* CSS keyframe overrides for route lines */}
              <style>{`
                @keyframes dashRoute {
                  to {
                    stroke-dashoffset: -1000;
                  }
                }
              `}</style>

              {/* RENDER ACTIVE PATIENTS */}
              <AnimatePresence>
                {patients.map(pat => {
                  const isCritical = pat.status === 'Critical';
                  
                  return (
                    <motion.div
                      key={pat.id}
                      className="absolute z-20 cursor-pointer flex flex-col items-center"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={
                        animatingPatientId === pat.id && patientAnimationPath.length > 0
                          ? { 
                              x: patientAnimationPath.map(p => p.x ),
                              y: patientAnimationPath.map(p => p.y ),
                            }
                          : { x: pat.x, y: pat.y }
                      }
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut" 
                      }}
                    >
                      {/* Avatar icon capsule */}
                      <div className={`p-2 rounded-xl flex items-center justify-center border transition-all ${
                        isCritical 
                          ? 'bg-red-50 border-red-400 text-red-650 shadow-[0_0_12px_rgba(239,68,68,0.2)] animate-pulse' 
                          : 'bg-white border-slate-300 text-slate-700 hover:border-red-300 shadow-xs'
                      }`}>
                        <Users className="h-3.5 w-3.5" />
                        
                        {/* Vitals Risk Mini Floating badge */}
                        <span className={`absolute -top-1.5 -right-1.5 px-1 py-0.5 rounded text-[7px] font-mono font-bold leading-none ${
                          isCritical ? 'bg-red-500 text-white font-extrabold' : 'bg-slate-205 text-slate-750'
                        }`}>
                          {pat.riskScore}%
                        </span>
                      </div>

                      {/* Complete Floating Label */}
                      <div className="bg-white border border-slate-200 px-2 py-1 rounded-md text-center mt-1 select-none pointer-events-none shadow-sm">
                        <span className="block text-[8px] font-extrabold text-slate-900">{pat.name}</span>
                        <span className="block text-[7px] font-mono text-red-600 font-bold">{pat.id} • RISK: {pat.riskScore}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>


              {/* RENDER ACTIVE DOCTORS */}
              <AnimatePresence>
                {doctors.map(doc => {
                  const isDispatched = doc.status === 'Dispatched';
                  const isTreating = doc.status === 'Treating';
                  const isReturning = doc.status === 'Returning';

                  let statusColor = 'bg-red-600 border-red-405 text-white';
                  let motionGlow = 'shadow-xs';
                  if (isDispatched) {
                    statusColor = 'bg-red-500 border-red-300 text-white shadow-[0_0_12px_rgba(239,68,68,0.35)]';
                    motionGlow = 'ring-2 ring-red-500 ring-offset-2 ring-offset-white animate-bounce';
                  } else if (isTreating) {
                    statusColor = 'bg-emerald-500 border-emerald-300 text-white';
                    motionGlow = 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white animate-pulse';
                  } else if (isReturning) {
                    statusColor = 'bg-amber-500 border-amber-300 text-white';
                  }

                  return (
                    <motion.div
                      key={doc.id}
                      className="absolute z-30 cursor-pointer flex flex-col items-center"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={
                        animatingDocId === doc.id && doctorAnimationPath.length > 0
                          ? { 
                              x: doctorAnimationPath.map(p => p.x ),
                              y: doctorAnimationPath.map(p => p.y ),
                            }
                          : { x: doc.x, y: doc.y }
                      }
                      transition={{ 
                        duration: 4, 
                        ease: "easeInOut" 
                      }}
                    >
                      {/* Doctor avatar head with halo */}
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${statusColor} ${motionGlow}`}>
                        <span className="font-extrabold text-[10px] font-mono tracking-tighter">
                          {doc.name.split(' ').pop()?.substring(0, 1) || 'D'}
                        </span>

                        {isTreating && (
                          <span className="absolute -inset-1 blur-md bg-emerald-500/10 rounded-full animate-ping z-[-1]" />
                        )}
                      </div>

                      {/* Doctor Floating Label (Name, Assignment, Score) */}
                      <div className="bg-white border border-slate-205 px-2.5 py-1.5 rounded-lg text-center mt-1.5 shadow-sm max-w-[120px] pointer-events-none">
                        <span className="block text-[8px] font-bold text-slate-900 truncate">{doc.name}</span>
                        <span className="block text-[6px] font-mono text-slate-500 mt-0.5 truncate uppercase font-bold">{doc.role}</span>
                        <span className={`block text-[7px] font-bold mt-0.5 px-1 py-0.2 rounded-sm text-[8px] tracking-wide truncate ${
                          isTreating ? 'text-emerald-600 uppercase font-black' : 
                          isDispatched ? 'text-red-550 uppercase font-black animate-pulse' :
                          'text-red-650 uppercase font-black'
                        }`}>
                          {doc.assignment}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

            </div>
          </div>

          {/* Operational Map Disclaimer alert */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs flex items-center space-x-2.5 text-slate-600">
            <Info className="h-4.5 w-4.5 text-red-500 shrink-0" />
            <p className="leading-tight text-[11px]">
              <strong>Framer Motion Navigation Corridor:</strong> AI detects vital breaches, maps closest intensivist, translates coordinate paths along virtual corridors, and automatically handles bed capacity changes in the local dataset.
            </p>
          </div>
        </div>

        {/* Right Side Column: AI Dispatch Panel & Realtime Operations Ticker */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI DISPATCH PANEL */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-red-655 animate-pulse" />
                <span>AI Dispatch Panel</span>
              </h4>
              <span className="text-[8px] font-mono bg-red-50 text-red-705 px-2 py-0.5 rounded-md border border-red-200 font-bold">
                ACTIVE
              </span>
            </div>

            {dispatchDetails ? (
              <div className="space-y-3.5 text-xs text-slate-705">
                <div>
                  <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider font-bold">Selected Dispatch Doctor:</span>
                  <p className="text-slate-900 font-black font-sans mt-0.5 text-[13px] flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-red-555" />
                    <span>{dispatchDetails.selectedDoctor}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="block text-[8px] text-slate-500 font-mono uppercase font-bold">DISPLACEMENT:</span>
                    <span className="text-red-600 font-extrabold font-mono text-[11px] block">{dispatchDetails.distance}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500 font-mono uppercase font-bold">ESTIMATED ETA:</span>
                    <span className="text-amber-605 font-extrabold font-mono text-[11px] block">{dispatchDetails.responseTime}</span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider font-bold">Reason for Selection:</span>
                  <p className="text-slate-600 text-[10px] leading-relaxed mt-1 italic font-sans">
                    "{dispatchDetails.reason}"
                  </p>
                </div>

                <div className="pt-2">
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] font-mono font-black text-red-600 animate-pulse tracking-widest block uppercase">URGENT IN-TRANSIT CORRIDOR SECURED</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-[11px] space-y-2">
                <ShieldCheck className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="font-medium text-slate-600">Telemetry Stable. AI Dispatch Center is in idle monitoring mode.</p>
                <div className="pt-1">
                  <span className="block text-[8px] font-mono text-red-650 font-bold uppercase">NO VITAL DEVIATIONS RECORDED</span>
                </div>
              </div>
            )}
          </div>

          {/* TELEMETRY EVENT LOG TICKER (REAL-TIME STREAM) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-[230px] justify-between">
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Real-Time Operations Log
            </h4>
            <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1 text-[10px] scrollbar-thin max-h-[150px] text-slate-700">
              {eventLog.map((log, idx) => {
                let badgeStyle = 'text-slate-600 bg-slate-50 border border-slate-200';
                if (log.type === 'critical') badgeStyle = 'text-red-700 bg-red-50 border border-red-200 font-bold';
                else if (log.type === 'success') badgeStyle = 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold';
                else if (log.type === 'ai') badgeStyle = 'text-cyan-705 bg-cyan-50 border border-cyan-200 font-bold';

                return (
                  <div key={idx} className="flex items-start space-x-1.5 leading-tight">
                    <span className="text-[8.5px] font-mono text-slate-400 font-bold shrink-0 mt-0.5">{log.time}</span>
                    <p className="text-slate-600 font-medium">
                      <span className={`inline-block text-[8px] font-mono font-bold uppercase py-0.5 px-1 rounded mr-1 ${badgeStyle}`}>
                        {log.type === 'ai' ? 'AI MODEL' : log.type.toUpperCase()}
                      </span>
                      {log.msg}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* --- IoT Smartband Emergency Broadcaster & Haptic Signal Simulator --- */}
      <div className="mt-8 border-t border-slate-200/85 pt-8" id="iot-smartband-simulator-block">
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 bg-red-100 hover:bg-red-200 text-red-650 rounded-xl">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-slate-905 font-extrabold text-base uppercase tracking-tight">
              Clinical Smartband Beacon & Haptic Transceiver Simulator
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              VIBRATING WRISTBAND PROTOCOLS • 2.4GHZ ULTRA-LOW LATENCY TELEMETRY PIPELINE
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Control Panel: Form / presets */}
          <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                1. Configure Outbound Signal Target
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Doctor Dropdown Select */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase mb-1">Target Duty Doctor:</label>
                  <div className="relative">
                    <select
                      id="iot-target-doctor-select"
                      value={selectedIotDocId}
                      onChange={(e) => setSelectedIotDocId(e.target.value)}
                      className="w-full bg-white select-none border border-slate-200.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-400"
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vibration Wave Profile selector */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase mb-1">Haptic Vibration Frequency:</label>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                    {(['single', 'double', 'continuous'] as const).map((pattern) => (
                      <button
                        key={pattern}
                        type="button"
                        id={`vibe-pattern-${pattern}-btn`}
                        onClick={() => setVibePattern(pattern)}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[9px] font-mono uppercase font-black transition-all cursor-pointer ${
                          vibePattern === pattern
                            ? 'bg-red-600 text-white shadow-xs font-black'
                            : 'text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preset messages suggestions */}
              <div className="space-y-1.5 pt-1">
                <span className="block text-[9.5px] font-bold text-slate-500 uppercase tracking-wide">Dynamic Clinical Quick-Templates:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Cardiac Call", text: "🚨 EMERGENCY: Severe Bradycardia reported in ICU Room 402. Report immediately." },
                    { label: "Lab Core Report", text: "⏱️ STAT: Lab results for Patient Clara Oswald parsed. Review EHR file." },
                    { label: "Sepsis Support", text: "⚠️ SEPSIS WARNING: Respiratory rate >24 in Ward B. High-risk telemetry trigger!" },
                    { label: "Standby OT", text: "🏥 SURGERY PREP: Report to Operation Theatre Suite-3 immediately. Standby ready." }
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      id={`iot-template-shortcut-${i}`}
                      onClick={() => setIotTemplateMsg(tpl.text)}
                      className={`px-2.5 py-1.5 border rounded-lg text-[9px] transition-all cursor-pointer text-left ${
                        iotTemplateMsg === tpl.text
                          ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Custom Box */}
              <div className="pt-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase mb-1">
                  Custom Outbound Telemetry Message:
                </label>
                <textarea
                  id="iot-custom-broadcast-msg"
                  value={iotTemplateMsg}
                  onChange={(e) => setIotTemplateMsg(e.target.value)}
                  placeholder="Enter smart alert commands..."
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="iot-transmit-vibe-signal-btn"
                onClick={broadcastIotSignal}
                disabled={isIotBroadcasting}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-mono font-black uppercase tracking-wider cursor-pointer transition-all ${
                  isIotBroadcasting
                    ? 'bg-slate-200 text-slate-400 border border-slate-300'
                    : 'bg-red-650 hover:bg-red-700 text-white shadow-md shadow-red-205'
                }`}
              >
                {isIotBroadcasting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                    <span>Broadcasting Wave Signal...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    <span>Emit IoT Haptic Signal</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="iot-reset-broadcaster-btn"
                onClick={resetIotBroadcaster}
                className="px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-black text-slate-600 uppercase rounded-xl transition-all cursor-pointer"
              >
                Clear Screen
              </button>
            </div>
          </div>

          {/* Smartband Hardware Simulator Visualizer Block */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[300px]">
            
            {/* Mesh background texture for watch HUD */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-35" />
            <div className="absolute top-2 right-3 flex items-center space-x-1 z-10 text-[8.5px] font-mono font-bold text-slate-400 font-sans">
              <Wifi className={`h-3 w-3 ${iotStatus === 'transmitting' ? 'text-cyan-400 animate-ping' : iotStatus === 'vibrating' ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
              <span>IOT CONNECT</span>
            </div>

            {/* Physical Smart Band Bezel Frame */}
            <motion.div 
              id="clinical-wearable-simulation-device"
              animate={iotStatus === 'vibrating' ? {
                x: vibePattern === 'single' ? [0, -3, 3, -3, 3, 0] : 
                   vibePattern === 'double' ? [0, -4, 4, -4, 4, -4, 4, 0] : 
                   [0, -5, 5, -5, 5, -5, 5, -5, 5, 0]
              } : {}}
              transition={iotStatus === 'vibrating' ? {
                repeat: Infinity,
                duration: vibePattern === 'single' ? 0.8 : vibePattern === 'double' ? 0.5 : 0.35,
                ease: "easeInOut"
              } : {}}
              className="w-[185px] h-[310px] rounded-[38px] bg-zinc-800 border-4 border-zinc-700 shadow-2xl relative p-3 flex flex-col justify-between shrink-0"
            >
              
              {/* Micro Speaker port details */}
              <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto" />

              {/* Simulated OLED Curved Display Screen */}
              <div className="flex-1 my-2 bg-black rounded-[26px] border-2 border-zinc-950 p-3.5 flex flex-col justify-between relative overflow-hidden select-none">
                
                {/* Subtle retro glowing overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-red-500/2 pointer-events-none" />

                {/* Top Status inside Screen */}
                <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                  <span className="text-[7px] font-mono font-bold text-zinc-500">CARE-BAND v4</span>
                  <span className="text-[7.5px] font-mono font-bold text-emerald-400 animate-pulse">
                    {iotStatus === 'idle' ? '📶 IDLE' :
                     iotStatus === 'transmitting' ? '📡 SYNC...' :
                     iotStatus === 'vibrating' ? '🚨 ALERT' : '✅ ACKED'}
                  </span>
                </div>

                {/* Center HUD Information */}
                <div className="flex-1 flex flex-col justify-center items-center py-2 text-center text-zinc-300">
                  
                  {/* SVG heartbeat signal waveform inside screen */}
                  <div className="w-full h-8 mb-2 overflow-hidden flex items-center relative">
                    <svg viewBox="0 0 100 30" className={`w-full h-full stroke-1 fill-none ${
                      iotStatus === 'vibrating' ? 'stroke-red-500' : 'stroke-emerald-400'
                    }`}>
                      <path d="M 0,15 L 20,15 L 25,2 L 30,28 L 35,15 L 60,15 L 65,5 L 70,25 L 75,15 L 100,15" className={iotStatus === 'vibrating' ? 'animate-pulse' : ''} />
                    </svg>
                    
                    {/* Vibrating Wave rings on device screen */}
                    {iotStatus === 'vibrating' && (
                      <div className="absolute inset-0 bg-red-500/10 animate-pulse border border-red-500/30 rounded-lg" />
                    )}
                  </div>

                  {/* Scrolling/Active Text Display on Screen */}
                  <div className="w-full max-h-[85px] overflow-y-auto pr-0.5">
                    <p className="text-[7px] text-zinc-400 uppercase font-mono tracking-widest font-bold">
                      {transmittedDocName.toUpperCase()}
                    </p>
                    
                    <p className={`text-[10px] leading-tight font-mono font-black mt-1 break-words ${
                      iotStatus === 'vibrating' ? 'text-red-500 animate-pulse' :
                      iotStatus === 'acknowledged' ? 'text-emerald-400 font-bold' : 'text-zinc-500'
                    }`}>
                      {iotReceivedMsg}
                    </p>
                  </div>

                  {/* Acknowledged notification */}
                  {iotStatus === 'acknowledged' && (
                    <div className="mt-2 text-[7.5px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900/40">
                      REPLY ACTIVE • {iotAckTimestamp}
                    </div>
                  )}
                </div>

                {/* Wearer Battery status indicator */}
                <div className="flex justify-between items-center pt-1.5 border-t border-zinc-900 text-[6.5px] font-mono text-zinc-500">
                  <span>HAP: {vibePattern.toUpperCase()}</span>
                  <span>BATT: 98%</span>
                </div>

              </div>

              {/* Simulated physical button with haptic action triggers */}
              <button
                type="button"
                id="wearer-physical-ack-button"
                onClick={acknowledgeIotAlert}
                disabled={iotStatus !== 'vibrating'}
                className={`w-12 h-6 mx-auto rounded-xl border flex items-center justify-center text-[7px] font-mono uppercase tracking-wider cursor-pointer font-black transition-all ${
                  iotStatus === 'vibrating'
                    ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white animate-bounce shadow-lg shadow-emerald-900/50'
                    : 'bg-zinc-850 border-zinc-705 text-zinc-650 cursor-not-allowed'
                }`}
              >
                TAP ACK
              </button>

            </motion.div>

            {/* Status Banner */}
            <div className="mt-3.5 text-center px-4">
              {iotStatus === 'idle' && (
                <p className="text-[9.5px] text-zinc-400 font-medium">
                  Configure a duty doctor and click <strong>"Emit IoT Haptic Signal"</strong> on the left panel.
                </p>
              )}
              {iotStatus === 'transmitting' && (
                <p className="text-[9.5px] text-cyan-400 font-bold animate-pulse uppercase tracking-wider">
                  📡 Emitting dynamic telemetry radio wave patterns...
                </p>
              )}
              {iotStatus === 'vibrating' && (
                <p className="text-[9.5px] text-red-500 font-black animate-pulse uppercase tracking-widest">
                  🚨 WATCH IS CURRENTLY VIBRATING! Tap <strong>"TAP ACK"</strong> on watch strap to reply.
                </p>
              )}
              {iotStatus === 'acknowledged' && (
                <p className="text-[9.5px] text-emerald-400 font-bold uppercase tracking-wide">
                  ✅ Telemetry handshake confirmed back to hospital station!
                </p>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
