import React from 'react';
import { Patient, SimulatedAlert, BedAllocation } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  Building2, Activity, AlertCircle, ShieldAlert, Cpu, CheckCircle 
} from 'lucide-react';

interface AnalyticsProps {
  patients: Patient[];
  alerts: SimulatedAlert[];
  beds: BedAllocation[];
}

export default function Analytics({ patients, alerts, beds }: AnalyticsProps) {
  
  // 1. Risk Status Distribution counts
  const statusCounts = {
    Stable: patients.filter(p => p.status === 'Stable').length,
    Observation: patients.filter(p => p.status === 'Observation').length,
    'High Risk': patients.filter(p => p.status === 'High Risk').length,
    Critical: patients.filter(p => p.status === 'Critical').length,
  };

  const riskDistData = [
    { name: 'Stable', count: statusCounts.Stable, color: '#10b981' },
    { name: 'Observation', count: statusCounts.Observation, color: '#eab308' },
    { name: 'High Risk', count: statusCounts['High Risk'], color: '#f59e0b' },
    { name: 'Critical', count: statusCounts.Critical, color: '#ef4444' },
  ];

  // 2. Alert Type frequency counts
  const alertTypes = alerts.reduce((acc: { [key: string]: number }, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {});

  const alertFreqData = Object.entries(alertTypes).map(([name, count]) => ({
    name,
    value: count
  }));

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#06b6d4', '#ec4899'];

  // 3. Simulated ICU Occupancy Over Last 12 Hours
  const icuUsageData = [
    { hour: '08:00', Occupied: 8, Available: 4, Emergency: 1 },
    { hour: '10:00', Occupied: 9, Available: 3, Emergency: 1 },
    { hour: '12:00', Occupied: 9, Available: 3, Emergency: 2 },
    { hour: '14:00', Occupied: 10, Available: 2, Emergency: 2 },
    { hour: '16:00', Occupied: 8, Available: 4, Emergency: 1 },
    { hour: '18:00', Occupied: 8, Available: 4, Emergency: 1 },
    { hour: '20:00', Occupied: 9, Available: 3, Emergency: 2 },
    { hour: '22:00', Occupied: 10, Available: 2, Emergency: 3 },
  ];

  // 4. Hospital Load Stress Index Trends over past days
  const hospitalLoadTrends = [
    { day: 'Mon', StressIndex: 45, CriticalIndex: 30, StaffDensity: 82 },
    { day: 'Tue', StressIndex: 52, CriticalIndex: 35, StaffDensity: 80 },
    { day: 'Wed', StressIndex: 68, CriticalIndex: 48, StaffDensity: 85 },
    { day: 'Thu', StressIndex: 74, CriticalIndex: 55, StaffDensity: 90 },
    { day: 'Fri', StressIndex: 82, CriticalIndex: 65, StaffDensity: 95 },
    { day: 'Sat', StressIndex: 78, CriticalIndex: 60, StaffDensity: 88 },
    { day: 'Sun', StressIndex: 89, CriticalIndex: 72, StaffDensity: 86 },
  ];

  // Average vitals stats
  const averageHeartRate = Math.round(patients.reduce((sum, p) => sum + p.heartRate, 0) / patients.length);
  const averageSpO2 = Math.round((patients.reduce((sum, p) => sum + p.spO2, 0) / patients.length) * 10) / 10;
  const averageRisk = Math.round(patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length);

  return (
    <div className="space-y-8">
      {/* Analytics Summary Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-red-950/50 border border-red-900 p-3 rounded-xl text-red-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs uppercase font-mono">Mean Ward Risk</span>
            <span className="text-2xl font-black font-mono text-white">{averageRisk}%</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-cyan-950/50 border border-cyan-900 p-3 rounded-xl text-cyan-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs uppercase font-mono">Mean Heart Rate</span>
            <span className="text-2xl font-black font-mono text-white">{averageHeartRate} bpm</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-emerald-950/50 border border-emerald-900 p-3 rounded-xl text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs uppercase font-mono">Mean Ward SpO₂</span>
            <span className="text-2xl font-black font-mono text-white">{averageSpO2}%</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="bg-yellow-950/50 border border-yellow-900 p-3 rounded-xl text-yellow-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-slate-400 text-xs uppercase font-mono">System Alarms Logged</span>
            <span className="text-2xl font-black font-mono text-white">{alerts.length} active</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Risk Distribution */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-xs space-y-4">
          <div>
            <h4 className="text-white font-bold text-base">Clinician Triage Risk Spread</h4>
            <p className="text-slate-400 text-xs mt-0.5">Spread of active inpatient capacity grouped by visual hazard color levels</p>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#101b30" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 11 }}
                  labelStyle={{ fontSize: 10, color: '#22d3ee', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                  {riskDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: ICU Usage Timeline */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-xs space-y-4">
          <div>
            <h4 className="text-white font-bold text-base">ICU Bed Occupancy Trends (Past 12 Hours)</h4>
            <p className="text-slate-400 text-xs mt-0.5">Historic capacity metrics tracing occupied beds vs available backups</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={icuUsageData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorOccupied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#101b30" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 11 }}
                  labelStyle={{ fontSize: 10, color: '#22d3ee', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="Occupied" stroke="#ef4444" fillOpacity={1} fill="url(#colorOccupied)" strokeWidth={2} />
                <Area type="monotone" dataKey="Available" stroke="#10b981" fillOpacity={1} fill="url(#colorAvailable)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Second Charts Row */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Chart 3: Alert Frequency distribution */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-xs space-y-4">
          <div>
            <h4 className="text-white font-bold text-base">Alarm Frequency Distribution</h4>
            <p className="text-slate-400 text-xs mt-0.5">Alert counts broken down by physiological telemetry risk categories</p>
          </div>

          <div className="h-52 w-full flex justify-center items-center">
            {alertFreqData.length === 0 ? (
              <p className="text-slate-500 italic">No alarms recorded recently.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertFreqData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertFreqData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: 10, color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-1 text-[11px] pt-3 border-t border-slate-800/40">
            {alertFreqData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-slate-350">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold text-white pr-2">{item.value} times</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Hospital Load Indexes */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl text-xs space-y-4">
          <div>
            <h4 className="text-white font-bold text-base">Hospital Stress Index Tracking (7-day timeline)</h4>
            <p className="text-slate-400 text-xs mt-0.5">Composite stress evaluation balancing patient acuity indexes against available ICU staffing densities</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hospitalLoadTrends} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#101b30" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 11 }}
                  labelStyle={{ fontSize: 10, color: '#22d3ee', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="StressIndex" name="Hospital Stress Score" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="CriticalIndex" name="Acuity Coefficient" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="StaffDensity" name="On-Duty Staff density" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
