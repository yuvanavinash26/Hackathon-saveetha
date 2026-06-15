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
    if (status === 'Critical') return 'bg-gradient-to-r from-red-50 to-slate-50 border-red-100';
    if (status === 'High Risk') return 'bg-gradient-to-r from-amber-50 to-slate-50 border-amber-100';
    if (status === 'Observation') return 'bg-gradient-to-r from-yellow-50 to-slate-50 border-yellow-100';
    return 'bg-gradient-to-r from-emerald-50 to-slate-50 border-emerald-100';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl shadow-xl overflow-hidden relative flex flex-col my-8 text-slate-800">
        
        {/* Banner with Patient Details */}
        <div className={`p-6 border-b ${getBannerColor(patient.status)} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono tracking-widest text-red-650 uppercase bg-white border border-red-200 px-2.5 py-1 rounded font-bold">
                PATIENT DIGITAL TWIN ACTIVE
              </span>
              <span className={`px-2 py-0.5 border text-[10px] uppercase rounded font-extrabold ${
                patient.status === 'Critical' ? 'text-red-700 bg-red-100/60 border-red-200/80' :
                patient.status === 'High Risk' ? 'text-amber-705 bg-amber-100/60 border-amber-200/80' :
                patient.status === 'Observation' ? 'text-yellow-700 bg-yellow-100/60 border-yellow-200/80' :
                'text-emerald-700 bg-emerald-100/60 border-emerald-200/80'
              }`}>
                {patient.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-2 flex items-center space-x-2">
              <span>{patient.name}</span>
              <span className="text-slate-505 text-sm font-bold">({patient.age}y/o • {patient.gender})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Room Number: <span className="text-slate-900 font-mono font-bold">{patient.roomNumber}</span> • Admitted: <span className="text-slate-900 font-mono font-bold">{patient.admissionDate}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl transition-all self-start md:self-auto cursor-pointer shadow-xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 flex-1 bg-white">
          
          {/* Primary Diagnosis Alert */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start space-x-3.5">
            <div className="bg-red-50 border border-red-150 p-2.5 rounded-xl text-red-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">PRIMARY PATIENT DIAGNOSIS</p>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{patient.primaryDiagnosis}</h4>
            </div>
          </div>

          {/* Grid Layout: Left Column Vitals & Trends, Right Column Clinician AI summaries */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 units) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Vitals Numeric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-red-650 font-mono uppercase pb-1.5 font-black">
                    <Heart className="h-3.5 w-3.5 mr-1" /> HR
                  </span>
                  <span className="block text-xl font-black font-mono text-slate-900">{patient.heartRate}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">bpm</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-red-550 font-mono uppercase pb-1.5 font-black">
                    <Wind className="h-3.5 w-3.5 mr-1" /> SpO₂
                  </span>
                  <span className="block text-xl font-black font-mono text-slate-900">{patient.spO2}%</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">oxygen</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-yellow-600 font-mono uppercase pb-1.5 font-black">
                    BP
                  </span>
                  <span className="block text-sm font-black font-mono text-slate-900 mt-1.5">{patient.bloodPressure}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">mmHg</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                  <span className="flex items-center justify-center text-[10px] text-amber-600 font-mono uppercase pb-1.5 font-black">
                    <Thermometer className="h-3.5 w-3.5 mr-1" /> TEMP
                  </span>
                  <span className="block text-xl font-black font-mono text-slate-900">{patient.temperature}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">°C</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="flex items-center justify-center text-[10px] text-emerald-650 font-mono uppercase pb-1.5 font-black">
                    RESP
                  </span>
                  <span className="block text-xl font-black font-mono text-slate-900">{patient.respiratoryRate}</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-bold">rpm</span>
                </div>
              </div>

              {/* Live Vitals Telemetry Trends Graphic */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <h4 className="text-xs font-mono font-bold text-red-655 uppercase tracking-widest mb-4">Patient Prognostic Telemetry Trends (Line Chart)</h4>
                <div className="h-48 w-full text-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={patient.history} 
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis stroke="#475569" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        itemStyle={{ fontSize: 11 }}
                        labelStyle={{ fontSize: 10, fontWeight: 'bold', color: '#ef4444', fontFamily: 'monospace' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="spO2" name="Oxygen (SpO₂)" stroke="#b91c1c" strokeWidth={2.5} />
                      <Line type="monotone" dataKey="riskScore" name="Risk Score " stroke="#d97706" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Predicted Outcomes */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-mono tracking-wider font-bold text-slate-500 uppercase">AI DETECTED RISK OUTCOMES</span>
                <p className="text-xs leading-relaxed text-slate-700 italic font-medium">{patient.predictedOutcomes}</p>
              </div>

            </div>

            {/* Right Column (5 units) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* AI Risk Prediction Gauge Details */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold text-red-655 uppercase tracking-widest flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-red-600 animate-pulse" />
                  <span>AI Predictive Metrics</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-500 uppercase font-mono font-bold">Current Risk Score</span>
                    <span className="block text-2xl font-black font-mono text-red-605 mt-1">{patient.riskScore}%</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-500 uppercase font-mono font-bold">Forecast Future Risk (2h)</span>
                    <span className="block text-2xl font-black font-mono text-amber-600 mt-1">{patient.predictedFutureRisk}%</span>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 uppercase font-mono text-[10px] font-bold">Estimated deterioration:</span>
                    <span className={`font-mono font-black ${patient.status === 'Critical' ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                      {patient.timeUntilDeterioration}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500 uppercase font-mono text-[10px] font-bold">Algorithm accuracy confidence:</span>
                    <span className="text-slate-800 font-mono font-bold">{patient.confidencePercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Patient AI summary profile */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <span className="text-[10px] font-mono tracking-wider font-bold text-red-655 uppercase">AI CLINICAL PROFILE PROFILE SUMMARY</span>
                <p className="text-xs text-slate-650 leading-relaxed mt-2.5 font-medium">
                  {patient.aiGeneratedSummary}
                </p>
              </div>

              {/* Family Update Generator Panel */}
              <div className="bg-gradient-to-tr from-slate-50 to-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-slate-800 text-xs font-mono font-bold uppercase tracking-widest flex items-center space-x-1.5">
                    <Clipboard className="h-4 w-4 text-red-600" />
                    <span>Family Update Generator</span>
                  </h4>
                </div>

                <button
                  id="pt-btn-gen-update"
                  onClick={handleGenerateFamilyUpdate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-white border border-red-200 hover:border-red-500 text-red-600 hover:text-red-700 hover:bg-slate-50 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{familyUpdate ? 'Regenerate Update Profile' : 'Generate Progress Update'}</span>
                </button>

                {familyUpdate && (
                  <div className="space-y-2">
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl max-h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-700 font-sans whitespace-pre-wrap font-medium">
                      {familyUpdate}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700">Copied to Clipboard!</span>
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

        {/* Modal Footer warning and Close Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-250 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold text-center sm:text-left">
            SECURE EHR TRANSFER PIPELINE • DIGITAL PATIENT MAPPING DEEP-LEARNING CORE V.7.67
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer uppercase tracking-wider shrink-0"
          >
            Close Digital Twin
          </button>
        </div>

      </div>
    </div>
  );
}
