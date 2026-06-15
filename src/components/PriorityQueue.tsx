import React from 'react';
import { Patient, BedAllocation, PatientStatus } from '../types';
import { 
  AlertTriangle, ShieldAlert, Cpu, HeartPulse, Sparkles, 
  Bed, ArrowUpRight, Activity, Users, HelpCircle 
} from 'lucide-react';
import { ON_DUTY_DOCTORS } from '../mockData';

interface PriorityQueueProps {
  patients: Patient[];
  beds: BedAllocation[];
  onSelectPatient: (patientId: string) => void;
}

export default function PriorityQueue({ patients, beds, onSelectPatient }: PriorityQueueProps) {
  // Sort patients by risk score descending
  const sortedPatients = [...patients].sort((a, b) => b.riskScore - a.riskScore);

  // Filter patients with code blue danger state (e.g., immediate risk probability >= 40%)
  const codeBluePatients = patients.filter(p => p.status === 'Critical' || p.codeBlue.probability >= 40);

  // Count beds
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const reservedBeds = beds.filter(b => b.status === 'Reserved').length;
  const totalBedsCount = beds.length;

  // Render a responsive color picker for condition status
  const getStatusStyle = (status: PatientStatus) => {
    switch (status) {
      case 'Critical':
        return 'text-red-700 bg-red-100/50 border-red-200';
      case 'High Risk':
        return 'text-amber-700 bg-amber-100/50 border-amber-200';
      case 'Observation':
        return 'text-yellow-700 bg-yellow-100/50 border-yellow-200';
      default:
        return 'text-emerald-700 bg-emerald-100/50 border-emerald-200';
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start text-slate-800">
      {/* Priority Queue Container (left-column: 8 grid spaces) */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Priority list card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-red-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Critical Triage Priority Queue</h3>
                <p className="text-xs text-slate-500">Real-time prioritized patient index ranked by computed systemic risk profiles</p>
              </div>
            </div>
            <div className="inline-flex self-start space-x-1 py-1 px-2.5 bg-red-50 border border-red-205 text-red-750 rounded-md text-[10px] font-mono tracking-widest uppercase font-bold">
              <span>Smart Sort Activated</span>
            </div>
          </div>

          <div className="overflow-x-auto text-slate-700">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-mono">
                  <th className="pb-3 pt-1 pl-4 w-12 text-center font-bold">Rank</th>
                  <th className="pb-3 pt-1 pl-2 font-bold">Patient Profile</th>
                  <th className="pb-3 pt-1 text-center w-24 font-bold">Risk Index</th>
                  <th className="pb-3 pt-1 font-bold">Condition Status</th>
                  <th className="pb-3 pt-1 pl-3 font-bold">Recommended Triage Action</th>
                  <th className="pb-3 pt-1 pr-4 w-12 text-center font-bold">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPatients.slice(0, 10).map((pt, index) => {
                  const rank = index + 1;
                  let rankBg = 'bg-slate-100 text-slate-700 border border-slate-200';
                  if (rank === 1) rankBg = 'bg-red-500 text-white font-bold border border-red-500';
                  else if (rank === 2) rankBg = 'bg-amber-500 text-white font-bold border border-amber-500';
                  else if (rank === 3) rankBg = 'bg-yellow-500 text-slate-900 font-bold border border-yellow-500';

                  return (
                    <tr 
                      key={pt.id} 
                      className="hover:bg-slate-50/75 transition-all cursor-pointer group"
                      onClick={() => onSelectPatient(pt.id)}
                    >
                      <td className="py-3 pl-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] ${rankBg}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="py-3 pl-2">
                        <div className="font-semibold text-slate-900 group-hover:text-red-600 transition-colors">{pt.name}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">Room {pt.roomNumber} • {pt.age}y/o • {pt.gender}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="font-mono text-xs font-bold text-slate-800">{pt.riskScore}%</div>
                        {/* Risk fill bar */}
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full mx-auto mt-1 overflow-hidden border border-slate-200/50">
                          <div 
                            className={`h-full rounded-full ${pt.riskScore >= 80 ? 'bg-red-500' : pt.riskScore >= 60 ? 'bg-amber-500' : 'bg-red-400'}`}
                            style={{ width: `${pt.riskScore}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 border text-[10px] rounded font-semibold ${getStatusStyle(pt.status)}`}>
                          {pt.status}
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-slate-600 pr-4 leading-normal text-[11px] max-w-[220px]">
                        {pt.status === 'Critical' ? (
                          <span className="text-red-600 font-semibold">• Continuous bedside assessment & emergency resus alert.</span>
                        ) : pt.status === 'High Risk' ? (
                          <span className="text-amber-700 font-semibold">• Monitor vitals trend frequency down to 10 mins.</span>
                        ) : (
                          <span>• Standard diagnostic interval scans (1 hour).</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-red-655 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-center pt-3 border-t border-slate-100 mt-4">
            <p className="text-[10px] text-slate-450 font-mono uppercase tracking-widest text-slate-500">Showing Top 10 High-Acuity Patient Alignments • Rank dynamic updates active</p>
          </div>
        </div>

        {/* Code Blue Predictor */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          {/* Subtle emergency background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-5">
            <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-red-500 animate-pulse">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-red-650 font-bold text-lg flex items-center space-x-2">
                <span>Code Blue Predictor Engine</span>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 bg-red-50 border border-red-200 rounded-md text-red-600 uppercase">Proactive Risk</span>
              </h3>
              <p className="text-xs text-slate-500">Algorithmic cardiovascular & respiratory collapse prediction telemetry model</p>
            </div>
          </div>

          <div className="space-y-4">
            {codeBluePatients.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No patients are flagged at active Code Blue risk state currently.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {codeBluePatients.slice(0, 4).map((pt) => (
                  <div 
                    key={pt.id} 
                    onClick={() => onSelectPatient(pt.id)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-red-400 hover:shadow-xs transition-all cursor-pointer relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="pr-2">
                        <h4 className="font-bold text-slate-900 group-hover:text-red-500 transition-all text-sm">{pt.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Room {pt.roomNumber} • Diagnosis: {pt.primaryDiagnosis}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex px-1.5 py-0.5 bg-red-100 text-red-600 border border-red-200 text-[9px] font-mono font-bold rounded">
                          {pt.codeBlue.probability}% PROB
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-200 pt-2.5 mt-2">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-slate-500 uppercase">PREDICTED TIMELINE:</span>
                        <span className="text-red-600 font-bold uppercase">{pt.codeBlue.timeWindow}</span>
                      </div>
                      <div className="text-[10px] text-slate-700 leading-normal bg-red-50/50 border border-red-150 p-2 rounded">
                        <strong className="text-red-650 block mb-0.5 font-mono">CRITICAL PROACTIVE RESPONSE:</strong>
                        {pt.codeBlue.suggestedIntervention}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ICU Resource Intelligence (right column: 4 grid spaces) */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Bed Status Intelligence */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
            <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-red-650">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">ICU Bed & Resource Intel</h3>
              <p className="text-xs text-slate-500">Total operational parameters on active capacity limits</p>
            </div>
          </div>

          {/* Sizable Metrics indicator */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-4 mb-4 text-center">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5">
              <span className="block text-slate-550 text-[10px] font-mono font-bold">AVAILABLE</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">{availableBeds}</span>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-2.5">
              <span className="block text-slate-550 text-[10px] font-mono font-bold">OCCUPIED</span>
              <span className="text-lg font-bold text-red-500 font-mono">{occupiedBeds}</span>
            </div>
            <div className="bg-yellow-50/50 border border-yellow-105 rounded-xl p-2.5">
              <span className="block text-slate-550 text-[10px] font-mono font-bold">RESERVED</span>
              <span className="text-lg font-bold text-yellow-600 font-mono">{reservedBeds}</span>
            </div>
          </div>

          {/* Available Physicians */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-red-655 uppercase tracking-widest flex items-center justify-between">
              <span>Physicians on Duty</span>
              <span className="text-slate-450 text-[10px] normal-case font-semibold">5 active staff</span>
            </h4>
            <div className="space-y-2 text-slate-705">
              {ON_DUTY_DOCTORS.map((doc, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div>
                    <div className="font-semibold text-slate-900">{doc.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{doc.specialty}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    doc.status === 'On Floor' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    doc.status.includes('Active') ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Transfer suggestions */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-mono font-bold text-red-655 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Real-Time Bed Allocations</span>
            </h4>
            
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] leading-relaxed text-slate-600">
              <strong className="text-red-700 block mb-1">Transfer Recommendation (AI Generated)</strong>
              Consider moving <span className="text-slate-900 font-bold">Marcus Vance</span> (Room ICU-415, Stable CABG Post-Op) to cardiac step-down suite to free up ICU monitoring line for admitting cardiac Block emergency patient.
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] leading-relaxed text-slate-600">
              <strong className="text-slate-800 block mb-1 font-bold">Emergency Allocation Reserve</strong>
              Bed 405 reserved for incoming trauma resuscitation helicopter transfer expected within 25 minutes.
            </div>
          </div>
        </div>

        {/* Visual Bed Grid Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-xs space-y-3 text-slate-805">
          <h4 className="text-slate-900 font-bold">ICU Bed Layout Index</h4>
          <div className="grid grid-cols-4 gap-2">
            {beds.map((bed) => (
              <div 
                key={bed.id} 
                className={`p-2 rounded text-center border font-mono ${
                  bed.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100/50' :
                  bed.status === 'Reserved' ? 'bg-yellow-50 border-yellow-250 text-yellow-600' :
                  'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/50'
                } transition-all cursor-pointer`}
                onClick={() => bed.patientId && onSelectPatient(bed.patientId)}
                title={bed.patientId ? `Click to see patient` : `${bed.type} - Available`}
              >
                <div className="text-[10px] font-bold">{bed.number.replace('Bed ', '')}</div>
                <div className="text-[8px] uppercase mt-0.5 text-slate-450">{bed.status.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
