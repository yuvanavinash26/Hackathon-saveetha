import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types';
import { Map, Users, Info, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface HeatmapProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export default function Heatmap({ patients, onSelectPatient }: HeatmapProps) {
  const [activeWing, setActiveWing] = useState<'All' | 'ICU-Level4' | 'ICU-Level3' | 'ICU-Level2' | 'Level1-Critical'>('All');

  // Define All Rooms for a complete Hospital Ward map
  const roomsLayout = [
    { room: 'ICU-401', label: 'Suite 401', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-402', label: 'Suite 402', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-403', label: 'Suite 403', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-404', label: 'Suite 404', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-405', label: 'Suite 405', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-406', label: 'Suite 406', level: 4, wing: 'ICU-Level4' },
    
    { room: 'ICU-301', label: 'Suite 301', level: 3, wing: 'ICU-Level3' },
    { room: 'ICU-303', label: 'Suite 303', level: 3, wing: 'ICU-Level3' },
    { room: 'ICU-305', label: 'Suite 305', level: 3, wing: 'ICU-Level3' },
    { room: 'ICU-311', label: 'Suite 311', level: 3, wing: 'ICU-Level3' },
    { room: 'ICU-316', label: 'Suite 316', level: 3, wing: 'ICU-Level3' },
    { room: 'ICU-410', label: 'Suite 410', level: 4, wing: 'ICU-Level4' },
    
    { room: 'ICU-204', label: 'Suite 204', level: 2, wing: 'ICU-Level2' },
    { room: 'ICU-208', label: 'Suite 208', level: 2, wing: 'ICU-Level2' },
    { room: 'ICU-215', label: 'Suite 215', level: 2, wing: 'ICU-Level2' },
    { room: 'ICU-222', label: 'Suite 222', level: 2, wing: 'ICU-Level2' },
    
    { room: 'ICU-102', label: 'Suite 102', level: 1, wing: 'Level1-Critical' },
    { room: 'ICU-107', label: 'Suite 107', level: 1, wing: 'Level1-Critical' },
    { room: 'ICU-112', label: 'Suite 112', level: 1, wing: 'Level1-Critical' },
    { room: 'ICU-415', label: 'Suite 415', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-418', label: 'Suite 418', level: 4, wing: 'ICU-Level4' },
    { room: 'ICU-420', label: 'Suite 420', level: 4, wing: 'ICU-Level4' },
  ];

  // Map active patients to their assigned rooms
  const getRoomOccupantDetails = (roomNo: string) => {
    return patients.find(p => p.roomNumber === roomNo);
  };

  // Assign styling according to clinical alert level
  const getRoomColorClasses = (status?: PatientStatus) => {
    if (!status) return 'bg-slate-950/45 border-slate-900 hover:border-slate-800 text-slate-500';
    switch (status) {
      case 'Critical':
        return 'bg-red-950/50 border-red-500/80 hover:bg-red-900/40 text-red-400 [box-shadow:0_0_15px_rgba(239,68,68,0.15)] animate-pulse';
      case 'High Risk':
        return 'bg-amber-950/45 border-amber-500/80 hover:bg-amber-900/30 text-amber-400 [box-shadow:0_0_12px_rgba(245,158,11,0.1)]';
      case 'Observation':
        return 'bg-yellow-950/35 border-yellow-600/60 hover:bg-yellow-900/20 text-yellow-500';
      default:
        return 'bg-emerald-950/35 border-emerald-600/60 hover:bg-emerald-900/20 text-emerald-400';
    }
  };

  // Filter layouts
  const filteredRooms = activeWing === 'All' 
    ? roomsLayout 
    : roomsLayout.filter(f => f.wing === activeWing);

  // Status numbers
  const countByStatus = (status: PatientStatus) => patients.filter(p => p.status === status).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-950/80 border border-cyan-850 p-2 rounded-lg text-cyan-400">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Interactive Hospital Floor Heatmap</h3>
            <p className="text-xs text-slate-400">Tactical environmental overview dividing level wings by risk parameters</p>
          </div>
        </div>

        {/* Wing Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-850 self-start md:self-auto">
          {[
            { id: 'All', label: 'All Floors' },
            { id: 'ICU-Level4', label: 'ICU Level 4' },
            { id: 'ICU-Level3', label: 'ICU Level 3' },
            { id: 'ICU-Level2', label: 'ICU Level 2' },
            { id: 'Level1-Critical', label: 'Trauma L1' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveWing(tab.id as any)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                activeWing === tab.id 
                  ? 'bg-cyan-500 text-slate-950' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend labels */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-950/40 p-3 rounded-xl border border-slate-850/60 text-xs">
        <span className="text-slate-400 uppercase font-mono text-[10px]">Triage Indicators:</span>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-red-500 rounded-full inline-block animate-pulse" />
          <span className="text-slate-200">Critical ({countByStatus('Critical')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-orange-500 rounded-full inline-block" />
          <span className="text-slate-200">High Risk ({countByStatus('High Risk')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-yellow-400 rounded-full inline-block" />
          <span className="text-slate-200">Observation ({countByStatus('Observation')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-emerald-400 rounded-full inline-block" />
          <span className="text-slate-200">Stable ({countByStatus('Stable')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-slate-800 rounded-full inline-block border border-slate-700" />
          <span className="text-slate-400">Empty Bed ({roomsLayout.length - patients.length})</span>
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filteredRooms.map((roomItem) => {
          const occupant = getRoomOccupantDetails(roomItem.room);
          const roomColorClass = getRoomColorClasses(occupant?.status);

          return (
            <div
              key={roomItem.room}
              onClick={() => occupant && onSelectPatient(occupant.id)}
              className={`p-4 rounded-2xl border text-xs leading-normal flex flex-col justify-between h-28 cursor-pointer transition-all ${roomColorClass} relative group`}
            >
              {/* Quick Hover Tooltip on occupant detail */}
              {occupant && (
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <span className="text-[10px] font-mono font-bold text-white tracking-tighter">{occupant.riskScore}%</span>
                </div>
              )}

              <div>
                <span className="block text-[10px] font-mono tracking-wider opacity-60 uppercase">{roomItem.room}</span>
                <span className="block text-white font-bold group-hover:text-cyan-400 transition-colors">{roomItem.label}</span>
              </div>

              <div className="border-t border-white/5 pt-2 mt-2">
                {occupant ? (
                  <>
                    <h5 className="font-bold text-white text-[11px] truncate">{occupant.name}</h5>
                    <p className="text-[9px] text-slate-400 truncate">{occupant.primaryDiagnosis}</p>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono italic">AVAILABLE BED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-950/45 p-4 rounded-xl border border-slate-850/60 text-xs flex items-start space-x-2.5">
        <Info className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-slate-400 leading-normal">
          <strong>Interactive Tactile Map:</strong> The floor map dynamically links directly to the telemetry monitors. Click on any colored ICU Suite to overlay their Digital Twin timeline, generate updates, and review targeted risk outcomes.
        </p>
      </div>

    </div>
  );
}
