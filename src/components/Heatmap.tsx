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
    if (!status) return 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-350';
    switch (status) {
      case 'Critical':
        return 'bg-red-50/50 border-red-300 text-red-900 hover:bg-red-50 shadow-xs animate-pulse';
      case 'High Risk':
        return 'bg-amber-50/50 border-amber-300 text-amber-900 hover:bg-amber-50 shadow-xs';
      case 'Observation':
        return 'bg-yellow-50/40 border-yellow-300 text-yellow-905 hover:bg-yellow-50';
      default:
        return 'bg-emerald-50/45 border-emerald-300 text-emerald-905 hover:bg-emerald-50';
    }
  };

  // Filter layouts
  const filteredRooms = activeWing === 'All' 
    ? roomsLayout 
    : roomsLayout.filter(f => f.wing === activeWing);

  // Status numbers
  const countByStatus = (status: PatientStatus) => patients.filter(p => p.status === status).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-red-650">
            <Map className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-base">Interactive Hospital Floor Heatmap</h3>
            <p className="text-xs text-slate-500">Tactical environmental overview dividing level wings by risk parameters</p>
          </div>
        </div>

        {/* Wing Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
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
               className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                 activeWing === tab.id 
                   ? 'bg-red-600 text-white shadow-xs' 
                   : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend labels */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
        <span className="text-slate-500 uppercase font-mono text-[10px] font-bold">Triage Indicators:</span>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-red-500 rounded-full inline-block animate-pulse" />
          <span>Critical ({countByStatus('Critical')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-amber-500 rounded-full inline-block" />
          <span>High Risk ({countByStatus('High Risk')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-yellow-400 rounded-full inline-block" />
          <span>Observation ({countByStatus('Observation')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full inline-block" />
          <span>Stable ({countByStatus('Stable')})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 bg-slate-200 rounded-full inline-block border border-slate-300" />
          <span className="text-slate-500">Empty Bed ({roomsLayout.length - patients.length})</span>
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
                  <span className="text-[10px] font-mono font-bold text-slate-800 tracking-tighter">{occupant.riskScore}%</span>
                </div>
              )}

              <div>
                <span className="block text-[10px] font-mono tracking-wider opacity-60 uppercase">{roomItem.room}</span>
                <span className="block text-slate-900 font-bold group-hover:text-red-655 transition-colors">{roomItem.label}</span>
              </div>

              <div className="border-t border-slate-200/40 pt-2 mt-2">
                {occupant ? (
                  <>
                    <h5 className="font-bold text-slate-900 text-[11px] truncate">{occupant.name}</h5>
                    <p className="text-[9px] text-slate-500 truncate">{occupant.primaryDiagnosis}</p>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono italic">AVAILABLE BED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex items-start space-x-2.5">
        <Info className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
        <p className="text-slate-500 leading-normal">
          <strong>Interactive Tactile Map:</strong> The floor map dynamically links directly to the telemetry monitors. Click on any colored ICU Suite to overlay their Digital Twin timeline, generate updates, and review targeted risk outcomes.
        </p>
      </div>

    </div>
  );
}
