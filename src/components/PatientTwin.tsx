import React, { useState } from 'react';
import { Patient, VitalsHistoryEntry } from '../types';
import { 
  X, Activity, Heart, Thermometer, Wind, AlertTriangle, Sparkles, 
  CornerDownRight, Copy, CheckCircle2, RefreshCw, Send, Clipboard 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface PatientTwinProps {
  patient: Patient;
  onClose: () => void;
}

export default function PatientTwin({ patient, onClose }: PatientTwinProps) {
  const [familyUpdate, setFamilyUpdate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Generate Status Update styled professionally
  const handleGenerateFamilyUpdate = () => {
    setIsGenerating(true);
    setIsCopied(false);
    setTimeout(() => {
      const conditionShort = patient.status === 'Stable' ? 'stable with encouraging signs of recovery' :
                             patient.status === 'Observation' ? 'gradually improving under active surveillance' :
                             patient.status === 'High Risk' ? 'experiencing elevated health complications requiring intense surveillance' :
                             'under critically intense, continuous life support assistance';

      const updateText = `**CARESYNC DIGITAL COMMUNICATIONS PORTAL**
Date: ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Recipients: Next of Kin and Care Team of Team Pentelton
Patient: ${patient.name} (Age: ${patient.age}, Room: ${patient.roomNumber})

Dear Family,

We wanted to provide a structured update regarding your loved one's medical journey. Currently, ${patient.name} is ${conditionShort}. 

**Clinical Parameter Summary:**
* Heart Rate: ${patient.heartRate} bpm (Normal parameters: 60-100)
* Blood Oxygenation (SpO₂): ${patient.spO2}% (Target parameter: >92%)
* Blood Pressure: ${patient.bloodPressure} mmHg
* Core Body Temperature: ${patient.temperature}°C
* Respiratory Performance: ${patient.respiratoryRate} breaths per minute

Our medical team is keeping constant oversight on all continuous telemetry monitoring lines in the ICU. The clinical decision models support optimal drug therapies customized for their specific progress. We will keep you updated.

Sincerely,
${patient.roomNumber} - ICU Care Staff and CARESYNC AI+ system.`;
      
      setFamilyUpdate(updateText);
      setIsGenerating(false);
    }, 900);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(familyUpdate);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Status-based color gradients
  const getBannerColor = (status: string) => {
    if (status === 'Critical') return 'from-red-950/60 via-red-900/30 to-slate-950';
    if (status === 'High Risk') return 'from-amber-950/60 via-amber-900/30 to-slate-950';
    if (status === 'Observation') return 'from-yellow-950/50 via-yellow-900/15 to-slate-950';
    return 'from-emerald-950/50 via-emerald-900/15 to-slate-950';
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col my-8">
        
        {/* Banner with Patient Details */}
        <div className={`p-6 bg-gradient-to-r ${getBannerColor(patient.status)} border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-slate-950/80 border border-cyan-500/25 px-2.5 py-1 rounded">
                PATIENT DIGITAL TWIN ACTIVE
              </span>
              <span className={`px-2 py-0.5 border text-[10px] uppercase rounded font-bold ${
                patient.status === 'Critical' ? 'text-red-400 bg-red-950/40 border-red-900/50' :
                patient.status === 'High Risk' ? 'text-amber-400 bg-amber-950/40 border-amber-900/50' :
                patient.status === 'Observation' ? 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50' :
                'text-emerald-400 bg-emerald-950/40 border-emerald-900/50'
              }`}>
                {patient.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 flex items-center space-x-2">
              <span>{patient.name}</span>
              <span className="text-slate-400 text-sm font-medium">({patient.age}y/o • {patient.gender})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Room Number: <span className="text-slate-200 font-mono font-bold">{patient.roomNumber}</span> • Admitted: <span className="text-slate-200 font-mono">{patient.admissionDate}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all self-start md:self-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          
          {/* Primary Diagnosis Alert */}
          <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex items-start space-x-3.5">
            <div className="bg-cyan-950/60 border border-cyan-800 p-2.5 rounded-xl text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">PRIMARY PATIENT DIAGNOSIS</p>
              <h4 className="text-sm font-bold text-white mt-1">{patient.primaryDiagnosis}</h4>
            </div>
          </div>

          {/* Grid Layout: Left Column Vitals & Trends, Right Column Clinician AI summaries */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 units) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Vitals Numeric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-red-400 font-mono uppercase pb-1.5 font-bold">
                    <Heart className="h-3.5 w-3.5 mr-1" /> HR
                  </span>
                  <span className="block text-xl font-bold font-mono text-white">{patient.heartRate}</span>
                  <span className="text-[9px] text-slate-550 block mt-0.5">bpm</span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-cyan-400 font-mono uppercase pb-1.5 font-bold">
                    <Wind className="h-3.5 w-3.5 mr-1" /> SpO₂
                  </span>
                  <span className="block text-xl font-bold font-mono text-white">{patient.spO2}%</span>
                  <span className="text-[9px] text-slate-550 block mt-0.5">oxygen</span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-yellow-500 font-mono uppercase pb-1.5 font-bold">
                    BP
                  </span>
                  <span className="block text-sm font-bold font-mono text-white mt-1.5">{patient.bloodPressure}</span>
                  <span className="text-[9px] text-slate-550 block mt-0.5">mmHg</span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-amber-500 font-mono uppercase pb-1.5 font-bold">
                    <Thermometer className="h-3.5 w-3.5 mr-1" /> TEMP
                  </span>
                  <span className="block text-xl font-bold font-mono text-white">{patient.temperature}</span>
                  <span className="text-[9px] text-slate-550 block mt-0.5">°C</span>
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="flex items-center justify-center text-[10px] text-emerald-400 font-mono uppercase pb-1.5 font-bold">
                    RESP
                  </span>
                  <span className="block text-xl font-bold font-mono text-white">{patient.respiratoryRate}</span>
                  <span className="text-[9px] text-slate-550 block mt-0.5">rpm</span>
                </div>
              </div>

              {/* Live Vitals Telemetry Trends Graphic */}
              <div className="bg-slate-950/30 border border-slate-850 p-5 rounded-2xl">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-4">Patient Prognostic Telemetry Trends (Line Chart)</h4>
                <div className="h-48 w-full text-white">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={patient.history} 
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#101b30" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                        itemStyle={{ fontSize: 11 }}
                        labelStyle={{ fontSize: 10, fontWeight: 'bold', color: '#06b6d4', fontFamily: 'monospace' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#f87171" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="spO2" name="Oxygen (SpO₂)" stroke="#22d3ee" strokeWidth={2} />
                      <Line type="monotone" dataKey="riskScore" name="Risk Score %" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Predicted Outcomes */}
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">AI DETECTED RISK OUTCOMES</span>
                <p className="text-xs leading-relaxed text-slate-300 italic">{patient.predictedOutcomes}</p>
              </div>

            </div>

            {/* Right Column (5 units) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* AI Risk Prediction Gauge Details */}
              <div className="bg-slate-950/70 border border-slate-850 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span>AI Predictive Metrics</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">Current Risk Score</span>
                    <span className="block text-2xl font-bold font-mono text-cyan-400 mt-1">{patient.riskScore}%</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <span className="block text-[9px] text-slate-400 uppercase font-mono">Forecast Future Risk (2h)</span>
                    <span className="block text-2xl font-bold font-mono text-amber-400 mt-1">{patient.predictedFutureRisk}%</span>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Estimated deterioration:</span>
                    <span className={`font-mono font-bold ${patient.status === 'Critical' ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                      {patient.timeUntilDeterioration}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Algorithm accuracy confidence:</span>
                    <span className="text-slate-250 font-mono">{patient.confidencePercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Patient AI summary profile */}
              <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl">
                <span className="text-[10px] font-mono tracking-wider font-bold text-cyan-400 uppercase">AI CLINICAL PROFILE PROFILE SUMMARY</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                  {patient.aiGeneratedSummary}
                </p>
              </div>

              {/* Family Update Generator Panel */}
              <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest flex items-center space-x-1.5">
                    <Clipboard className="h-4 w-4 text-cyan-400" />
                    <span>Family Update Generator</span>
                  </h4>
                </div>

                <button
                  id="pt-btn-gen-update"
                  onClick={handleGenerateFamilyUpdate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-slate-900 border border-cyan-800/40 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 rounded-xl hover:bg-slate-850 transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{familyUpdate ? 'Regenerate Update Profile' : 'Generate Progress Update'}</span>
                </button>

                {familyUpdate && (
                  <div className="space-y-2">
                    <div className="bg-slate-950/90 border border-slate-850 p-3.5 rounded-xl max-h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-350 font-sans whitespace-pre-wrap">
                      {familyUpdate}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy Update to Mail</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer warning */}
        <div className="p-4 bg-slate-950 text-center border-t border-slate-850">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            SECURE EHR TRANSFER PIPELINE • DIGITAL PATIENT MAPPING DEEP-LEARNING CORE V.7.67
          </p>
        </div>

      </div>
    </div>
  );
}
